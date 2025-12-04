import React, { useContext, useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  FlatList, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import ButtonMAI from '../../../components/ButtonMAI';
import theme from '../../../theme';
import { AppContext } from '../../../contexts/app';
import { supabase } from '../../../services/supabase';

const { width, height } = Dimensions.get('window');

export default function Avaliacoes() {
  const navigation = useNavigation();
  const route = useRoute();
  const { estabelecimentoId } = route.params;
  const { getAvaliacoesByEstabelecimento } = useContext(AppContext);
  
  const [selectedAvaliacao, setSelectedAvaliacao] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  
  const [modalMotivoVisible, setModalMotivoVisible] = useState(false);
  const [motivoTexto, setMotivoTexto] = useState("");
  const [sending, setSending] = useState(false);

  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function carregarAvaliacoes() {
    setLoading(true);
    const data = await getAvaliacoesByEstabelecimento(estabelecimentoId);
    setAvaliacoes(data);
    setLoading(false);
  }

  useEffect(() => {
    carregarAvaliacoes();

    const channel = supabase
      .channel(`avaliacoes-estab-${estabelecimentoId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'avaliacoes',
          filter: `id_estabelecimento=eq.${estabelecimentoId}`
        },
        (payload) => {
          carregarAvaliacoes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [estabelecimentoId]);

  useFocusEffect(
    useCallback(() => {
      carregarAvaliacoes();
    }, [estabelecimentoId])
  );

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={i <= rating ? 'star' : 'star-border'}
          size={24}
          color={theme.COLORS.YELLOW1}
        />
      );
    }
    return <View style={{ flexDirection: 'row', marginTop: 4 }}>{stars}</View>;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.nome}>
          {item.eh_anonimo ? 'Anônimo' : item.nome_usuario || 'Usuário'}
        </Text>

        <TouchableOpacity 
          onPress={() => {
            setSelectedAvaliacao(item);
            setMenuVisible(true);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <MaterialIcons
            name="more-vert"
            size={24}
            color={theme.COLORS.BLACK3}
            />
        </TouchableOpacity>
      </View>

      {renderStars(item.nota)}

      {item.titulo ? <Text style={styles.titulo}>{item.titulo}</Text> : null}
      
      <Text style={styles.data}>
        {new Date(item.data_criacao).toLocaleDateString('pt-BR')}
      </Text>
      
      <Text style={styles.texto}>{item.comentario}</Text>
    </View>
  );

  async function confirmarExclusao() {
    if (!motivoTexto.trim()) {
      Alert.alert("Atenção", "Por favor, digite o motivo da exclusão.");
      return;
    }

    setSending(true);

    try {
      const { error } = await supabase
        .from("pedidos_exclusao_avaliacao")
        .insert({
          id_avaliacao: selectedAvaliacao.id,
          id_estabelecimento: estabelecimentoId,
          motivo: motivoTexto,
          status: "pendente",
        });

      if (error) throw error;

      Alert.alert("Sucesso", "Pedido enviado! O administrador irá analisar.");
      
      setMotivoTexto("");
      setModalMotivoVisible(false);
      setMenuVisible(false);
      setSelectedAvaliacao(null);

    } catch (err) {
      Alert.alert("Erro", "Não foi possível enviar a solicitação.");
    } finally {
      setSending(false);
    }
  }

  const renderMenu = () => {
    if (!menuVisible || !selectedAvaliacao) return null;

    return (
      <TouchableOpacity 
        style={styles.menuOverlay} 
        activeOpacity={1} 
        onPress={() => setMenuVisible(false)}
      >
        <View style={styles.menuBox}>
          <Text style={styles.menuTitle}>Opções</Text>

          <TouchableOpacity
            style={styles.menuOptionBtn}
            onPress={() => {
              setMenuVisible(false);
              setMotivoTexto("");
              setModalMotivoVisible(true);
            }}
          >
            <Text style={styles.menuOptionText}>Solicitar exclusão da avaliação</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuOptionBtn}
            onPress={() => {
                setMenuVisible(false);
                setSelectedAvaliacao(null);
            }}
          >
            <Text style={[styles.menuOptionText, { color: theme.COLORS.RED2 }]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderModalMotivo = () => (
    <Modal
      visible={modalMotivoVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setModalMotivoVisible(false)}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Solicitar Exclusão
          </Text>
          <Text style={styles.modalSubtitle}>
            Por favor, explique por que esta avaliação deve ser removida:
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite o motivo aqui..."
            placeholderTextColor={theme.COLORS.BLACK3}
            multiline
            numberOfLines={4}
            value={motivoTexto}
            onChangeText={setMotivoTexto}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity onPress={() => setModalMotivoVisible(false)} disabled={sending}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            {sending ? (
              <ActivityIndicator size="small" color={theme.COLORS.BLUE1} />
            ) : (
              <TouchableOpacity onPress={confirmarExclusao}>
                <Text style={styles.confirmText}>Enviar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.COLORS.BLUE1} />
        </View>
      ) : avaliacoes.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Text style={styles.emptyText}>Nenhuma avaliação ainda.</Text>
        </View>
      ) : (
        <FlatList
          data={avaliacoes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <ButtonMAI
          name="+ Escrever avaliação"
          onPress={() =>
            navigation.navigate('EscreverAvaliacao', { estabelecimentoId })
          }
        />
      </View>
      
      {renderMenu()}
      {renderModalMotivo()}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE2,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  emptyText: {
    color: theme.COLORS.BLACK3,
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: theme.COLORS.WHITE3,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    

    shadowColor: theme.COLORS.BLACK1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,

    borderWidth: 1,
    borderColor: theme.COLORS.WHITE1,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.BLACK1,
  },
  titulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.COLORS.BLACK1,
    marginTop: 8,
  },
  data: {
    fontSize: 12,
    color: theme.COLORS.BLACK3,
    marginTop: 4,
    marginBottom: 8,
  },
  texto: {
    fontSize: 14,
    color: theme.COLORS.BLACK2,
    lineHeight: 20,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  menuBox: {
    width: width * 0.8,
    backgroundColor: theme.COLORS.WHITE3,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: theme.COLORS.BLACK1,
    textAlign: 'center',
  },
  menuOptionBtn: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.WHITE1,
  },
  menuOptionText: {
    fontSize: 16,
    color: theme.COLORS.BLACK1,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: theme.COLORS.WHITE3,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.COLORS.BLACK1,
  },
  modalSubtitle: {
    marginBottom: 15,
    color: theme.COLORS.BLACK3,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.COLORS.WHITE1,
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    backgroundColor: theme.COLORS.WHITE2,
    color: theme.COLORS.BLACK1,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 20,
  },
  cancelText: {
    fontSize: 16,
    color: theme.COLORS.BLACK3,
    fontWeight: '600',
  },
  confirmText: {
    fontSize: 16,
    color: theme.COLORS.BLUE1,
    fontWeight: 'bold',
  },
});