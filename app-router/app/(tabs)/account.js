import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router"

export default function MinhaConta() {
  const { logout, user } = useContext(AuthContext);
  const router =  useRouter();

  const extrairRM = (email) => {
    if (!email) return "000000";
    const match = email.match(/rm(\d+)/i);
    return match ? match[1] : "Não identificado";
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* PERFIL */}
      <View style={styles.profileCard}>

        <View style={styles.avatarWrapper}>
          <Image
            source={ require('../../assets/user_photo.png') }
            style={styles.avatar}
          />
        </View>

        <Text style={styles.name}>{user?.nome}</Text>
        <Text style={styles.rm}>RM: {extrairRM(user?.email)}</Text>

      </View>

      {/* OPÇÕES */}
      <View style={styles.card}>

        <TouchableOpacity style={styles.option} onPress={() => router.push('/trocarSenha')}>
          <Ionicons name="lock-closed-outline" size={25} color="#6B7280" />
          <Text style={styles.optionText}>Alterar senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={logout}>
          <Ionicons name="log-out-outline" size={25} color="#EA1463" />
          <Text style={[styles.optionText, { color: '#EA1463' }]}>
            Sair
          </Text>
        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#F3F4F6',
    flexGrow: 1,
    justifyContent: 'center',
  },

  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 5,
  },

  avatarWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#EA1463', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },

  name: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#111',
  },

  rm: {
    fontSize: 18,
    // fontWeight: 600,
    color: '#EA1463',
    marginTop: 6,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginTop: 40,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
  },

  optionText: {
    fontSize: 15,
    color: '#111',
    fontWeight: '500',
  },
});
