import { Image } from 'react-native';

export function LogoTitle() {
    return (
        <Image
            source={require('../assets/logo.png')}
            style={{ width: 120, height: 40 }}
        />
    );
}
