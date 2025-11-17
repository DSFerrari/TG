import React, { useState, useContext,useEffect } from 'react';
import { View, Text, Alert,TouchableWithoutFeedback,Platform,Keyboard,KeyboardAvoidingView,ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRoute } from '@react-navigation/native';
import { AuthContext } from '../../../contexts/auth';

import TextInputMAI from '../../../components/TextInputMAI';
import ButtonMAI from '../../../components/ButtonMAI';
import { styles } from './styles';
import theme from '../../../theme';


export default function ConfirmEmailScreen() {
    const [token, setToken] = useState('');
    const route = useRoute();
    const { email } = route.params;

    const { verifyOtp,resendSignUpOtp, loadingAuth } = useContext(AuthContext);
    const [countdown, setCountdown] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

      useEffect(() => {
        if (countdown === 0) {
            setIsResendDisabled(false);
            return;
        }

        const timerId = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);

        return () => clearTimeout(timerId);
    }, [countdown]);



    async function handleVerification() {
        if (token.trim().length !== 6) {
            Alert.alert("Erro", "Por favor, insira o código de 6 dígitos.");
            return;
        }
        try{
        await verifyOtp(email, token);
        }catch (error) {
            console.log("Erro na verificação:",error);
        }
    }

    async function handleResendCode() {
        setIsResendDisabled(true);
        setCountdown(60);
        await resendSignUpOtp(email);
    }

    return (
        <TouchableWithoutFeedback
    onPress={Keyboard.dismiss}
    >
    <KeyboardAvoidingView
     style={styles.container}
   behavior={Platform.OS === 'ios' ? 'padding': 'height'}
    >
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        >
        <SafeAreaView style={styles.container}>
            <Text style={{marginTop:30, fontSize: 18,color: theme.COLORS.BLUE1}}>
                Insira o código de 6 dígitos enviado para 
            o seu email
            </Text>

            <TextInputMAI
                texto="Código de Verificação"
                value={token}
                onChangeText={setToken}
                keyboardType="numeric"
                maxLength={6}
            />

            <ButtonMAI
                name="Verificar Código"
                onPress={handleVerification}
                loading={loadingAuth}
                limpo={true}
            />
{isResendDisabled ? (
                    <Text style={{color: theme.COLORS.BLUE1}}>
                        Reenviar código em {countdown}s
                    </Text>
                ) : (
            <ButtonMAI
            name= "Reenviar Codigo"
            onPress={handleResendCode} 
            disabled={isResendDisabled}
            />
                )}
        </SafeAreaView>
        </ScrollView>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}