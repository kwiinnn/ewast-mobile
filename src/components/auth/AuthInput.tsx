import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import { SvgProps } from 'react-native-svg';
import EyeCloseIcon from '@/assets/icons/eye-close.svg';
import EyeOpenIcon from '@/assets/icons/eye-open.svg';
import { AuthColors } from '@/constants/auth-colors';

// ─── Props ───────────────────────────────────────────────────────────────────

interface AuthInputProps {
    /** Optional label shown above the input. When omitted, uses larger bottom margin. */
    label?: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    /** Error text shown next to the label (or ignored if no label) */
    error?: string;
    /** SVG icon component rendered on the left side of the input */
    Icon: React.FC<SvgProps>;
    /** When true, hides text and shows an eye toggle button */
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address';
    autoCapitalize?: 'none' | 'sentences' | 'words';
    returnKeyType?: 'next' | 'done' | 'default';
    onSubmitEditing?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AuthInput({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    Icon,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    returnKeyType = 'default',
    onSubmitEditing,
}: AuthInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={{ marginBottom: label ? 16 : 32 }}>
            {/* Optional label row with error */}
            {label && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontFamily: 'StackSans-Text', fontSize: 13, color: AuthColors.green }}>
                        {label}
                    </Text>
                    {error ? (
                        <Text style={{ fontFamily: 'StackSans-Text', fontSize: 13, color: AuthColors.errorText }}>
                            {error}
                        </Text>
                    ) : null}
                </View>
            )}

            {/* Input row */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1.5,
                    borderColor: error ? AuthColors.errorText : AuthColors.dark,
                    borderRadius: 50,
                    paddingHorizontal: 20,
                    height: 52,
                    backgroundColor: AuthColors.field,
                }}
            >
                <Icon width={18} height={18} color={AuthColors.placeholder} fill={AuthColors.placeholder} />
                <TextInput
                    className="border-none outline-none"
                    style={{
                        flex: 1,
                        marginLeft: 12,
                        fontFamily: 'StackSans-Text',
                        fontSize: 14,
                        color: AuthColors.dark,
                    }}
                    placeholder={placeholder}
                    placeholderTextColor={AuthColors.placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry && !showPassword}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={() => setShowPassword((v) => !v)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? (
                            <EyeOpenIcon width={20} height={20} color={AuthColors.placeholder} fill={AuthColors.placeholder} />
                        ) : (
                            <EyeCloseIcon width={20} height={20} color={AuthColors.placeholder} fill={AuthColors.placeholder} />
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
