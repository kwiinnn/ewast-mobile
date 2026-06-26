import { forwardRef, useEffect, useRef } from 'react';

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

interface Props {
    center: [number, number];
    zoom: number;
    onCoordinatesChange?: (coords: [number, number]) => void;
    /** Ordered [lng, lat] pairs from the API. When provided a green route
     *  polyline with directional arrows is drawn and the map flies to it. */
    routeWaypoints?: [number, number][];
    routeColor?: string;
}

/** GeoJSON LineString FeatureCollection from ordered waypoints. */
function buildLineGeoJSON(waypoints: [number, number][]) {
    return {
        type: 'FeatureCollection' as const,
        features: [
            {
                type: 'Feature' as const,
                geometry: { type: 'LineString' as const, coordinates: waypoints },
                properties: {},
            },
        ],
    };
}

/**
 * One Point feature per segment midpoint, carrying a `bearing` property
 * used to rotate the arrow icon so it always points in the travel direction.
 */
function buildArrowGeoJSON(waypoints: [number, number][]) {
    const features: any[] = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
        const [x0, y0] = waypoints[i];
        const [x1, y1] = waypoints[i + 1];
        const bearing = (Math.atan2(x1 - x0, y1 - y0) * 180) / Math.PI;
        features.push({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [(x0 + x1) / 2, (y0 + y1) / 2] },
            properties: { bearing },
        });
    }
    return { type: 'FeatureCollection' as const, features };
}

/** Compute the bounding box [[minLng,minLat],[maxLng,maxLat]] of a waypoint list. */
function waypointBounds(waypoints: [number, number][]): [[number, number], [number, number]] {
    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
    for (const [lng, lat] of waypoints) {
        if (lng < minLng) minLng = lng;
        if (lat < minLat) minLat = lat;
        if (lng > maxLng) maxLng = lng;
        if (lat > maxLat) maxLat = lat;
    }
    return [[minLng, minLat], [maxLng, maxLat]];
}

/** Add or update a maplibre-gl source. */
function upsertSource(map: any, id: string, data: any) {
    const src = map.getSource(id);
    if (src) {
        src.setData(data);
    } else {
        map.addSource(id, { type: 'geojson', data });
    }
}

/** Add a layer only if it doesn't already exist. */
function addLayerOnce(map: any, layer: any) {
    if (!map.getLayer(layer.id)) map.addLayer(layer);
}

const WebMap = forwardRef<any, Props>(function WebMap({
    center,
    zoom,
    onCoordinatesChange,
    routeWaypoints = [],
    routeColor = '#16A637',
}, _ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    // Keep a ref so the route-drawing effect can always see the latest prop
    const routeRef = useRef(routeWaypoints);
    routeRef.current = routeWaypoints;

    // ── Initialise the map once ──────────────────────────────────────────────
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

            // Click-to-place marker (only when onCoordinatesChange is supplied)
            if (onCoordinatesChange) {
                const el = document.createElement('div');
                el.style.cssText =
                    'width:20px;height:20px;border-radius:50%;background:#16A637;' +
                    'border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);cursor:pointer';
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

            // Draw route if waypoints were already set before the map mounted
            map.on('load', () => drawRoute(map, routeRef.current, routeColor));
        });

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Re-draw whenever routeWaypoints changes ──────────────────────────────
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        // Wait until the map style is fully loaded before touching sources/layers
        if (map.isStyleLoaded()) {
            drawRoute(map, routeWaypoints, routeColor);
        } else {
            map.once('load', () => drawRoute(map, routeWaypoints, routeColor));
        }
    }, [routeWaypoints, routeColor]);

    // ── Sync center when prop changes (and no route is active) ──────────────
    useEffect(() => {
        markerRef.current?.setLngLat(center);
    }, [center]);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
});

export default WebMap;

// ── Route drawing helper (runs after map style loads) ───────────────────────

function drawRoute(map: any, waypoints: [number, number][], routeColor: string) {
    if (!waypoints || waypoints.length < 2) {
        // Clear any previously drawn route
        ['route-arrows', 'route-line', 'route-casing'].forEach((id) => {
            if (map.getLayer(id)) map.removeLayer(id);
        });
        ['route-arrows-src', 'route-line-src'].forEach((id) => {
            if (map.getSource(id)) map.removeSource(id);
        });
        return;
    }

    // ── Sources ─────────────────────────────────────────────────────────────
    upsertSource(map, 'route-line-src', buildLineGeoJSON(waypoints));
    upsertSource(map, 'route-arrows-src', buildArrowGeoJSON(waypoints));

    // ── White casing (makes line pop on light basemap) ───────────────────────
    addLayerOnce(map, {
        id: 'route-casing',
        type: 'line',
        source: 'route-line-src',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#ffffff', 'line-width': 10 },
    });

    // ── Green route line ─────────────────────────────────────────────────────
    addLayerOnce(map, {
        id: 'route-line',
        type: 'line',
        source: 'route-line-src',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': routeColor, 'line-width': 6 },
    });

    // ── Directional arrows ───────────────────────────────────────────────────
    // We draw a filled triangle SVG as a data-URI so we don't depend on the
    // sprite sheet having an arrow glyph.
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <polygon points="10,1 19,19 10,14 1,19" fill="white"/>
    </svg>`;
    const arrowDataUrl = 'data:image/svg+xml;base64,' + btoa(svg);

    const addArrowLayer = () => {
        addLayerOnce(map, {
            id: 'route-arrows',
            type: 'symbol',
            source: 'route-arrows-src',
            layout: {
                'icon-image': 'route-arrow',
                'icon-size': 0.9,
                'icon-rotate': ['get', 'bearing'],
                'icon-rotation-alignment': 'map',
                'icon-allow-overlap': true,
                'icon-ignore-placement': true,
            },
        });
    };

    // Load the arrow image only once; reuse on subsequent calls
    if (!map.hasImage('route-arrow')) {
        const img = new Image(20, 20);
        img.onload = () => {
            if (!map.hasImage('route-arrow')) map.addImage('route-arrow', img);
            addArrowLayer();
        };
        img.src = arrowDataUrl;
    } else {
        addArrowLayer();
    }

    // ── Fly the map to fit the whole route ───────────────────────────────────
    const bounds = waypointBounds(waypoints);
    map.fitBounds(bounds, { padding: 60, duration: 800 });
}