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

        setFavoriteIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(establishmentId);
          return newSet;
        });

      } else {
        const { error } = await supabase
          .from("favoritos")
          .insert({
            id_usuario: userId,
            id_estabelecimento: establishmentId
          });

        if (error) throw error;

        setFavoriteIds((prev) => {
          const newSet = new Set(prev);
          newSet.add(establishmentId);
          return newSet;
        });
      }
    } catch (err) {
      Alert.alert("Erro", err.message);
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

  async function createAvaliacao({ id_estabelecimento, nota, titulo, comentario, eh_anonimo }) {
    if (!user) {
      Alert.alert("Atenção", "Você precisa estar logado para avaliar.");
      return false;
    }

    try {
      const { error } = await supabase
        .from("avaliacoes")
        .insert([
          {
            id_estabelecimento,
            id_usuario: user.id,
            nota,
            titulo,
            comentario,
            eh_anonimo,
          }
        ]);

      if (error) throw error;

      await supabase.rpc("atualizar_media_estabelecimento", {
        id_estab: id_estabelecimento,
      });

      Alert.alert("Sucesso", "Avaliação criada com sucesso!");
      return true;

    } catch (err) {
      Alert.alert("Erro", err.message);
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

      Alert.alert("Enviado!", "Sua solicitação foi enviada ao admin.");
      return true;

    } catch (err) {
      Alert.alert("Erro", err.message);
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

      Alert.alert("Sucesso!", "Solicitação de exclusão enviada.");
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
      const { data, error } = await supabase
        .from("estabelecimento_solicitacoes")
        .select(`
          *,
          estabelecimentos:estabelecimentos!estabelecimento_solicitacoes_id_estabelecimento_fkey (nome)
        `)
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
        .select(`
          *,
          estabelecimentos:estabelecimentos!estabelecimento_solicitacoes_id_estabelecimento_fkey (nome)
        `)
        .order("data_solicitacao", { ascending: false });

      if (error) throw error;

      return data;

    } catch (err) {
      Alert.alert("Erro", err.message);
      return [];
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

  async function aprovarSolicitacao(id_solicitacao, id_estabelecimento, alteracoes) {
    try {
      setLoadingAuth(true);

      if (!id_solicitacao) throw new Error("ID da solicitação inválido.");
      if (!id_estabelecimento) throw new Error("ID do estabelecimento inválido.");

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
        if (!ok) throw new Error("Falha ao excluir.");

        const { error: solUpdateErr } = await supabase
          .from("estabelecimento_solicitacoes")
          .update({
            status: "aprovado",
            resposta_admin: "Exclusão aprovada e realizada.",
            data_resposta: new Date(),
          })
          .eq("id", id_solicitacao)
          .select();

        if (solUpdateErr) throw solUpdateErr;

        Alert.alert("Sucesso", "Solicitação aprovada.");
        return true;
      }

      const { data: estab } = await supabase
        .from("estabelecimentos")
        .select("*")
        .eq("id", id_estabelecimento)
        .single();

      let dataToUpdate = { ...alteracoes };

      if (alteracoes?.url_foto_nova) {
        const novaFoto = alteracoes.url_foto_nova;

        if (estab.url_foto) {
          const path = estab.url_foto.replace(/^.+\/object\/public\//, "");
          await supabase.storage
            .from("fotos_estabelecimentos")
            .remove([path]);
        }

        const fileName = `${id_estabelecimento}-${Date.now()}.jpg`;
        const filePath = `estabelecimentos/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from("fotos_estabelecimentos")
          .upload(filePath, decode(novaFoto.base64), {
            contentType: "image/jpeg",
          });

        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage
          .from("fotos_estabelecimentos")
          .getPublicUrl(filePath);

        dataToUpdate.url_foto = urlData.publicUrl;

        delete dataToUpdate.url_foto_nova;
      }

      const { error: estUpdateErr } = await supabase
        .from("estabelecimentos")
        .update(dataToUpdate)
        .eq("id", id_estabelecimento)
        .select();

      if (estUpdateErr) throw estUpdateErr;

      const { error: solUpdateError } = await supabase
        .from("estabelecimento_solicitacoes")
        .update({
          status: "aprovado",
          resposta_admin: "Alterações aplicadas com sucesso.",
          data_resposta: new Date(),
        })
        .eq("id", id_solicitacao)
        .select();

      if (solUpdateError) throw solUpdateError;

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

      if (!id_solicitacao) throw new Error("ID inválido.");

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
        profile,
        userIsAdmin,

        toggleFavorite,
        favoriteIds,
        getEstablishments,

        createAvaliacao,

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