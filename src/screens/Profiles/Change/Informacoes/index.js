import React, { useContext, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { AuthContext } from "../../../../contexts/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import TextInputMAI from "../../../../components/TextInputMAI";
import CheckboxDeficiencias from "../../../../components/CheckboxDeficiencias";
import ButtonMAI from "../../../../components/ButtonMAI";
import { styles } from "./styles";

export default function Informacoes({ navigation }) {
  const { user, updateProfile, loadingAuth } = useContext(AuthContext);

  const [nome, setNome] = useState(user?.user_metadata?.full_name || "");
  const [dataNascimento, setDataNascimento] = useState(
    user?.user_metadata?.birth_date || ""
  );
  const [deficiencia, setDeficiencia] = useState([]);

  const formatarData = (text) => {
    const numeros = text.replace(/\D/g, "");

    let formatado = numeros;

    if (numeros.length >= 3) {
      formatado = numeros.slice(0, 2) + "/" + numeros.slice(2);
    }
    if (numeros.length >= 5) {
      formatado =
        numeros.slice(0, 2) +
        "/" +
        numeros.slice(2, 4) +
        "/" +
        numeros.slice(4, 8);
    }

    setDataNascimento(formatado);
  };

  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "Nome é obrigatório");
      return;
    }

    const dataFormatada = converterData(dataNascimento);
    if (!dataFormatada) {
      Alert.alert("Erro", "Data de nascimento inválida!");
      return;
    }

    const success = await updateProfile(
      nome,
      dataFormatada,
      deficiencia
    );

    if (success) {
      Alert.alert("Sucesso", "Informações atualizadas com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  };

  const converterData = (dataInput) => {
    if (dataInput.length !== 10) return null;

    const [dia, mes, ano] = dataInput.split("/");
    const data = new Date(ano, mes - 1, dia);

    if (isNaN(data.getTime())) return null;

    return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TextInputMAI
          texto="Nome Completo"
          value={nome}
          onChangeText={setNome}
        />
        <TextInputMAI
          texto="Data de nascimento"
          placeholder="dd/mm/aaaa"
          value={dataNascimento}
          onChangeText={formatarData}
          keyboardType="numeric"
          maxLength={10}
        />

        <CheckboxDeficiencias
          selectedDeficiencias={deficiencia}
          onSelectionChange={setDeficiencia}
        />

        <ButtonMAI name="Alterar" limpo={true} onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
}

