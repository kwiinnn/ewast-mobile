import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; payload: JSON };

const DAVAO: [number, number] = [125.6010, 7.0650];

function WebMap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const [state, setState] = useState<FetchState>({status: "loading"});

    useEffect(()=>{
        getBarangayInfo();
    }, []);

    const getBarangayInfo = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/barangays', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

            const data = await response.json();

            setState({ status: "success", payload: data });
        } catch (error) {
            setState({ status: "error", message: error });
        }
    };
    
    useEffect(() => {
        let map: any;

        import('maplibre-gl').then(({ Map }) => {
            if (!containerRef.current || mapRef.current) return;

            const map = new Map({
                container: containerRef.current,
                style: 'https://tiles.openfreemap.org/styles/liberty',
                center: DAVAO,
                zoom: 10,
                attributionControl: false,
            });

            mapRef.current = map;

            map.on('load', () => {
                state.payload.forEach((barangay_data) => {
                    const curr_geojson = {
                        type: 'FeatureCollection',
                        features: [
                            {
                            type: 'Feature',
                            properties: {
                                id: barangay_data.name,
                                name: barangay_data.name,
                            },
                            geometry: {
                                type: 'Polygon',
                                coordinates: [barangay_data.bounds_coords.map(([lat, lng]) => [lng, lat])], // wrap in an extra array
                            },
                            },
                        ],
                    };

                    map.addSource(barangay_data.name, { type: 'geojson', data: curr_geojson});

                    const fillColor: string = "#3D7EFF";
                    const fillOpacity: number = 0.2;

                    map.addLayer({
                        id: `${barangay_data.name}-fill`,
                        type: 'fill',
                        source: barangay_data.name,
                        paint: {
                            'fill-color': fillColor,
                            'fill-opacity': [
                                'case',
                                ['boolean', ['feature-state', 'hover'], false],
                                fillOpacity * 2.5,  // brighter on hover
                                fillOpacity,
                            ],
                        },
                    });
                });
            });
        });

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);
    
    return (
        <>
            {/* Loading */}
            {state.status === "loading" && (
                <View className="py-10 items-center">
                <ActivityIndicator size="small" color="#6b7280" />
                <Text className="font-normal text-sm text-gray-400 mt-2">Loading...</Text>
                </View>
            )}

            {/* Error */}
            {state.status === "error" && (
                <>
                    <Text>Error</Text>
                </>
            )}

            {state.status === "success" && (
                <div
                    ref={containerRef}
                    style={{ width: '100%', height: '100%' }}
                />
            )}
        </>
  );
}

export default function AdminHeatmap() {
    return (
        <View className="w-1/2 rounded-2xl border border-[#DAD0D0] overflow-hidden" style={{ height: 400 }}>
            <WebMap>
            </WebMap>
        </View>
    );
}