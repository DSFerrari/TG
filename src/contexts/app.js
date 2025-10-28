import { createContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { Alert } from "react-native";
import { decode } from "base64-arraybuffer";

export const AppContext = createContext({});

export default function AppProvider({ children }) {
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [user, setUser] = useState(null);

  // NOVO: Estados para Favoritos
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // NOVO: Função para buscar os IDs dos favoritos do usuário
  async function fetchUserFavorites(userId) {
    if (!userId) return;

    try {
      setLoadingFavorites(true);
      const { data, error } = await supabase
        .from("favoritos")
        .select("id_estabelecimento") // <-- MUDANÇA AQUI
        .eq("id_usuario", userId);

      if (error) throw error;

      // Transforma o array de objetos em um Set de IDs
      const idSet = new Set(data.map((fav) => fav.id_estabelecimento)); // <-- MUDANÇA AQUI
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
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserFavorites(session.user.id);
        } else {
          setFavoriteIds(new Set());
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); 

  // NOVO: Função para adicionar/remover um favorito (clique no coração)
  async function toggleFavorite(establishmentId) {
    if (!user) {
      Alert.alert("Atenção", "Você precisa estar logado para favoritar.");
      return;
    }

    const userId = user.id;
    const isCurrentlyFavorite = favoriteIds.has(establishmentId);

    try {
      if (isCurrentlyFavorite) {
        // --- REMOVER (DELETE) ---
        const { error } = await supabase
          .from("favoritos")
          .delete()
          .eq("id_usuario", userId)
          .eq("id_estabelecimento", establishmentId); // <-- MUDANÇA AQUI

        if (error) throw error;

        setFavoriteIds((prevSet) => {
          const newSet = new Set(prevSet);
          newSet.delete(establishmentId); 
          return newSet;
        });
      } else {
        // --- ADICIONAR (INSERT) ---
        const { error } = await supabase
          .from("favoritos")
          .insert({ id_usuario: userId, id_estabelecimento: establishmentId }); // <-- MUDANÇA AQUI

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

  // NOVO: Função para carregar a tela "Favoritos" (com JOIN)
  async function getFavoriteEstablishments() {
    if (!user) return []; 

    try {
      setLoadingFavorites(true);

      const { data, error } = await supabase
        .from("favoritos")
        .select("estabelecimentos(*)")
        .eq("id_usuario", user.id)
        .order("id", { foreignTable: "estabelecimentos", ascending: false }); 

      if (error) throw error;

      return data.map((item) => item.estabelecimentos);
    } catch (err) {
      Alert.alert("Erro ao carregar favoritos", err.message);
      return [];
    } finally {
      setLoadingFavorites(false);
    }
  }

  async function uploadEstablishmentImage(image, establishmentId) {
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
      return publicUrl;
    } catch (err) {
      Alert.alert("Erro no upload", err.message);
      return null;
    } finally {
      setLoadingAuth(false);
    }
  }

  async function createEstablishment(establishmentData, navigation) {
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

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        Alert.alert("Sucesso!", "Novo estabelecimento cadastrado.");
        navigation.goBack();
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
        .from("estabelecimentos")
        .select("*")
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}