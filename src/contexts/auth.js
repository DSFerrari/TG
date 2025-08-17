import { createContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useNavigation } from "@react-navigation/native";

export const AuthContext = createContext({});


export default function AuthProvider({children}){

const [user,setUser] = useState(null);
const [loadingAuth,setLoadingAuth] = useState(false);
const [loading,setLoading] = useState(true);

const navigation = useNavigation();

 useEffect(() => {
        
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

async function signIn(email,password) {
    setLoadingAuth(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert('Erro no Login', error.message);
    setLoadingAuth(false);
  }

  async function signUp(email,password,confirmPassword,fullName,birthDate,disability) {
        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem!");
            return;
        }
        

        setLoading(true);

        
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (authError) {
            Alert.alert("Erro no cadastro", authError.message);
            setLoading(false);
            return;
        }

        if (!authData.user) {
            Alert.alert("Erro", "Não foi possível criar o usuário. Tente novamente.");
            setLoading(false);
            return;
        }

        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: authData.user.id,
                full_name: fullName,
                birth_date: birthDate,
                disability: disability,
            });

        if (profileError) {
            Alert.alert("Erro ao salvar perfil", profileError.message);
        } else {
            Alert.alert("Sucesso!", "Cadastro realizado. Verifique seu e-mail para confirmar a conta.");
        }

        setLoading(false);
        navigation.goBack();
  }

  async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log("Erro ao fazer logout:", error.message);
        }
    }

    return(
        <AuthContext.Provider value={{ signed: !!user,user,signIn,signUp,signOut,loading,loadingAuth}}>
            {children}
        </AuthContext.Provider>
    )
}