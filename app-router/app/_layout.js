// app/_layout.js
import { Stack, useRouter, useSegments } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import AuthProvider, { AuthContext } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import AppDataProvider from '../context/AppDataContext';

function RootLayoutNav() {
    const { user, carregando } = useContext(AuthContext);
    const segments = useSegments(); // Identifica em qual grupo o usuário está
    const router = useRouter();
    const [isNavigationReady, setIsNavigationReady] = useState(false);

    // Garante que o Router está montado antes de tentar navegar
    useEffect(() => {
        setIsNavigationReady(true);
    }, []);

    useEffect(() => {
        if (carregando || !isNavigationReady) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            router.replace('/login');
        } else if (user && inAuthGroup) {
            router.replace('/home');
        }
    }, [user, carregando, segments, isNavigationReady]);

    if (carregando) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* O nome aqui deve corresponder exatamente ao nome das pastas entre parênteses!! */}
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
                name="(perfil)"
                options={{
                    presentation: 'modal'
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
