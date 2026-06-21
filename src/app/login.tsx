import { router } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Icons
import ErrorIcon from '@/assets/icons/error.svg';
import LockIcon from '@/assets/icons/lock.svg';
import MailIcon from '@/assets/icons/mail.svg';

// Shared auth components
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthInput } from '@/components/auth/AuthInput';
import { useAuth } from '@/components/AuthContext';
import Logo from '@/components/logo';
import { AuthColors } from '@/constants/auth-colors';

// ─── Component ───────────────────────────────────────────────────────────────

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const clearError = () => { if (error) setError(null); };

    async function handleLogin() {
        if (!email.trim() || !password) {
            setError('Invalid Username or Password');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            await login(email.trim(), password);
            router.replace('/(tabs)');
        } catch {
            setError('Invalid Username or Password');
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: AuthColors.background }}>
            <StatusBar barStyle="dark-content" backgroundColor={AuthColors.background} />
            <AuthHeader title="LOG-IN" onBack={() => router.back()} />

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={false}
                >
                    <View className="px-5 py-2 pb-10">
                        {/* ── Error banner ───────────────────────────────────── */}
                        <View
                            className="flex-row items-center rounded-xl px-4 py-3 mb-5"
                            style={{
                                backgroundColor: AuthColors.errorBg,
                                opacity: error ? 1 : 0,
                            }}
                            pointerEvents={error ? 'auto' : 'none'}
                        >
                            <ErrorIcon width={18} height={18} color={AuthColors.errorText} />
                            <Text
                                className="ml-2 text-sm flex-1"
                                style={{ color: AuthColors.errorText, fontFamily: 'StackSans-Text' }}
                            >
                                {error || ' '}
                            </Text>
                        </View>

                        {/* ── Card ───────────────────────────────────────────── */}
                        <AuthCard style={{ marginTop: 8 }}>
                            {/* Logo */}
                            <View className="items-center mb-3 overflow-visible">
                                <Logo height={80} className="mb-3" style={{ overflow: 'visible' }} />
                            </View>

                            {/* Email */}
                            <AuthInput
                                placeholder="Email"
                                value={email}
                                onChangeText={(t) => { setEmail(t); clearError(); }}
                                Icon={MailIcon}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                returnKeyType="next"
                            />

                            {/* Password */}
                            <AuthInput
                                placeholder="Password"
                                value={password}
                                onChangeText={(t) => { setPassword(t); clearError(); }}
                                Icon={LockIcon}
                                secureTextEntry
                                returnKeyType="done"
                                onSubmitEditing={handleLogin}
                            />

                            {/* Login button */}
                            <TouchableOpacity
                                onPress={handleLogin}
                                disabled={loading}
                                className="rounded-full items-center justify-center"
                                style={{
                                    backgroundColor: AuthColors.green,
                                    height: 52,
                                    opacity: loading ? 0.75 : 1,
                                }}
                                accessibilityRole="button"
                                accessibilityLabel="Log in"
                            >
                                <Text
                                    className="text-base"
                                    style={{ color: AuthColors.white, fontFamily: 'StackSans-Headline' }}
                                >
                                    {loading ? 'Logging in…' : 'Login'}
                                </Text>
                            </TouchableOpacity>

                            {/* Sign-up link */}
                            <View className="flex-row justify-center mt-5">
                                <Text
                                    className="text-sm"
                                    style={{ color: AuthColors.dark, fontFamily: 'StackSans-Text' }}
                                >
                                    Need an account?{' '}
                                </Text>
                                <TouchableOpacity onPress={() => router.push('/signup')}>
                                    <Text
                                        className="text-sm"
                                        style={{ color: AuthColors.green, fontFamily: 'StackSans-Headline' }}
                                    >
                                        Signup
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </AuthCard>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
