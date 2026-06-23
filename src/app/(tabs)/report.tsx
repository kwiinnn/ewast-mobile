import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'expo-router';
import { AlertTriangle, ChevronDown, MapPin, UserLock } from 'lucide-react-native';
import { useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ISSUE_TYPES = [
    'Illegal Dumping',
    'Missed Collection',
    'Overflowing Bin',
    'Damaged Bin',
    'Hazardous Waste',
    'Other',
];

export default function ReportScreen() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [location] = useState('Tupas Street, Matina Crossing, Davao City');
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

    // ── Not logged in gate ───────────────────────────────────────────────────
    if (!isLoggedIn) {
        return (
            <View className="flex-1 bg-[#F0F4F1] items-center justify-center px-8" style={{ paddingBottom: insets.bottom }}>
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
                            Don't have an account? <Text className="text-[#16A637] font-bold">Sign up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#F8F9FA]" style={{ paddingTop: insets.top }}>
            {/* Header */}
            <View className="flex-row items-center px-5 py-4 bg-[#F8F9FA]" style={{ gap: 12 }}>
                <TouchableOpacity
                    className="bg-[#16A637] w-11 h-11 rounded-full items-center justify-center"
                    onPress={() => router.push('/' as any)}
                >
                    <Text className="text-white text-lg font-bold">←</Text>
                </TouchableOpacity>
                <View className="flex-1 bg-white border border-[#E5E7EB] rounded-full px-5 h-11 justify-center">
                    <Text className="text-[10px] text-[#8F9BB3] font-bold tracking-widest">CURRENT TAB</Text>
                    <Text className="text-[13px] font-extrabold text-[#233329]">Report Garbage</Text>
                </View>
            </View>

            <ScrollView
                className="flex-1 bg-[#F8F9FA]"
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Report Details heading */}
                <View className="px-5 pt-4 pb-5 bg-[#F8F9FA]">
                    <Text className="text-[28px] font-extrabold text-[#233329]">Report Details</Text>
                </View>

                {/* Form area */}
                <View className="flex-1 bg-[#F0F4F1] px-5 pt-6" style={{ minHeight: 500 }}>
                    {/* Location label */}
                    <Text className="text-[15px] font-extrabold text-[#233329] mb-3">Location</Text>

                    {/* Map placeholder */}
                    <View
                        className="rounded-[16px] overflow-hidden mb-3 bg-[#D9E8D4] items-center justify-center"
                        style={{ height: 180 }}
                    >
                        <MapPin size={36} color="#16A637" />
                        <Text className="text-[#16A637] font-bold mt-2 text-sm">Map View</Text>
                    </View>

                    {/* Address input */}
                    <View className="bg-white border border-[#E5E7EB] rounded-[12px] px-4 h-[48px] justify-center mb-6">
                        <Text className="text-[#233329] text-sm">{location}</Text>
                    </View>

                    {/* Type of Report */}
                    <Text className="text-[15px] font-extrabold text-[#233329] mb-3">Type of Report</Text>
                    <TouchableOpacity
                        className="bg-white border border-[#E5E7EB] rounded-[12px] px-4 h-[48px] flex-row items-center justify-between mb-6"
                        onPress={() => setDropdownOpen(true)}
                    >
                        <Text className={issueType ? 'text-[#233329] text-sm' : 'text-[#8F9BB3] text-sm'}>
                            {issueType || 'Select issue type...'}
                        </Text>
                        <ChevronDown size={18} color="#8F9BB3" />
                    </TouchableOpacity>

                    {/* Description */}
                    <Text className="text-[15px] font-extrabold text-[#233329] mb-3">Description</Text>
                    <TextInput
                        className="bg-white border border-[#E5E7EB] rounded-[12px] px-4 pt-4 pb-4 text-sm text-[#233329] mb-6"
                        placeholder="Describe the issue..."
                        placeholderTextColor="#8F9BB3"
                        multiline
                        numberOfLines={6}
                        style={{ height: 160, textAlignVertical: 'top' }}
                        value={description}
                        onChangeText={setDescription}
                    />

                    {/* Consent text */}
                    <Text className="text-[11px] text-[#8F9BB3] leading-[18px] mb-5">
                        By submitting this form, you consent to the collection, processing, and storage of your report solely for the purposes of recording and analysis by CENRO in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173).
                    </Text>

                    {/* Submit Button */}
                    <TouchableOpacity
                        className="bg-[#16A637] rounded-[14px] h-[56px] items-center justify-center"
                        onPress={handleSubmit}
                        disabled={submitting}
                        style={{ opacity: submitting ? 0.7 : 1 }}
                    >
                        <Text style={{ fontFamily: 'PlusJakartaSans-Bold', fontSize: 15, color: '#fff', letterSpacing: 1.5 }}>
                            {submitting ? 'SUBMITTING...' : 'SUBMIT REPORT'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Issue type modal */}
            <Modal visible={dropdownOpen} transparent animationType="fade" onRequestClose={() => setDropdownOpen(false)}>
                <Pressable className="flex-1 bg-black/40" onPress={() => setDropdownOpen(false)}>
                    <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] px-5 pt-4 pb-8">
                        <Text className="text-[16px] font-extrabold text-[#233329] mb-4">Select Issue Type</Text>
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
