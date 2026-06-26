import { Camera, Map, MarkerView } from '@maplibre/maplibre-react-native';
import { StyleSheet, View } from 'react-native';

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

interface Props {
    center: [number, number];
    zoom: number;
    onCoordinatesChange?: (coords: [number, number]) => void;
}

export default function WebMap({ center, zoom, onCoordinatesChange }: Props) {
    return (
        <Map
            style={styles.map}
            mapStyle={MAP_STYLE}
            attributionEnabled={false}
            compassEnabled={false}
            onPress={onCoordinatesChange
                ? (e: any) => {
                    const { coordinates } = e.geometry;
                    onCoordinatesChange([coordinates[0], coordinates[1]]);
                }
                : undefined
            }
        >
            <Camera zoom={zoom} centerCoordinate={center} />
            {onCoordinatesChange && (
                <MarkerView coordinate={center}>
                    <View style={styles.marker} />
                </MarkerView>
            )}
        </Map>
    );
}

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
});