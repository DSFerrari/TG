import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  StyleSheet,
  ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../../theme"; 
import { categoryItems } from "../../Home/CadastrarEstabelecimento/categoryItems"; 
import { supabase } from "../../../services/supabase";

export default function SolicitacaoDetalheUser({ route }) {
  const { solicitacao } = route.params;

  const [estabAtual, setEstabAtual] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEstabelecimento() {
      if (solicitacao.tipo === "editar" && solicitacao.id_estabelecimento) {
        try {
          const { data, error } = await supabase
            .from("estabelecimentos")
            .select("*")
            .eq("id", solicitacao.id_estabelecimento)
            .maybeSingle();

          if (!error && data) {
            setEstabAtual(data);
          }
        } catch (err) {
        }
      }
      setLoading(false);
    }

    fetchEstabelecimento();
  }, [solicitacao]);

  const fieldLabels = {
    nome: "Nome do Estabelecimento",
    categoria: "Categoria",
    endereco: "Endereço",
    acessibilidades: "Itens de Acessibilidade",
    url_foto_nova: "Foto Sugerida"
  };

  const getCategoryLabel = (value) => {
    const found = categoryItems.find((item) => item.value === value);
    return found ? found.label : value;
  };

  const checkIfChanged = (key, oldVal, newVal) => {
    if (solicitacao.tipo === 'novo') return true;
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
      if (typeof value === 'object' && value?.uri) uri = value.uri;
      else if (typeof value === 'string') {
         uri = value.startsWith("http") || value.startsWith("data:") 
           ? value : `data:image/jpeg;base64,${value}`;
      }
      if (!uri) return <Text style={styles.missingText}>(Imagem inválida)</Text>;
      return (
        <View style={styles.imageContainer}>
          <Image source={{ uri }} style={styles.previewImage} resizeMode="cover" />
        </View>
      );
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

    if (fieldKey === "categoria") {
      return <Text style={styles.valueText}>{getCategoryLabel(value)}</Text>;
    }

    return <Text style={styles.valueText}>{String(value)}</Text>;
  };

  function renderAlteracoes() {
    if (loading) return <ActivityIndicator color={theme.COLORS.BLUE1} style={{marginTop: 20}} />;

    const alteracoes = solicitacao.alteracoes || {};
    let campos = Object.keys(alteracoes);

    const dadosAntigos = estabAtual || {};

    if (solicitacao.tipo === "editar") {
        campos = campos.filter(key => checkIfChanged(key, dadosAntigos[key], alteracoes[key]));
    }

    if (campos.length === 0) {
       return (
         <View style={styles.emptyContainer}>
            <Text style={{color: theme.COLORS.BLACK3}}>Nenhuma alteração de dados detectada.</Text>
         </View>
       );
    }

    return (
      <View style={{ marginTop: 10 }}>
        {campos.map((campo) => {
          const valorNovo = alteracoes[campo];
          const valorAntigo = dadosAntigos[campo]; 
          
          const isImageField = campo.includes("foto") || campo.includes("img");
          const label = fieldLabels[campo] || campo;

          return (
            <View key={campo} style={styles.changeCard}>
              <Text style={styles.fieldTitle}>{label}</Text>
              
              <View style={styles.comparisonContainer}>
                {solicitacao.tipo === "editar" && (
                  <View style={[styles.compareBox, styles.boxOld]}>
                    <Text style={styles.boxHeader}>COMO ERA</Text>
                    <ValueDisplay value={valorAntigo} fieldKey={campo} isImage={isImageField} />
                  </View>
                )}

                <View style={[styles.compareBox, styles.boxNew]}>
                  <Text style={[styles.boxHeader, { color: theme.COLORS.BLUE1 }]}>
                     {solicitacao.tipo === "novo" ? "DADOS ENVIADOS" : "NOVA VERSÃO"}
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

  const getStatusColor = (s) => {
      if(s === 'aprovado') return theme.COLORS.GREEN1;
      if(s === 'rejeitado') return theme.COLORS.RED1;
      return theme.COLORS.YELLOW2;
  };

  const nomeEstabelecimento = 
    estabAtual?.nome || 
    solicitacao.nome_estabelecimento || 
    solicitacao.estabelecimentos?.nome || 
    "Carregando...";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.WHITE3 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        
        <Text style={styles.headerTitle}>{nomeEstabelecimento}</Text>

        <View style={styles.badgesRow}>
            <View style={[styles.badge, { backgroundColor: theme.COLORS.BLUE1 }]}>
                <Text style={styles.badgeText}>
                    {solicitacao.tipo === 'novo' ? 'NOVO CADASTRO' : 'EDIÇÃO'}
                </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: getStatusColor(solicitacao.status) }]}>
                <Text style={[
                  styles.badgeText, 
                
                  { color: solicitacao.status === 'pendente' ? theme.COLORS.BLACK2 : theme.COLORS.WHITE3 }
                ]}>
                    {solicitacao.status.toUpperCase()}
                </Text>
            </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Sua Justificativa:</Text>
          <View style={styles.justificationBox}>
             <Text style={styles.bodyText}>{solicitacao.justificativa}</Text>
          </View>
        </View>

        {solicitacao.status !== "pendente" && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Resposta da Análise:</Text>
            <View style={[
                styles.adminResponseBox, 
                { borderLeftColor: getStatusColor(solicitacao.status) }
            ]}>
              <Text style={styles.bodyText}>
                {solicitacao.resposta_admin || "Sem observações adicionais."}
              </Text>
              <Text style={styles.dateText}>
                Atualizado em: {new Date(solicitacao.data_resposta).toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        <Text style={[styles.sectionLabel, { marginTop: 25, marginBottom: 5 }]}>
          Dados da Solicitação:
        </Text>
        {renderAlteracoes()}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: theme.COLORS.BLACK1,
    marginBottom: 10 
  },
  badgesRow: { 
    flexDirection: 'row', 
    marginBottom: 20, 
    gap: 10 
  },
  badge: { 
    paddingHorizontal: 12, 
    paddingVertical: 5, 
    borderRadius: 4 
  },
  badgeText: { 
    color: theme.COLORS.WHITE3, 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  section: { 
    marginBottom: 15 
  },
  sectionLabel: { 
    fontSize: 14, 
    fontWeight: "bold", 
    color: theme.COLORS.BLACK2,
    textTransform: 'uppercase', 
    marginBottom: 8 
  },
  justificationBox: { 
    backgroundColor: theme.COLORS.WHITE3,
    padding: 15, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: theme.COLORS.WHITE1
  },
  adminResponseBox: { 
    backgroundColor: theme.COLORS.WHITE3, 
    padding: 15, 
    borderRadius: 8, 
    borderLeftWidth: 5, 
    shadowColor: theme.COLORS.BLACK1, 
    shadowOpacity: 0.05, 
    elevation: 2 
  },
  bodyText: { 
    fontSize: 15, 
    color: theme.COLORS.BLACK3,
    lineHeight: 22 
  },
  dateText: { 
    fontSize: 12, 
    color: theme.COLORS.BLACK3,
    marginTop: 10, 
    fontStyle: 'italic' 
  },
  changeCard: { 
    backgroundColor: theme.COLORS.WHITE3, 
    borderRadius: 8, 
    padding: 15, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: theme.COLORS.WHITE1,
    elevation: 2 
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
    textTransform: 'uppercase', 
    letterSpacing: 1 
  },
  valueText: { 
    fontSize: 15, 
    color: theme.COLORS.BLACK1
  },
  missingText: { 
    fontStyle: 'italic', 
    color: theme.COLORS.BLACK3,
    fontSize: 13 
  },
  imageContainer: { 
    marginTop: 5, 
    borderRadius: 6, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: theme.COLORS.WHITE1 
  },
  previewImage: { 
    width: '100%', 
    height: 150, 
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
  emptyContainer: { 
    padding: 15, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderStyle: 'dashed', 
    borderWidth: 1, 
    borderColor: theme.COLORS.WHITE1, 
    borderRadius: 8 
  }
});