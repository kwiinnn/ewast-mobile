import { router } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LanguageIcon from '@/assets/icons/language.svg';
import LocationIcon from '@/assets/icons/location.svg';
import { useAuth, User } from '@/components/AuthContext';
import Logo from '@/components/logo';
import { AuthColors } from '@/constants/auth-colors';
import { BARANGAY_OPTIONS } from '@/constants/barangays';

// ─── Guest View ───────────────────────────────────────────────────────────────

function GuestView() {
    return (
        <View className="flex-1 items-center justify-center px-8">
            <Logo height={70} className="mb-6" />

            <Text className="text-2xl text-center mb-2" style={{ color: AuthColors.dark }}>
                Welcome to EWAST
            </Text>
            <Text
                className="text-sm text-center mb-8 leading-5"
                style={{ color: AuthColors.placeholder }}
            >
                Sign in to access your profile, report waste, and track collection schedules
            </Text>

            <TouchableOpacity
                onPress={() => router.push('/login')}
                className="w-1/2 h-13 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: AuthColors.green }}
                activeOpacity={0.85}
            >
                <Text className="text-white text-base">
                    Sign In
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push('/signup')}
                className="w-1/2 h-13 rounded-full items-center justify-center border-[1.5px]"
                style={{ borderColor: AuthColors.green }}
                activeOpacity={0.75}
            >
                <Text
                    className="text-base"
                    style={{ color: AuthColors.green }}
                >
                    Create Account
                </Text>
            </TouchableOpacity>
        </View>
    );
}

// ─── Barangay Dropdown (web native <select>) ──────────────────────────────────

function BarangayDropdown() {
    const [selected, setSelected] = useState<string>('');

    return (
        <View className="flex-1">
            {/* @ts-ignore – select is valid HTML on web */}
            <select
                value={selected}
                onChange={(e: any) => setSelected(e.target.value)}
                style={{
                    width: '100%',
                    height: 44,
                    border: 'none',
                    background: 'transparent',
                    fontSize: 14,
                    color: selected ? AuthColors.dark : AuthColors.placeholder,
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    paddingRight: 28,
                }}
            >
                <option value="" disabled>Search Location</option>
                {BARANGAY_OPTIONS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                ))}
            </select>
            {/* Custom caret */}
            <View
                style={{
                    position: 'absolute',
                    right: 4,
                    top: '50%',
                    transform: [{ translateY: -6 }],
                    pointerEvents: 'none',
                }}
            >
                <Text className="text-xs" style={{ color: AuthColors.placeholder }}>▾</Text>
            </View>
        </View>
    );
}

// ─── Profile View ─────────────────────────────────────────────────────────────

