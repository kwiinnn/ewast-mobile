import { useAuth } from '@/components/AuthContext';
import { t } from '@/constants/translations';
import { useRouter } from 'expo-router';
import { AlertTriangle, ChevronDown, UserLock } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';


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

const DESKTOP_BREAKPOINT = 768;
const DAVAO: [number, number] = [125.601, 7.065];


// ── Web map ────────────────────────────────────────────────────────────────────
function WebMap({ coordinates, onCoordinatesChange }: {
    coordinates: [number, number];
    onCoordinatesChange: (coords: [number, number]) => void;
}) {
    const containerRef = useRef<any>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        let map: any;
        import('maplibre-gl').then(({ Map, Marker }) => {
            if (!containerRef.current || mapRef.current) return;
            map = new Map({
                container: containerRef.current,
                style: 'https://tiles.openfreemap.org/styles/liberty',
                center: coordinates,
                zoom: 15,
                attributionControl: false,
            });
            mapRef.current = map;

            const el = document.createElement('div');
            el.style.cssText = 'width:20px;height:20px;border-radius:50%;background:#16A637;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);cursor:pointer';
            const marker = new Marker({ element: el, draggable: true })
                .setLngLat(coordinates)
                .addTo(map);
            markerRef.current = marker;

            marker.on('dragend', () => {
                const lngLat = marker.getLngLat();
                onCoordinatesChange([lngLat.lng, lngLat.lat]);
            });
            map.on('click', (e: any) => {
                const { lng, lat } = e.lngLat;
                marker.setLngLat([lng, lat]);
                onCoordinatesChange([lng, lat]);
            });
        });
        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        markerRef.current?.setLngLat(coordinates);
    }, [coordinates]);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden' }} />
    );
}

// ── Root ───────────────────────────────────────────────────────────────────────
export default function ReportScreen() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isDesktop = width >= DESKTOP_BREAKPOINT;

    if (!isLoggedIn) {
        return <LoggedOutGate isDesktop={isDesktop} router={router} />;
    }

    return <ReportForm isDesktop={isDesktop} onBack={() => router.back()} />;
}

