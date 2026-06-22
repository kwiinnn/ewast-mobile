import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Icons
import ErrorIcon from '@/assets/icons/error.svg';
import LockIcon from '@/assets/icons/lock.svg';
import MailIcon from '@/assets/icons/mail.svg';

// Brand assets for the showcase panel
import Truck from '@/assets/icons/truck2.svg';
import Showcase from '@/assets/showcase.svg';
import Logo from '@/components/logo';

// Shared auth components
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { useAuth } from '@/components/AuthContext';
import { AuthColors } from '@/constants/auth-colors';

// ─── Inject CSS grid layout (web only) ───────────────────────────────────────
// React Native Web doesn't reliably support gap / CSS grid via StyleSheet,
// so we inject a real <style> tag once on mount.

function useWebStyles() {
    useEffect(() => {
        const id = 'ewast-login-web-styles';
        if (document.getElementById(id)) return;
        const el = document.createElement('style');
        el.id = id;
        el.textContent = `
            .ewast-login-root {
                display: flex;
                flex: 1;
                height: 100vh;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                padding: 40px 48px;
                gap: 48px;
                box-sizing: border-box;
                overflow: hidden;
            }
            .ewast-login-left {
                flex: 0 0 420px;
                min-width: 0;
            }
            .ewast-login-right {
                flex: 1 1 0;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 0;
            }

            /* ── Mobile: hide the device showcase entirely, center the card ── */
            @media (max-width: 768px) {
                .ewast-login-root {
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 24px 20px;
                    gap: 0;
                }
                .ewast-login-left {
                    flex: 0 0 auto;
                    width: 100%;
                    max-width: 420px;
                }
                .ewast-login-right {
                    display: none;
                }
            }
        `;
        document.head.appendChild(el);
        return () => { el.remove(); };
    }, []);
}


// ─── Device mockup ───────────────────────────────────────────────────────────

