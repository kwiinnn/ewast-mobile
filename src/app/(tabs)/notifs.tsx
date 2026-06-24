import { useAuth } from '@/components/AuthContext';
import { AuthColors } from '@/constants/auth-colors';
import { useRouter } from 'expo-router';
import {
    CheckCircle2,
    Clock3,
    Inbox,
    MapPin,
    UserLock
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ReportStatus = 'pending' | 'resolved';

interface ReportNotification {
    id: string;
    issueType: string;
    location: string;
    timeAgo: string;
    status: ReportStatus;
}

// Mock data — replace with reports fetched for the logged-in user
const MOCK_NOTIFICATIONS: ReportNotification[] = [
    {
        id: '1',
        issueType: 'Overflowing bin/s',
        location: 'Tupas Street, Matina Crossing',
        timeAgo: '2 hours ago',
        status: 'resolved',
    },
    {
        id: '2',
        issueType: 'Illegal dumping',
        location: 'Quimpo Boulevard, Talomo',
        timeAgo: 'Yesterday',
        status: 'resolved',
    },
    {
        id: '3',
        issueType: 'Drainage blockage',
        location: 'Roxas Avenue, Poblacion',
        timeAgo: '3 days ago',
        status: 'pending',
    },
    {
        id: '4',
        issueType: 'Mixed waste',
        location: 'Sandawa Road, Bucana',
        timeAgo: '5 days ago',
        status: 'pending',
    },
    {
        id: '5',
        issueType: 'Bulky waste',
        location: 'Diversion Road, Catalunan Grande',
        timeAgo: '1 week ago',
        status: 'resolved',
    },
];

const FILTERS = [
    { key: 'resolved', label: 'Resolved' },
    { key: 'pending', label: 'Pending' },
    { key: 'all', label: 'All' },
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];

export default function NotificationsScreen() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [filter, setFilter] = useState<FilterKey>('resolved');

    const filteredNotifications = useMemo(() => {
        if (filter === 'all') return MOCK_NOTIFICATIONS;
        return MOCK_NOTIFICATIONS.filter((n) => n.status === filter);
    }, [filter]);

    // ── Not logged in gate ───────────────────────────────────────────────────
    if (!isLoggedIn) {
        return (
            <View
                className="flex-1 items-center justify-center px-8"
                style={{ backgroundColor: AuthColors.background, paddingBottom: insets.bottom }}
            >
                <View
                    className="rounded-[24px] p-8 items-center shadow-sm w-full"
                    style={{ backgroundColor: AuthColors.card, elevation: 2 }}
                >
                    <View
                        className="w-16 h-16 rounded-full items-center justify-center mb-5"
                        style={{ backgroundColor: AuthColors.greenLight }}
                    >
                        <UserLock size={30} color={AuthColors.green} />
                    </View>
                    <Text className="text-[20px] font-extrabold text-center mb-2" style={{ color: AuthColors.dark }}>
                        Login Required
                    </Text>
                    <Text
                        className="text-sm text-center leading-5 mb-7"
                        style={{ color: AuthColors.placeholder }}
                    >
                        You need to be logged in to view your notifications.
                    </Text>
                    <TouchableOpacity
                        className="rounded-full h-[50px] w-full items-center justify-center mb-3"
                        style={{ backgroundColor: AuthColors.green }}
                        onPress={() => router.push('/login' as any)}
                    >
                        <Text className="text-white font-bold text-base">Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/signup' as any)}>
                        <Text className="text-sm" style={{ color: AuthColors.placeholder }}>
                            Don't have an account?{' '}
                            <Text className="font-bold" style={{ color: AuthColors.green }}>
                                Sign up
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1" style={{ backgroundColor: AuthColors.background, paddingTop: insets.top }}>
            <ScrollView
                className="flex-1"
                style={{ backgroundColor: AuthColors.background }}
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Heading */}
                <View className="px-5 pt-4 pb-5" style={{ backgroundColor: AuthColors.background }}>
                    <Text className="text-[28px] font-extrabold" style={{ color: AuthColors.dark }}>
                        Notifications
                    </Text>
                    <Text className="text-sm mt-1" style={{ color: AuthColors.placeholder }}>
                        Updates on the reports you've submitted
                    </Text>
                </View>

                {/* Filter pills */}
                <View className="flex-row px-5 mb-2" style={{ gap: 10 }}>
                    {FILTERS.map((f) => {
                        const active = filter === f.key;
                        return (
                            <TouchableOpacity
                                key={f.key}
                                onPress={() => setFilter(f.key)}
                                className="rounded-full px-5 h-[38px] items-center justify-center border"
                                style={{
                                    backgroundColor: active ? AuthColors.green : AuthColors.white,
                                    borderColor: active ? AuthColors.green : AuthColors.field,
                                }}
                            >
                                <Text
                                    className="text-[13px] font-bold"
                                    style={{ color: active ? AuthColors.white : AuthColors.placeholder }}
                                >
                                    {f.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* List area */}
                <View
                    className="flex-1 px-5 pt-5"
                    style={{ backgroundColor: AuthColors.field, minHeight: 500 }}
                >
                    {filteredNotifications.length === 0 ? (
                        <View className="items-center justify-center pt-20">
                            <View
                                className="w-16 h-16 rounded-full items-center justify-center mb-4"
                                style={{ backgroundColor: AuthColors.greenLight }}
                            >
                                <Inbox size={28} color={AuthColors.green} />
                            </View>
                            <Text className="text-base font-extrabold mb-1" style={{ color: AuthColors.dark }}>
                                Nothing here yet
                            </Text>
                            <Text className="text-sm text-center" style={{ color: AuthColors.placeholder }}>
                                {filter === 'pending'
                                    ? "You don't have any pending reports."
                                    : filter === 'resolved'
                                    ? "You don't have any resolved reports yet."
                                    : "You haven't submitted any reports yet."}
                            </Text>
                        </View>
                    ) : (
                        filteredNotifications.map((item) => {
                            const isResolved = item.status === 'resolved';
                            return (
                                <View
                                    key={item.id}
                                    className="rounded-[16px] p-4 mb-3 flex-row"
                                    style={{ backgroundColor: AuthColors.card, gap: 12 }}
                                >
                                    {/* Status icon */}
                                    <View
                                        className="w-11 h-11 rounded-full items-center justify-center"
                                        style={{
                                            backgroundColor: isResolved ? AuthColors.greenLight : AuthColors.field,
                                        }}
                                    >
                                        {isResolved ? (
                                            <CheckCircle2 size={20} color={AuthColors.green} />
                                        ) : (
                                            <Clock3 size={20} color={AuthColors.placeholder} />
                                        )}
                                    </View>

                                    {/* Content */}
                                    <View className="flex-1">
                                        <View className="flex-row items-start justify-between mb-1">
                                            <Text
                                                className="text-[14px] font-extrabold flex-1 pr-2"
                                                style={{ color: AuthColors.dark }}
                                            >
                                                {item.issueType}
                                            </Text>
                                            <View
                                                className="rounded-full px-3 py-1"
                                                style={{
                                                    backgroundColor: isResolved
                                                        ? AuthColors.greenLight
                                                        : AuthColors.field,
                                                }}
                                            >
                                                <Text
                                                    className="text-[10px] font-bold tracking-wide"
                                                    style={{
                                                        color: isResolved ? AuthColors.green : AuthColors.placeholder,
                                                    }}
                                                >
                                                    {isResolved ? 'RESOLVED' : 'PENDING'}
                                                </Text>
                                            </View>
                                        </View>

                                        <Text className="text-[13px] mb-2" style={{ color: AuthColors.placeholder }}>
                                            {isResolved
                                                ? 'Your report has been resolved by CENRO.'
                                                : 'Your report is being reviewed by CENRO.'}
                                        </Text>

                                        <View className="flex-row items-center mb-1" style={{ gap: 4 }}>
                                            <MapPin size={12} color={AuthColors.placeholder} />
                                            <Text className="text-[12px]" style={{ color: AuthColors.placeholder }}>
                                                {item.location}
                                            </Text>
                                        </View>

                                        <Text className="text-[11px]" style={{ color: AuthColors.placeholder }}>
                                            {item.timeAgo}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>
        </View>
    );
}