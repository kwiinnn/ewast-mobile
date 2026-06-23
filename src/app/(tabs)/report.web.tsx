import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'expo-router';
import { AlertTriangle, ChevronDown, MapPin, UserLock } from 'lucide-react-native';
import { useState } from 'react';
import {
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';

const ISSUE_TYPES = [
    'Illegal Dumping',
    'Missed Collection',
    'Overflowing Bin',
    'Damaged Bin',
    'Hazardous Waste',
    'Other',
];

const DESKTOP_BREAKPOINT = 768;

export default function ReportScreen() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isDesktop = width >= DESKTOP_BREAKPOINT;

    const [location] = useState('Tupas Street, Matina Crossing, Davao City');
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
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setIssueType('');
            setDescription('');
        }, 3000);
    };

    // ── Not logged in gate ───────────────────────────────────────────────────
    if (!isLoggedIn) {
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
                {/* Page heading — only show on mobile (desktop has nav header) */}
                {!isDesktop && (
                    <View className="px-6 pt-6 pb-2 bg-[#F8F9FA]">
                        <Text className="text-[26px] font-extrabold text-[#233329]">Report Details</Text>
                    </View>
                )}

                {isDesktop && (
                    <Text className="text-[28px] font-extrabold text-[#233329] mb-6">Report Details</Text>
                )}

                {/* Form card */}
                <View
                    className="bg-[#F0F4F1]"
                    style={{
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
                        <View className="bg-[#E8F5E9] border border-[#16A637] rounded-[12px] px-4 py-3 mb-5 flex-row items-center" style={{ gap: 10 }}>
                            <AlertTriangle size={18} color="#16A637" />
                            <Text className="text-[#16A637] font-bold text-sm">Report submitted successfully!</Text>
                        </View>
                    )}

                    <View style={{ paddingHorizontal: isDesktop ? 0 : 20 }}>
                        {/* Location */}
                        <Text className="text-[15px] font-extrabold text-[#233329] mb-3">Location</Text>

                        {/* Map placeholder */}
                        <View
                            className="rounded-[16px] bg-[#D9E8D4] items-center justify-center mb-3"
                            style={{ height: 200 }}
                        >
                            <MapPin size={36} color="#16A637" />
                            <Text className="text-[#16A637] font-bold mt-2 text-sm">Map View</Text>
                        </View>

                        {/* Address */}
                        <View className="bg-white border border-[#E5E7EB] rounded-[12px] px-4 h-[48px] justify-center mb-6">
                            <Text className="text-[#233329] text-sm">{location}</Text>
                        </View>

                        {/* Type of Report */}
                        <Text className="text-[15px] font-extrabold text-[#233329] mb-3">Type of Report</Text>
                        <View className="relative mb-6">
                            <TouchableOpacity
                                className="bg-white border border-[#E5E7EB] rounded-[12px] px-4 h-[48px] flex-row items-center justify-between"
                                onPress={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <Text className={issueType ? 'text-[#233329] text-sm' : 'text-[#8F9BB3] text-sm'}>
                                    {issueType || 'Select issue type...'}
                                </Text>
                                <ChevronDown
                                    size={18}
                                    color="#8F9BB3"
                                    style={{ transform: [{ rotate: dropdownOpen ? '180deg' : '0deg' }] }}
                                />
                            </TouchableOpacity>

                            {dropdownOpen && (
                                <View
                                    className="absolute left-0 right-0 bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden"
                                    style={{ top: 52, zIndex: 100, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 8 }}
                                >
                                    {ISSUE_TYPES.map((type, i) => (
                                        <TouchableOpacity
                                            key={type}
                                            className={`px-4 py-3.5 ${i < ISSUE_TYPES.length - 1 ? 'border-b border-[#F0F4F1]' : ''}`}
                                            onPress={() => { setIssueType(type); setDropdownOpen(false); }}
                                        >
                                            <Text className={`text-sm ${issueType === type ? 'text-[#16A637] font-bold' : 'text-[#233329]'}`}>
                                                {type}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Description */}
                        <Text className="text-[15px] font-extrabold text-[#233329] mb-3">Description</Text>
                        <TextInput
                            className="bg-white border border-[#E5E7EB] rounded-[12px] px-4 pt-4 text-sm text-[#233329] mb-6"
                            placeholder="Describe the issue..."
                            placeholderTextColor="#8F9BB3"
                            multiline
                            style={{ height: 160, textAlignVertical: 'top' } as any}
                            value={description}
                            onChangeText={setDescription}
                        />

                        {/* Consent */}
                        <Text className="text-[11px] text-[#8F9BB3] leading-[18px] mb-6">
                            By submitting this form, you consent to the collection, processing, and storage of your report solely for the purposes of recording and analysis by CENRO in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173).
                        </Text>

                        {/* Submit */}
                        <TouchableOpacity
                            className="bg-[#16A637] rounded-[14px] h-[56px] items-center justify-center"
                            onPress={handleSubmit}
                            disabled={submitting || !issueType}
                            style={{ opacity: submitting || !issueType ? 0.65 : 1 }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PlusJakartaSans-Bold',
                                    fontSize: 15,
                                    color: '#fff',
                                    letterSpacing: 1.5,
                                    fontWeight: '700',
                                }}
                            >
                                {submitting ? 'SUBMITTING...' : 'SUBMIT REPORT'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