function DeviceMockup() {
    return (
        <View style={{ alignItems: 'center' }}>
            {/* Wrapper that establishes a local stacking context for the phone overlap */}
            <View style={{ position: 'relative', width: 520, height: 346 }}>

                {/* ── Monitor bezel ── */}
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 460,
                        height: 310,
                        backgroundColor: '#1a1a1a',
                        borderRadius: 16,
                        padding: 10,
                        shadowColor: '#000',
                        shadowOpacity: 0.3,
                        shadowRadius: 24,
                        shadowOffset: { width: 0, height: 8 },
                    }}
                >
                    {/* Screen */}
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#ffffff',
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 16,
                        }}
                    >
                        <Logo height={70}/>
                        <Truck width={101} height={75} className="ml-8"/>
                    </View>
                </View>

                {/* ── Smartphone (overlaps bottom-right of monitor) ── */}
                <View
                    style={{
                        position: 'absolute',
                        top: 40,
                        right: 0,
                        width: 155,
                        height: 300,
                        backgroundColor: '#111',
                        borderRadius: 30,
                        padding: 7,
                        shadowColor: '#000',
                        shadowOpacity: 0.45,
                        shadowRadius: 20,
                        shadowOffset: { width: 0, height: 6 },
                        borderWidth: 1,
                        borderColor: '#2a2a2a',
                    }}
                >
                    {/* Dynamic island pill */}
                    <View
                        style={{
                            alignSelf: 'center',
                            width: 36,
                            height: 10,
                            backgroundColor: '#000',
                            borderRadius: 5,
                            marginBottom: 4,
                        }}
                    />

                    {/* Phone screen */}
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            borderRadius: 22,
                            overflow: 'hidden',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Showcase />
                    </View>

                    {/* Home bar */}
                    <View
                        style={{
                            alignSelf: 'center',
                            marginTop: 6,
                            width: 44,
                            height: 4,
                            backgroundColor: '#444',
                            borderRadius: 2,
                        }}
                    />
                </View>

                {/* ── Monitor stand ──────────────────────────────────────────────
                    FIX: anchored absolutely with the SAME left/width as the
                    monitor bezel above, instead of being a separate sibling
                    centered within the outer 520px-wide container. Previously
                    the stand centered itself relative to the full 520px box
                    (which exists to make room for the overlapping phone), so
                    it sat ~30px to the right of the monitor's actual center.
                    Anchoring it to left:0 / width:460 — identical to the
                    monitor — guarantees it's always centered under the
                    monitor itself, regardless of how wide the outer box is. */}
                <View
                    style={{
                        position: 'absolute',
                        top: 310, // sits right at the bottom edge of the bezel
                        left: 0,
                        width: 460,
                        alignItems: 'center',
                    }}
                >
                    <View style={{ width: 38, height: 26, backgroundColor: '#2a2a2a' }} />
                    <View style={{ width: 130, height: 10, backgroundColor: '#2a2a2a', borderRadius: 5 }} />
                </View>
            </View>
        </View>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function LoginScreenWeb() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useWebStyles();

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
            router.replace('/');
        } catch {
            setError('Invalid Username or Password');
        } finally {
            setLoading(false);
        }
    }

    return (
            <View className="ewast-login-root" style={{ backgroundColor: AuthColors.background }}>

                {/* ── LEFT: error + form ── */}
                {/* @ts-ignore — className is web-only */}
                <View className="ewast-login-left">

                    {/* Error banner — always rendered, toggled via opacity */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            marginBottom: 20,
                            backgroundColor: AuthColors.errorBg,
                            opacity: error ? 1 : 0,
                        }}
                        // @ts-ignore
                        pointerEvents={error ? 'auto' : 'none'}
                    >
                        <ErrorIcon width={18} height={18} color={AuthColors.errorText} />
                        <Text
                            style={{
                                marginLeft: 8,
                                fontSize: 14,
                                flex: 1,
                                color: AuthColors.errorText,
                                fontFamily: 'StackSans-Text',
                            }}
                        >
                            {error || ' '}
                        </Text>
                    </View>

                    {/* Login card */}
                    <AuthCard>
                        <Text
                            style={{
                                fontSize: 35,
                                fontWeight: '800',
                                textAlign: 'center',
                                color: '#233329',
                                marginBottom: 40,
                                fontFamily: 'StackSans-Headline',
                            }}
                        >
                            Login
                        </Text>

                        <AuthInput
                            placeholder="Email"
                            value={email}
                            onChangeText={(t) => { setEmail(t); clearError(); }}
                            Icon={MailIcon}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            returnKeyType="next"
                        />

                        <AuthInput
                            placeholder="Password"
                            value={password}
                            onChangeText={(t) => { setPassword(t); clearError(); }}
                            Icon={LockIcon}
                            secureTextEntry
                            returnKeyType="done"
                            onSubmitEditing={handleLogin}
                        />

                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={loading}
                            style={{
                                backgroundColor: AuthColors.green,
                                height: 52,
                                borderRadius: 999,
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: loading ? 0.75 : 1,
                            }}
                            accessibilityRole="button"
                            accessibilityLabel="Log in"
                        >
                            <Text style={{ fontSize: 16, color: AuthColors.white, fontFamily: 'StackSans-Headline' }}>
                                {loading ? 'Logging in…' : 'Login'}
                            </Text>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                            <Text style={{ fontSize: 14, color: AuthColors.dark, fontFamily: 'StackSans-Text' }}>
                                Need an account?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/signup')}>
                                <Text style={{ fontSize: 14, color: AuthColors.green, fontFamily: 'StackSans-Headline' }}>
                                    Signup
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </AuthCard>
                </View>

                {/* ── RIGHT: device showcase ── */}
                {/* @ts-ignore — className is web-only */}
                <View className="ewast-login-right">
                    <DeviceMockup />
                </View>

            </View>
    );
}