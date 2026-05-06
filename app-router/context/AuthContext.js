import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        carregarUser();
    }, []);

    const carregarUser = async () => {
        try {
            const userGuardado = await AsyncStorage.getItem('userLogado');

            if (userGuardado) {
                setUser(JSON.parse(userGuardado));
            }
        } catch (e) {
            console.log('Erro ao carregar usuário:', e);
        } finally {
            setCarregando(false);
        }
    };

    const register = async ({ nome, email, senha }) => {
        try {
            const dados = await AsyncStorage.getItem('users');
            let usuarios = dados ? JSON.parse(dados) : [];

            const emailNormalizado = email.trim().toLowerCase();

            if (usuarios.some(u => u.email === emailNormalizado)) {
                return { error: 'E-mail já cadastrado' };
            }

            const novoUsuario = {
                nome: nome.trim(),
                email: emailNormalizado,
                senha
            };

            usuarios.push(novoUsuario);

            await AsyncStorage.setItem('users', JSON.stringify(usuarios));

            return { success: true };
        } catch (e) {
            console.log('Erro no register:', e);
            return { error: 'Erro ao cadastrar' };
        }
    };

    const login = async (email, senha) => {
        try {
            const dados = await AsyncStorage.getItem('users');
            const usuarios = dados ? JSON.parse(dados) : [];

            const emailNormalizado = email.trim().toLowerCase();

            const usuario = usuarios.find(
                u => u.email === emailNormalizado && u.senha === senha
            );

            if (!usuario) {
                return { error: 'E-mail ou senha inválidos' };
            }

            await AsyncStorage.setItem('userLogado', JSON.stringify(usuario));
            setUser(usuario);

            return { success: true };
        } catch (e) {
            console.log('Erro no login:', e);
            return { error: 'Erro no login' };
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userLogado');
            setUser(null);
        } catch (e) {
            console.log('Erro no logout:', e);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                register,
                carregando
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}