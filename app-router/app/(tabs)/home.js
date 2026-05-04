import { View, StyleSheet, Text, SectionList, Alert, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { AppDataContext } from '../../context/AppDataContext';
import { Ionicons } from '@expo/vector-icons';

// Caso não hajam agendamentos, eu fiz esse elemento estilo React Native só pra não ficar feio
const EmptyListPlaceholder = () => (
  <View style={styles.card}>
    <Text style={styles.pastText}>Nenhum agendamento feito.</Text>
  </View>
)

export default function Home() {
  const { agendamentos, cancelarAgendamento } = useContext(AppDataContext);

  const handleCancelar = (item) => {
    cancelarAgendamento(item);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>É bom te ver de novo!</Text>
      <Text style={styles.label}>Agendamentos</Text>

      <SectionList
        sections={groupByDate(agendamentos)}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyListPlaceholder />}
        stickySectionHeadersEnabled={false} // Mantém o header rolando junto

        renderSectionHeader={({ section }) => (
          <View style={[styles.cardWrapper, { paddingBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}>
            <Text style={[styles.headerText, section.isHoje && styles.hojeText]}>
              {section.title}
            </Text>
          </View>
        )}

        renderItem={({ item }) => {
          const past = isPast(item.data, item.horario);
          return (
            <View style={[styles.cardWrapper, { paddingVertical: 5, borderRadius: 0 }]}>
              <TouchableOpacity
                // Só permite cancelar se não for um horário passado
                onPress={() => !past && handleCancelar(item)}
                activeOpacity={past ? 1 : 0.7}
                style={[styles.itemRow, past && styles.pastRow]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.unidadeText, past && styles.pastText]}>{item.unidade}</Text>
                  <Text style={[styles.labText, past && styles.pastText]}>{item.lab}</Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.horaText, past && styles.pastText]}>{item.horario}</Text>
                  {!past && (
                    <Ionicons name="close-circle-outline" size={16} color="#9CA3AF" style={{ marginTop: 4 }} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          );
        }}

        renderSectionFooter={() => (
          <View style={[styles.cardWrapper, {
            paddingTop: 5,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            marginBottom: 20
          }]} />
        )}

        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const groupByDate = (agendamentos) => {
  const grouped = {};

  agendamentos.forEach((item) => {
    if (!grouped[item.data]) {
      grouped[item.data] = [];
    }
    grouped[item.data].push(item);
  });

  return Object.keys(grouped)
    .sort()
    .map((data) => {
      const formatado = formatDate(data);

      return {
        id: data,
        title: formatado,
        isHoje: formatado === 'Hoje',
        data: grouped[data].sort((a, b) => a.horario.localeCompare(b.horario)),
      };
    });
};

const formatDate = (dataString) => {
  const hoje = new Date().toLocaleDateString('en-CA'); // Eles usam YYYY-MM-DD. Mais sobre no arquivo ./agendar.js

  const amanhaObj = new Date();
  amanhaObj.setDate(amanhaObj.getDate() + 1);
  const amanhaStr = amanhaObj.toLocaleDateString('en-CA');

  if (dataString === hoje) return 'Hoje';
  if (dataString === amanhaStr) return 'Amanhã';

  const [ano, mes, dia] = dataString.split('-');
  return `${dia}/${mes}/${ano}`;
};

const isPast = (data, horario) => {
  const agora = new Date();
  const hojeStr = agora.toLocaleDateString('en-CA');

  if (data < hojeStr) return true;
  if (data > hojeStr) return false;

  const [hora, minuto] = horario.split(':').map(Number);
  const minutosAgora = (agora.getHours() * 60) + agora.getMinutes();
  const minutosFimAgendamento = (hora * 60) + minuto + 60;

  return minutosFimAgendamento <= minutosAgora;
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F3F4F6' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  label: { marginTop: 12, marginBottom: 6, fontSize: 13, fontWeight: '600', color: '#6B7280' },

  cardWrapper: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    paddingHorizontal: 15,
    borderRadius: 16, // Arredondamento padrão
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  headerText: { fontSize: 18, fontWeight: 'bold', paddingTop: 15, paddingBottom: 10 },
  hojeText: { color: '#EA1463' },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    marginVertical: 4,
  },
  pastRow: { backgroundColor: '#F3F4F6', opacity: 0.7 },

  unidadeText: { fontWeight: 'bold', color: '#1F2937' },
  labText: { fontSize: 12, color: '#6B7280' },
  horaText: { fontWeight: '600', color: '#EA1463' },
  pastText: { color: '#9CA3AF' },
});
