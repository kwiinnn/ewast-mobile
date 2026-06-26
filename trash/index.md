import CalendarIcon from '@/assets/icons/calendar.svg';
import LocationIcon from '@/assets/icons/location.svg';
import { useAuth } from '@/components/AuthContext';
import { AuthColors } from '@/constants/auth-colors';
import { t } from '@/constants/translations';
import { useRouter } from 'expo-router';
import { CalendarDays, Clock, Map as MapIcon, Search, Truck } from 'lucide-react-native';
import { ScrollView, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';

const ANNOUNCEMENTS = [
    {
        id: '1',
        title: 'Littering in Water Bodies',
        district: 'Talomo',
        date: '06/24/2026',
        body: 'Cleanup Drive on June 26, 2024. Located at MacArthur Highway, Kissea Village, Ulas, Talomo Proper, Talomo District, Davao City, Davao Region, 8023, Philippines',
    },
    {
        id: '2',
        title: 'Littering in Water Bodies',
        district: 'Talomo',
        date: '06/24/2026',
        body: 'Cleanup Drive on June 26, 2024. Located at MacArthur Highway, Kissea Village, Ulas, Talomo Proper, Talomo District, Davao City, Davao Region, 8023, Philippines',
    },
];

function AnnouncementCard({
    ann,
    isDesktop,
}: {
    ann: (typeof ANNOUNCEMENTS)[0];
    isDesktop: boolean;
}) {
    const { language } = useAuth();
    return (
        <View
            style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: isDesktop ? 20 : 14,
                marginBottom: isDesktop ? 12 : 12,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                elevation: 1,
            }}
        >
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#16A637', marginBottom: 8 }}>
                {ann.title}
            </Text>
            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <LocationIcon width={13} height={13} color="#8F9BB3" />
                    <Text style={{ fontSize: 11, color: '#8F9BB3', fontWeight: '600' }}>{ann.district}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <CalendarIcon width={13} height={13} color="#8F9BB3" />
                    <Text style={{ fontSize: 11, color: '#8F9BB3', fontWeight: '600' }}>{ann.date}</Text>
                </View>
            </View>
            <Text style={{ fontSize: 11, color: '#5a6a7a', lineHeight: 17, marginBottom: 12 }}>
                {ann.body}
            </Text>
            <TouchableOpacity
                style={{
                    backgroundColor: '#16A637',
                    borderRadius: 20,
                    paddingHorizontal: 18,
                    paddingVertical: 7,
                    alignSelf: 'flex-start',
                }}
                activeOpacity={0.8}
            >
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{t('report.read', language)}{' '}</Text>
            </TouchableOpacity>
        </View>
    );
}

const DESKTOP_BREAKPOINT = 768;

