import { createContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { Alert } from "react-native";
import { decode } from "base64-arraybuffer";

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session && session.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session && session.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

 async function signIn(email, password) {
  setLoadingAuth(true);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("ERRO LOGIN:", error);

    let mensagem = "Ocorreu um erro ao fazer login.";

    if (error.message.includes("Invalid login credentials")) {
      mensagem = "E-mail ou senha incorretos.";
    } 
    else if (error.message.includes("Email not confirmed")) {
      mensagem = "Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.";
    }
    else if (error.message.includes("rate limit")) {
      mensagem = "Muitas tentativas. Aguarde um momento e tente novamente.";
    }
    else {
      // Último fallback
      mensagem = error.message;
    }

    Alert.alert("Erro no login", mensagem);
    setLoadingAuth(false);
    return false;
  }

  setLoadingAuth(false);
  return true;
}


  async function signUp(email, password, fullName, birthDate, disability) {
    setLoadingAuth(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          birth_date: birthDate,
          disability,
        },
      },
    });

    if (error) {
      if (
        error.message.includes("already registered") ||
        error.message.includes("unique constraint") ||
        error.message.includes("duplicate")
      ) {
        Alert.alert(
          "E-mail já cadastrado",
          "Esse e-mail já está em uso. Tente fazer login ou use outro e-mail."
        );
      } else {
        Alert.alert("Erro no cadastro", error.message);
      }

      setLoadingAuth(false);
      return false;
    }

    Alert.alert(
      "Verifique seu e-mail",
      "Enviamos um código de confirmação para sua caixa de entrada."
    );

    setLoadingAuth(false);
    return true;
  }

  async function verifyOtp(email, token) {
    setLoadingAuth(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    if (error) {
      Alert.alert(
        "Erro na Verificação",
        error.message || "Código inválido ou expirado."
      );
      setLoadingAuth(false);
      return;
    }

    Alert.alert("Sucesso!", "Seu e-mail foi verificado com sucesso.");
    setLoadingAuth(false);
  }

  async function resendSignUpOtp(email) {
    setLoadingAuth(true);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      Alert.alert("Erro", error.message || "Não foi possível reenviar o código.");
    } else {
      Alert.alert(
        "Sucesso",
        "Um novo código de confirmação foi enviado para o seu e-mail."
      );
    }

    setLoadingAuth(false);
  }

  async function signOut() {
    setLoadingAuth(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("Erro ao fazer logout:", error.message);
      Alert.alert(
        "Erro",
        "Não foi possível fazer logout. Tente novamente."
      );
    } else {
      Alert.alert("Sucesso", "Você saiu com sucesso!");
      setUser(null);
    }

    setLoadingAuth(false);
  }

  async function sendPasswordResetOtp(email) {
    setLoadingAuth(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      Alert.alert("Erro", error.message || "Não foi possível enviar o código.");
      setLoadingAuth(false);
      return false;
    }

    setLoadingAuth(false);
    return true;
  }

  async function verifyPasswordResetOtp(email, token) {
    setLoadingAuth(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "recovery",
    });

    if (error) {
      Alert.alert("Erro", "Código inválido ou expirado. Tente novamente.");
      setLoadingAuth(false);
      return false;
    }

    setIsRecoveringPassword(true);
    setLoadingAuth(false);
    return true;
  }

  async function updateUserPassword(newPassword) {
    setLoadingAuth(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      Alert.alert(
        "Erro",
        "Não foi possível atualizar a senha: " + error.message
      );
      setLoadingAuth(false);
      return false;
    }

    await supabase.auth.signOut();
    setIsRecoveringPassword(false);
    setLoadingAuth(false);
    return true;
  }

  async function deleteAccount() {
    setLoadingAuth(true);

    const { error } = await supabase.rpc("delete_user_account");

    if (error) {
      Alert.alert("Erro ao excluir conta", error.message);
      setLoadingAuth(false);
      return false;
    }

    await signOut();

    Alert.alert("Conta Excluída", "Sua conta foi excluída com sucesso.");
    return true;
  }

  async function uploadAvatar(image) {
    try {
      setLoadingAuth(true);

      const fileExt = image.uri.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, decode(image.base64), {
          contentType: image.mimeType || "image/jpeg",
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const { data: updatedUser, error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          avatar_url: publicUrl,
        },
      });

      if (error) throw error;

      setUser(updatedUser.user);
      Alert.alert("Sucesso", "Sua foto de perfil foi atualizada!");

      return publicUrl;
    } catch (err) {
      Alert.alert("Erro no upload", err.message);
      return null;
    } finally {
      setLoadingAuth(false);
    }
  }

  async function updateProfile(fullName, birthDate, disability) {
    setLoadingAuth(true);

    const normalizeDisability = (input) => {
      if (!input) return [];
      const arr = Array.isArray(input) ? input : [input];
      const pieces = arr.flatMap((item) => {
        if (item == null) return [];
        return String(item)
          .split(/[,;\/\|]|(\s+e\s+)/i)
          .map((p) => p && p.trim())
          .filter(Boolean);
      });

      const seen = new Set();
      const cleaned = [];

      for (let p of pieces) {
        const key = p
          .normalize("NFKD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          const titleCase = p
            .toLowerCase()
            .split(" ")
            .filter(Boolean)
            .map((s) => s[0].toUpperCase() + s.slice(1))
            .join(" ");
          cleaned.push(titleCase);
        }
      }

      return cleaned;
    };

    try {
      const normalized = normalizeDisability(disability);

      const { error: clearError } = await supabase.auth.updateUser({
        data: {
          disability: [],
        },
      });

      if (clearError) {
        Alert.alert("Erro", "Não foi possível limpar deficiências. Tente novamente.");
        setLoadingAuth(false);
        return false;
      }

      const finalDisability =
        Array.isArray(normalized) && normalized.length > 0 ? normalized : [];

      const payload = {
        full_name: String(fullName || "").trim(),
        birth_date: String(birthDate || "").trim(),
        disability: finalDisability,
      };

      const { data: updatedUser, error } = await supabase.auth.updateUser({
        data: payload,
      });

      if (error) {
        Alert.alert("Erro", error.message || "Erro ao atualizar perfil");
        setLoadingAuth(false);
        return false;
      }

      if (updatedUser && updatedUser.user) {
        setUser(updatedUser.user);
      } else {
        const fetched = await supabase.auth.getUser();
        if (!fetched.error && fetched.data?.user) setUser(fetched.data.user);
      }

      setLoadingAuth(false);
      return true;
    } catch (err) {
      Alert.alert("Erro", err?.message || "Erro desconhecido ao atualizar perfil");
      setLoadingAuth(false);
      return false;
    }
  }

  async function getProfile() {
    const { data, error } = await supabase.auth.getUser();
    if (!error) {
      setUser(data.user);
      return data.user;
    }
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        signIn,
        signUp,
        signOut,
        loading,
        loadingAuth,
        verifyOtp,
        resendSignUpOtp,
        sendPasswordResetOtp,
        verifyPasswordResetOtp,
        updateUserPassword,
        isRecoveringPassword,
        deleteAccount,
        updateProfile,
        uploadAvatar,
        getProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
