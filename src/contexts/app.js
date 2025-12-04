import { createContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { Alert } from "react-native";
import { decode } from "base64-arraybuffer";

export const AppContext = createContext({});

export default function AppProvider({ children }) {
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEstab, setSelectedEstab] = useState(null);


  async function fetchProfile(userId) {
    if (!userId) return null;

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
        return newProfile;
      }

      setProfile(data);
      setUserIsAdmin(data.is_admin === true && data.status !== "banido");
      return data;

    } catch (err) {
      return null;
    }
  }


  async function fetchUserFavorites(userId) {
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
      Alert.alert("Erro ao carregar favoritos", err.message);
    } finally {
      setLoadingFavorites(false);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserFavorites(session.user.id);

        const p = await fetchProfile(session.user.id);

        if (p?.status === "banido") {
          await supabase.auth.signOut();
          Alert.alert("Acesso bloqueado", "Seu usuário foi banido.");
        }
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserFavorites(session.user.id);
          const p = await fetchProfile(session.user.id);

          if (p?.status === "banido") {
            await supabase.auth.signOut();
            Alert.alert("Acesso bloqueado", "Seu usuário foi banido.");
          }
        } else {
          setFavoriteIds(new Set());
          setUserIsAdmin(false);
          setProfile(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function toggleFavorite(establishmentId) {
    if (!user) {
      return Alert.alert("Atenção", "É necessário estar logado.");
    }

    const userId = user.id;
    const isFavorite = favoriteIds.has(establishmentId);

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from("favoritos")
          .delete()
          .eq("id_usuario", userId)
          .eq("id_estabelecimento", establishmentId);

        if (error) throw error;

        const newSet = new Set(favoriteIds);
        newSet.delete(establishmentId);
        setFavoriteIds(newSet);

      } else {
        const { error } = await supabase
          .from("favoritos")
          .insert({ id_usuario: userId, id_estabelecimento: establishmentId });

        if (error) throw error;

        const newSet = new Set(favoriteIds);
        newSet.add(establishmentId);
        setFavoriteIds(newSet);
      }

    } catch (err) {
      Alert.alert("Erro", err.message);
    }
  }

  async function getFavoriteEstablishments() {
    if (!user) return [];

    try {
      setLoadingFavorites(true);

      const { data: favRows } = await supabase
        .from("favoritos")
        .select("id_estabelecimento")
        .eq("id_usuario", user.id);

      const ids = favRows.map((r) => r.id_estabelecimento);
      if (ids.length === 0) return [];

      const { data } = await supabase
        .from("estabelecimentos_view")
        .select("*")
        .in("id", ids);

      return data;

    } catch (err) {
      Alert.alert("Erro", err.message);
      return [];

    } finally {
      setLoadingFavorites(false);
    }
  }

  async function getAvaliacoesByEstabelecimento(id_estabelecimento) {
    try {
      const { data, error } = await supabase
        .from("avaliacoes_view")
        .select("*")
        .eq("id_estabelecimento", id_estabelecimento)
        .order("data_criacao", { ascending: false });

      if (error) throw error;

      return data;

    } catch (err) {
      Alert.alert("Erro", err.message);
      return [];
    }
  }

  async function createAvaliacao({ id_estabelecimento, nota, titulo, comentario, eh_anonimo }) {
    if (!user) {
      return Alert.alert("Atenção", "É necessário estar logado.");
    }

    try {
      const { error } = await supabase
        .from("avaliacoes")
        .insert({
          id_estabelecimento,
          id_usuario: user.id,
          nota,
          titulo,
          comentario,
          eh_anonimo,
        });

      if (error) throw error;

      await supabase.rpc("atualizar_media_estabelecimento", {
        id_estab: id_estabelecimento,
      });

      Alert.alert("Sucesso", "Avaliação publicada!");
      return true;

    } catch (err) {
      Alert.alert("Erro", err.message);
      return false;
    }
  }

  async function getEstablishments() {
    try {
      setLoadingAuth(true);

      const { data } = await supabase
        .from("estabelecimentos_view")
        .select("*")
        .eq("status", "aprovado")
        .order("id", { ascending: false });

      return data;

    } catch (err) {
      Alert.alert("Erro ao carregar", err.message);
      return [];

    } finally {
      setLoadingAuth(false);
    }
  }

  async function createEstablishment(establishmentData) {
    try {
      setLoadingAuth(true);

      if (!user) throw new Error("Usuário não autenticado.");

      const payload = {
        ...establishmentData,
        id_usuario_criador: user.id,
      };

      const { data, error } = await supabase
        .from("estabelecimentos")
        .insert([payload])
        .select();

      if (error) throw error;

      Alert.alert("Sucesso!", "Estabelecimento enviado para aprovação.");
      return data[0];

    } catch (err) {
      Alert.alert("Erro", err.message);
      return null;

    } finally {
      setLoadingAuth(false);
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

      const { error } = await supabase
        .from("estabelecimentos")
        .update({ url_foto: publicUrl })
        .eq("id", establishmentId);

      if (error) throw error;

      Alert.alert("Sucesso", "Foto atualizada!");
      navigation.goBack();

      return publicUrl;

    } catch (err) {
      Alert.alert("Erro", err.message);
      return null;

    } finally {
      setLoadingAuth(false);
    }
  }

  async function deleteEstablishment(estab) {
    try {
      if (!estab) throw new Error("Estabelecimento inválido.");

      if (estab.url_foto) {
        const path = estab.url_foto.replace(/^.+\/object\/public\//, "");
        await supabase.storage
          .from("fotos_estabelecimentos")
          .remove([path]);
      }

      await supabase
        .from("favoritos")
        .delete()
        .eq("id_estabelecimento", estab.id);

      const { error } = await supabase
        .from("estabelecimentos")
        .delete()
        .eq("id", estab.id);

      if (error) throw error;

      return true;

    } catch (err) {
      Alert.alert("Erro", err.message);
      return false;
    }
  }


  async function solicitarEdicao(estabelecimentoId, alteracoes, justificativa, nomeEstabelecimento) {
    try {
      setLoadingAuth(true);

      if (!user) throw new Error("Usuário não autenticado.");

      const { error } = await supabase
        .from("estabelecimento_solicitacoes")
        .insert({
          id_estabelecimento: estabelecimentoId,
          id_usuario: user.id,
          tipo: "editar",
          alteracoes,
          justificativa,
          nome_estabelecimento: nomeEstabelecimento,
        });

      if (error) throw error;

      Alert.alert("Sucesso", "Sua solicitação foi enviada.");
      return true;

    } catch (err) {
      Alert.alert("Erro", err.message);
      return false;

    } finally {
      setLoadingAuth(false);
    }
  }

  async function solicitarExclusao(estabelecimentoId, justificativa, nomeEstabelecimento) {
    try {
      setLoadingAuth(true);

      if (!user) throw new Error("Usuário não autenticado.");

      const { error } = await supabase
        .from("estabelecimento_solicitacoes")
        .insert({
          id_estabelecimento: estabelecimentoId,
          id_usuario: user.id,
          tipo: "excluir",
          justificativa,
          nome_estabelecimento: nomeEstabelecimento,
        });

      if (error) throw error;

      Alert.alert("Sucesso", "Solicitação enviada para análise.");
      return true;

    } catch (err) {
      Alert.alert("Erro", err.message);
      return false;

    } finally {
      setLoadingAuth(false);
    }
  }

  async function listarSolicitacoesUsuario() {
    if (!user) return [];

    try {
      const { data } = await supabase
        .from("estabelecimento_solicitacoes")
        .select(`
          *,
          estabelecimentos:estabelecimentos!estabelecimento_solicitacoes_id_estabelecimento_fkey (nome)
        `)
        .eq("id_usuario", user.id)
        .order("data_solicitacao", { ascending: false });

      return data;

    } catch (err) {
      Alert.alert("Erro", err.message);
      return [];
    }
  }

  async function listarSolicitacoesAdmin() {
    if (!userIsAdmin) return [];

    try {
      const { data } = await supabase
        .from("estabelecimento_solicitacoes")
        .select(`
          *,
          estabelecimentos:estabelecimentos!estabelecimento_solicitacoes_id_estabelecimento_fkey (nome)
        `)
        .order("data_solicitacao", { ascending: false });

      return data;

    } catch (err) {
      Alert.alert("Erro", err.message);
      return [];
    }
  }

  async function aprovarSolicitacao(id_solicitacao, id_estabelecimento, alteracoes) {
    try {
      setLoadingAuth(true);

      if (!id_solicitacao) throw new Error("ID inválido.");
      if (!id_estabelecimento) throw new Error("Estabelecimento inválido.");

      const { data: solicitacao } = await supabase
        .from("estabelecimento_solicitacoes")
        .select("*")
        .eq("id", id_solicitacao)
        .single();

      if (solicitacao.tipo === "excluir") {
        const { data: estab } = await supabase
          .from("estabelecimentos")
          .select("*")
          .eq("id", id_estabelecimento)
          .single();

        const ok = await deleteEstablishment(estab);
        if (!ok) throw new Error("Erro ao excluir.");

        await supabase
          .from("estabelecimento_solicitacoes")
          .update({
            status: "aprovado",
            resposta_admin: "Exclusão realizada.",
            data_resposta: new Date(),
          })
          .eq("id", id_solicitacao)
          .select();

        Alert.alert("Sucesso", "Solicitação aprovada.");
        return true;
      }

      const { data: estab } = await supabase
        .from("estabelecimentos")
        .select("*")
        .eq("id", id_estabelecimento)
        .single();

      let updates = { ...alteracoes };

      if (alteracoes?.url_foto_nova) {
        if (estab.url_foto) {
          const path = estab.url_foto.replace(/^.+\/object\/public\//, "");
          await supabase.storage
            .from("fotos_estabelecimentos")
            .remove([path]);
        }

        const fileName = `${id_estabelecimento}-${Date.now()}.jpg`;
        const filePath = `estabelecimentos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("fotos_estabelecimentos")
          .upload(filePath, decode(alteracoes.url_foto_nova.base64), {
            contentType: "image/jpeg",
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("fotos_estabelecimentos")
          .getPublicUrl(filePath);

        updates.url_foto = urlData.publicUrl;

        delete updates.url_foto_nova;
      }

      await supabase
        .from("estabelecimentos")
        .update(updates)
        .eq("id", id_estabelecimento)
        .select();

      await supabase
        .from("estabelecimento_solicitacoes")
        .update({
          status: "aprovado",
          resposta_admin: "Alterações aplicadas.",
          data_resposta: new Date(),
        })
        .eq("id", id_solicitacao)
        .select();

      Alert.alert("Sucesso", "Solicitação aprovada!");
      return true;

    } catch (err) {
      Alert.alert("Erro", err.message);
      return false;

    } finally {
      setLoadingAuth(false);
    }
  }

  async function rejeitarSolicitacao(id_solicitacao, justificativaAdmin) {
    try {
      setLoadingAuth(true);

      const { error } = await supabase
        .from("estabelecimento_solicitacoes")
        .update({
          status: "rejeitado",
          resposta_admin: justificativaAdmin,
          data_resposta: new Date(),
        })
        .eq("id", id_solicitacao)
        .select();

      if (error) throw error;

      Alert.alert("Sucesso", "Solicitação rejeitada.");
      return true;

    } catch (err) {
      Alert.alert("Erro", err.message);
      return false;

    } finally {
      setLoadingAuth(false);
    }
  }

  async function makeUserAdmin(userId, isAdmin) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_admin: isAdmin })
        .eq("id", userId);

      if (error) throw error;

      Alert.alert("Sucesso", "Admin atualizado.");
      return true;

    } catch (err) {
      Alert.alert("Erro", err.message);
      return false;
    }
  }

  async function banUser(userId) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: "banido" })
        .eq("id", userId);

      if (error) throw error;

      Alert.alert("Sucesso", "Usuário banido!");
      return true;

    } catch (err) {
      Alert.alert("Erro", err.message);
      return false;
    }
  }

  async function deleteAvaliacao(idAvaliacao) {
    if (!user) {
      Alert.alert("Atenção", "É necessário estar logado.");
      return false;
    }

    try {
      const { error } = await supabase
        .from("avaliacoes")
        .delete()
        .eq("id", idAvaliacao)
        .eq("id_usuario", user.id);

      if (error) throw error;

      return true;

    } catch (err) {
      Alert.alert("Erro ao excluir", err.message);
      return false;
    }
  }

  async function unbanUser(userId) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: "ativo" })
        .eq("id", userId);

      if (error) throw error;

      Alert.alert("Sucesso", "Usuário desbanido!");
      return true;

    } catch (err) {
      Alert.alert("Erro", err.message);
      return false;
    }
  }

async function getMyEstablishments() {
  if (!user) return [];

  try {
    setLoadingAuth(true);
    
    const { data, error } = await supabase
      .from("estabelecimentos")
      .select("*")
      .eq("id_usuario_criador", user.id)
      .order("data_criacao", { ascending: false }); 

    if (error) throw error;

    return data;
  } catch (err) {
    Alert.alert("Erro", err.message);
    return [];
  } finally {
    setLoadingAuth(false);
  }
}
  return (
    <AppContext.Provider
      value={{
        loadingAuth,
        loadingFavorites,

        user,
        profile,
        userIsAdmin,

        // FAVORITOS
        favoriteIds,
        toggleFavorite,
        getFavoriteEstablishments,

        // AVALIAÇÕES
        getAvaliacoesByEstabelecimento,
        createAvaliacao,
        deleteAvaliacao,

        // ESTABELECIMENTOS
        getEstablishments,
        createEstablishment,
        uploadEstablishmentImage,
        deleteEstablishment,
        getMyEstablishments,

        // SOLICITAÇÕES
        solicitarEdicao,
        solicitarExclusao,
        listarSolicitacoesUsuario,
        listarSolicitacoesAdmin,
        aprovarSolicitacao,
        rejeitarSolicitacao,

        // ADMIN
        makeUserAdmin,
        banUser,
        unbanUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
