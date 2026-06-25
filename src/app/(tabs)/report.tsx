import CalendarIcon from '@/assets/icons/calendar.svg';
import LocationIcon from '@/assets/icons/location.svg';
import { useAuth } from '@/components/AuthContext';
import { BackButton } from '@/components/backbutton';
import { t } from '@/constants/translations';
import { Camera, GeoJSONSource, Layer, Map as MapLibreMap } from '@maplibre/maplibre-react-native';
import { useRouter } from 'expo-router';
import { ChevronDown, Plus, UserLock } from 'lucide-react-native';
import { useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ISSUE_TYPES = [
    'Drainage blockage',
    'E-waste',
    'Hazardous waste',
    'Organic waste',
    'Plastic waste',
    'Bulky waste',
    'Mixed waste',
    'Overflowing bin/s',
    'Illegal dumping',
];

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

type Screen = 'home' | 'report';

export default function ReportScreen() {
    const { isLoggedIn, language } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [screen, setScreen] = useState<Screen>('home');

    if (!isLoggedIn) {
        return <LoggedOutGate insets={insets} router={router} />;
    }

    if (screen === 'report') {
        return <ReportForm insets={insets} onBack={() => setScreen('home')} />;
    }

    // ← THIS WAS MISSING
    return <HomeScreen insets={insets} onReportPress={() => setScreen('report')} router={router} />;
}

// ── Logged-out gate ────────────────────────────────────────────────────────────
function LoggedOutGate({ insets, router }: { insets: any; router: any }) {
    return (
        <View
            className="flex-1 bg-[#F0F4F1] items-center justify-center px-8"
            style={{ paddingBottom: insets.bottom }}
        >
            <View className="bg-white rounded-[24px] p-8 items-center shadow-sm w-full" style={{ elevation: 2 }}>
                <View className="bg-[#E8F5E9] w-16 h-16 rounded-full items-center justify-center mb-5">
                    <UserLock size={30} color="#16A637" />
                </View>
                <Text className="text-[20px] font-extrabold text-[#233329] text-center mb-2">Login Required</Text>
                <Text className="text-sm text-[#8F9BB3] text-center leading-5 mb-7">
                    You need to be logged in to submit a garbage report.
                </Text>
                <TouchableOpacity
                    className="bg-[#16A637] rounded-full h-[50px] w-full items-center justify-center mb-3"
                    onPress={() => router.push('/login' as any)}
                >
                    <Text className="text-white font-bold text-base">Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/signup' as any)}>
                    <Text className="text-[#8F9BB3] text-sm">
                        Don't have an account?{' '}
                        <Text className="text-[#16A637] font-bold">Sign up</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ── Home screen ────────────────────────────────────────────────────────────────
function HomeScreen({
    insets,
    onReportPress,
    router,
}: {
    insets: any;
    onReportPress: () => void;
    router: any;
}) {
    const { language } = useAuth();
    return (
        <View className="flex-1 bg-[#F0F4F1]" style={{ paddingTop: insets.top }}>
            {/* Report an Issue banner */}
            <View className="px-5 pb-3">
                <TouchableOpacity
                    className="bg-[#E8F5E9] rounded-[16px] flex-row items-center p-4"
                    style={{ gap: 14 }}
                    onPress={onReportPress}
                    activeOpacity={0.75}
                >
                    <View className="bg-[#16A637] w-[52px] h-[52px] rounded-[12px] items-center justify-center">
                        <Plus size={28} color="#fff" strokeWidth={2.5}/>
                    </View>
                    <Text className="text-[17px] font-extrabold text-[#233329]">{t('report.headline1', language)}{' '}</Text>

                </TouchableOpacity>
            </View>

            {/* Announcements */}
            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
            >
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-[16px] font-extrabold text-[#233329]">{t('report.announcements', language)}{' '}</Text>
                    <TouchableOpacity>
                        <Text className="text-[13px] font-semibold text-[#16A637] underline">{t('report.view', language)}{' '}</Text>
                    </TouchableOpacity>
                </View>
                {ANNOUNCEMENTS.map((ann) => (
                    <AnnouncementCard key={ann.id} ann={ann} />
                ))}
            </ScrollView>
        </View>
    );
}

// ── Announcement card ──────────────────────────────────────────────────────────
function AnnouncementCard({ ann }: { ann: (typeof ANNOUNCEMENTS)[0] }) {
    const { language } = useAuth();
    return (
        <View className="bg-white rounded-[16px] p-4 mb-3 border border-[#E5E7EB]" style={{ elevation: 1 }}>
            <Text className="text-[14px] font-extrabold text-[#16A637] mb-2">{ann.title}</Text>
            <View className="flex-row mb-2" style={{ gap: 16 }}>
                <View className="flex-row items-center" style={{ gap: 5 }}>
                    <LocationIcon width={13} height={13} color="#8F9BB3" />
                    <Text className="text-[11px] text-[#8F9BB3] font-semibold">{ann.district}</Text>
                </View>
                <View className="flex-row items-center" style={{ gap: 5 }}>
                    <CalendarIcon width={13} height={13} color="#8F9BB3" />
                    <Text className="text-[11px] text-[#8F9BB3] font-semibold">{ann.date}</Text>
                </View>
            </View>
            <Text className="text-[11px] text-[#5a6a7a] leading-[17px] mb-3">{ann.body}</Text>
            <TouchableOpacity
                className="bg-[#16A637] rounded-full px-5 py-[7px] self-start"
                activeOpacity={0.8}
            >
                <Text className="text-white text-[11px] font-bold">{t('report.read', language)}{' '}</Text>
            </TouchableOpacity>
        </View>
    );
}

// ── Report form ────────────────────────────────────────────────────────────────
function ReportForm({ insets, onBack }: { insets: any; onBack: () => void }) {
    const { language } = useAuth();
    const [location] = useState('Tupas Street, Matina Crossing, Davao City');
    const [coordinates, setCoordinates] = useState<[number, number]>([125.601, 7.065]);
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!issueType) {
            Alert.alert('Missing Field', 'Please select a type of report.');
            return;
        }
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 800));
        setSubmitting(false);
        Alert.alert('Report Submitted', 'Thank you! Your report has been submitted.');
        setIssueType('');
        setDescription('');
    };

    return (
        <View className="flex-1 bg-[#F8F9FA]" style={{ paddingTop: insets.top }}>
            <ScrollView
                className="flex-1 bg-[#F8F9FA]"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="px-5 pt-4 pb-5 bg-[#F8F9FA]">
                    <BackButton />
                    <Text className="text-[28px] font-extrabold text-[#233329]">{t('report.details', language)}{' '}</Text>
                </View>

                <View className="flex-1 bg-[#F0F4F1] px-5 pt-6" style={{ minHeight: 500 }}>
                    <Text className="text-[15px] font-extrabold text-[#233329] mb-3">{t('report.location', language)}{' '}</Text>
                    <View style={{ height: 200, borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
                        <MapLibreMap
                            style={{ flex: 1 }}
                            mapStyle="https://tiles.openfreemap.org/styles/liberty"
                            logo={false}
                            attribution={false}
                            onPress={(e: any) => {
                                const coords = e?.geometry?.coordinates;
                                if (coords) setCoordinates(coords as [number, number]);
                            }}
                        >
                            <Camera
                                initialViewState={{
                                    center: coordinates,
                                    zoom: 15,
                                }}
                            />
                            <GeoJSONSource
                                id="pin-source"
                                data={{ type: 'Feature', geometry: { type: 'Point', coordinates }, properties: {} }}
                            >
                                <Layer
                                    id="pin-circle"
                                    type="circle"
                                    style={{
                                        circleRadius: 10,
                                        circleColor: '#16A637',
                                        circleStrokeWidth: 3,
                                        circleStrokeColor: '#ffffff',
                                    }}
                                />
                            </GeoJSONSource>
                        </MapLibreMap>
                    </View>

                    <View className="bg-white border border-[#E5E7EB] rounded-[12px] px-4 h-[48px] justify-center mb-6">
                        <Text className="text-[#233329] text-sm">{location}</Text>
                    </View>

                    <Text className="text-[15px] font-extrabold text-[#233329] mb-3">{t('report.type', language)}{' '}</Text>
                    <TouchableOpacity
                        className="bg-white border border-[#E5E7EB] rounded-[12px] px-4 h-[48px] flex-row items-center justify-between mb-6"
                        onPress={() => setDropdownOpen(true)}
                    >
                        <Text className={issueType ? 'text-[#233329] text-sm' : 'text-[#8F9BB3] text-sm'}>
                            {issueType || t('report.select', language)}
                        </Text>
                        <ChevronDown size={18} color="#8F9BB3" />
                    </TouchableOpacity>

                    <Text className="text-[15px] font-extrabold text-[#233329] mb-3">{t('report.description', language)}{' '}</Text>
                    <TextInput
                        className="bg-white border border-[#E5E7EB] rounded-[12px] px-4 pt-4 pb-4 text-sm text-[#233329] mb-6"
                        placeholder={t('report.describe', language)}
                        placeholderTextColor="#8F9BB3"
                        multiline
                        numberOfLines={6}
                        style={{ height: 160, textAlignVertical: 'top' }}
                        value={description}
                        onChangeText={setDescription}
                    />

                    <Text className="text-[11px] text-[#8F9BB3] leading-[18px] mb-5">
                        {t('report.note', language)}{' '}
                    </Text>

                    <TouchableOpacity
                        className="bg-[#16A637] rounded-[14px] h-[56px] items-center justify-center"
                        onPress={handleSubmit}
                        disabled={submitting}
                        style={{ opacity: submitting ? 0.7 : 1 }}
                    >
                        <Text style={{ fontSize: 15, color: '#fff', letterSpacing: 1.5, fontWeight: '800' }}>
                            {submitting ? t('report.submitting', language) : t('report.submit', language)}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal visible={dropdownOpen} transparent animationType="fade" onRequestClose={() => setDropdownOpen(false)}>
                <Pressable className="flex-1 bg-black/40" onPress={() => setDropdownOpen(false)}>
                    <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] px-5 pt-4 pb-8">
                        <Text className="text-[16px] font-extrabold text-[#233329] mb-4">{t('report.type', language)}{' '}</Text>
                        {ISSUE_TYPES.map((type) => (
                            <TouchableOpacity
                                key={type}
                                className="py-4 border-b border-[#F0F4F1]"
                                onPress={() => { setIssueType(type); setDropdownOpen(false); }}
                            >
                                <Text className={`text-sm ${issueType === type ? 'text-[#16A637] font-bold' : 'text-[#233329]'}`}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}