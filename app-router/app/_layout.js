// app/_layout.js
import { Stack, useRouter, useSegments } from 'expo-router';
import { useContext, useEffect } from 'react';
import AuthProvider, { AuthContext } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import AppDataProvider from '../context/AppDataContext';

function RootLayoutNav() {
    const { user, carregando } = useContext(AuthContext);
    const segments = useSegments(); // Identifica em qual grupo o usuário está
    const router = useRouter();

    useEffect(() => {
        if (carregando) return;

        const inAuthGroup = segments[0] === '(auth)';

        // Verifica em qual grupo está e redireciona para o certo
        if (!user && !inAuthGroup) {
            router.replace('/login');
        } else if (user && inAuthGroup) {
            router.replace('/home');
        }
    }, [user, carregando, segments]);

    // Isso aqui teoricamente só aparece se estiver demorando para carregar
    if (carregando) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="(perfil)"
                options={{
                    headerShown: false,
                    presentation: 'card'
                }}
            />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <AppDataProvider>
                <RootLayoutNav />
            </AppDataProvider>
        </AuthProvider>
    );
}
