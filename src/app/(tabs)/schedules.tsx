import BackIcon from '@/assets/icons/back.svg';
import CalendarIcon from '@/assets/icons/calendar.svg';
import LocationIcon from '@/assets/icons/location.svg';
import { AuthColors } from '@/constants/auth-colors';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const SCHEDULES = [
    { id: '1', barangay: 'Mintal', date: '06/26/2026' },
    { id: '2', barangay: 'Mintal', date: '06/26/2026' },
    { id: '3', barangay: 'Mintal', date: '06/26/2026' },
    { id: '4', barangay: 'Mintal', date: '06/26/2026' },
    { id: '5', barangay: 'Mintal', date: '06/26/2026' },
];

function ScheduleCard({ schedule }: { schedule: (typeof SCHEDULES)[0] }) {
    const router = useRouter();

    return (
        <View
            className="bg-white rounded-[16px] p-4 mb-3 border border-[#E5E7EB] flex-row items-center justify-between"
            style={{ elevation: 1 }}
        >
            <View style={{ gap: 8 }}>
                <View className="flex-row items-center" style={{ gap: 6 }}>
                    <LocationIcon width={14} height={14} color={AuthColors.green} />
                    <Text className="text-[13px] font-semibold" style={{ color: AuthColors.dark }}>
                        Brgy:{' '}
                        <Text className="font-normal" style={{ color: AuthColors.dark }}>
                            {schedule.barangay}
                        </Text>
                    </Text>
                </View>
                <View className="flex-row items-center" style={{ gap: 6 }}>
                    <CalendarIcon width={14} height={14} color={AuthColors.green} />
                    <Text className="text-[13px] font-semibold" style={{ color: AuthColors.dark }}>
                        Date:{' '}
                        <Text className="font-normal" style={{ color: AuthColors.dark }}>
                            {schedule.date}
                        </Text>
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                className="rounded-full px-5 py-[8px]"
                style={{ backgroundColor: AuthColors.green }}
                activeOpacity={0.8}
                onPress={() =>
                    router.push({
                        pathname: '/routes' as any,
                        params: { barangay: schedule.barangay, date: schedule.date },
                    })
                }
            >
                <Text className="text-[12px] font-bold" style={{ color: AuthColors.white }}>
                    Show Route
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default function SchedulesScreen() {
    const router = useRouter();
    const navigateTo = (path: string) => router.push(path as any);

    return (
        <ScrollView
            className="flex-1"
            style={{ backgroundColor: AuthColors.background }}
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header Layout */}
            <View className="flex-row items-center mb-6" style={{ gap: 14 }}>
                <TouchableOpacity
                    onPress={() => navigateTo('/')}
                    className="w-10 h-10 rounded-[12px] items-center justify-center"
                    style={{ backgroundColor: AuthColors.green }}
                    activeOpacity={0.8}
                >
                    <BackIcon width={22} height={22} color={AuthColors.white} />
                </TouchableOpacity>
                <Text className="text-[26px] font-bold" style={{ color: AuthColors.dark }}>
                    Schedules
                </Text>
            </View>

            {/* Grid Layout Container */}
            <View className="flex-row flex-wrap justify-between">
                {SCHEDULES.map((schedule) => (
                    <View key={schedule.id} className="w-full md:w-[49%]">
                        <ScheduleCard schedule={schedule} />
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}