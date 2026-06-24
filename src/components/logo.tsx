import { AuthColors } from '@/constants/auth-colors';
import { Text, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface LogoProps {
    height?: number;
    className?: string;
    style?: ViewStyle;
    textColor?: string;
}

// Original SVG viewBox dimensions
const SVG_WIDTH = 172.98991;
const SVG_HEIGHT = 199.77176;
const ASPECT_RATIO = SVG_WIDTH / SVG_HEIGHT;

export default function Logo({
    height = 90,
    className = '',
    style,
    textColor = "#233329",
}: LogoProps) {
    // --- SCALING MATHEMATICS ---
    // 1. Icon is sized to full height; width derived from SVG aspect ratio.
    const iconHeight = height;
    const iconWidth = iconHeight * ASPECT_RATIO;

    // 2. Scale the text size to 65% of total height for a balanced look.
    const textHeight = height * 0.65;

    // 3. Proportional gap between icon and text (2.5% of height).
    const gap = height * 0.05;

    // The original SVG uses translate(-21.890136,-84.83048) on the group,
    // so we shift the viewBox origin to match, exposing the full artwork.
    const vbX = 21.890136;
    const vbY = 84.83048;

    return (
        <View
            className={`flex-row items-center justify-center ${className}`}
            style={[{ height: iconHeight }, style]}
        >
            {/* 1. TRASH BIN ICON — rendered from inline SVG paths */}
            <Svg
                width={iconWidth}
                height={iconHeight}
                viewBox={`${vbX} ${vbY} ${SVG_WIDTH} ${SVG_HEIGHT}`}
                style={{ marginRight: gap }}
            >
                {/* Lid / top bar */}
                <Path
                    fill={AuthColors.dark}
                    strokeWidth={0}
                    d="M 95.581589,84.830481 A 15,15 0 0 0 80.581988,99.830082 H 41.917681 A 19.405187,19.405187 0 0 0 22.471839,119.19479 H 188.69167 A 19.364325,19.364325 0 0 0 169.32748,99.830082 H 130.58204 A 15,15 0 0 0 115.58192,84.830481 Z m 3.965132,7.216614 h 12.070069 a 9.052386,7.7834292 0 0 1 9.05216,7.782987 H 90.494561 a 9.052386,7.7834292 0 0 1 9.05216,-7.782987 z"
                    transform="translate(-0.58170274)"
                />

                {/* Bin body with vertical slots */}
                <Path
                    fill={AuthColors.dark}
                    strokeWidth={1.00007}
                    d="m 21.890137,126.45636 25.017077,141.87662 v 10e-4 c 0.0033,5.36423 25.911124,9.68261 58.092576,9.68261 7.27614,0 14.23171,-0.22056 20.63957,-0.62425 l -3.10265,-16.56591 -56.556758,-12.24008 4.285527,-1.23765 c -2.442225,-0.33319 -4.311882,-2.41711 -4.311882,-4.95371 v -89.99967 c 0,-2.77 2.229695,-5.00021 4.999695,-5.00021 2.77,0 5.000211,2.23021 5.000211,5.00021 v 89.99967 c 0,1.5363 -0.686271,2.90668 -1.769917,3.82251 l 25.6651,-7.4104 v -86.41178 c 0,-2.77 2.230214,-5.00021 5.000214,-5.00021 2.77,0 4.99969,2.23021 4.99969,5.00021 v 83.52462 l 23.89518,-6.89984 v -76.62478 c 0,-2.77 2.23022,-5.00021 5.00022,-5.00021 2.77,0 5.00021,2.23021 5.00021,5.00021 v 73.73762 l 28.22722,-8.15041 16.13855,-91.5262 z"
                />

                {/* Green recycling arrow accent */}
                <Path
                    fill={AuthColors.green}
                    strokeWidth={0}
                    d="m 195.02419,218.17024 -52.36347,43.49812 40.33165,12.62506 c 0,-0.79376 12.03182,-56.12318 12.03182,-56.12318 z m 0.003,-0.002 -108.46987,31.32057 43.59984,9.43455 z m -66.9189,46.04808 4.11619,21.98331 10.05616,-18.47561 z"
                    transform="translate(-0.1471237,-1.5973875)"
                />
            </Svg>

            {/* 2. LOGO TEXT */}
            <Text
                className="font-bold"
                style={{
                    fontSize: textHeight,
                    lineHeight: textHeight * 1.05,
                    color: textColor,
                    letterSpacing: textHeight * 0.04,
                }}
            >
                EWAST
            </Text>
        </View>
    );
}