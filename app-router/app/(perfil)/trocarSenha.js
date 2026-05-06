import { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function AlterarSenha() {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const handleSalvar = async () => {
        if (!user) return;

        setErro('');
        setSucesso('');

        if (!novaSenha || !confirmarSenha) {
            setErro("Preencha todos os campos");
            return;
        }

        if (novaSenha.length < 6) {
            setErro("A senha precisa ter no mínimo 6 caracteres");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setErro("As senhas não coincidem");
            return;
        }

        setSalvando(true);

        try {
            const dados = await AsyncStorage.getItem('users');
            const usuarios = dados ? JSON.parse(dados) : [];

            const index = usuarios.findIndex(u => u.email === user.email);

            if (index === -1) {
                setErro("Usuário não encontrado");
                setSalvando(false)
                return;
            }

            usuarios[index].senha = novaSenha;

            await AsyncStorage.setItem('users', JSON.stringify(usuarios));

            const usuarioAtualizado = { ...user[index] };
            await SecureStore.setItemAsync('user_session', JSON.stringify(usuarioAtualizado));

            setSucesso("Senha alterada com sucesso!");

            setTimeout(() => {
                setSucesso('');
                router.back();
            }, 1200);

        } catch {
            setErro("Erro ao atualizar senha");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Segurança</Text>
            <Text style={styles.subtitle}>Escolha uma senha forte para proteger sua conta.</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Nova Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite a nova senha"
                    secureTextEntry
                    value={novaSenha}
                    onChangeText={setNovaSenha}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar Nova Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Repita a senha"
                    secureTextEntry
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                />
            </View>

            {erro ? <Text style={styles.error}>{erro}</Text> : null}
            {sucesso ? <Text style={styles.success}>{sucesso}</Text> : null}

            <TouchableOpacity
                style={[styles.button, salvando && styles.buttonDisabled]}
                onPress={handleSalvar}
                disabled={salvando}
            >
                {salvando ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.buttonText}>Atualizar Senha</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#F9F9F9',
    },
    button: {
        backgroundColor: '#EA1463',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonDisabled: {
        backgroundColor: '#CCC',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },

    success: {
        color: 'green',
        marginBottom: 10,
    },
});
