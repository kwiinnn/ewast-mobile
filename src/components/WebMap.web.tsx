import { useEffect, useRef } from 'react';

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

interface Props {
    center: [number, number];
    zoom: number;
    onCoordinatesChange?: (coords: [number, number]) => void;
}

export default function WebMap({ center, zoom, onCoordinatesChange }: Props) {
    const containerRef = useRef<any>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        import('maplibre-gl').then(({ Map, Marker }) => {
            if (!containerRef.current || mapRef.current) return;
            const map = new Map({
                container: containerRef.current,
                style: MAP_STYLE,
                center,
                zoom,
                attributionControl: false,
            });
            mapRef.current = map;

            if (onCoordinatesChange) {
                const el = document.createElement('div');
                el.style.cssText = 'width:20px;height:20px;border-radius:50%;background:#16A637;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);cursor:pointer';
                const marker = new Marker({ element: el, draggable: true })
                    .setLngLat(center)
                    .addTo(map);
                markerRef.current = marker;

                marker.on('dragend', () => {
                    const { lng, lat } = marker.getLngLat();
                    onCoordinatesChange([lng, lat]);
                });
                map.on('click', (e: any) => {
                    const { lng, lat } = e.lngLat;
                    marker.setLngLat([lng, lat]);
                    onCoordinatesChange([lng, lat]);
                });
            }
        });
        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        markerRef.current?.setLngLat(center);
    }, [center]);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    );
}