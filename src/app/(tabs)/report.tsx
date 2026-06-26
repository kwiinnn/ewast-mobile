import { useAuth } from '@/components/AuthContext';
import WebMap from '@/components/WebMap';
import { t } from '@/constants/translations';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { AlertTriangle, Camera, ChevronDown, Image as ImageIcon, Upload, UserLock, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
    Alert,
    Image,
    Platform,
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
    const [photo, setPhoto] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const fileInputRef = useRef<any>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    // ── Web: read a File object into a data-URI ────────────────────────────────
    const readFileAsDataURI = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    // ── Web: file-input change ─────────────────────────────────────────────────
    const handleWebFileChange = async (e: any) => {
        const file: File | undefined = e.target?.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            Alert.alert('Invalid file', 'Please select an image file.');
            return;
        }
        const uri = await readFileAsDataURI(file);
        setPhoto(uri);
        // Reset input so the same file can be re-selected after removal
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // ── Web: drag-and-drop ─────────────────────────────────────────────────────
    const handleDrop = async (e: any) => {
        e.preventDefault();
        setIsDragOver(false);
        const file: File | undefined = e.dataTransfer?.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            Alert.alert('Invalid file', 'Please drop an image file.');
            return;
        }
        const uri = await readFileAsDataURI(file);
        setPhoto(uri);
    };

    // ── Native: camera ─────────────────────────────────────────────────────────
    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Camera access is needed to take a photo.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.85,
        });
        if (!result.canceled && result.assets.length > 0) {
            setPhoto(result.assets[0].uri);
        }
    };

    // ── Native: gallery ────────────────────────────────────────────────────────
    const handlePickFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Gallery access is needed to select a photo.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.85,
        });
        if (!result.canceled && result.assets.length > 0) {
            setPhoto(result.assets[0].uri);
        }
    };

    // ── Dispatcher: web opens file picker; native shows action sheet ───────────
    const handlePhotoPress = () => {
        if (Platform.OS === 'web') {
            fileInputRef.current?.click();
        } else {
            Alert.alert('Add Photo', 'Choose a method', [
                { text: 'Take Photo', onPress: handleTakePhoto },
                { text: 'Choose from Gallery', onPress: handlePickFromGallery },
                { text: 'Cancel', style: 'cancel' },
            ]);
        }
    };

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
            setPhoto(null);
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
                            <WebMap center={coordinates} zoom={15} onCoordinatesChange={setCoordinates} />
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

                        {/* Photo */}
                        <Text className="text-[15px] font-extrabold text-[#233329] mb-3">Photo (Optional)</Text>

                        {/* Hidden file input — web only */}
                        {Platform.OS === 'web' && (
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleWebFileChange}
                            />
                        )}

                        {photo ? (
                            <View style={{ marginBottom: 24 }}>
                                <View style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
                                    <Image
                                        source={{ uri: photo }}
                                        style={{ width: '100%', height: 200, borderRadius: 16 }}
                                        resizeMode="cover"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setPhoto(null)}
                                        style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                            backgroundColor: 'rgba(0,0,0,0.55)',
                                            borderRadius: 20,
                                            width: 32,
                                            height: 32,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <X size={16} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    onPress={handlePhotoPress}
                                    style={{ marginTop: 10, alignSelf: 'flex-start' }}
                                >
                                    <Text style={{ fontSize: 13, color: '#16A637', fontWeight: '700' }}>Change photo</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={handlePhotoPress}
                                activeOpacity={0.75}
                                // Web drag-and-drop via react-native-web dataSet/event props
                                {...(Platform.OS === 'web' ? {
                                    onDragOver: (e: any) => { e.preventDefault(); setIsDragOver(true); },
                                    onDragLeave: () => setIsDragOver(false),
                                    onDrop: handleDrop,
                                } : {})}
                                style={{
                                    borderWidth: 1.5,
                                    borderColor: isDragOver ? '#16A637' : '#D1D5DB',
                                    borderStyle: 'dashed',
                                    borderRadius: 16,
                                    height: isDesktop ? 150 : 130,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: isDragOver ? '#F0FBF3' : '#fff',
                                    marginBottom: 24,
                                    gap: 10,
                                    // Smooth colour transition on web
                                    ...(Platform.OS === 'web' ? { transition: 'border-color 0.15s, background-color 0.15s' } as any : {}),
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                    <View style={{
                                        backgroundColor: isDragOver ? '#C8EDD0' : '#E8F5E9',
                                        borderRadius: 50,
                                        padding: 10,
                                    }}>
                                        {isDragOver
                                            ? <Upload size={22} color="#16A637" />
                                            : (Platform.OS === 'web'
                                                ? <Upload size={22} color="#16A637" />
                                                : <Camera size={22} color="#16A637" />)
                                        }
                                    </View>
                                    <View style={{ gap: 2 }}>
                                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#233329' }}>
                                            {isDragOver ? 'Drop to attach' : (Platform.OS === 'web' ? 'Upload a photo' : 'Take or upload a photo')}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: '#8F9BB3' }}>
                                            {Platform.OS === 'web'
                                                ? 'Click to browse or drag & drop an image here'
                                                : 'Helps responders identify the issue faster'}
                                        </Text>
                                    </View>
                                </View>

                                {/* Pill buttons — native only */}
                                {Platform.OS !== 'web' && (
                                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 4,
                                            backgroundColor: '#F0F4F1',
                                            paddingHorizontal: 12,
                                            paddingVertical: 6,
                                            borderRadius: 20,
                                        }}>
                                            <Camera size={13} color="#16A637" />
                                            <Text style={{ fontSize: 12, color: '#16A637', fontWeight: '600' }}>Camera</Text>
                                        </View>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 4,
                                            backgroundColor: '#F0F4F1',
                                            paddingHorizontal: 12,
                                            paddingVertical: 6,
                                            borderRadius: 20,
                                        }}>
                                            <ImageIcon size={13} color="#16A637" />
                                            <Text style={{ fontSize: 12, color: '#16A637', fontWeight: '600' }}>Gallery</Text>
                                        </View>
                                    </View>
                                )}
                            </TouchableOpacity>
                        )}

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