import { router } from 'expo-router';
import { LogOut, Mail, User as UserIcon } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth, User } from '@/components/AuthContext';
import Logo from '@/components/logo';
import { AuthColors } from '@/constants/auth-colors';

// ─── Guest View (not logged in) ─────────────────────────────────────────────

function GuestView() {
    return (
        <View className="flex-1 items-center justify-center px-8">
            <Logo height={70} className="mb-6" />

            <Text
                style={{
                    fontSize: 24,
                    color: AuthColors.dark,
                    textAlign: 'center',
                    marginBottom: 8,
                }}
            >
                Welcome to EWAST
            </Text>
            <Text
                style={{
                    fontSize: 14,
                    color: AuthColors.placeholder,
                    textAlign: 'center',
                    marginBottom: 32,
                    lineHeight: 20,
                }}
            >
                Sign in to access your profile, report waste, and track collection schedules
            </Text>

            {/* Sign In button */}
            <TouchableOpacity
                onPress={() => router.push('/login')}
                style={{
                    backgroundColor: AuthColors.green,
                    borderRadius: 50,
                    height: 52,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                }}
                activeOpacity={0.85}
            >
                <Text style={{ fontFamily: 'StackSans-Headline', fontSize: 16, color: '#fff' }}>
                    Sign In
                </Text>
            </TouchableOpacity>

            {/* Create Account button */}
            <TouchableOpacity
                onPress={() => router.push('/signup')}
                style={{
                    borderWidth: 1.5,
                    borderColor: AuthColors.green,
                    borderRadius: 50,
                    height: 52,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                activeOpacity={0.75}
            >
                <Text style={{ fontFamily: 'StackSans-Headline', fontSize: 16, color: AuthColors.green }}>
                    Create Account
                </Text>
            </TouchableOpacity>
        </View>
    );
}

// ─── Profile View (logged in) ───────────────────────────────────────────────

function ProfileView({ user }: { user: User }) {
    const { logout } = useAuth();

    return (
        <View className="flex-1 px-6">
            {/* Profile card */}
            <View
                className="bg-white rounded-[32px] px-6 py-8 shadow-sm mt-6"
                style={{ elevation: 2 }}
            >
                {/* Avatar circle */}
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <View
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: AuthColors.greenLight,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <UserIcon size={36} color={AuthColors.green} />
                    </View>
                </View>

                {/* Info rows */}
                <View style={{ gap: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <UserIcon size={20} color={AuthColors.placeholder} />
                        <View>
                            <Text style={{ fontFamily: 'StackSans-Text', fontSize: 12, color: AuthColors.green }}>
                                Full Name
                            </Text>
                            <Text style={{ fontFamily: 'StackSans-Headline', fontSize: 16, color: AuthColors.dark }}>
                                {user.fullName}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Mail size={20} color={AuthColors.placeholder} />
                        <View>
                            <Text style={{ fontFamily: 'StackSans-Text', fontSize: 12, color: AuthColors.green }}>
                                Email
                            </Text>
                            <Text style={{ fontFamily: 'StackSans-Headline', fontSize: 16, color: AuthColors.dark }}>
                                {user.email}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Logout button */}
            <TouchableOpacity
                onPress={logout}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    marginTop: 24,
                    borderWidth: 1.5,
                    borderColor: AuthColors.errorText,
                    borderRadius: 50,
                    height: 52,
                }}
                activeOpacity={0.75}
            >
                <LogOut size={20} color={AuthColors.errorText} />
                <Text style={{ fontFamily: 'StackSans-Headline', fontSize: 16, color: AuthColors.errorText }}>
                    Log Out
                </Text>
            </TouchableOpacity>
        </View>
    );
}

// ─── Root Screen ─────────────────────────────────────────────────────────────

export default function ProfileScreen() {
    const { isLoggedIn, user } = useAuth();
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1" style={{ backgroundColor: AuthColors.background, paddingTop: insets.top }}>
            {isLoggedIn && user ? (
                <>
                    <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 }}>
                        <Text style={{ fontFamily: 'StackSans-Headline', fontSize: 24, color: AuthColors.dark }}>
                            Profile
                        </Text>
                    </View>
                    <ProfileView user={user} />
                </>
            ) : (
                <GuestView />
            )}
        </View>
    );
}
