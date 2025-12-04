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

export default function TermosUsoModal({ visible, onAccept, onClose, apenasLeitura = false }) {
  
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
          <Text style={styles.title}>Termos de Uso e Privacidade</Text>
          <Text style={styles.subtitle}>
            Por favor, leia com atenção como cuidamos dos seus dados.
          </Text>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 40 }}
          accessibilityLabel="Texto completo dos termos de uso"
        >
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>1. Coleta de Dados:</Text> Para o funcionamento do aplicativo, precisamos coletar informações como seu nome, data de nascimento e e-mail. Estes dados servem para garantir sua identidade e segurança.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>2. Acessibilidade:</Text> Nosso compromisso é com todos. Seus dados nos ajudam a adaptar a experiência para suas necessidades específicas de acessibilidade.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>3. Uso das Informações:</Text> Não vendemos seus dados. Eles são usados exclusivamente para melhorar o serviço e para comunicação oficial do aplicativo.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>4. Seus Direitos:</Text> Você pode consultar, editar ou solicitar a exclusão dos seus dados a qualquer momento através do menu de configurações.
          </Text>
          
          <Text style={styles.paragraph}>
            Ao clicar em "Li e Aceito", você concorda com o processamento destes dados conforme descrito acima.
          </Text>
        </ScrollView>

        <View style={styles.footer}>
          {!apenasLeitura ? (
            <ButtonMAI
              name="Li e concordo com os termos"
              onPress={onAccept}
              accessibilityLabel="Botão Li e concordo com os termos. Toque duas vezes para aceitar e entrar no aplicativo."
              accessibilityHint="Ao ativar, você aceita os termos e acessa a tela inicial."
            />
          ) : (
            <ButtonMAI
              name="Fechar"
              onPress={onClose}
              limpo={true}
              accessibilityLabel="Fechar tela de termos de uso"
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