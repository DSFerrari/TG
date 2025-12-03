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
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import ButtonMAI from '../../../components/ButtonMAI';
import theme from '../../../theme';
import { styles } from './styles';
import { AppContext } from '../../../contexts/app';
import { supabase } from '../../../services/supabase';

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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.nome}>
          {item.eh_anonimo ? 'Anônimo' : item.nome_usuario || 'Usuário'}
        </Text>

        <MaterialIcons
          name="more-vert"
          size={26}
          color={theme.COLORS.BLACK2}
          style={{ padding: 4 }}
          onPress={() => {
            setSelectedAvaliacao(item);
            setMenuVisible(true);
          }}
        />
      </View>

      {renderStars(item.nota)}

      <Text style={styles.titulo}>{item.titulo}</Text>
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
      console.log(err);
      Alert.alert("Erro", "Não foi possível enviar a solicitação.");
    } finally {
      setSending(false);
    }
  }

  const renderMenu = () => {
    if (!menuVisible || !selectedAvaliacao) return null;

    return (
      <View style={styles.menuOverlay}>
        <View style={styles.menuBox}>
          <Text style={styles.menuTitle}>Opções</Text>

          <Text
            style={styles.menuOption}
            onPress={() => {
              setMenuVisible(false);
              setMotivoTexto("");
              setModalMotivoVisible(true);
            }}
          >
            Solicitar exclusão da avaliação
          </Text>

          <Text
            style={[styles.menuOption, { color: 'red' }]}
            onPress={() => {
                setMenuVisible(false);
                setSelectedAvaliacao(null);
            }}
          >
            Cancelar
          </Text>
        </View>
      </View>
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
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={{ width: '85%', backgroundColor: '#fff', borderRadius: 12, padding: 20, elevation: 5 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Solicitar Exclusão
          </Text>
          <Text style={{ marginBottom: 10, color: '#555' }}>
            Por favor, explique por que esta avaliação deve ser removida:
          </Text>

          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              padding: 10,
              height: 100,
              textAlignVertical: 'top',
              backgroundColor: '#f9f9f9'
            }}
            placeholder="Digite o motivo aqui..."
            multiline
            numberOfLines={4}
            value={motivoTexto}
            onChangeText={setMotivoTexto}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, gap: 15 }}>
            <TouchableOpacity onPress={() => setModalMotivoVisible(false)} disabled={sending}>
              <Text style={{ fontSize: 16, color: '#666', fontWeight: 'bold' }}>Cancelar</Text>
            </TouchableOpacity>

            {sending ? (
              <ActivityIndicator size="small" color={theme.COLORS.BLUE1} />
            ) : (
              <TouchableOpacity onPress={confirmarExclusao}>
                <Text style={{ fontSize: 16, color: theme.COLORS.BLUE1, fontWeight: 'bold' }}>Enviar</Text>
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
        <ActivityIndicator size="large" color={theme.COLORS.BLUE1} />
      ) : avaliacoes.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma avaliação ainda.</Text>
      ) : (
        <FlatList
          data={avaliacoes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={{ marginBottom: 30 }}>
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