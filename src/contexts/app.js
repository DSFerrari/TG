import { createContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { Alert } from "react-native";
import { decode } from "base64-arraybuffer";

export const AppContext = createContext({});

export default function AppProvider({ children }) {
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState(null);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  async function fetchProfile(userId) {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (!data) {
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert([{ id: userId }])
          .select()
          .maybeSingle();

        if (insertError) throw insertError;
        setProfile(newProfile);
        setUserIsAdmin(false);
      } else {
        setProfile(data);
        setUserIsAdmin(data.is_admin === true);
      }
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
    }
  }


  async function fetchUserFavorites(userId) {
    if (!userId) return;

    try {
      setLoadingFavorites(true);
      const { data, error } = await supabase
        .from("favoritos")
        .select("id_estabelecimento")
        .eq("id_usuario", userId);

      if (error) throw error;

      const idSet = new Set(data.map((fav) => fav.id_estabelecimento));
      setFavoriteIds(idSet);
    } catch (err) {
      Alert.alert("Erro ao carregar seus favoritos", err.message);
    } finally {
      setLoadingFavorites(false);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserFavorites(session.user.id);
        fetchProfile(session.user.id);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserFavorites(session.user.id);
          fetchProfile(session.user.id);
        } else {
          setFavoriteIds(new Set());
          setUserIsAdmin(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); 

  async function toggleFavorite(establishmentId) {
    if (!user) {
      Alert.alert("Atenção", "Você precisa estar logado para favoritar.");
      return;
    }

    const userId = user.id;
    const isCurrentlyFavorite = favoriteIds.has(establishmentId);

    try {
      if (isCurrentlyFavorite) {
        const { error } = await supabase
          .from("favoritos")
          .delete()
          .eq("id_usuario", userId)
          .eq("id_estabelecimento", establishmentId);

        if (error) throw error;

        setFavoriteIds((prevSet) => {
          const newSet = new Set(prevSet);
          newSet.delete(establishmentId); 
          return newSet;
        });
      } else {
        const { error } = await supabase
          .from("favoritos")
          .insert({ id_usuario: userId, id_estabelecimento: establishmentId });

        if (error) throw error;

        setFavoriteIds((prevSet) => {
          const newSet = new Set(prevSet);
          newSet.add(establishmentId); 
          return newSet;
        });
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar o favorito.");
    }
  }

  async function getFavoriteEstablishments() {
  if (!user) return [];

  try {
    setLoadingFavorites(true);

    const { data: favRows, error: favErr } = await supabase
      .from("favoritos")
      .select("id_estabelecimento")
      .eq("id_usuario", user.id);

    if (favErr) throw favErr;
    if (!favRows || favRows.length === 0) return [];

    const ids = favRows.map((r) => r.id_estabelecimento);

    const { data: estabs, error: estErr } = await supabase
      .from("estabelecimentos_view")
      .select("*")
      .in("id", ids);

    if (estErr) throw estErr;

    return estabs || [];
  } catch (err) {
    Alert.alert("Erro ao carregar favoritos", err.message);
    return [];
  } finally {
    setLoadingFavorites(false);
  }
}


  async function uploadEstablishmentImage(image, establishmentId, navigation) {
    try {
      setLoadingAuth(true);

      const fileExt = image.uri.split(".").pop();
      const fileName = `${establishmentId}-${Date.now()}.${fileExt}`;
      const filePath = `estabelecimentos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("fotos_estabelecimentos")
        .upload(filePath, decode(image.base64), {
          contentType: image.mimeType || "image/jpeg",
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("fotos_estabelecimentos")
        .getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { data: updatedEstablishment, error } = await supabase
        .from("estabelecimentos")
        .update({ url_foto: publicUrl })
        .eq("id", establishmentId);

      if (error) throw error;

      Alert.alert("Sucesso", "Foto do estabelecimento atualizada!");
       await new Promise(resolve => setTimeout(resolve, 1000));
      navigation.goBack();
      return publicUrl;
    } catch (err) {
      Alert.alert("Erro no upload", err.message);
      return null;
    } finally {
      setLoadingAuth(false);
    }
  }

  async function createEstablishment(establishmentData) {
  try {
    setLoadingAuth(true);

    if (!user) {
      throw new Error("Usuário não autenticado.");
    }

    const dataToInsert = {
      ...establishmentData,
      id_usuario_criador: user.id,
    };

    const { data, error } = await supabase
      .from("estabelecimentos")
      .insert([dataToInsert])
      .select();

    if (error) throw error;

    if (data && data.length > 0) {
      Alert.alert("Sucesso!", "Novo estabelecimento cadastrado.");
      return data[0];
    }

    return null;
  } catch (err) {
    Alert.alert("Erro ao salvar", err.message);
    return null;
  } finally {
    setLoadingAuth(false);
  }
}

async function getEstablishments() {
  try {
    setLoadingAuth(true);

    const { data, error } = await supabase
      .from("estabelecimentos_view")
      .select("*")
     // .eq("status", "aprovado")
      .order("id", { ascending: false });

    if (error) throw error;

    return data;
  } catch (err) {
    Alert.alert("Erro ao carregar", err.message);
    return [];
  } finally {
    setLoadingAuth(false);
  }
}

async function getAvaliacoesByEstabelecimento(id_estabelecimento) {
  try {
    const { data, error } = await supabase
      .from('avaliacoes_view')
      .select('id, id_estabelecimento, id_usuario, nota, titulo, comentario, eh_anonimo, data_criacao, nome_usuario')
      .eq('id_estabelecimento', id_estabelecimento)
      .order('data_criacao', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    Alert.alert('Erro', err.message || 'Não foi possível carregar as avaliações.');
    return [];
  }
}

  async function createAvaliacao({ id_estabelecimento, nota, titulo, comentario, eh_anonimo }) {
    if (!user) {
      Alert.alert('Atenção', 'Você precisa estar logado para avaliar.');
      return false;
    }

    try {
      const { error } = await supabase.from('avaliacoes').insert([
        {
          id_estabelecimento,
          id_usuario: user.id,
          nota,
          titulo,
          comentario,
          eh_anonimo,
        },
      ]);

      if (error) throw error;

      await supabase.rpc('atualizar_media_estabelecimento', { id_estab: id_estabelecimento });

      Alert.alert('Sucesso!', 'Avaliação publicada com sucesso!');
      return true;
    } catch (err) {
      Alert.alert('Erro', err.message || 'Não foi possível publicar a avaliação.');
      return false;
    }
  }

  async function makeUserAdmin(userId, isAdmin) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_admin: isAdmin })
        .eq("id", userId);

      if (error) throw error;

      Alert.alert(
        "Sucesso",
        isAdmin
          ? "Usuário agora é administrador!"
          : "Usuário deixou de ser administrador."
      );
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar o status do usuário.");
    }
  }

  async function banUser(userId) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: "banido" })
        .eq("id", userId);

      if (error) throw error;
      Alert.alert("Sucesso", "Usuário banido com sucesso!");
    } catch (err) {
      Alert.alert("Erro", "Falha ao banir o usuário.");
    }
  }

  async function unbanUser(userId) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: "ativo" })
        .eq("id", userId);

      if (error) throw error;
      Alert.alert("Sucesso", "Usuário reativado com sucesso!");
    } catch (err) {
      Alert.alert("Erro", "Falha ao reativar o usuário.");
    }
  }

  return (
    <AppContext.Provider
      value={{
        loadingAuth,
        user,
        uploadEstablishmentImage,
        createEstablishment,
        getEstablishments,
        loadingFavorites, 
        favoriteIds, 
        toggleFavorite, 
        getFavoriteEstablishments,
        getAvaliacoesByEstabelecimento,
        createAvaliacao,
        userIsAdmin,
        makeUserAdmin,
        banUser,
        unbanUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}