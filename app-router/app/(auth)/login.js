import { 
    View, Text, TextInput, TouchableOpacity, StyleSheet, 
    ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform 
} from 'react-native';
import { useContext, useState, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function Login() {
    const router = useRouter();
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Ref para pular do email para a senha
    const senhaRef = useRef();

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validação individual
    const validateField = (field, value) => {
        let error = "";
        if (field === 'email') {
            if (!value) error = "O e-mail é obrigatório";
            else if (!regexEmail.test(value)) error = "E-mail inválido";
        }

        if (field === 'senha' && !value) {
            error = "A senha é obrigatória";
        }

        setErrors(prev => ({ ...prev, [field]: error }));
        return error === "";
    };

    const handleLogin = async () => {
        const isEmailValid = validateField('email', email);
        const isSenhaValid = validateField('senha', senha);

        if (!isEmailValid || !isSenhaValid) return;

        setLoading(true);
        const res = await login(email, senha);

        if (res?.error) {
            setErrors({ geral: res.error });
        }
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView 
                contentContainerStyle={styles.container} 
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.header}>Bem-vindo</Text>

                {/* ERRO GERAL */}
                {errors.geral && <Text style={styles.errorGeral}>{errors.geral}</Text>}

                {/* CAMPO EMAIL */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={[styles.input, errors.email && styles.inputError]}
                        placeholder='seu@email.com'
                        value={email}
                        onChangeText={setEmail}
                        onBlur={() => validateField('email', email)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        returnKeyType="next"
                        onSubmitEditing={() => senhaRef.current.focus()}
                        blurOnSubmit={false}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                {/* CAMPO SENHA */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        ref={senhaRef}
                        style={[styles.input, errors.senha && styles.inputError]}
                        placeholder='Digite sua senha'
                        secureTextEntry
                        value={senha}
                        onChangeText={setSenha}
                        onBlur={() => validateField('senha', senha)}
                        returnKeyType="done"
                        onSubmitEditing={handleLogin}
                    />
                    {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}
                </View>

                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.7 }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Entrar</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => router.push('/cadastro')} 
                    style={styles.linkContainer} 
                    activeOpacity={.7}
                >
                    <Text style={styles.linkText}>
                        Ainda não tem uma conta? <Text style={styles.linkTextDestaque}>Cadastre-se</Text>
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 25, flexGrow: 1, justifyContent: 'center', backgroundColor: '#F3F4F6' },
    header: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#1F2937' },

    // Inputs
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 14, fontWeight: '600', color: '#4B5563', marginBottom: 5, marginLeft: 4 },
    
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#D1D5DB', fontSize: 16 },
    inputError: { borderColor: '#EF4444' },
    
    // Erro
    errorText: { color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 4 },
    errorGeral: { backgroundColor: '#FEE2E2', color: '#B91C1C', padding: 12, borderRadius: 8, marginBottom: 20, textAlign: 'center', overflow: 'hidden' },

    // Botão
    button: { backgroundColor: '#EA1463', padding: 16, borderRadius: 10, marginTop: 10, elevation: 2 },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },

    // Link cadastro
    linkContainer: { marginTop: 25, padding: 10, alignItems: 'center' },
    linkText: { fontSize: 15, color: '#4B5563' },
    linkTextDestaque: { color: '#2563EB', fontWeight: 'bold' },
});