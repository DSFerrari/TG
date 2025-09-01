import { createContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { Alert } from "react-native";

export const AuthContext = createContext({});


export default function AuthProvider({children}){

const [user,setUser] = useState(null);
const [loadingAuth,setLoadingAuth] = useState(false);
const [loading,setLoading] = useState(true);

const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);

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

   async function signUp(email, password, fullName, birthDate, disability) {
        setLoadingAuth(true);
        
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    birth_date: birthDate,
                    disability: disability,
                }
            }
        });

        if (error) {
            Alert.alert("Erro no cadastro", error.message);
            setLoadingAuth(false);
            return false; // Retorna falha
        }

        Alert.alert("Verifique seu e-mail", "Enviamos um código de confirmação para sua caixa de entrada.");
        setLoadingAuth(false);
        return true;
    }

    async function verifyOtp(email, token) {
        setLoadingAuth(true);
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'signup',
        });

        if (error) {
            Alert.alert("Erro na Verificação", error.message || "Código inválido ou expirado.");
            setLoadingAuth(false);
            return;
        }

        Alert.alert("Sucesso!", "Seu e-mail foi verificado com sucesso.");
        setLoadingAuth(false);
}

  async function resendSignUpOtp(email) {
        setLoadingAuth(true);
        const { data, error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
        });

        if (error) {
            Alert.alert("Erro", error.message || "Não foi possível reenviar o código.");
        } else {
            Alert.alert("Sucesso", "Um novo código de confirmação foi enviado para o seu e-mail.");
        }

        setLoadingAuth(false);
    }

  async function signOut() {
    setLoadingAuth(true);
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        console.log("Erro ao fazer logout:", error.message);
        Alert.alert("Erro", "Não foi possível fazer logout. Tente novamente.");
    } else {
        setUser(null);
    }
    
    setLoadingAuth(false);
}

  async function sendPasswordResetOtp(email) {
        setLoadingAuth(true);
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);

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
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'recovery'
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
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            Alert.alert("Erro", "Não foi possível atualizar a senha: " + error.message);
            setLoadingAuth(false);
            return false;
        }

        await supabase.auth.signOut();
        setIsRecoveringPassword(false);
        setLoadingAuth(false);
        return true;
    }

    return(
        <AuthContext.Provider value={{ signed: !!user,user,signIn,signUp,signOut,
        loading,loadingAuth,verifyOtp,resendSignUpOtp,
        sendPasswordResetOtp,verifyPasswordResetOtp,updateUserPassword,
        isRecoveringPassword
        }}>
            {children}
        </AuthContext.Provider>
    )
}