export default function HomeScreen() {
    const { isLoggedIn, language } = useAuth();
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
                        {t('home.guest.headline1', language)}{' '}
                        <Text className="text-[#16A637]">{t('home.guest.headline2', language)}</Text>
                    </Text>
                    <Text
                        className="font-extrabold text-center text-[#16A637]"
                        style={{ fontSize: isDesktop ? 26 : 24, marginBottom: isDesktop ? 14 : 12 }}
                    >
                        {t('home.guest.headline3', language)}
                    </Text>
                    <View className="items-center mt-5" style={{ marginBottom: isDesktop ? 24 : 20 }}>
                        <Text
                            className="text-center text-[#8F9BB3] leading-5 font-medium"
                            style={{ fontSize: isDesktop ? 14 : 13, paddingHorizontal: 8 }}
                        >
                            {t('home.guest.subtitle', language)}{' '}
                            <Text
                                style={{ color: AuthColors.green, fontSize: isDesktop ? 14 : 13 }}
                                onPress={() => router.push('/login')}
                            >
                                {t('home.guest.login', language)}
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
                            <Text className="text-white font-extrabold tracking-widest uppercase" style={{ fontSize: 11 }}>
                                {t('home.guest.schedules', language)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 bg-[#16A637] rounded-full items-center justify-center"
                            style={{ height: isDesktop ? 46 : 44 }}
                            onPress={() => navigateTo('/data')}
                        >
                            <Text className="text-white font-extrabold tracking-widest uppercase" style={{ fontSize: 11 }}>
                                {t('home.guest.data', language)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 bg-[#16A637] rounded-full items-center justify-center"
                            style={{ height: isDesktop ? 46 : 44 }}
                            onPress={() => navigateTo('/report')}
                        >
                            <Text className="text-white font-extrabold tracking-widest uppercase" style={{ fontSize: 11 }}>
                                {t('home.guest.report', language)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    // ── Logged-in view ───────────────────────────────────────────────────────────
    return (
        <>
            {isDesktop ? (
                // ── Desktop: scrollable column centred at 460 px ──────────────
                <ScrollView
                    className="flex-1 bg-[#F0F4F1]"
                    contentContainerStyle={{ alignItems: 'center', paddingVertical: 40, paddingBottom: 60 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Main tracking card */}
                    <View
                        className="bg-white rounded-[28px] shadow-sm"
                        style={{ width: 460, paddingHorizontal: 40, paddingVertical: 28, elevation: 2 }}
                    >
                        <Text className="text-[26px] font-extrabold text-center text-[#233329]">
                            {t('home.track.headline1', language)}
                        </Text>
                        <Text className="text-[26px] font-extrabold text-center text-[#233329] mb-3">
                            {t('home.track.headline2', language)}{' '}
                            <Text className="text-[#16A637]">{t('home.track.headline3', language)}</Text>
                        </Text>
                        <Text className="text-center text-[#8F9BB3] text-sm mb-5 px-4 leading-5 font-medium">
                            {t('home.track.subtitle', language)}
                        </Text>
                        <View className="flex-row items-center border-[1.5px] border-[#D1D5DB] rounded-full px-5 h-[46px] mb-5 bg-white">
                            <TextInput
                                className="flex-1 text-[#233329] font-medium text-sm"
                                placeholder={t('home.track.search', language)}
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
                            <Text className="text-white font-bold text-sm">{t('home.track.live', language)}</Text>
                        </TouchableOpacity>
                        <View className="flex-row justify-center gap-8">
                            <View className="items-center">
                                <TouchableOpacity
                                    className="bg-[#233329] w-[68px] h-[68px] rounded-[20px] items-center justify-center mb-2"
                                    onPress={() => navigateTo('/schedules')}
                                >
                                    <CalendarDays size={30} color="#FFFFFF" />
                                </TouchableOpacity>
                                <Text className="text-[#233329] font-medium text-sm">{t('home.track.schedules', language)}</Text>
                            </View>
                            <View className="items-center">
                                <TouchableOpacity
                                    className="bg-[#233329] w-[68px] h-[68px] rounded-[20px] items-center justify-center mb-2"
                                    onPress={() => navigateTo('/routes')}
                                >
                                    <MapIcon size={30} color="#FFFFFF" />
                                </TouchableOpacity>
                                <Text className="text-[#233329] font-medium text-sm">{t('home.track.heatmap', language)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* ── Announcements (desktop) ──────────────────────────── */}
                    <View style={{ width: 460, marginTop: 24 }}>
                        <View className="flex-row items-center justify-between mb-3">
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#233329' }}>
                                {t('report.announcements', language)}{' '}
                            </Text>
                            <TouchableOpacity>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: '#16A637', textDecorationLine: 'underline' }}>
                                    {t('report.view', language)}{' '}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {ANNOUNCEMENTS.map((ann) => (
                            <AnnouncementCard key={ann.id} ann={ann} isDesktop={true} />
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <ScrollView
                    className="flex-1 bg-[#F0F4F1]"
                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 140 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="bg-white rounded-[32px] px-6 pt-10 pb-10 shadow-sm mt-6" style={{ elevation: 2 }}>
                        <Text className="text-[28px] font-extrabold text-center text-[#233329] mb-1">
                            {t('home.track.headline1', language)}
                        </Text>
                        <Text className="text-[28px] font-extrabold text-center text-[#233329] mb-4">
                            {t('home.track.headline2', language)}{' '}
                            <Text className="text-[#16A637]">{t('home.track.headline3', language)}</Text>
                        </Text>
                        <Text className="text-center text-[#8F9BB3] text-sm mb-8 px-2 leading-5 font-medium">
                            {t('home.track.subtitle', language)}
                        </Text>
                        <View className="flex-row items-center border-[1.5px] border-[#233329] rounded-full px-5 h-[52px] mb-8 bg-[#F0F4F1]">
                            <TextInput
                                className="flex-1 text-[#233329] font-medium text-base"
                                placeholder={t('home.track.search', language)}
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
                            <Text className="text-white font-bold text-base">{t('home.track.live', language)}</Text>
                        </TouchableOpacity>
                        <View className="flex-row justify-center gap-10 mt-2">
                            <View className="items-center">
                                <TouchableOpacity className="bg-[#233329] w-[76px] h-[76px] rounded-[24px] items-center justify-center mb-3 shadow-sm">
                                    <CalendarDays size={34} color="#FFFFFF" />
                                </TouchableOpacity>
                                <Text className="text-[#233329] font-medium text-base">{t('home.track.schedules', language)}</Text>
                            </View>
                            <View className="items-center">
                                <TouchableOpacity className="bg-[#233329] w-[76px] h-[76px] rounded-[24px] items-center justify-center mb-3 shadow-sm">
                                    <MapIcon size={34} color="#FFFFFF" />
                                </TouchableOpacity>
                                <Text className="text-[#233329] font-medium text-base">{t('home.track.heatmap', language)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* ── Announcements ─────────────────────────────────────── */}
                    <View className="mt-6">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#233329' }}>
                                {t('report.announcements', language)}{' '}
                            </Text>
                            <TouchableOpacity>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: '#16A637', textDecorationLine: 'underline' }}>
                                    {t('report.view', language)}{' '}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {ANNOUNCEMENTS.map((ann) => (
                            <AnnouncementCard key={ann.id} ann={ann} isDesktop={false} />
                        ))}
                    </View>
                </ScrollView>
            )}
        </>
    );
}