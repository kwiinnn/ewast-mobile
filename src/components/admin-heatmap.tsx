import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export interface BoundaryProperties {
  id: string | number;
  name: string;
  [key: string]: unknown;
}

interface PopupInfo {
  properties: BoundaryProperties;
  lngLat: [number, number];
}

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; payload: JSON };

const DAVAO: [number, number] = [125.6010, 7.0650];

function WebMap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const popupRef = useRef<any>(null);
    const [state, setState] = useState<FetchState>({status: "loading"});
    const [popup, setPopup] = useState<PopupInfo | null>(null);

    useEffect(()=>{
        getBarangayInfo();
    }, []);

    const getBarangayInfo = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/barangays/geojson', {
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

        import('maplibre-gl').then(({ Map, Popup }) => {
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
                state.payload.forEach((barangay_info) => {
                    console.log(`${barangay_info.barangay_name}, ${barangay_info.geojson}`);
                    map.addSource(barangay_info.barangay_name, { type: 'geojson', data: barangay_info.geojson});

                    const fillColor: string = "#3D7EFF";
                    const fillOpacity: number = 0.2;
                    const strokeColor: string = "#1A56CC"
                    const strokeWidth: number = 1;

                    map.addLayer({
                        id: `${barangay_info.barangay_name}-fill`,
                        type: 'fill',
                        source: barangay_info.barangay_name,
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

                    map.addLayer({
                        id: `${barangay_info.barangay_name}-stroke`,
                        type: 'line',
                        source: barangay_info.barangay_name,
                        paint: {
                            'line-color': strokeColor,
                            'line-width': [
                                'case',
                                ['boolean', ['feature-state', 'hover'], false],
                                strokeWidth * 2,    // thicker on hover
                                strokeWidth,
                            ],
                        },
                    });

                    map.on('click', `${barangay_info.barangay_name}-fill`, (e: any) => {
                        if (!e.features?.length) return;

                        if (popupRef.current) {
                            popupRef.current.remove();
                        }

                        console.log(`I clicked ${barangay_info.barangay_name}`);

                        const feature = e.features[0];
                        
                        popupRef.current = new Popup({ closeOnClick: true })
                            .setLngLat(e.lngLat)
                            .setHTML(`<div><h4 class=\"font-bold\">${barangay_info.barangay_name}</h4>Test</div>`)
                            .addTo(map);
                    });

                    map.on('mouseenter', `${barangay_info.barangay_name}-fill`, () => {
                            map.getCanvas().style.cursor = 'pointer';
                        });

                    map.on('mouseleave', `${barangay_info.barangay_name}-fill`, () => {
                        map.getCanvas().style.cursor = '';
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