function ProfileView({ user }: { user: User }) {
    const { logout } = useAuth();
    const [language, setLanguage] = useState<'english' | 'bisaya'>('english');

    return (
        <ScrollView
            className="flex-1"
            contentContainerClassName="py-8 px-4"
            showsVerticalScrollIndicator={false}
        >
            {/* Centered content column — mirrors desktop mockup max-width */}
            <View className="self-center w-full max-w-lg">

                {/* ── Profile Card ── */}
                <View
                    className="bg-white rounded-3xl px-8 py-8 mb-6"
                    style={{
                        shadowColor: '#000',
                        shadowOpacity: 0.07,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 2 },
                    }}
                >
                    {/* Avatar + name + email */}
                    <View className="items-center mb-4">
                        <View
                            className="w-20 h-20 rounded-full items-center justify-center mb-3"
                            style={{ backgroundColor: AuthColors.greenLight }}
                        >
                            {/* Head */}
                            <View
                                className="w-4 h-4 rounded-full border-[2.5px] mb-1"
                                style={{ borderColor: AuthColors.green }}
                            />
                            {/* Shoulders */}
                            <View
                                className="w-7 h-3.5 border-[2.5px] border-b-0 rounded-tl-[14px] rounded-tr-[14px]"
                                style={{ borderColor: AuthColors.green }}
                            />
                        </View>

                        <Text
                            className="font-extrabold text-xl text-center"
                            style={{ color: AuthColors.dark }}
                        >
                            {user.fullName}
                        </Text>
                        <Text
                            className="text-sm text-center mt-1"
                            style={{ color: AuthColors.placeholder }}
                        >
                            {user.email}
                        </Text>
                    </View>

                    {/* Divider */}
                    <View className="h-px bg-gray-100 my-4" />

                    {/* Stats */}
                    <View className="flex-row items-center justify-around">
                        <TouchableOpacity
                            className="flex-1 items-center"
                            activeOpacity={0.7}
                            onPress={() => router.push('/notifs?filter=all' as any)}
                        >
                            <Text
                                className="text-[22px]"
                                style={{ color: AuthColors.green }}
                            >
                                5
                            </Text>
                            <Text
                                className="text-xs mt-0.5"
                                style={{ color: AuthColors.dark }}
                            >
                                Reports
                            </Text>
                        </TouchableOpacity>

                        <View className="w-px h-9 bg-gray-200" />

                        <TouchableOpacity
                            className="flex-1 items-center"
                            activeOpacity={0.7}
                            onPress={() => router.push('/notifs?filter=resolved' as any)}
                        >
                            <Text
                                className="text-[22px]"
                                style={{ color: AuthColors.green }}
                            >
                                3
                            </Text>
                            <Text
                                className="text-xs mt-0.5"
                                style={{ color: AuthColors.dark }}
                            >
                                Resolved
                            </Text>
                        </TouchableOpacity>

                        <View className="w-px h-9 bg-gray-200" />

                        <TouchableOpacity
                            className="flex-1 items-center"
                            activeOpacity={0.7}
                            onPress={() => router.push('/notifs?filter=pending' as any)}
                        >
                            <Text
                                className="text-[22px]"
                                style={{ color: AuthColors.green }}
                            >
                                2
                            </Text>
                            <Text
                                className="text-xs mt-0.5"
                                style={{ color: AuthColors.dark }}
                            >
                                Pending
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── BARANGAY ── */}
                <Text
                    className="font-bold text-[16px] tracking-widest mb-2.5"
                    style={{ color: AuthColors.green }}
                >
                    BARANGAY
                </Text>

                <View
                    className="bg-white rounded-2xl px-4 py-3 flex-row items-center gap-3 mb-6"
                    style={{
                        shadowColor: '#000',
                        shadowOpacity: 0.04,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 1 },
                    }}
                >
                    <View
                        className="w-12 h-12 rounded-[14px] items-center justify-center shrink-0"
                        style={{ backgroundColor: AuthColors.dark }}
                    >
                        <LocationIcon width={22} height={22} color="#fff" />
                    </View>

                    <View
                        className="flex-1 h-11 border border-[#233329] rounded-full px-4 justify-center overflow-hidden bg-[#F0F4F1]"
                        style={{ position: 'relative' }}
                    >
                        <BarangayDropdown />
                    </View>
                </View>

                {/* ── LANGUAGE ── */}
                <Text
                    className="font-bold text-[16px] tracking-widest mb-2.5"
                    style={{ color: AuthColors.green }}
                >
                    LANGUAGE
                </Text>

                <View
                    className="bg-white rounded-2xl px-4 py-3 flex-row items-center gap-4 mb-8"
                    style={{
                        shadowColor: '#000',
                        shadowOpacity: 0.04,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 1 },
                    }}
                >
                    <View
                        className="w-12 h-12 rounded-[14px] items-center justify-center shrink-0"
                        style={{ backgroundColor: AuthColors.dark }}
                    >
                        <LanguageIcon width={22} height={22} color="#fff" />
                    </View>

                    <View className="flex-1 flex-row items-center justify-center gap-8">
                        {/* English */}
                        <TouchableOpacity
                            onPress={() => setLanguage('english')}
                            className="flex-row items-center gap-2"
                            activeOpacity={0.7}
                        >
                            <View
                                className="w-[22px] h-[22px] rounded-full border-2 items-center justify-center"
                                style={{
                                    borderColor: language === 'english' ? AuthColors.green : '#C0C0C0',
                                }}
                            >
                                {language === 'english' && (
                                    <View
                                        className="w-[11px] h-[11px] rounded-full"
                                        style={{ backgroundColor: AuthColors.green }}
                                    />
                                )}
                            </View>
                            <Text
                                className="text-[15px]"
                                style={{
                                    color: language === 'english' ? AuthColors.green : AuthColors.dark,
                                }}
                            >
                                English
                            </Text>
                        </TouchableOpacity>

                        {/* Bisaya */}
                        <TouchableOpacity
                            onPress={() => setLanguage('bisaya')}
                            className="flex-row items-center gap-2"
                            activeOpacity={0.7}
                        >
                            <View
                                className="w-[22px] h-[22px] rounded-full border-2 items-center justify-center"
                                style={{
                                    borderColor: language === 'bisaya' ? AuthColors.green : '#C0C0C0',
                                }}
                            >
                                {language === 'bisaya' && (
                                    <View
                                        className="w-[11px] h-[11px] rounded-full"
                                        style={{ backgroundColor: AuthColors.green }}
                                    />
                                )}
                            </View>
                            <Text
                                className="text-[15px]"
                                style={{
                                    color: language === 'bisaya' ? AuthColors.green : AuthColors.dark,
                                }}
                            >
                                Bisaya
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Log Out ── */}
                <TouchableOpacity
                    onPress={logout}
                    className="w-1/2 self-center flex-row items-center justify-center gap-2 border-[1.5px] rounded-full h-13"
                    style={{ borderColor: AuthColors.errorText, backgroundColor: '#FFF5F5' }}
                    activeOpacity={0.75}
                >
                    <LogOut size={20} color={AuthColors.errorText} />
                    <Text
                        className="text-base"
                        style={{ color: AuthColors.errorText }}
                    >
                        Log Out
                    </Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}

// ─── Root Screen ──────────────────────────────────────────────────────────────

export default function ProfileScreen() {
    const { isLoggedIn, user } = useAuth();
    const insets = useSafeAreaInsets();

    return (
        <View
            className="flex-1"
            style={{ backgroundColor: AuthColors.background, paddingTop: insets.top }}
        >
            {isLoggedIn && user ? (
                <>
                    <ProfileView user={user} />
                </>
            ) : (
                <GuestView />
            )}
        </View>
    );
}