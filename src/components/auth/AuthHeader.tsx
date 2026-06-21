import React from 'react';
import { Text, View } from 'react-native';
import { BackButton } from '@/components/backbutton';
import { AuthColors } from '@/constants/auth-colors';

// ─── Props ───────────────────────────────────────────────────────────────────

interface AuthHeaderProps {
    /** Screen title displayed next to the back button (e.g. "LOG-IN", "CREATE ACCOUNT") */
    title: string;
    /** Called when the back button is pressed */
    onBack: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AuthHeader({ title, onBack }: AuthHeaderProps) {
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 16,
                backgroundColor: AuthColors.background,
            }}
        >
            <BackButton onBack={onBack} />
            <Text
                style={{
                    fontSize: 20,
                    color: AuthColors.dark,
                    fontFamily: 'StackSans-Headline',
                    letterSpacing: 2,
                }}
            >
                {title}
            </Text>
        </View>
    );
}
