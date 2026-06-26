import {
    Camera,
    LineLayer,
    Map,
    MarkerView,
    ShapeSource,
    SymbolLayer,
} from '@maplibre/maplibre-react-native';
import { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

interface Props {
    center: [number, number];
    zoom: number;
    onCoordinatesChange?: (coords: [number, number]) => void;
    /** Ordered [lng, lat] pairs from the API. When provided a green route
     *  polyline with directional arrows is drawn on the map. */
    routeWaypoints?: [number, number][];
    routeColor?: string;
}

/** Build a GeoJSON FeatureCollection with one LineString from waypoints. */
function buildLineGeoJSON(waypoints: [number, number][]) {
    return {
        type: 'FeatureCollection' as const,
        features: [
            {
                type: 'Feature' as const,
                geometry: {
                    type: 'LineString' as const,
                    coordinates: waypoints,
                },
                properties: {},
            },
        ],
    };
}

/**
 * Build point features at the midpoint of each segment so we can place
 * arrow icons along the route without clustering at dense vertices.
 */
function buildArrowGeoJSON(waypoints: [number, number][]) {
    const features: any[] = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
        const [x0, y0] = waypoints[i];
        const [x1, y1] = waypoints[i + 1];
        // Bearing in degrees (screen-space, good enough for short segments)
        const bearing =
            (Math.atan2(x1 - x0, y1 - y0) * 180) / Math.PI;
        features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                // Midpoint of the segment
                coordinates: [(x0 + x1) / 2, (y0 + y1) / 2],
            },
            properties: { bearing },
        });
    }
    return { type: 'FeatureCollection' as const, features };
}

const WebMap = forwardRef<any, Props>(function WebMap({
    center,
    zoom,
    onCoordinatesChange,
    routeWaypoints = [],
    routeColor = '#16A637',
}, _ref) {
    const hasRoute = routeWaypoints.length >= 2;

    return (
        <Map
            style={styles.map}
            mapStyle={MAP_STYLE}
            attributionEnabled={false}
            compassEnabled={false}
            onPress={
                onCoordinatesChange
                    ? (e: any) => {
                          const { coordinates } = e.geometry;
                          onCoordinatesChange([coordinates[0], coordinates[1]]);
                      }
                    : undefined
            }
        >
            <Camera zoom={zoom} centerCoordinate={center} animationDuration={600} />

            {/* ── Route polyline ──────────────────────────────────────────── */}
            {hasRoute && (
                <>
                    {/* Thick white casing for contrast */}
                    <ShapeSource id="routeCasing" shape={buildLineGeoJSON(routeWaypoints)}>
                        <LineLayer
                            id="routeCasingLayer"
                            style={{
                                lineColor: '#ffffff',
                                lineWidth: 10,
                                lineCap: 'round',
                                lineJoin: 'round',
                            }}
                        />
                    </ShapeSource>

                    {/* Green route line */}
                    <ShapeSource id="routeLine" shape={buildLineGeoJSON(routeWaypoints)}>
                        <LineLayer
                            id="routeLineLayer"
                            style={{
                                lineColor: routeColor,
                                lineWidth: 6,
                                lineCap: 'round',
                                lineJoin: 'round',
                            }}
                        />
                    </ShapeSource>

                    {/* Directional arrows along each segment midpoint */}
                    <ShapeSource id="routeArrows" shape={buildArrowGeoJSON(routeWaypoints)}>
                        <SymbolLayer
                            id="routeArrowLayer"
                            style={{
                                iconImage: 'arrow',          // built-in sprite in openfreemap liberty
                                iconSize: 0.8,
                                iconRotate: ['get', 'bearing'],
                                iconRotationAlignment: 'map',
                                iconAllowOverlap: true,
                                iconIgnorePlacement: true,
                                iconColor: '#ffffff',
                            }}
                        />
                    </ShapeSource>

                    {/* Start marker */}
                    <MarkerView coordinate={routeWaypoints[0]}>
                        <View style={[styles.terminal, styles.startMarker]} />
                    </MarkerView>

                    {/* End marker */}
                    <MarkerView coordinate={routeWaypoints[routeWaypoints.length - 1]}>
                        <View style={[styles.terminal, styles.endMarker]} />
                    </MarkerView>
                </>
            )}

            {/* ── Click-to-place marker (used in other screens) ───────────── */}
            {onCoordinatesChange && (
                <MarkerView coordinate={center}>
                    <View style={styles.marker} />
                </MarkerView>
            )}
        </Map>
    );
});

export default WebMap;

const styles = StyleSheet.create({
    map: { flex: 1 },
    marker: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#16A637',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    terminal: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    startMarker: { backgroundColor: '#16A637' },
    endMarker: { backgroundColor: '#DC2626' },
});