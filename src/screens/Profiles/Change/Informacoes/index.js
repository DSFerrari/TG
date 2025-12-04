import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Alert,
  View,
  Keyboard
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { AuthContext } from "../../../../contexts/auth";
import theme from "../../../../theme";

import TextInputMAI from "../../../../components/TextInputMAI";
import CheckboxDeficiencias from "../../../../components/CheckboxDeficiencias";
import ButtonMAI from "../../../../components/ButtonMAI";

export default function Informacoes() {
  const navigation = useNavigation();
  const { user, updateProfile, loadingAuth } = useContext(AuthContext);

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [deficiencia, setDeficiencia] = useState([]);

  useEffect(() => {
    if (user?.user_metadata) {
      const { full_name, birth_date, disability } = user.user_metadata;

      setNome(full_name || "");
      setDataNascimento(formatarDataDoBanco(birth_date));

      if (Array.isArray(disability)) {
        setDeficiencia(disability);
      } else if (typeof disability === "string") {
        setDeficiencia(
          disability
            .split(",")
            .map(s => s.trim())
            .filter(Boolean)
        );
      } else {
        setDeficiencia([]);
      }
    }
  }, [user]);

  

  const formatarDataDoBanco = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("/")) return dateStr;
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [ano, mes, dia] = parts;
    return `${dia}/${mes}/${ano}`;
  };

  const mascaraData = (text) => {
    let v = text.replace(/\D/g, "");
    if (v.length > 2) v = v.replace(/^(\d{2})(\d)/g, "$1/$2");
    if (v.length > 5) v = v.replace(/^(\d{2})\/(\d{2})(\d)/g, "$1/$2/$3");
    setDataNascimento(v);
  };

  const converterDataParaSalvar = (dataInput) => {
    if (!dataInput || dataInput.length !== 10) return null;
    const [dia, mes, ano] = dataInput.split("/");

    const d = parseInt(dia, 10);
    const m = parseInt(mes, 10);
    const a = parseInt(ano, 10);

    if (!d || !m || !a || m > 12 || m < 1 || d > 31 || d < 1) return null;

    const diaPad = dia.padStart(2, "0");
    const mesPad = mes.padStart(2, "0");

    return `${ano}-${mesPad}-${diaPad}`;
  };

  const handleSave = async () => {
  
  if (loadingAuth) {
    return;
  }

  Keyboard.dismiss();

  if (!nome.trim()) {
    Alert.alert("Atenção", "O nome é obrigatório.");
    return;
  }

  const dataFormatadaISO = converterDataParaSalvar(dataNascimento);

  if (!dataFormatadaISO) {
    Alert.alert("Atenção", "Data inválida. Use o formato DD/MM/AAAA.");
    return;
  }

  const success = await updateProfile(
    nome,
    dataFormatadaISO,
    deficiencia
  );

  if (success) {
    Alert.alert("Sucesso", "Informações atualizadas!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  }
};

useEffect(() => {
}, [loadingAuth]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <TextInputMAI
          texto="Nome Completo"
          value={nome}
          onChangeText={setNome}
          placeholder="Digite seu nome"
        />
        
        <TextInputMAI
          texto="Data de nascimento"
          placeholder="DD/MM/AAAA"
          value={dataNascimento}
          onChangeText={mascaraData}
          keyboardType="numeric"
          maxLength={10}
        />

        <CheckboxDeficiencias
          selectedDeficiencias={deficiencia}
          onSelectionChange={setDeficiencia}
        />

        <View style={styles.buttonContainer}>
          <ButtonMAI 
            name={loadingAuth ? "Salvando..." : "Salvar Alterações"} 
            onPress={handleSave}
            disabled={loadingAuth}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE3,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  buttonContainer: {
    marginTop: 20,
  }
});