import React from 'react';
import { TouchableOpacity } from 'react-native';
import BackIcon from "../../assets/icons/back.svg";

interface BackButtonProps {
    /** Custom navigation or action handler when the button is pressed */
    onBack?: () => void;
    /** Optional extra Tailwind classes to override or add styles dynamically */
    className?: string;
}

const COLOR = {
    green: "#16A637",
};

export const BackButton: React.FC<BackButtonProps> = ({ onBack, className = '' }) => {
    return (
        <TouchableOpacity
            onPress={() => onBack?.()}
            // Replaced inline styles with Tailwind 'bg-emerald-600' (or use your preferred green)
            className={`w-10 h-10 rounded-lg items-center justify-center mr-3 ${className}`}
            style={{backgroundColor: COLOR.green}}
            accessibilityLabel="Go back"
            accessibilityRole="button"
        >
            {/* Keeping your direct SVG fix intact */}
            <BackIcon width={30} height={30} color="#FFFFFF" fill="#FFFFFF" />
        </TouchableOpacity>
    );
};