// ── Logged-out gate ────────────────────────────────────────────────────────────
function LoggedOutGate({ isDesktop, router }: { isDesktop: boolean; router: any }) {
    return (
        <View className="flex-1 bg-[#F0F4F1] items-center justify-center px-8">
            <View
                className="bg-white rounded-[24px] p-10 items-center shadow-sm"
                style={{ width: isDesktop ? 420 : '100%', elevation: 2 }}
            >
                <View className="bg-[#E8F5E9] w-16 h-16 rounded-full items-center justify-center mb-5">
                    <UserLock size={30} color="#16A637" />
                </View>
                <Text className="text-[22px] font-extrabold text-[#233329] text-center mb-2">Login Required</Text>
                <Text className="text-sm text-[#8F9BB3] text-center leading-6 mb-8">
                    You need to be logged in to submit a garbage report.
                </Text>
                <TouchableOpacity
                    className="bg-[#16A637] rounded-full h-[50px] w-full items-center justify-center mb-4"
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

// ── Report form ────────────────────────────────────────────────────────────────
function ReportForm({ isDesktop, onBack }: { isDesktop: boolean; onBack: () => void }) {
    const { language } = useAuth();
    const [location] = useState('Tupas Street, Matina Crossing, Davao City');
    const [coordinates, setCoordinates] = useState<[number, number]>(DAVAO);
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!issueType) return;
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 800));
        setSubmitting(false);
        // { issueType, description, coordinates, location }
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setIssueType('');
            setDescription('');
        }, 3000);
    };

    return (
        <ScrollView
            className="flex-1 bg-[#F0F4F1]"
            contentContainerStyle={{
                paddingBottom: isDesktop ? 60 : 120,
                paddingTop: isDesktop ? 40 : 0,
                alignItems: isDesktop ? 'center' : undefined,
            }}
            showsVerticalScrollIndicator={false}
        >
            <View style={{ width: isDesktop ? 640 : '100%' }}>

                {/* Mobile heading with back button */}
                {!isDesktop && (
                    <View className="flex-row items-center px-5 py-4 bg-[#F8F9FA]" style={{ gap: 12 }}>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, alignSelf: 'flex-start' }}
                            onPress={onBack}
                        >
                            <Text style={{ fontSize: 13, color: '#16A637', fontWeight: '700' }}>{t('report.return', language)}{' '}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {!isDesktop && (
                    <View className="px-6 pt-4 pb-2 bg-[#F8F9FA]">
                        <Text className="text-[26px] font-extrabold text-[#233329]">Report Details</Text>
                    </View>
                )}

                {/* Desktop: back link + heading */}
                {isDesktop && (
                    <View style={{ marginBottom: 24 }}>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, alignSelf: 'flex-start' }}
                            onPress={onBack}
                        >
                            <Text style={{ fontSize: 13, color: '#16A637', fontWeight: '700' }}>{t('report.return', language)}{' '}</Text>
                        </TouchableOpacity>
                        <Text className="text-[28px] font-extrabold text-[#233329]">{t('report.details', language)}{' '}</Text>
                    </View>
                )}

                {/* Form card */}
                <View
                    className="bg-[#F0F4F1]"
                    style={{
                        overflow: 'visible',
                        ...(isDesktop && {
                            backgroundColor: '#fff',
                            borderRadius: 24,
                            padding: 40,
                            shadowColor: '#000',
                            shadowOpacity: 0.06,
                            shadowRadius: 12,
                            elevation: 2,
                        }),
                    }}
                >
                    {/* Success banner */}
                    {submitted && (
                        <View
                            className="bg-[#E8F5E9] border border-[#16A637] rounded-[12px] px-4 py-3 mb-5 flex-row items-center"
                            style={{ gap: 10 }}
                        >
                            <AlertTriangle size={18} color="#16A637" />
                            <Text className="text-[#16A637] font-bold text-sm">{t('report.location', language)}{' '}</Text>
                        </View>
                    )}

                    <View style={{ paddingHorizontal: isDesktop ? 0 : 20, overflow: 'visible' }}>
                        {/* Location */}
                        <Text className="text-[15px] font-extrabold text-[#233329] mb-3">{t('report.location', language)}{' '}</Text>
                        <View style={{ height: 200, borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
                            <WebMap coordinates={coordinates} onCoordinatesChange={setCoordinates} />
                        </View>
                        <View className="bg-white border border-[#E5E7EB] rounded-[12px] px-4 h-[48px] justify-center mb-6">
                            <Text className="text-[#233329] text-sm">{location}</Text>
                        </View>

                        {/* Type of Report */}
                        <Text className="text-[15px] font-extrabold text-[#233329] mb-3">{t('report.type', language)}{' '}</Text>
                        <View style={{ position: 'relative', zIndex: 10, overflow: 'visible', marginBottom: 24 }}>
                            {dropdownOpen && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: 52,
                                        left: 0,
                                        right: 0,
                                        backgroundColor: '#fff',
                                        borderWidth: 1,
                                        borderColor: '#16A637',
                                        borderTopLeftRadius: 0,
                                        borderTopRightRadius: 0,
                                        borderBottomLeftRadius: 12,
                                        borderBottomRightRadius: 12,
                                        borderTopWidth: 0,
                                        overflow: 'hidden',
                                        zIndex: 10,
                                        shadowColor: '#000',
                                        shadowOpacity: 0.08,
                                        shadowRadius: 8,
                                        elevation: 8,
                                    }}
                                >
                                    {ISSUE_TYPES.map((type, i) => (
                                        <TouchableOpacity
                                            key={type}
                                            style={{
                                                paddingHorizontal: 16,
                                                paddingVertical: 13,
                                                borderBottomWidth: i < ISSUE_TYPES.length - 1 ? 1 : 0,
                                                borderBottomColor: '#F0F4F1',
                                                backgroundColor: issueType === type ? '#F0FBF3' : '#fff',
                                            }}
                                            onPress={() => { setIssueType(type); setDropdownOpen(false); }}
                                        >
                                            <Text style={{
                                                fontSize: 14,
                                                color: issueType === type ? '#16A637' : '#233329',
                                                fontWeight: issueType === type ? '700' : '400',
                                            }}>
                                                {type}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#fff',
                                    borderWidth: 1,
                                    borderColor: dropdownOpen ? '#16A637' : '#E5E7EB',
                                    borderTopLeftRadius: 12,
                                    borderTopRightRadius: 12,
                                    borderBottomLeftRadius: dropdownOpen ? 0 : 12,
                                    borderBottomRightRadius: dropdownOpen ? 0 : 12,
                                    paddingHorizontal: 16,
                                    height: 48,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                                onPress={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <Text style={{ fontSize: 14, color: issueType ? '#233329' : '#8F9BB3' }}>
                                    {issueType || t('report.select', language)}
                                </Text>
                                <ChevronDown
                                    size={18}
                                    color="#8F9BB3"
                                    style={{ transform: [{ rotate: dropdownOpen ? '180deg' : '0deg' }] }}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Description */}
                        <Text className="text-[15px] font-extrabold text-[#233329] mb-3">{t('report.description', language)}{' '}</Text>
                        <TextInput
                            className="bg-white border border-[#E5E7EB] rounded-[12px] px-4 pt-4 text-sm text-[#233329] mb-6"
                            placeholder={t('report.describe', language)}
                            placeholderTextColor="#8F9BB3"
                            multiline
                            style={{ height: 160, textAlignVertical: 'top' } as any}
                            value={description}
                            onChangeText={setDescription}
                        />

                        {/* Consent */}
                        <Text className="text-[11px] text-[#8F9BB3] leading-[18px] mb-6">
                            {t('report.note', language)}{' '}
                        </Text>

                        {/* Submit */}
                        <TouchableOpacity
                            className="bg-[#16A637] rounded-[14px] h-[56px] items-center justify-center"
                            onPress={handleSubmit}
                            disabled={submitting || !issueType}
                            style={{ opacity: submitting || !issueType ? 0.65 : 1 }}
                        >
                            <Text style={{
                                fontSize: 15,
                                color: '#fff',
                                letterSpacing: 1.5,
                                fontWeight: '800',
                            }}>
                                {submitting ? t('report.submitting', language) : t('report.submit', language)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}