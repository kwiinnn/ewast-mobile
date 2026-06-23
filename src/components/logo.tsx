import { Image, Text, View, ViewStyle } from 'react-native';

// The bin icon was originally an SVG wrapping an embedded raster image
// (a <pattern>/<image> hack, not real vector paths). Using the extracted
// PNG directly via <Image> avoids the react-native-svg remount/clipping bug.
import BinIcon from '../../assets/LogoIcon.png';

interface ScalableLogoProps {
    height?: number;
    className?: string;
    style?: ViewStyle;
    textColor?: string;
    fontFamily?: string;
}

export default function Logo({
    height = 60,
    className = '',
    style,
    textColor = '#233329', // matches COLOR.dark from your design tokens
    fontFamily = 'StackSans-Headline',
}: ScalableLogoProps) {
    // --- SCALING MATHEMATICS ---
    // 1. The Trash Bin is square, so its width matches its height.
    const iconSize = height;

    // 2. Scale the text size down slightly (65% of total height) for a balanced look.
    const textHeight = height * 0.65;

    // 3. Calculate a proportional gap between the bin and text (15% of height)
    const gap = height * 0.025;

    return (
        <View
            className={`flex-row items-center justify-center ${className}`}
            style={[{ height: height }, style]}
        >
            {/* 1. THE TRASH BIN ICON */}
            <Image
                source={BinIcon}
                resizeMode="contain"
                style={{ width: iconSize, height: iconSize, marginRight: gap }}
            />

            {/* 2. THE LOGO TEXT */}
            <Text
                style={{
                    fontSize: textHeight,
                    lineHeight: textHeight * 1.05,
                    color: textColor,
                    fontFamily,
                    letterSpacing: textHeight * 0.04,
                }}
            >
                EWAST
            </Text>
        </View>
    );
}
