import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppDataContext = createContext();

export default function AppDataProvider({ children }) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgendamentos();
  }, []);

  const loadAgendamentos = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();

      const agendamentoKeys = keys.filter(key =>
        /^\d{4}-\d{2}-\d{2}/.test(key)
      );

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
    const { data, lab, unidade, horario } = novoAgendamento;
    const chave = `${data}-${lab}-${unidade}`;

    try {
      const dados = await AsyncStorage.getItem(chave);
      let lista = dados ? JSON.parse(dados) : [];

      // evita duplicado
      if (lista.some(a => a.horario === horario)) {
        return { error: 'Horário já ocupado' };
      }

      lista.push(novoAgendamento);

      await AsyncStorage.setItem(chave, JSON.stringify(lista));

      await loadAgendamentos();

      return { success: true };
    } catch (e) {
      return { error: 'Erro ao salvar agendamento' };
    }
  };

  const cancelarAgendamento = async (item) => {
    const chave = `${item.data}-${item.lab}-${item.unidade}`;

    try {
      const dados = await AsyncStorage.getItem(chave);
      if (!dados) return;

      const lista = JSON.parse(dados);
      const novaLista = lista.filter(a => a.id !== item.id);

      if (novaLista.length > 0) {
        await AsyncStorage.setItem(chave, JSON.stringify(novaLista));
      } else {
        await AsyncStorage.removeItem(chave);
      }

      await loadAgendamentos();
    } catch (e) {
      console.log('Erro ao cancelar:', e);
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