import {
  Text,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  View,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
import theme from "../../theme";

import TextInputMAI from "../../components/TextInputMAI";
import { useContext, useState } from "react";
import ButtonMAI from "../../components/ButtonMAI";
import { useNavigation } from "@react-navigation/native";
import CheckboxDeficiencias from "../../components/CheckboxDeficiencias";
import { AuthContext } from "../../contexts/auth";
import { supabase } from "../../services/supabase";

import TermosUsoModal from "../../components/TermoUso"; 
import { Ionicons } from '@expo/vector-icons'; 

const VERSAO_ATUAL_TERMOS = 'v1';

function verificarForcaSenha(senha) {
  let forca = 0;
  if (senha.length >= 8) forca++;
  if (/[a-z]/.test(senha)) forca++;
  if (/[A-Z]/.test(senha)) forca++;
  if (/[0-9]/.test(senha)) forca++;
  if (/[^A-Za-z0-9]/.test(senha)) forca++;
  return forca;
}

export default function SignUp() {
  const [dataNascimento, setDataNascimento] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");
  const [deficienciasMultiplas, setDeficienciasMultiplas] = useState([]);

  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [mostrarModalTermos, setMostrarModalTermos] = useState(false);

  const { signUp } = useContext(AuthContext);
  const navegar = useNavigation();

  const formatarData = (text) => {
    const numeros = text.replace(/\D/g, "");
    let formatado = numeros;

    if (numeros.length >= 3) {
      formatado = numeros.slice(0, 2) + "/" + numeros.slice(2);
    }
    if (numeros.length >= 5) {
      formatado = numeros.slice(0, 2) + "/" + numeros.slice(2, 4) + "/" + numeros.slice(4, 8);
    }
    setDataNascimento(formatado);
  };

  const converterData = (dataInput) => {
    if (dataInput.length !== 10) return null;
    const [dia, mes, ano] = dataInput.split("/");
    const numAno = Number(ano);
    const numMes = Number(mes);
    const numDia = Number(dia);
    const agora = new Date();

    if (numAno < 1900 || numAno > agora.getFullYear()) return null;
    const data = new Date(numAno, numMes - 1, numDia);
    if (isNaN(data.getTime())) return null;
    if (data > agora) return null;
    const idade = agora.getFullYear() - data.getFullYear();
    if (idade > 120) return null;

    return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
  };

  const handleCadastro = async () => {

    if (!nome.trim() || !email.trim() || !senha.trim() || !confSenha.trim() || !dataNascimento.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    if (!aceitouTermos) {
      Alert.alert(
        "Atenção", 
        "Para se cadastrar, é necessário ler e aceitar os Termos de Uso e Privacidade."
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "Digite um e-mail válido!");
      return;
    }

    const { data: existingEmail, error: emailCheckError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existingEmail) {
      Alert.alert("E-mail já cadastrado", "Esse e-mail já está em uso.");
      return;
    }

    if (senha.length < 8) {
      Alert.alert("Erro", "A senha deve ter pelo menos 8 caracteres!");
      return;
    }
    const regrasSenha = [
      { regex: /[a-z]/, msg: "Falta pelo menos 1 letra minúscula." },
      { regex: /[A-Z]/, msg: "Falta pelo menos 1 letra maiúscula." },
      { regex: /[0-9]/, msg: "Falta pelo menos 1 número." },
      { regex: /[^A-Za-z0-9]/, msg: "Falta pelo menos 1 símbolo (!@#$%)." },
    ];
    for (let regra of regrasSenha) {
      if (!regra.regex.test(senha)) {
        Alert.alert("Senha fraca", regra.msg);
        return;
      }
    }
    const sequenciasComuns = ["12345678", "98765432", "abcdefgh", "87654321", "qwertyui", "11111111"];
    if (sequenciasComuns.includes(senha.toLowerCase())) {
      Alert.alert("Erro", "A senha não pode ser uma sequência óbvia!");
      return;
    }
    if (senha.includes(" ")) {
      Alert.alert("Erro", "A senha não pode conter espaços!");
      return;
    }
    if (senha !== confSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    const dataFormatada = converterData(dataNascimento);
    if (!dataFormatada) {
      Alert.alert("Data inválida", "Informe uma data real entre 1900 e o ano atual.");
      return;
    }

    const deficienciasString = deficienciasMultiplas.length > 0 ? deficienciasMultiplas : [];

    const sucesso = await signUp(
      email,
      senha,
      nome,
      dataFormatada,
      deficienciasString,
      { 
        versao_termos: VERSAO_ATUAL_TERMOS,
        termos_aceitos: true
      }
    );

    if (sucesso) {
      Alert.alert(
        "Cadastro realizado!",
        "Enviamos um código de verificação para seu e-mail."
      );
      navegar.navigate("ConfirmEmail", { email });
    } else {
      Alert.alert(
        "Erro",
        "Não foi possível concluir o cadastro. Tente novamente."
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView>
            <Text style={styles.titulo}>Cadastro</Text>

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
              selectedDeficiencias={deficienciasMultiplas}
              onSelectionChange={setDeficienciasMultiplas}
            />

            <TextInputMAI
              texto="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInputMAI
              texto="Senha"
              value={senha}
              onChangeText={setSenha}
              password={true}
            />

            {senha.length > 0 && (
              <Text
                style={{
                  marginBottom: 10,
                  fontWeight: "bold",
                  color:
                    verificarForcaSenha(senha) <= 2
                      ? "red"
                      : verificarForcaSenha(senha) === 3
                      ? "orange"
                      : "green",
                }}
              >
                {verificarForcaSenha(senha) <= 2
                  ? "Senha fraca"
                  : verificarForcaSenha(senha) === 3
                  ? "Senha média"
                  : "Senha forte"}
              </Text>
            )}

            <TextInputMAI
              texto="Confirme sua senha"
              value={confSenha}
              onChangeText={setConfSenha}
              password={true}
            />

            <View style={localStyles.termosContainer}>
              <TouchableOpacity 
                style={localStyles.checkboxArea}
                onPress={() => setAceitouTermos(!aceitouTermos)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: aceitouTermos }}
                accessibilityLabel="Li e concordo com os termos de uso"
              >
                <View style={[localStyles.checkbox, aceitouTermos && localStyles.checkboxChecked]}>
                  {aceitouTermos && <Ionicons name="checkmark" size={14} color="#FFF" />}
                </View>
              </TouchableOpacity>

              <View style={localStyles.textoContainer}>
                <Text style={localStyles.textoSimples}>Li e concordo com os </Text>
                <TouchableOpacity onPress={() => setMostrarModalTermos(true)}>
                  <Text style={localStyles.linkTermos}>Termos de Uso e Privacidade.</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ButtonMAI
              name="Cadastrar"
              limpo={true}
              onPress={handleCadastro}
            />

            <ButtonMAI
              name="Já tenho cadastro"
              onPress={() => navegar.goBack()}
            />

            <TermosUsoModal 
                visible={mostrarModalTermos}
                onClose={() => setMostrarModalTermos(false)}
                apenasLeitura={true} 
            />

          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const localStyles = StyleSheet.create({
  termosContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 15,
    marginBottom: 20,
    paddingHorizontal: 10
  },
  checkboxArea: {
    padding: 5,
    marginRight: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.COLORS.BLUE1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  checkboxChecked: {
    backgroundColor: theme.COLORS.BLUE1 || '#007BFF',
  },
  textoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    marginTop: 5
  },
  textoSimples: {
    color: '#333',
    fontSize: 14,
  },
  linkTermos: {
    color: theme.COLORS.BLUE1,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 14,
  }
});