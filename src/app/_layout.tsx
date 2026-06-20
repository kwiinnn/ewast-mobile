import "../global.css";
import { Stack } from 'expo-router';
import { AuthProvider } from '@/components/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput } from 'react-native';

// Set global font
if (!(Text as any).defaultProps) (Text as any).defaultProps = {};
(Text as any).defaultProps.style = { fontFamily: 'StackSans-Headline' };

if (!(TextInput as any).defaultProps) (TextInput as any).defaultProps = {};
(TextInput as any).defaultProps.style = { fontFamily: 'StackSans-Headline' };

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
