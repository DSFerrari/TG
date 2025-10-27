import { createContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { Alert } from "react-native";
import { decode } from "base64-arraybuffer";

export const AppContext = createContext({});

export default function AppProvider({ children }) {
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [user, setUser] = useState(null); 
  
  useEffect(() => {
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

   
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


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

  async function createEstablishment(establishmentData,navigation) {
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}