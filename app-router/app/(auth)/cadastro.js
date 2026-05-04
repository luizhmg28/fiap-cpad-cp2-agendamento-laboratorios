import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function Cadastro() {
    const { register } = useContext(AuthContext);
    const router = useRouter();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const [errors, setErrors] = useState({});

    function validate() {
        let newErrors = {};

        if (!nome) newErrors.nome = "Nome obrigatório";

        if (!email) newErrors.email = "E-mail obrigatório";
        else if (!email.includes("@")) newErrors.email = "E-mail inválido";

        if (!senha) newErrors.senha = "Senha obrigatória";
        else if (senha.length < 6) newErrors.senha = "Mínimo 6 caracteres";

        if (confirmarSenha !== senha) {
            newErrors.confirmarSenha = "Senhas não coincidem";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleCadastro = async () => {
        if (!validate()) return;

        const res = await register({ nome, email, senha });

        if (res?.error) {
            setErrors({ geral: res.error });
            return;
        }

        router.replace('/login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Cadastro</Text>

            {errors.geral && <Text style={styles.error}>{errors.geral}</Text>}

            <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
            {errors.nome && <Text style={styles.error}>{errors.nome}</Text>}

            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput style={styles.input} placeholder="Senha" value={senha} secureTextEntry onChangeText={setSenha} />
            {errors.senha && <Text style={styles.error}>{errors.senha}</Text>}

            <TextInput style={styles.input} placeholder="Confirmar Senha" value={confirmarSenha} secureTextEntry onChangeText={setConfirmarSenha} />
            {errors.confirmarSenha && <Text style={styles.error}>{errors.confirmarSenha}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleCadastro} disabled={!nome || !email || !senha || !confirmarSenha}>
                <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center', backgroundColor: '#F3F4F6' },
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

  buttonText: { color: '#fff', textAlign: 'center' },
});