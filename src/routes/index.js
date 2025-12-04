import React, { useContext, useState, useEffect } from "react";
import { View, ActivityIndicator, Alert } from "react-native";

import { AuthContext } from "../contexts/auth";
import { AppContext } from "../contexts/app";

import AuthRoutes from "./auth.routes";
import AppRoutes from "./app.routes";
import AdminRoutes from "./admin.routes";

import TermosUsoModal from "../components/TermoUso";
import { supabase } from "../services/supabase"; 
import theme from "../theme";

const VERSAO_ATUAL_TERMOS = 'v1'; 

export default function Routes() {
  const { signed, loading, isRecoveringPassword, user } = useContext(AuthContext); 
  const { userIsAdmin, loadingProfile } = useContext(AppContext);

  const [checkingTerms, setCheckingTerms] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [savingTerms, setSavingTerms] = useState(false);

  useEffect(() => {
    async function checkTerms() {
      if (!signed || !user?.id) {
        setCheckingTerms(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('termos_versao')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data?.termos_versao !== VERSAO_ATUAL_TERMOS) {
          setShowTermsModal(true);
        }

      } catch (err) {
      } finally {
        setCheckingTerms(false);
      }
    }

    checkTerms();
  }, [signed, user]);

  async function handleAcceptTerms() {
    if (!user?.id) return;
    setSavingTerms(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          termos_aceitos_em: new Date(),
          termos_versao: VERSAO_ATUAL_TERMOS
        })
        .eq('id', user.id);

      if (error) throw error;

      setShowTermsModal(false);

    } catch (err) {
      Alert.alert(
        "Erro", 
        "Não foi possível salvar seu aceite. Verifique sua conexão e tente novamente."
      );
    } finally {
      setSavingTerms(false);
    }
  }

  if (loading || loadingProfile || (signed && checkingTerms)) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: theme.COLORS.WHITE3
      }}>
        <ActivityIndicator size="large" color={theme.COLORS.BLUE1} /> 
      </View>
    );
  }

  if (!signed) return <AuthRoutes />;
  if (isRecoveringPassword) return <AuthRoutes />;

  if (showTermsModal) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.COLORS.WHITE3 }}> 
        {savingTerms && (
           <ActivityIndicator 
              size="small" 
              color={theme.COLORS.BLUE1}
              style={{ position: 'absolute', top: 50, right: 20, zIndex: 99 }} 
           />
        )}
        <TermosUsoModal 
          visible={true} 
          onAccept={handleAcceptTerms} 
          apenasLeitura={false}
        />
      </View>
    );
  }

  return <AppRoutes />;
}