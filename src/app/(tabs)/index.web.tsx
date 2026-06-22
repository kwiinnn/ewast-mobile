import { useAuth } from '@/components/AuthContext';
import Logo from '@/components/logo';
import { useRouter } from 'expo-router';
import { Bell, CalendarDays, Clock, Map as MapIcon, Menu, Search, Truck, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DESKTOP_BREAKPOINT = 768;

export default function HomeScreen() {
    const { isLoggedIn } = useAuth();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const [menuOpen, setMenuOpen] = useState(false);

    const isDesktop = width >= DESKTOP_BREAKPOINT;

    const navigateTo = (path: string) => {
        setMenuOpen(false);
        router.push(path as any);
    };

    return (
        <View className="flex-1 bg-[#F0F4F1]" style={{ paddingTop: insets.top }}>

            {/* ── Desktop Nav Bar ── */}
            {isDesktop && (
                <View
                    className="flex-row items-center justify-between bg-[#F0F4F1] px-10"
                    style={{ height: 64 }}
                >
                    <TouchableOpacity onPress={() => navigateTo('/')}>
                        <Logo height={38} />
                    </TouchableOpacity>

                    <View className="flex-row items-center" style={{ gap: 56 }}>
                        <TouchableOpacity onPress={() => navigateTo('/')}>
                            <Text className="text-sm font-extrabold tracking-widest text-[#16A637]">HOME</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigateTo('/report')}>
                            <Text className="text-sm font-bold tracking-widest text-[#233329]">REPORT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigateTo('/routes')}>
                            <Text className="text-sm font-bold tracking-widest text-[#233329]">ROUTES</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center" style={{ gap: 20 }}>
                        {isLoggedIn ? (
                            <>
                                <TouchableOpacity className="relative">
                                    <Bell size={22} color="#233329" />
                                    <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#F0F4F1]" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigateTo('/profile')}>
                                    <Text className="text-sm font-bold tracking-widest text-[#233329]">PROFILE</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                className="bg-[#16A637] rounded-full px-7 h-[38px] items-center justify-center"
                                onPress={() => navigateTo('/login')}
                            >
                                <Text className="text-white font-bold text-sm tracking-widest">LOGIN</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}

            {/* ── Mobile Hamburger Header ── */}
            {!isDesktop && (
                <View className="flex-row justify-between items-center px-6 py-4 mt-2">
                    <Logo height={50} />
                    <View className="flex-row items-center">
                        {isLoggedIn && (
                            <TouchableOpacity className="relative mr-5">
                                <Bell size={26} color="#233329" />
                                <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#F0F4F1]" />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={() => setMenuOpen(true)}>
                            <Menu size={28} color="#233329" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* ── Body ── */}
            {isDesktop ? (
                /* Desktop: card vertically centred, no scroll */
                <View className="flex-1 items-center justify-center">
                    <View
                        className="bg-white rounded-[28px] shadow-sm"
                        style={{ width: 460, paddingHorizontal: 40, paddingVertical: 28, elevation: 2 }}
                    >
                        <Text className="text-[26px] font-extrabold text-center text-[#233329]">
                            Track Your Local
                        </Text>
                        <Text className="text-[26px] font-extrabold text-center text-[#233329] mb-3">
                            Waste <Text className="text-[#16A637]">Collection</Text>
                        </Text>
                        <Text className="text-center text-[#8F9BB3] text-sm mb-5 px-4 leading-5 font-medium">
                            Stay updated with live garbage truck locations and collection schedules
                        </Text>
                        <View className="flex-row items-center border-[1.5px] border-[#D1D5DB] rounded-full px-5 h-[46px] mb-5 bg-white">
                            <TextInput
                                className="flex-1 text-[#233329] font-medium text-sm"
                                placeholder="Search Location"
                                placeholderTextColor="#8F9BB3"
                            />
                            <Search size={20} color="#233329" />
                        </View>
                        <View className="flex-row justify-between items-center mb-5 px-1">
                            <View className="flex-row items-center">
                                <Truck size={30} color="#16A637" />
                                <Text className="text-lg font-bold text-[#233329] ml-2">Mintal</Text>
                            </View>
                            <View className="bg-[#E8F5E9] px-3 py-1 rounded-full flex-row items-center">
                                <Clock size={11} color="#16A637" />
                                <Text className="text-[10px] font-extrabold text-[#16A637] ml-1 tracking-wider">7:00 AM – 12:00 PM</Text>
                            </View>
                        </View>
                        <TouchableOpacity className="bg-[#16A637] rounded-full h-[48px] flex-row items-center justify-center mb-6 mx-4">
                            <View className="w-2 h-2 bg-white rounded-full mr-2" />
                            <Text className="text-white font-bold text-sm">Track Live</Text>
                        </TouchableOpacity>
                        <View className="flex-row justify-center gap-8">
                            <View className="items-center">
                                <TouchableOpacity
                                    className="bg-[#233329] w-[68px] h-[68px] rounded-[20px] items-center justify-center mb-2"
                                    onPress={() => navigateTo('/schedules')}
                                >
                                    <CalendarDays size={30} color="#FFFFFF" />
                                </TouchableOpacity>
                                <Text className="text-[#233329] font-medium text-sm">Schedules</Text>
                            </View>
                            <View className="items-center">
                                <TouchableOpacity
                                    className="bg-[#233329] w-[68px] h-[68px] rounded-[20px] items-center justify-center mb-2"
                                    onPress={() => navigateTo('/routes')}
                                >
                                    <MapIcon size={30} color="#FFFFFF" />
                                </TouchableOpacity>
                                <Text className="text-[#233329] font-medium text-sm">Heatmap</Text>
                            </View>
                        </View>
                    </View>
                </View>
            ) : (
                /* Mobile: scrollable card */
                <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
                    <View className="bg-white rounded-[32px] px-6 pt-10 pb-10 shadow-sm mt-6" style={{ elevation: 2 }}>
                        <Text className="text-[28px] font-extrabold text-center text-[#233329] mb-1">
                            Track Your Local
                        </Text>
                        <Text className="text-[28px] font-extrabold text-center text-[#233329] mb-4">
                            Waste <Text className="text-[#16A637]">Collection</Text>
                        </Text>
                        <Text className="text-center text-[#8F9BB3] text-sm mb-8 px-2 leading-5 font-medium">
                            Stay updated with live garbage truck locations and collection schedules
                        </Text>
                        <View className="flex-row items-center border-[1.5px] border-[#233329] rounded-full px-5 h-[52px] mb-8 bg-[#F0F4F1]">
                            <TextInput
                                className="flex-1 text-[#233329] font-medium text-base"
                                placeholder="Search Location"
                                placeholderTextColor="#8F9BB3"
                            />
                            <Search size={22} color="#233329" />
                        </View>
                        <View className="flex-row justify-between items-center mb-8 px-2">
                            <View className="flex-row items-center">
                                <Truck size={36} color="#16A637" />
                                <Text className="text-xl font-bold text-[#233329] ml-3">Mintal</Text>
                            </View>
                            <View className="bg-[#E8F5E9] px-3 py-1.5 rounded-full flex-row items-center">
                                <Clock size={12} color="#16A637" />
                                <Text className="text-[10px] font-extrabold text-[#16A637] ml-1 tracking-wider">7:00 AM - 12:00 PM</Text>
                            </View>
                        </View>
                        <TouchableOpacity className="bg-[#16A637] rounded-full h-[52px] flex-row items-center justify-center mb-8 mx-6">
                            <View className="w-2.5 h-2.5 bg-white rounded-full mr-2.5" />
                            <Text className="text-white font-bold text-base">Track Live</Text>
                        </TouchableOpacity>
                        <View className="flex-row justify-center gap-10 mt-2">
                            <View className="items-center">
                                <TouchableOpacity className="bg-[#233329] w-[76px] h-[76px] rounded-[24px] items-center justify-center mb-3 shadow-sm">
                                    <CalendarDays size={34} color="#FFFFFF" />
                                </TouchableOpacity>
                                <Text className="text-[#233329] font-medium text-base">Schedules</Text>
                            </View>
                            <View className="items-center">
                                <TouchableOpacity className="bg-[#233329] w-[76px] h-[76px] rounded-[24px] items-center justify-center mb-3 shadow-sm">
                                    <MapIcon size={34} color="#FFFFFF" />
                                </TouchableOpacity>
                                <Text className="text-[#233329] font-medium text-base">Heatmap</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}

            {/* ── Hamburger Slide-in Panel (mobile only) ── */}
            {!isDesktop && menuOpen && (
                <View className="absolute inset-0" style={{ zIndex: 50 }}>
                    <Pressable
                        className="absolute inset-0 bg-black/30"
                        onPress={() => setMenuOpen(false)}
                    />
                    <View
                        className="absolute top-0 bottom-0 right-0 bg-white"
                        style={{ width: '58%', paddingTop: insets.top, elevation: 8 }}
                    >
                        <View className="flex-row justify-between items-center px-4 py-4 mt-2">
                            <TouchableOpacity onPress={() => setMenuOpen(false)}>
                                <X size={24} color="#233329" />
                            </TouchableOpacity>
                            <Logo height={50} />
                        </View>
                        <View className="items-center mt-10" style={{ gap: 44 }}>
                            <TouchableOpacity onPress={() => navigateTo('/')}>
                                <Text className="text-base font-extrabold text-[#16A637] tracking-wider">HOME</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigateTo('/report')}>
                                <Text className="text-base font-bold text-[#233329] tracking-wider">REPORT</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigateTo('/routes')}>
                                <Text className="text-base font-bold text-[#233329] tracking-wider">ROUTES</Text>
                            </TouchableOpacity>
                            {isLoggedIn ? (
                                <TouchableOpacity onPress={() => navigateTo('/profile')}>
                                    <Text className="text-base font-bold text-[#233329] tracking-wider">PROFILE</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    className="bg-[#16A637] rounded-full h-[48px] px-10 items-center justify-center mt-2"
                                    onPress={() => navigateTo('/login')}
                                >
                                    <Text className="text-white font-bold text-base tracking-wider">LOGIN</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}