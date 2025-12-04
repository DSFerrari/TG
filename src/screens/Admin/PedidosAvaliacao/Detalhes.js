import React, { useState } from "react";
import { 
  View, 
  Text, 
  Alert, 
  ActivityIndicator, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import ButtonMAI from "../../../components/ButtonMAI";
import { supabase } from "../../../services/supabase";
import theme from "../../../theme";

export default function DetalhesPedido({ route, navigation }) {

  const pedido = route.params?.pedido; 
  const [loading, setLoading] = useState(false);

  if (!pedido) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <MaterialIcons name="error-outline" size={60} color={theme.COLORS.RED1} />
        <Text style={{ marginTop: 20, fontSize: 16, color: theme.COLORS.BLACK2 }}>
          Erro: Dados do pedido não encontrados.
        </Text>
        <TouchableOpacity 
          style={{ marginTop: 20, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: theme.COLORS.BLUE1, borderRadius: 8 }}
          onPress={() => navigation.goBack()}
        >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }


  const nomeEstabelecimento = pedido.estabelecimentos?.nome || "Estabelecimento Desconhecido";
  
 
  const dataCriacao = new Date(pedido.data_criacao).toLocaleDateString("pt-BR");
  
  let nomeAutor = "Usuário Desconhecido";
  if (pedido.avaliacoes?.eh_anonimo) {
    nomeAutor = "Usuário Anônimo";
  } else if (pedido.avaliacoes?.profiles?.full_name) {
   
    nomeAutor = pedido.avaliacoes.profiles.full_name;
  } else {
    
    nomeAutor = "Usuário Identificado"; 
  }

  async function handleAprovacao() {
    setLoading(true);
    try {
     
      const { error } = await supabase
        .from("avaliacoes")
        .delete()
        .eq("id", pedido.id_avaliacao);

      if (error) throw error;

      Alert.alert("Sucesso", "Avaliação excluída permanentemente.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir: " + error.message);
    } finally { 
      setLoading(false); 
    }
  }

  async function handleRejeicao() {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("pedidos_exclusao_avaliacao")
        .update({ status: "rejeitado" })
        .eq("id", pedido.id);

      if (error) throw error;
      
      Alert.alert("Feito", "Pedido rejeitado. A avaliação foi mantida.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar status.");
    } finally { 
      setLoading(false); 
    }
  }


  const renderStars = (nota) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons 
          key={i} 
          name={i <= nota ? 'star' : 'star-border'} 
          size={18} 
          color={theme.COLORS.YELLOW1} 
        />
      );
    }
    return <View style={{ flexDirection: 'row', marginTop: 2 }}>{stars}</View>;
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
             <MaterialIcons name="arrow-back" size={28} color={theme.COLORS.BLACK1} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Análise do Pedido #{pedido.id}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
   
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SOLICITANTE (ESTABELECIMENTO)</Text>
          <View style={styles.estabCard}>
            <View style={styles.estabIcon}>
                <MaterialIcons name="storefront" size={24} color={theme.COLORS.WHITE3} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.estabName}>{nomeEstabelecimento}</Text>
                <Text style={styles.dateText}>Solicitado em: {dataCriacao}</Text>
            </View>
          </View>
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionLabel}>MOTIVO DA DENÚNCIA</Text>
          <View style={styles.motivoBox}>
            <MaterialIcons name="report-problem" size={24} color={theme.COLORS.RED2} style={{marginRight: 10}} />
            <Text style={styles.motivoText}>"{pedido.motivo}"</Text>
          </View>
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AVALIAÇÃO ORIGINAL</Text>
          
          <View style={styles.reviewCard}>
             {pedido.avaliacoes ? (
                <>
                    <View style={styles.reviewHeader}>
                        <View style={styles.userAvatar}>
                            <MaterialIcons name="person" size={22} color={theme.COLORS.BLACK3} />
                        </View>
                        <View style={{flex: 1, marginLeft: 10}}>
                            <Text style={styles.userName}>{nomeAutor}</Text>
                            {renderStars(pedido.avaliacoes.nota || 0)}
                        </View>
                    </View>
                    
                    <Text style={styles.reviewTitle}>
                        {pedido.avaliacoes.titulo || "(Sem título)"}
                    </Text>
                    
                    <Text style={styles.reviewBody}>
                        {pedido.avaliacoes.comentario || "O usuário não inseriu um comentário em texto."}
                    </Text>
                    
                    <Text style={styles.reviewDate}>
                        Postado em: {pedido.avaliacoes.data_criacao ? new Date(pedido.avaliacoes.data_criacao).toLocaleDateString() : "--/--/----"}
                    </Text>
                </>
             ) : (

                <View style={{ alignItems: 'center', padding: 20 }}>
                    <MaterialIcons name="delete-forever" size={40} color={theme.COLORS.BLACK3} />
                    <Text style={{ color: theme.COLORS.BLACK2, marginTop: 10, textAlign: 'center' }}>
                        Esta avaliação não foi encontrada.{'\n'}Talvez já tenha sido excluída.
                    </Text>
                </View>
             )}
          </View>
        </View>


        <View style={styles.footer}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.COLORS.BLUE1} />
          ) : (
            <>
              <ButtonMAI
                name="Aprovar Exclusão"
                color={theme.COLORS.RED1}
                onPress={() => Alert.alert(
                  "Atenção!", 
                  "Isso apagará a avaliação permanentemente do aplicativo. Tem certeza?", 
                  [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Sim, Excluir", onPress: handleAprovacao, style: 'destructive' }
                  ]
                )}
              />
              
              <View style={{ height: 15 }} />
              
              <ButtonMAI
                name="Rejeitar Pedido (Manter Avaliação)"
                color={theme.COLORS.BLACK2} 
                onPress={handleRejeicao}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.COLORS.WHITE2, paddingHorizontal: 20 },
  
  header: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  headerTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 10, color: theme.COLORS.BLACK1, flex: 1 },
  
  section: { marginBottom: 25 },
  sectionLabel: { fontSize: 12, fontWeight: "bold", color: theme.COLORS.BLACK3, marginBottom: 8, letterSpacing: 1 },
  
  estabCard: { 
    flexDirection: "row", alignItems: "center", 
    backgroundColor: theme.COLORS.WHITE3, 
    padding: 15, borderRadius: 12, elevation: 2,
    shadowColor: theme.COLORS.BLACK1, shadowOpacity: 0.05, shadowRadius: 5
  },
  estabIcon: { 
    width: 44, height: 44, borderRadius: 22, 
    backgroundColor: theme.COLORS.BLUE1, 
    alignItems: 'center', justifyContent: 'center', marginRight: 15 
  },
  estabName: { fontSize: 16, fontWeight: "bold", color: theme.COLORS.BLACK1 },
  dateText: { fontSize: 12, color: theme.COLORS.BLACK3, marginTop: 2 },

  motivoBox: { 
    flexDirection: "row", alignItems: 'center',
    backgroundColor: '#FEF3F2', 
    padding: 15, borderRadius: 12, 
    borderWidth: 1, borderColor: '#FECACA'
  },
  motivoText: { flex: 1, fontSize: 15, color: theme.COLORS.RED1, fontStyle: "italic", fontWeight: '500' },

  reviewCard: { 
    backgroundColor: theme.COLORS.WHITE3, 
    padding: 20, borderRadius: 16, 
    elevation: 3, shadowColor: theme.COLORS.BLACK1, shadowOpacity: 0.1, shadowRadius: 8,
    borderWidth: 1, borderColor: theme.COLORS.WHITE1
  },
  reviewHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  userAvatar: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: theme.COLORS.WHITE2, 
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: theme.COLORS.WHITE1
  },
  userName: { fontSize: 15, fontWeight: "bold", color: theme.COLORS.BLACK1 },
  reviewTitle: { fontSize: 17, fontWeight: "bold", marginBottom: 8, color: theme.COLORS.BLACK1 },
  reviewBody: { fontSize: 15, color: theme.COLORS.BLACK2, lineHeight: 22, marginBottom: 15 },
  reviewDate: { fontSize: 12, color: theme.COLORS.BLACK3, textAlign: "right", fontStyle: 'italic', marginTop: 10 },

  footer: { marginTop: 10, marginBottom: 30 }
});