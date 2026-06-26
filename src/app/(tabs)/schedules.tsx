import BackIcon from '@/assets/icons/back.svg';
import CalendarIcon from '@/assets/icons/calendar.svg';
import LocationIcon from '@/assets/icons/location.svg';
import { AuthColors } from '@/constants/auth-colors';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

// ─── Types (from API docs) ────────────────────────────────────────────────────

interface Assignment {
    assignment_id: number;
    assigned_to_user_id: number;
    route_id: number;
    is_started: boolean;
    is_completed: boolean;
    collection_date: string; // date_assigned aliased by the backend
    date_completed: string | null;
}

interface Route {
    route_id: number;
    waypoints: [number, number][];
    is_approved: boolean;
    collection_rate: number;
    for_barangay_id: number;
    est_fuel_cost: number;
    date_approved: string | null;
}

interface Barangay {
    barangay_id: number;
    name: string;
    bounds_coords: [number, number][];
}

interface Schedule {
    assignment_id: number;
    route_id: number;
    barangay_id: number;
    barangay_name: string;
    date: string;
    is_started: boolean;
    is_completed: boolean;
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function ScheduleCard({ schedule }: { schedule: Schedule }) {
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
                            {schedule.barangay_name}
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
                        params: {
                            barangay: schedule.barangay_name,
                            barangay_id: String(schedule.barangay_id),
                            date: schedule.date,
                        },
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

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SchedulesScreen() {
    const router = useRouter();

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadSchedules() {
        try {
            setLoading(true);
            setError(null);

            // 1. Fetch assignments  →  GET /api/assignments
            const assignRes = await fetch(`${BASE_URL}/api/assignments?limit=100`);
            if (!assignRes.ok) throw new Error(`Failed to fetch assignments (${assignRes.status})`);
            const assignments: Assignment[] = await assignRes.json();

            if (!assignments.length) {
                setSchedules([]);
                return;
            }

            // 2. Fetch all routes  →  GET /api/routes
            //    Used to resolve for_barangay_id for each assignment's route_id
            const routesRes = await fetch(`${BASE_URL}/api/routes?limit=100`);
            if (!routesRes.ok) throw new Error(`Failed to fetch routes (${routesRes.status})`);
            const routes: Route[] = await routesRes.json();
            const routeMap = new Map<number, Route>(routes.map((r) => [r.route_id, r]));

            // 3. Fetch all barangays  →  GET /api/barangays
            //    Used to resolve the human-readable name from barangay_id
            const barangayRes = await fetch(`${BASE_URL}/api/barangays?limit=100`);
            if (!barangayRes.ok)
                throw new Error(`Failed to fetch barangays (${barangayRes.status})`);
            const barangays: Barangay[] = await barangayRes.json();
            const barangayMap = new Map<number, Barangay>(
                barangays.map((b) => [b.barangay_id, b])
            );

            // 4. Join: assignment → route → barangay
            const joined: Schedule[] = assignments.flatMap((a) => {
                const route = routeMap.get(a.route_id);
                if (!route) return [];

                const barangay = barangayMap.get(route.for_barangay_id);

                return [
                    {
                        assignment_id: a.assignment_id,
                        route_id: a.route_id,
                        barangay_id: route.for_barangay_id,
                        barangay_name: barangay?.name ?? `Barangay ${route.for_barangay_id}`,
                        date: new Date(a.collection_date).toLocaleDateString('en-US', {
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric',
                        }),
                        is_started: a.is_started,
                        is_completed: a.is_completed,
                    },
                ];
            });

            setSchedules(joined);
        } catch (err: any) {
            setError(err?.message ?? 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSchedules();
    }, []);

    return (
        <ScrollView
            className="flex-1"
            style={{ backgroundColor: AuthColors.background }}
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View className="flex-row items-center mb-6" style={{ gap: 14 }}>
                <TouchableOpacity
                    onPress={() => router.push('/' as any)}
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

            {/* Loading */}
            {loading && (
                <View style={{ marginTop: 48, alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={AuthColors.green} />
                </View>
            )}

            {/* Error */}
            {!loading && error && (
                <View
                    style={{
                        marginTop: 40,
                        backgroundColor: '#FEF2F2',
                        borderRadius: 12,
                        padding: 20,
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    <Text style={{ color: '#DC2626', fontSize: 14, textAlign: 'center' }}>
                        {error}
                    </Text>
                    <TouchableOpacity
                        onPress={loadSchedules}
                        style={{
                            backgroundColor: AuthColors.green,
                            borderRadius: 10,
                            paddingHorizontal: 20,
                            paddingVertical: 8,
                        }}
                    >
                        <Text style={{ color: AuthColors.white, fontWeight: '700', fontSize: 13 }}>
                            Retry
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Empty */}
            {!loading && !error && schedules.length === 0 && (
                <View style={{ marginTop: 48, alignItems: 'center' }}>
                    <Text style={{ color: AuthColors.dark, opacity: 0.45, fontSize: 14 }}>
                        No schedules found.
                    </Text>
                </View>
            )}

            {/* Schedule cards grid */}
            {!loading && !error && schedules.length > 0 && (
                <View className="flex-row flex-wrap justify-between">
                    {schedules.map((schedule) => (
                        <View key={schedule.assignment_id} className="w-full md:w-[49%]">
                            <ScheduleCard schedule={schedule} />
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}