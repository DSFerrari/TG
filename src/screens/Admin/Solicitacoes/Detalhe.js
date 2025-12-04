import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TextInputMAI from "../../../components/TextInputMAI";
import ButtonMAI from "../../../components/ButtonMAI";
import { AppContext } from "../../../contexts/app";
import theme from "../../../theme";
import { supabase } from "../../../services/supabase";
import { categoryItems } from "../../Home/CadastrarEstabelecimento/categoryItems";

export default function AdminDetalheSolicitacao({ route, navigation }) {
  const { aprovarSolicitacao, rejeitarSolicitacao } = useContext(AppContext);
  const { solicitacao } = route.params;

  const [motivoRejeicao, setMotivoRejeicao] = useState("");
  const [estab, setEstab] = useState(null);
  const [loading, setLoading] = useState(true);

  const fieldLabels = {
    nome: "Nome do Estabelecimento",
    categoria: "Categoria",
    endereco: "Endereço",
    acessibilidades: "Itens de Acessibilidade",
    url_foto_nova: "Foto do Local"
  };

  useEffect(() => {
    async function loadEstab() {
      if (solicitacao.tipo === "editar" && solicitacao.id_estabelecimento) {
        const { data } = await supabase
          .from("estabelecimentos")
          .select("*")
          .eq("id", solicitacao.id_estabelecimento)
          .maybeSingle();

        setEstab(data);
      }
      setLoading(false);
    }
    loadEstab();
  }, []);

  async function aceitar() {
    try {
      const ok = await aprovarSolicitacao(
        solicitacao.id,
        solicitacao.id_estabelecimento,
        solicitacao.alteracoes
      );
      if (ok) navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  }

  async function rejeitar() {
    if (!motivoRejeicao.trim()) {
      Alert.alert("Atenção", "É obrigatório justificar a rejeição.");
      return;
    }
    try {
      const ok = await rejeitarSolicitacao(solicitacao.id, motivoRejeicao);
      if (ok) navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  }

  const getCategoryLabel = (value) => {
    const found = categoryItems.find((item) => item.value === value);
    return found ? found.label : value;
  };

  const checkIfChanged = (key, oldVal, newVal) => {
    if (key === 'url_foto_nova' && newVal) return true;

    const oldV = oldVal || "";
    const newV = newVal || "";

    if (key === 'acessibilidades') {
      const arrOld = typeof oldV === 'string' ? oldV.split(',').map(s => s.trim()).sort().join(',') : "";
      const arrNew = typeof newV === 'string' ? newV.split(',').map(s => s.trim()).sort().join(',') : "";
      return arrOld !== arrNew;
    }

    return String(oldV).trim() !== String(newV).trim();
  };

  const ValueDisplay = ({ value, fieldKey, isImage }) => {
    if (!value) return <Text style={styles.missingText}>(Vazio)</Text>;

    if (isImage) {
      let uri = null;
      if (typeof value === "object" && value?.uri) uri = value.uri;
      else if (typeof value === "string") {
        uri = value.startsWith("http") || value.startsWith("data:")
          ? value : `data:image/jpeg;base64,${value}`;
      }
      if (!uri) return <Text style={styles.missingText}>(Imagem inválida)</Text>;
      return <Image source={{ uri }} style={styles.imagePreview} resizeMode="cover" />;
    }

    if (fieldKey === "acessibilidades") {
      const items = typeof value === 'string' ? value.split(",") : [];
      return (
        <View style={styles.tagsContainer}>
          {items.map((item, idx) => (
            item.trim() ? (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{item.trim()}</Text>
              </View>
            ) : null
          ))}
        </View>
      );
    }

    if (fieldKey === "categoria") return <Text style={styles.valueText}>{getCategoryLabel(value)}</Text>;

    return <Text style={styles.valueText}>{String(value)}</Text>;
  };

  function renderAlteracoes() {
    if (loading) return <ActivityIndicator color={theme.COLORS.BLUE1} />;

    const alteracoes = solicitacao.alteracoes || {};
    let campos = Object.keys(alteracoes);

    if (estab && solicitacao.tipo === "editar") {
      campos = campos.filter(key => checkIfChanged(key, estab[key], alteracoes[key]));
    }

    if (campos.length === 0) {
      return (
        <View style={styles.noChangeContainer}>
          <Text style={styles.noChangeText}>
            ⚠️ Os dados enviados são idênticos aos atuais do estabelecimento.
          </Text>
        </View>
      );
    }

    return (
      <View style={{ marginTop: 10 }}>
        {campos.map((campo) => {
          const valorNovo = alteracoes[campo];
          const valorAntigo = estab ? estab[campo] : null;

          const isImageField = campo.includes("foto") || campo.includes("img");
          const label = fieldLabels[campo] || campo;

          return (
            <View key={campo} style={styles.changeCard}>
              <Text style={styles.fieldTitle}>{label}</Text>

              <View style={styles.comparisonContainer}>
                {solicitacao.tipo === "editar" && (
                  <View style={[styles.compareBox, styles.boxOld]}>
                    <Text style={styles.boxHeader}>ATUAL</Text>
                    <ValueDisplay value={valorAntigo} fieldKey={campo} isImage={isImageField} />
                  </View>
                )}

                <View style={[styles.compareBox, styles.boxNew]}>
                  <Text style={[styles.boxHeader, { color: theme.COLORS.BLUE1 }]}>
                    {solicitacao.tipo === "novo" ? "DADOS" : "PROPOSTO"}
                  </Text>
                  <ValueDisplay value={valorNovo} fieldKey={campo} isImage={isImageField} />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.WHITE3 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>

        <Text style={styles.headerTitle}>
          {solicitacao.nome_estabelecimento || solicitacao.estabelecimentos?.nome || "Estabelecimento"}
        </Text>

        <View style={styles.typeBadge}>
          <Text style={{ color: theme.COLORS.WHITE3, fontWeight: 'bold', fontSize: 12 }}>
            {solicitacao.tipo === 'novo' ? 'NOVO CADASTRO' : 'EDIÇÃO'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Justificativa:</Text>
          <View style={styles.justificationBox}>
            <Text style={styles.bodyText}>{solicitacao.justificativa}</Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 20, marginBottom: 5 }]}>
          Alterações Identificadas:
        </Text>
        {renderAlteracoes()}

        {solicitacao.status === "pendente" && (
          <View style={styles.actionsContainer}>
            <View style={styles.divider} />
            <ButtonMAI
              name="Aprovar Alterações"
              onPress={aceitar}
              style={{ backgroundColor: theme.COLORS.GREEN1, marginBottom: 20 }}
            />
            <View style={styles.rejectContainer}>
              <Text style={{ fontWeight: 'bold', color: theme.COLORS.RED1, marginBottom: 5 }}>
                Rejeitar solicitação?
              </Text>
              <TextInputMAI
                texto="Motivo (Obrigatório)"
                value={motivoRejeicao}
                onChangeText={setMotivoRejeicao}
                style={styles.rejectInput}
                multiline
              />
              <ButtonMAI
                name="Confirmar Rejeição"
                onPress={rejeitar}
                limpo={true}
                style={{ borderColor: theme.COLORS.RED1, borderWidth: 1 }}
                textColor={theme.COLORS.RED1}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: theme.COLORS.BLACK1 
  },
  typeBadge: {
    backgroundColor: theme.COLORS.BLUE1,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 5,
    marginBottom: 20,
  },
  section: { 
    marginBottom: 10 
  },
  sectionLabel: {
    fontSize: 14, 
    fontWeight: "bold", 
    color: theme.COLORS.BLACK2,
    textTransform: 'uppercase', 
    marginBottom: 8,
  },
  justificationBox: {
    backgroundColor: theme.COLORS.WHITE2,
    padding: 15, 
    borderRadius: 8,
    borderLeftWidth: 4, 
    borderLeftColor: theme.COLORS.YELLOW1,
    shadowColor: theme.COLORS.BLACK1, 
    shadowOpacity: 0.05, 
    elevation: 1,
  },
  bodyText: { 
    fontSize: 15, 
    color: theme.COLORS.BLACK1, 
    lineHeight: 22 
  },
  changeCard: {
    backgroundColor: theme.COLORS.WHITE3, 
    borderRadius: 8, 
    padding: 15, 
    marginBottom: 15,
    borderWidth: 1, 
    borderColor: theme.COLORS.WHITE1,
    elevation: 2,
    shadowColor: theme.COLORS.BLACK1,
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fieldTitle: {
    fontSize: 16, 
    fontWeight: 'bold', 
    color: theme.COLORS.BLACK1, 
    marginBottom: 10,
    borderBottomWidth: 1, 
    borderBottomColor: theme.COLORS.WHITE1, 
    paddingBottom: 5
  },
  comparisonContainer: { 
    flexDirection: 'column', 
    gap: 10 
  },
  compareBox: { 
    padding: 10, 
    borderRadius: 6, 
    borderWidth: 1 
  },
  boxOld: { 
    backgroundColor: theme.COLORS.WHITE1,
    borderColor: theme.COLORS.WHITE1 
  },
  boxNew: { 
    backgroundColor: theme.COLORS.WHITE3,
    borderColor: theme.COLORS.BLUE2
  },
  boxHeader: {
    fontSize: 10, 
    fontWeight: '900', 
    color: theme.COLORS.BLACK3, 
    marginBottom: 5,
    textTransform: 'uppercase'
  },
  valueText: { 
    fontSize: 15, 
    color: theme.COLORS.BLACK2 
  },
  missingText: { 
    fontStyle: 'italic', 
    color: theme.COLORS.BLACK3, 
    fontSize: 13 
  },
  imagePreview: { 
    width: '100%', 
    height: 150, 
    borderRadius: 6, 
    backgroundColor: theme.COLORS.WHITE1 
  },
  tagsContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    marginTop: 2 
  },
  tag: {
    backgroundColor: theme.COLORS.WHITE3, 
    borderRadius: 15, 
    paddingHorizontal: 10,
    paddingVertical: 4, 
    marginRight: 6, 
    marginBottom: 6,
    borderWidth: 1, 
    borderColor: theme.COLORS.WHITE1 
  },
  tagText: { 
    fontSize: 12, 
    color: theme.COLORS.BLACK3 
  },
  actionsContainer: { 
    marginTop: 20 
  },
  divider: { 
    height: 1, 
    backgroundColor: theme.COLORS.WHITE1, 
    marginVertical: 20 
  },
  rejectContainer: {
    marginTop: 20, 
    backgroundColor: theme.COLORS.WHITE3,
    padding: 15,
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: theme.COLORS.RED3
  },
  rejectInput: {
    height: 80, 
    textAlignVertical: "top", 
    backgroundColor: theme.COLORS.WHITE2,
    marginBottom: 10, 
    paddingTop: 10, 
    fontSize: 14,
    borderColor: theme.COLORS.WHITE1,
    borderWidth: 1,
    borderRadius: 4
  },
  noChangeContainer: {
    padding: 20, 
    backgroundColor: theme.COLORS.WHITE2, 
    borderWidth: 1,
    borderColor: theme.COLORS.YELLOW1, 
    borderRadius: 8
  },
  noChangeText: { 
    color: theme.COLORS.BLACK2, 
    textAlign: 'center' 
  }
});