import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonMAI from '../../components/ButtonMAI';
import theme from '../../theme';

const { height } = Dimensions.get('window');

export default function RegrasEstabelecimentoModal({
  visible,
  onAccept,
  onClose,
  apenasLeitura = false
}) {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={() => {
        if (apenasLeitura && onClose) onClose();
      }}
    >
      <SafeAreaView style={styles.container}>

        <View style={styles.header} accessibilityRole="header">
          <Text style={styles.title}>Regras para Cadastro de Estabelecimentos</Text>
          <Text style={styles.subtitle}>
            Leia com atenção antes de registrar um local na plataforma.
          </Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 40 }}
          accessibilityLabel="Texto completo das regras de cadastro de estabelecimentos"
        >
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>1. Tipos de Estabelecimentos Permitidos: </Text> 
            Aceitamos locais reais e acessíveis ao público, como comércios, serviços, saúde, educação, lazer, gastronomia e atendimento público.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>2. Não Permitidos: </Text> 
            Não aceitamos residências, locais inexistentes, estabelecimentos sem funcionamento público, nem anúncios com fins políticos ou ofensivos.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>3. Informações Obrigatórias:</Text> 
            O estabelecimento deve conter nome real, endereço correto, categorias adequadas e ao menos uma informação verdadeira sobre acessibilidade.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>4. Fotos: </Text> 
            As imagens devem mostrar o local verdadeiro, Não use fotos de outros estabelecimentos.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>5. Responsabilidade do Usuário: </Text> 
            O usuário que realizar o cadastro afirma que todas as informações fornecidas são verdadeiras e podem ser verificadas pela equipe administradora.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6. Revisões e Aprovações: </Text>
            Todo cadastro passa por análise. Cadastros que violarem as regras serão recusados.
          </Text>

          <Text style={styles.paragraph}>
            Ao tocar em "Li e Concordo", você confirma que seguiu todas as regras acima para cadastrar o estabelecimento.
          </Text>

        </ScrollView>

        <View style={styles.footer}>
          {!apenasLeitura ? (
            <ButtonMAI
              name="Li e Concordo"
              onPress={onAccept}
              accessibilityLabel="Confirmar leitura das regras e continuar com o cadastro do estabelecimento."
              accessibilityHint="Ao ativar, você confirma que entende e respeita as regras para cadastrar um estabelecimento."
            />
          ) : (
            <ButtonMAI
              name="Fechar"
              onPress={onClose}
              limpo={true}
              accessibilityLabel="Fechar regras de cadastro"
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE3,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.WHITE1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.COLORS.BLACK1,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.COLORS.BLACK3,
    lineHeight: 24,
  },
  content: {
    flex: 1,
  },
  paragraph: {
    fontSize: 18,
    lineHeight: 28,
    color: theme.COLORS.BLACK2,
    marginBottom: 20,
    textAlign: 'left',
  },
  bold: {
    fontWeight: 'bold',
    color: theme.COLORS.BLUE1,
  },
  footer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.COLORS.WHITE1,
  }
});