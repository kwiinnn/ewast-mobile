import BackIcon from '@/assets/icons/back.svg';
import WebMap from '@/components/WebMap'; // ← bundler picks .web.tsx or .tsx automatically
import { AuthColors } from '@/constants/auth-colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Barangay {
    barangay_id: number;
    name: string;
    bounds_coords: [number, number][];
}

interface Route {
    route_id: number;
    /** Each waypoint is [longitude, latitude] per the API */
    waypoints: [number, number][];
    is_approved: boolean;
    collection_rate: number;
    for_barangay_id: number;
    est_fuel_cost: number;
    date_approved: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? ''; // adjust if your base URL differs
const DEFAULT_CENTER: [number, number] = [125.5406, 7.0498]; // Mintal, Davao
const DEFAULT_ZOOM = 14;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Compute the geographic centroid of a waypoint list so the map centres on
 * the route rather than on a hard-coded coordinate.
 */
function centroidOf(waypoints: [number, number][]): [number, number] {
    if (!waypoints.length) return DEFAULT_CENTER;
    const sumLng = waypoints.reduce((s, w) => s + w[0], 0);
    const sumLat = waypoints.reduce((s, w) => s + w[1], 0);
    return [sumLng / waypoints.length, sumLat / waypoints.length];
}

/**
 * Pick the most efficient route from a list:
 * - Prefer approved routes.
 * - Among ties, pick the one with the highest collection_rate.
 * - Fall back to lowest est_fuel_cost.
 */
function pickBestRoute(routes: Route[]): Route | null {
    if (!routes.length) return null;
    const approved = routes.filter((r) => r.is_approved);
    const pool = approved.length ? approved : routes;
    return pool.reduce((best, r) => {
        if (r.collection_rate > best.collection_rate) return r;
        if (r.collection_rate === best.collection_rate && r.est_fuel_cost < best.est_fuel_cost)
            return r;
        return best;
    });
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function RoutesScreen() {
    const router = useRouter();
    const { barangay, date, barangay_id: barangayIdParam } =
        useLocalSearchParams<{ barangay: string; date: string; barangay_id?: string }>();

    // ── State ──────────────────────────────────────────────────────────────────
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeRoute, setActiveRoute] = useState<Route | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
    const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
    const [routesLoaded, setRoutesLoaded] = useState(false);

    // Keep a stable ref to the WebMap so we can imperatively pass the polyline
    // via the mapRef pattern your WebMap component likely supports.
    const mapRef = useRef<any>(null);

    // ── Data fetching ─────────────────────────────────────────────────────────

    /**
     * Resolve the barangay_id from either the navigation param directly
     * (fastest) or by querying GET /api/barangays and matching by name.
     */
    async function resolveBarangayId(): Promise<number | null> {
        // If the caller already passed barangay_id, use it directly.
        if (barangayIdParam) return Number(barangayIdParam);

        const res = await fetch(`${BASE_URL}/api/barangays?limit=100`);
        if (!res.ok) throw new Error(`Failed to fetch barangays (${res.status})`);
        const list: Barangay[] = await res.json();

        const match = list.find(
            (b) => b.name.toLowerCase() === (barangay ?? '').toLowerCase()
        );
        return match?.barangay_id ?? null;
    }

    /**
     * Fetch all routes for a barangay and pick the most efficient one.
     * Strategy:
     *  1. Try GET /api/routes/trip/barangay/{id}   – returns the active trip route.
     *  2. Fall back to GET /api/routes/suggest      – returns AI-suggested routes,
     *     filter by for_barangay_id, then pick the best.
     *  3. Last resort: GET /api/routes             – filter by for_barangay_id.
     */
    async function fetchBestRoute(barangayId: number): Promise<Route | null> {
        // 1. Active trip route for this barangay
        try {
            const tripRes = await fetch(
                `${BASE_URL}/api/routes/trip/barangay/${barangayId}`
            );
            if (tripRes.ok) {
                const tripRoutes: Route[] = await tripRes.json();
                const best = pickBestRoute(tripRoutes);
                if (best) return best;
            }
        } catch {
            // fall through
        }

        // 2. Suggested routes
        try {
            const suggestRes = await fetch(`${BASE_URL}/api/routes/suggest?limit=100`);
            if (suggestRes.ok) {
                const suggested: Route[] = await suggestRes.json();
                const forBarangay = suggested.filter(
                    (r) => r.for_barangay_id === barangayId
                );
                const best = pickBestRoute(forBarangay);
                if (best) return best;
            }
        } catch {
            // fall through
        }

        // 3. All routes fallback
        const allRes = await fetch(`${BASE_URL}/api/routes?limit=100`);
        if (!allRes.ok) throw new Error(`Failed to fetch routes (${allRes.status})`);
        const all: Route[] = await allRes.json();
        const forBarangay = all.filter((r) => r.for_barangay_id === barangayId);
        return pickBestRoute(forBarangay);
    }

    // ── Show Routes handler ───────────────────────────────────────────────────

    async function handleShowRoutes() {
        try {
            setLoading(true);
            setError(null);

            const barangayId = await resolveBarangayId();
            if (barangayId === null) {
                setError(`No barangay found for "${barangay ?? 'this area'}".`);
                return;
            }

            const best = await fetchBestRoute(barangayId);
            if (!best || !best.waypoints?.length) {
                setError('No routes available for this barangay yet.');
                return;
            }

            setActiveRoute(best);

            // Centre the map on the route centroid
            const center = centroidOf(best.waypoints);
            setMapCenter(center);
            setMapZoom(15);
            setRoutesLoaded(true);
        } catch (err: any) {
            setError(err?.message ?? 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────

    const displayDate = date ?? new Date().toLocaleDateString('en-US');

    return (
        <View style={styles.container}>
            {/* Full-screen map */}
            <View style={StyleSheet.absoluteFill}>
                <WebMap
                    ref={mapRef}
                    center={mapCenter}
                    zoom={mapZoom}
                    // Pass waypoints as a polyline; WebMap should render it as a
                    // green directional line when waypoints are provided.
                    // Waypoints from the API are [lng, lat]; pass as-is if your
                    // WebMap expects [lng, lat], or swap if it expects [lat, lng].
                    routeWaypoints={activeRoute?.waypoints ?? []}
                    routeColor={AuthColors.green}
                />
            </View>

            {/* ── Header Overlay ────────────────────────────────────────────── */}
            <View style={styles.headerOverlay}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                >
                    <BackIcon width={22} height={22} color={AuthColors.white} />
                </TouchableOpacity>
                <View style={styles.headerText}>
                    <Text style={styles.routeTitle}>
                        Route for {barangay ?? 'Mintal'}
                    </Text>
                    <Text style={styles.routeDate}>{displayDate}</Text>
                </View>
            </View>

            {/* ── Track Live Button ─────────────────────────────────────────── */}
            <View style={styles.trackButtonContainer}>
                <TouchableOpacity
                    style={styles.trackButton}
                    activeOpacity={0.85}
                    onPress={() => {
                        /* TODO: live tracking */
                    }}
                >
                    <Text style={styles.trackButtonText}>Track Live</Text>
                </TouchableOpacity>
            </View>

            {/* ── Route Info Card (shown after routes load) ─────────────────── */}
            {activeRoute && (
                <View style={styles.routeInfoCard}>
                    <View style={styles.routeInfoRow}>
                        <View style={styles.routeInfoItem}>
                            <Text style={styles.routeInfoLabel}>Collection Rate</Text>
                            <Text style={styles.routeInfoValue}>
                                {(activeRoute.collection_rate * 100).toFixed(0)}%
                            </Text>
                        </View>
                        <View style={styles.routeInfoDivider} />
                        <View style={styles.routeInfoItem}>
                            <Text style={styles.routeInfoLabel}>Est. Fuel Cost</Text>
                            <Text style={styles.routeInfoValue}>
                                ₱{activeRoute.est_fuel_cost.toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.routeInfoDivider} />
                        <View style={styles.routeInfoItem}>
                            <Text style={styles.routeInfoLabel}>Status</Text>
                            <Text
                                style={[
                                    styles.routeInfoValue,
                                    activeRoute.is_approved
                                        ? styles.statusApproved
                                        : styles.statusPending,
                                ]}
                            >
                                {activeRoute.is_approved ? 'Approved' : 'Pending'}
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            {/* ── Show Routes / loading / error button ──────────────────────── */}
            {!routesLoaded && (
                <View style={styles.showRoutesContainer}>
                    {error ? (
                        <View style={styles.errorBanner}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity
                                style={styles.retryButton}
                                onPress={handleShowRoutes}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.retryText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[
                                styles.showRoutesButton,
                                loading && styles.showRoutesButtonDisabled,
                            ]}
                            onPress={handleShowRoutes}
                            activeOpacity={0.85}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={AuthColors.white} size="small" />
                            ) : (
                                <Text style={styles.showRoutesText}>Show Routes</Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    headerOverlay: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 14,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: AuthColors.green,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: { gap: 2 },
    routeTitle: { fontSize: 16, fontWeight: '700', color: AuthColors.dark },
    routeDate: {
        fontSize: 13,
        fontWeight: '400',
        color: AuthColors.dark,
        opacity: 0.7,
    },

    // Track Live
    trackButtonContainer: { position: 'absolute', top: 104, right: 16 },
    trackButton: {
        backgroundColor: AuthColors.green,
        borderRadius: 999,
        paddingHorizontal: 22,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    trackButtonText: { color: AuthColors.white, fontSize: 14, fontWeight: '700' },

    // Route info card (bottom)
    routeInfoCard: {
        position: 'absolute',
        bottom: 32,
        left: 16,
        right: 16,
        backgroundColor: 'rgba(255,255,255,0.97)',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 6,
    },
    routeInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    routeInfoItem: { flex: 1, alignItems: 'center', gap: 2 },
    routeInfoDivider: {
        width: 1,
        height: 32,
        backgroundColor: '#E5E7EB',
    },
    routeInfoLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    routeInfoValue: {
        fontSize: 16,
        fontWeight: '700',
        color: AuthColors.dark,
    },
    statusApproved: { color: '#16A34A' },
    statusPending: { color: '#D97706' },

    // Show Routes button
    showRoutesContainer: {
        position: 'absolute',
        bottom: 32,
        left: 16,
        right: 16,
    },
    showRoutesButton: {
        backgroundColor: AuthColors.green,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 6,
    },
    showRoutesButtonDisabled: {
        opacity: 0.7,
    },
    showRoutesText: {
        color: AuthColors.white,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    // Error state
    errorBanner: {
        backgroundColor: 'rgba(255,255,255,0.97)',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 5,
    },
    errorText: {
        fontSize: 14,
        color: '#DC2626',
        fontWeight: '500',
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: AuthColors.green,
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    retryText: { color: AuthColors.white, fontSize: 14, fontWeight: '700' },
});