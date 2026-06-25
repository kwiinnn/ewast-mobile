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
    
    useEffect(() => {
        let map: any;

        import('maplibre-gl').then(({ Map }) => {
            if (!containerRef.current || mapRef.current) return;

            map = new Map({
                container: containerRef.current,
                style: 'https://tiles.openfreemap.org/styles/liberty',
                center: DAVAO,
                zoom: 10,
                attributionControl: false,
            });

            mapRef.current = map;
        });

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);
    
    return (
        <div
            ref={containerRef}
            style={{ width: '100%', height: '100%' }}
        />
  );
}

export default function AdminHeatmap() {
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
            console.log(data[0].name);
            setState({ status: "success", payload: data });
        } catch (error) {
            setState({ status: "error", message: error });
        }
    };

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
                <View className="w-1/2" style={{ height: 400 }}>
                    <WebMap>
                    </WebMap>
                </View>
            )}
        </>
    );
}