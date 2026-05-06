import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useContext, useState, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function Cadastro() {
    const { register } = useContext(AuthContext);
    const router = useRouter();

    // Estados dos campos
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [errors, setErrors] = useState({});

    // Referências para pular de campo
    const emailRef = useRef();
    const senhaRef = useRef();
    const confirmarSenhaRef = useRef();

    // Configurações de Validação
    const regexEmail = /^(?:rm|pf)\d+@fiap\.com\.br$/i;
    const regexSenha = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    // Função de validação individual por campo
    const validateField = (field, value) => {
        let error = "";

        if (field === 'nome' && !value.trim()) error = "Nome é obrigatório";
        
        if (field === 'email') {
            if (!value) error = "E-mail obrigatório";
            else if (!regexEmail.test(value)) error = "E-mail inválido";
        }

        if (field === 'senha') {
            if (!value) error = "Senha obrigatória";
            else if (!regexSenha.test(value)) error = "Mínimo 6 caracteres (letras e números)";
        }

        if (field === 'confirmarSenha' && value !== senha) {
            error = "As senhas não coincidem";
        }

        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleCadastro = async () => {
        // Valida tudo uma última vez antes de enviar, só por precaução
        validateField('nome', nome);
        validateField('email', email);
        validateField('senha', senha);
        validateField('confirmarSenha', confirmarSenha);

        if (nome && email && senha && senha === confirmarSenha && !errors.email && !errors.senha) {
            const res = await register({ nome, email, senha });
            if (res?.error) setErrors({ geral: res.error });
            else router.replace('/login');
        }
    };

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.header}>Cadastro</Text>

                {/* CAMPO NOME */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput 
                        style={[styles.input, errors.nome && styles.inputError]}
                        value={nome}
                        placeholder='Ex: João Silva'
                        onChangeText={setNome}
                        onBlur={() => validateField('nome', nome)}
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current.focus()} // Pula para o próximo
                        blurOnSubmit={false}
                    />
                    {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
                </View>

                {/* CAMPO EMAIL */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput 
                        ref={emailRef}
                        style={[styles.input, errors.email && styles.inputError]}
                        placeholder='Ex: rm123456@fiap.com.br'
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
                        placeholder='Mínimo de 6 caracteres'
                        value={senha}
                        onChangeText={setSenha}
                        onBlur={() => validateField('senha', senha)}
                        secureTextEntry
                        returnKeyType="next"
                        onSubmitEditing={() => confirmarSenhaRef.current.focus()}
                        blurOnSubmit={false}
                        autoCapitalize='none'
                    />
                    {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}
                </View>

                {/* CAMPO CONFIRMAR SENHA */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirmar Senha</Text>
                    <TextInput 
                        ref={confirmarSenhaRef}
                        style={[styles.input, errors.confirmarSenha && styles.inputError]}
                        placeholder='Confirmar senha'
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        onBlur={() => validateField('confirmarSenha', confirmarSenha)}
                        secureTextEntry
                        returnKeyType="done"
                        onSubmitEditing={handleCadastro}
                        autoCapitalize='none'
                    />
                    {errors.confirmarSenha && <Text style={styles.errorText}>{errors.confirmarSenha}</Text>}
                </View>

                {/* BOTÃO CADASTRAR */}
                <TouchableOpacity style={styles.button} onPress={handleCadastro}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>

                {/* LOGIN */}
                <TouchableOpacity 
                    style={styles.linkContainer} 
                    onPress={() => router.back()} 
                    activeOpacity={0.7}
                >
                    <Text style={styles.linkText}>
                        Já possui uma conta? <Text style={styles.linkTextDestaque}>Entrar</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flexGrow: 1, justifyContent: 'center', backgroundColor: '#F3F4F6' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },

    // Inputs
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 14, color: '#4B5563', marginBottom: 5, fontWeight: '600' },
    input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
    inputError: { borderColor: '#EF4444' },
    errorText: { color: '#EF4444', fontSize: 12, marginTop: 4 },

    // Botão cadastrar
    button: { backgroundColor: '#EA1463', padding: 15, borderRadius: 8, marginTop: 10 },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },

    // Link login
    linkContainer: { marginTop: 20, padding: 10, alignItems: 'center' },
    linkText: { fontSize: 15, color: '#4B5563' },
    linkTextDestaque: { color: '#2563EB', fontWeight: 'bold' },
});