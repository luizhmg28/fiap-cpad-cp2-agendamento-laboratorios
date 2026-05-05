import { 
    KeyboardAvoidingView, 
    ScrollView, 
    Platform, 
    StyleSheet, 
    Text, 
    View 
} from 'react-native';

export default function AuthWrapper({ children, title, errorGeral }) {
    return (
        <KeyboardAvoidingView 
            style={styles.flex} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView 
                contentContainerStyle={styles.container} 
                keyboardShouldPersistTaps="handled"
            >
                {title && <Text style={styles.header}>{title}</Text>}

                {/* Feedback de erro global para a tela */}
                {errorGeral && <Text style={styles.errorGeral}>{errorGeral}</Text>}

                {children}
                
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: { 
        padding: 25, 
        flexGrow: 1, 
        justifyContent: 'center', 
        backgroundColor: '#F3F4F6' 
    },
    header: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        marginBottom: 30, 
        textAlign: 'center', 
        color: '#1F2937' 
    },
    errorGeral: { 
        backgroundColor: '#FEE2E2', 
        color: '#B91C1C', 
        padding: 12, 
        borderRadius: 8, 
        marginBottom: 20, 
        textAlign: 'center' 
    },
});