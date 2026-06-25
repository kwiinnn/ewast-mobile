import { useAuth } from '@/components/AuthContext';
import { AuthColors } from '@/constants/auth-colors';
import { useRouter } from 'expo-router';
import { CalendarDays, Clock, Map as MapIcon, Search, Truck } from 'lucide-react-native';
import { ScrollView, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';

const DESKTOP_BREAKPOINT = 768;

export default function HomeScreen() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isDesktop = width >= DESKTOP_BREAKPOINT;

    const navigateTo = (path: string) => router.push(path as any);

    // ── Guest view ──────────────────────────────────────────────────────────────
    if (!isLoggedIn) {
        return (
            <View className="flex-1 items-center justify-center bg-[#F0F4F1]">
                <View
                    className="bg-white rounded-[28px] shadow-sm"
                    style={{
                        width: isDesktop ? 460 : '100%',
                        marginHorizontal: isDesktop ? 0 : 24,
                        paddingHorizontal: isDesktop ? 40 : 24,
                        paddingVertical: isDesktop ? 40 : 32,
                        elevation: 2,
                    }}
                >
                    <Text
                        className="font-extrabold text-center text-[#233329]"
                        style={{ fontSize: isDesktop ? 26 : 24, marginBottom: 2 }}
                    >
                        Be Part of the{' '}
                        <Text className="text-[#16A637]">Local</Text>
                    </Text>
                    <Text
                        className="font-extrabold text-center text-[#16A637]"
                        style={{ fontSize: isDesktop ? 26 : 24, marginBottom: isDesktop ? 14 : 12 }}
                    >
                        Waste Collection
                    </Text>
                    <View className="items-center mt-5" style={{ marginBottom: isDesktop ? 24 : 20 }}>
                        <Text
                            className="text-center text-[#8F9BB3] leading-5 font-medium"
                            style={{ fontSize: isDesktop ? 14 : 13, paddingHorizontal: 8 }}
                        >
                            Get information about garbage collection and report scattered garbage around your area.{' '}
                            <Text
                                style={{ color: AuthColors.green, fontSize: isDesktop ? 14 : 13 }}
                                onPress={() => router.push('/login')}
                            >
                                Login now!
                            </Text>
                        </Text>
                    </View>
                    {/* CTA Buttons */}
                    <View className="flex-row justify-between" style={{ gap: 10 }}>
                        <TouchableOpacity
                            className="flex-1 bg-[#16A637] rounded-full items-center justify-center"
                            style={{ height: isDesktop ? 46 : 44 }}
                            onPress={() => navigateTo('/schedules')}
                        >
                            <Text className="text-white font-extrabold tracking-widest" style={{ fontSize: 11 }}>
                                SCHEDULES
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 bg-[#16A637] rounded-full items-center justify-center"
                            style={{ height: isDesktop ? 46 : 44 }}
                            onPress={() => navigateTo('/data')}
                        >
                            <Text className="text-white font-extrabold tracking-widest" style={{ fontSize: 11 }}>
                                DATA
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 bg-[#16A637] rounded-full items-center justify-center"
                            style={{ height: isDesktop ? 46 : 44 }}
                            onPress={() => navigateTo('/report')}
                        >
                            <Text className="text-white font-extrabold tracking-widest" style={{ fontSize: 11 }}>
                                REPORT
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    // ── Logged-in view (unchanged) ───────────────────────────────────────────────
    return (
        <>
            {isDesktop ? (
                <View className="flex-1 items-center justify-center bg-[#F0F4F1]">
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
                <ScrollView
                    className="flex-1 bg-[#F0F4F1]"
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 140 }}
                    showsVerticalScrollIndicator={false}
                >
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
        </>
    );
}