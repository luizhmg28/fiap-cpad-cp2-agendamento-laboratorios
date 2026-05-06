import { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';

export const AppDataContext = createContext();

export default function AppDataProvider({ children }) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user)
      loadAgendamentos();
    else
      setAgendamentos([]);
  }, [user]);

  const loadAgendamentos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const keys = await AsyncStorage.getAllKeys();

      // Chave para tornar cada agendamento único para cada usuário
      const prefixo = `@user:${user.email}`;

      const agendamentoKeys = keys.filter(key => key.startsWith(prefixo));

      const dados = await AsyncStorage.multiGet(agendamentoKeys);

      const lista = dados
        .map(([_, value]) => JSON.parse(value))
        .flat();

      setAgendamentos(lista);
    } catch (e) {
      console.log('Erro ao carregar:', e);
    } finally {
      setLoading(false);
    }
  };

  const criarAgendamento = async (novoAgendamento) => {
    if (!user) return;

    setLoading(true);

    const { data, lab, unidade, horario } = novoAgendamento;

    const chaveGlobal = `@global:ocupacao:${data}-${lab}-${unidade}`;
    const chavePrivada = `@user:${user.email}:${data}-${lab}-${unidade}`;

    try {
      // Verifica se foi ocupado por alguém (chave global)
      const dadosGlobais = await AsyncStorage.getItem(chaveGlobal);
      const ocupacaoGlobal = dadosGlobais ? JSON.parse(dadosGlobais) : [];

      if (ocupacaoGlobal.some(a => a.horario === horario))
        return { error: 'Horário já ocupado' };

      // Caso esteja livre, grava primeiro na chave global
      const reservaPrivada = { ...novoAgendamento, userEmail: user.email, id: Date.now().toLocaleString('en-CA') };
      
      ocupacaoGlobal.push(reservaPrivada);
      await AsyncStorage.setItem(chaveGlobal, JSON.stringify(ocupacaoGlobal));

      // Finalmente, grava-se na chave privada
      const dadosPrivados = await AsyncStorage.getItem(chavePrivada);
      const agendamentosPrivados = dadosPrivados ? JSON.parse(dadosPrivados) : [];

      agendamentosPrivados.push(reservaPrivada);
      await AsyncStorage.setItem(chavePrivada, JSON.stringify(agendamentosPrivados));

      // Atualiza UI
      await loadAgendamentos();

      return { success: true };
    } catch (e) {
      return { error: 'Erro ao salvar agendamento' };
    } finally {
      setLoading(false);
    }
  };

  const cancelarAgendamento = async (item) => {
    if (!user) return;
    setLoading(true);

    // Remoção deve acontecer em duas chaves simultaneamente
    const chaveGlobal = `@global:ocupacao:${item.data}-${item.lab}-${item.unidade}`
    const chavePrivada = `@user:${user.email}:${item.data}-${item.lab}-${item.unidade}`;

    try {
      const dadosGlobais = await AsyncStorage.getItem(chaveGlobal)
      const dadosPrivados = await AsyncStorage.getItem(chavePrivada);

      if (dadosGlobais) {
        const listaGlobal = JSON.parse(dadosGlobais);
        // Filtra por horário e dono só para garantir
        const novaListaGlobal = listaGlobal.filter(a => !(a.horario === item.horario && a.userEmail === user.email));

        if (novaListaGlobal.length > 0)
          await AsyncStorage.setItem(chaveGlobal, JSON.stringify(novaListaGlobal));
        else
          await AsyncStorage.removeItem(chaveGlobal);
      }

      if (dadosPrivados) {
        const listaPrivada = JSON.parse(dadosPrivados);
        const novaListaPrivada = listaPrivada.filter(a => a.id !== item.id);

        await AsyncStorage.setItem(chavePrivada, JSON.stringify(novaListaPrivada));
      }

      await loadAgendamentos();
    } catch (e) {
      console.log('Erro ao cancelar:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppDataContext.Provider
      value={{
        agendamentos,
        loading,
        criarAgendamento,
        cancelarAgendamento,
        loadAgendamentos
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}