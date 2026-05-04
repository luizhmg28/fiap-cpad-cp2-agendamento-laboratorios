import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'expo-router';



export default function Login() {
    const router = useRouter();

    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    function validate() {
        let newErrors = {};

        if (!email) {
            newErrors.email = "O e-mail é obrigatório";
        } else if (!email.includes("@")) {
            newErrors.email = "E-mail inválido";
        }

        if (!senha) {
            newErrors.senha = "A senha é obrigatória";
        } else if (senha.length < 6) {
            newErrors.senha = "Mínimo de 6 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleLogin = async () => {
        if (!validate()) return;

        setLoading(true);

        const res = await login(email, senha);

        if (res?.error) {
            setErrors({ geral: res.error });
        }

        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Login</Text>

            {/* ERRO GERAL */}
            {errors.geral && <Text style={styles.error}>{errors.geral}</Text>}

            <TextInput
                style={styles.input}
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
                style={styles.input}
                placeholder='Senha'
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
            />
            {errors.senha && <Text style={styles.error}>{errors.senha}</Text>}

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

            <TouchableOpacity onPress={() => router.push('/cadastro')}>
                <Text style={{ textAlign: 'center', marginTop: 10 }}>
                    Não tem uma conta? Cadastre-se
                </Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#F3F4F6', flex: 1, justifyContent: 'center' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },

    input: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },

    error: {
        color: 'red',
        marginBottom: 10,
        fontSize: 12,
    },

    button: {
        backgroundColor: '#EA1463',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
    },

    buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});