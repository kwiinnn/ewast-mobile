import BackIcon from '@/assets/icons/back.svg';
import { AuthColors } from '@/constants/auth-colors';
import * as MapLibre from '@maplibre/maplibre-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

export default function RoutesScreen() {
    const router = useRouter();
    const { barangay, date } = useLocalSearchParams<{ barangay: string; date: string }>();
    const cameraRef = useRef<React.ElementRef<typeof Camera>>(null);

    return (
        <View style={styles.container}>
            {/* Full-screen Map */}
            <MapLibre.Map
                style={styles.map}
                mapStyle={MAP_STYLE}
                attributionEnabled={false}
                compassEnabled={false}
            >
                <MapLibre.Camera
                    ref={cameraRef}
                    zoom={14}
                    center={[125.5406, 7.0498]}
                    easing="fly"
                    duration={2000}
                />
            </MapLibre.Map>

            {/* Header Overlay */}
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
                    <Text style={styles.routeDate}>{date ?? '06/26/2026'}</Text>
                </View>
            </View>

            {/* Track Live Button */}
            <View style={styles.trackButtonContainer}>
                <TouchableOpacity
                    style={styles.trackButton}
                    activeOpacity={0.85}
                    onPress={() => { /* TODO: implement live tracking */ }}
                >
                    <Text style={styles.trackButtonText}>Track Live</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
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
    headerText: {
        gap: 2,
    },
    routeTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: AuthColors.dark,
    },
    routeDate: {
        fontSize: 13,
        fontWeight: '400',
        color: AuthColors.dark,
        opacity: 0.7,
    },
    trackButtonContainer: {
        position: 'absolute',
        top: 104,
        right: 16,
    },
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
    trackButtonText: {
        color: AuthColors.white,
        fontSize: 14,
        fontWeight: '700',
    },
});