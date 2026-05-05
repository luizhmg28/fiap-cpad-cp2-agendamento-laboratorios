import { Stack } from "expo-router";
import { LogoTitle } from '../../components/LogoTitle';

export default function Layout() {
  return (
    <Stack screenOptions={{ 
      headerTitle: () => <LogoTitle />,
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: '#F3F4F6' }, 
    }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="cadastro" />
    </Stack>
  );
}
