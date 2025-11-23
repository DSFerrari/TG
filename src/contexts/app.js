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

      } else {
        setProfile(data);
        setUserIsAdmin(data.is_admin === true && data.status !== "banido");
        return data;
      }

    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
      return null;
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
            return;
          }

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

      const { error } = await supabase
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
        Alert.alert("Sucesso!", "criação de estabelecimento enviada para aprovação do administrador.");
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
        .eq("status", "aprovado")
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
        .from("avaliacoes_view")
        .select(
          "id, id_estabelecimento, id_usuario, nota, titulo, comentario, eh_anonimo, data_criacao, nome_usuario"
        )
        .eq("id_estabelecimento", id_estabelecimento)
        .order("data_criacao", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      Alert.alert("Erro", err.message || "Não foi possível carregar as avaliações.");
      return [];
    }
  }

  async function createAvaliacao({ id_estabelecimento, nota, titulo, comentario, eh_anonimo }) {
    if (!user) {
      Alert.alert("Atenção", "Você precisa estar logado para avaliar.");
      return false;
    }

    try {
      const { error } = await supabase.from("avaliacoes").insert([
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

      await supabase.rpc("atualizar_media_estabelecimento", {
        id_estab: id_estabelecimento,
      });

      Alert.alert("Sucesso!", "Avaliação publicada com sucesso!");
      return true;
    } catch (err) {
      Alert.alert("Erro", err.message || "Não foi possível publicar a avaliação.");
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

      return true;
    } catch (err) {
      Alert.alert("Erro", err.message || "Não foi possível atualizar o status.");
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
      Alert.alert("Erro", err.message || "Falha ao banir o usuário.");
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

      Alert.alert("Sucesso", "Usuário reativado!");
      return true;
    } catch (err) {
      Alert.alert("Erro", err.message || "Falha ao reativar o usuário.");
      return false;
    }
  }

  async function deleteEstablishment(estab) {
    try {
      if (!estab || !estab.url_foto) {
        throw new Error("Estabelecimento inválido ou sem imagem.");
      }

      const path = estab.url_foto.replace(
        /^.+\/object\/public\//,
        ""
      );

      await supabase.storage
        .from("fotos_estabelecimentos")
        .remove([path]);

      await supabase
        .from("favoritos")
        .delete()
        .eq("id_estabelecimento", estab.id);

      const { error } = await supabase
        .from("estabelecimentos")
        .delete()
        .eq("id", estab.id);

      if (error) throw error;

      Alert.alert("Rejeitado", "Estabelecimento removido com sucesso!");
      return true;
    } catch (err) {
      Alert.alert("Erro", err.message || "Falha ao rejeitar estabelecimento.");
      return false;
    }
  }

    async function solicitarEdicao(estabelecimentoId, alteracoes, justificativa, nomeEstabelecimento) {
  if (!user) {
    Alert.alert("Atenção", "Você precisa estar logado.");
    return false;
  }

  try {
    setLoadingAuth(true);

    const { error } = await supabase
      .from("estabelecimento_solicitacoes")
      .insert([
        {
          id_estabelecimento: estabelecimentoId,
          id_usuario: user.id,
          tipo: "editar",
          alteracoes,
          justificativa,
          nome_estabelecimento: nomeEstabelecimento,
        }
      ]);

    if (error) throw error;

    Alert.alert("Enviado!", "Sua solicitação de edição foi enviada para análise.");
    return true;

  } catch (err) {
    Alert.alert("Erro", err.message || "Não foi possível enviar a solicitação.");
    return false;

  } finally {
    setLoadingAuth(false);
  }
}


 async function solicitarExclusao(estabelecimentoId, justificativa, nomeEstabelecimento) {
  if (!user) {
    Alert.alert("Atenção", "Você precisa estar logado.");
    return false;
  }

  try {
    setLoadingAuth(true);

    const { error } = await supabase
      .from("estabelecimento_solicitacoes")
      .insert([
        {
          id_estabelecimento: estabelecimentoId,
          id_usuario: user.id,
          tipo: "excluir",
          justificativa,
          nome_estabelecimento: nomeEstabelecimento,
        }
      ]);

    if (error) throw error;

    Alert.alert("Solicitação enviada", "A exclusão será analisada por um administrador.");
    return true;

  } catch (err) {
    Alert.alert("Erro", err.message || "Não foi possível enviar a solicitação.");
    return false;

  } finally {
    setLoadingAuth(false);
  }
}

  async function listarSolicitacoesUsuario() {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from("estabelecimento_solicitacoes")
        .select(`*, estabelecimentos(nome)`)
        .eq("id_usuario", user.id)
        .order("data_solicitacao", { ascending: false });

      if (error) throw error;

      return data;
    } catch (err) {
      Alert.alert("Erro", err.message);
      return [];
    }
  }

  async function listarSolicitacoesAdmin() {
    if (!userIsAdmin) return [];

    try {
      const { data, error } = await supabase
        .from("estabelecimento_solicitacoes")
        .select(`*, estabelecimentos(nome)`)
        .order("data_solicitacao", { ascending: false });

      if (error) throw error;

      return data;
    } catch (err) {
      Alert.alert("Erro", err.message);
      return [];
    }
  }

async function aprovarSolicitacao(id_solicitacao, id_estabelecimento, alteracoes) {
  try {
    setLoadingAuth(true);

    const { data: solicitacao, error: solErr } = await supabase
      .from("estabelecimento_solicitacoes")
      .select("*")
      .eq("id", id_solicitacao)
      .single();

    if (solErr) throw solErr;

    if (solicitacao.tipo === "excluir") {
      const { data: estab } = await supabase
        .from("estabelecimentos")
        .select("*")
        .eq("id", id_estabelecimento)
        .single();

      const ok = await deleteEstablishment(estab);
      if (!ok) throw new Error("Falha ao excluir estabelecimento.");

      await supabase
        .from("estabelecimento_solicitacoes")
        .update({
          status: "aprovado",
          resposta_admin: "Exclusão aprovada e realizada.",
          data_resposta: new Date(),
        })
        .eq("id", id_solicitacao);

      Alert.alert("Sucesso", "Solicitação de exclusão aprovada.");
      return true;
    }
    const { data: estab, error: estErr } = await supabase
      .from("estabelecimentos")
      .select("*")
      .eq("id", id_estabelecimento)
      .single();

    if (estErr) throw estErr;

    let dataToUpdate = { ...alteracoes };

    if (alteracoes.url_foto_nova) {
      const novaFoto = alteracoes.url_foto_nova;

      if (estab.url_foto) {
        const path = estab.url_foto.replace(/^.+\/object\/public\//, "");
        await supabase.storage
          .from("fotos_estabelecimentos")
          .remove([path]);
      }

      const fileExt = "jpg";
      const fileName = `${id_estabelecimento}-${Date.now()}.${fileExt}`;
      const filePath = `estabelecimentos/${fileName}`;

      const base64 = novaFoto.base64;

      const { error: uploadError } = await supabase.storage
        .from("fotos_estabelecimentos")
        .upload(filePath, decode(base64), {
          contentType: "image/jpeg",
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("fotos_estabelecimentos")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      dataToUpdate.url_foto = publicUrl;

      delete dataToUpdate.url_foto_nova;
    }

    const { error: updateErr } = await supabase
      .from("estabelecimentos")
      .update(dataToUpdate)
      .eq("id", id_estabelecimento);

    if (updateErr) throw updateErr;
    
    await supabase
      .from("estabelecimento_solicitacoes")
      .update({
        status: "aprovado",
        resposta_admin: "Alterações aplicadas com sucesso.",
        data_resposta: new Date(),
      })
      .eq("id", id_solicitacao);

    Alert.alert("Sucesso", "Solicitação de edição aprovada!");
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
          data_resposta: new Date()
        })
        .eq("id", id_solicitacao);

      if (error) throw error;

      Alert.alert("Rejeitado", "Solicitação rejeitada com sucesso.");
      return true;

    } catch (err) {
      Alert.alert("Erro", err.message);
      return false;

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

        getAvaliacoesByEstabelecimento,
        createAvaliacao,

        userIsAdmin,
        makeUserAdmin,
        banUser,
        unbanUser,
        deleteEstablishment,

        solicitarEdicao,
        solicitarExclusao,

        listarSolicitacoesUsuario,
        listarSolicitacoesAdmin,

        aprovarSolicitacao,
        rejeitarSolicitacao,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
