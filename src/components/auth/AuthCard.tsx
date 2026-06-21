import React from 'react';
import { View, ViewStyle } from 'react-native';

// ─── Props ───────────────────────────────────────────────────────────────────

interface AuthCardProps {
    children: React.ReactNode;
    /** Additional styles merged onto the card container */
    style?: ViewStyle;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * White rounded card used as the main content surface in auth screens.
 * Provides consistent border-radius, padding, and shadow.
 */
export function AuthCard({ children, style }: AuthCardProps) {
    return (
        <View
            className="bg-white rounded-[32px] px-6 pt-10 pb-10 shadow-sm"
            style={[{ elevation: 2 }, style]}
        >
            {children}
        </View>
    );
}
