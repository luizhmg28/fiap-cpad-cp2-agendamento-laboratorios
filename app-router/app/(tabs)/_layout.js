import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LogoTitle } from '../../components/LogoTitle';

export default function Layout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#EA1463' }}>
      <Tabs.Screen
        name="home"
        options={{
          headerTitleAlign: 'center',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          headerTitle: () => <LogoTitle />,
        }}
      />
      <Tabs.Screen
        name="agendar"
        options={{
          headerTitleAlign: 'center',
          tabBarLabel: 'Agendar',
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />,
          headerTitle: () => <LogoTitle />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          headerTitleAlign: 'center',
          tabBarLabel: 'Minha conta',
          tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={24} color={color} />,
          headerTitle: () => <LogoTitle />,
        }}
      />
    </Tabs>
  );
}
