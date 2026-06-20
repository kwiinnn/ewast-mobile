import { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SvgUri } from "react-native-svg";

// ---------------------------------------------------------------------------
// Asset imports – adjust paths if your bundler resolves them differently
// ---------------------------------------------------------------------------
// SVG assets are imported as URI strings so SvgUri can render them.
// If you use a transformer like react-native-svg-transformer, swap these for
// direct `import Logo from "@/assets/logo.svg"` component imports instead.
const LOGO_URI = require("@/assets/logo.svg");
const BACK_URI = require("@/assets/icons/back.svg");
const MAIL_URI = require("@/assets/icons/mail.svg");
const LOCK_URI = require("@/assets/icons/lock.svg");
const EYE_OPEN_URI = require("@/assets/icons/eye-open.svg");
const EYE_CLOSE_URI = require("@/assets/icons/eye-close.svg");
const ERROR_URI = require("@/assets/icons/error.svg");

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const COLOR = {
    background: "#F5F7F5",
    dark: "#233329",
    white: "#FFFFFF",
    green: "#16A637",
    placeholder: "#C7CBD2",
    errorBg: "#FFEBEE",
    errorText: "#E53935",
};

// ---------------------------------------------------------------------------
// Tiny SVG wrapper (works with both require() and URI strings)
// ---------------------------------------------------------------------------
interface SvgIconProps {
    source: any;
    size?: number;
    color?: string;
}

function SvgIcon({ source, size = 20, color }: SvgIconProps) {
    // resolve the asset URI from require()
    const uri =
        typeof source === "string"
            ? source
            : Image.resolveAssetSource(source)?.uri;

    if (!uri) return null;
    return <SvgUri width={size} height={size} uri={uri} color={color} />;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface LoginScreenProps {
    /** Called when the user taps Login. Return a rejected Promise or throw to show an error. */
    onLogin?: (email: string, password: string) => Promise<void> | void;
    /** Called when user taps the back arrow */
    onBack?: () => void;
    /** Called when user taps Signup */
    onSignup?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function LoginScreen({
    onLogin,
    onBack,
    onSignup,
}: LoginScreenProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if (!email.trim() || !password) {
            setError("Invalid Username or Password");
            return;
        }
        setError(null);
        setLoading(true);
        try {
            await onLogin?.(email.trim(), password);
        } catch {
            setError("Invalid Username or Password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1" style={{ backgroundColor: COLOR.background }}>
            <StatusBar barStyle="dark-content" backgroundColor={COLOR.background} />

            {/* ── Header ───────────────────────────────────────────────────── */}
            <View
                className="flex-row items-center px-4 pt-12 pb-4"
                style={{ backgroundColor: COLOR.background }}
            >
                <TouchableOpacity
                    onPress={onBack}
                    className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                    style={{ backgroundColor: COLOR.green }}
                    accessibilityLabel="Go back"
                >
                    <SvgIcon source={BACK_URI} size={18} color={COLOR.white} />
                </TouchableOpacity>

                <Text
                    className="text-xl tracking-widest"
                    style={{
                        color: COLOR.dark,
                        fontFamily: "StackSans-Headline",
                        letterSpacing: 2,
                    }}
                >
                    LOG-IN
                </Text>
            </View>

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 px-5 py-4">

                        {/* ── Error banner ─────────────────────────────────────────── */}
                        {error && (
                            <View
                                className="flex-row items-center rounded-xl px-4 py-3 mb-5"
                                style={{ backgroundColor: COLOR.errorBg }}
                            >
                                <SvgIcon source={ERROR_URI} size={18} color={COLOR.errorText} />
                                <Text
                                    className="ml-2 text-sm flex-1"
                                    style={{
                                        color: COLOR.errorText,
                                        fontFamily: "StackSans-Text",
                                    }}
                                >
                                    Error! {error}
                                </Text>
                            </View>
                        )}

                        {/* ── Card ─────────────────────────────────────────────────── */}
                        <View
                            className="rounded-2xl px-6 pt-10 pb-8"
                            style={{
                                backgroundColor: COLOR.white,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.06,
                                shadowRadius: 12,
                                elevation: 3,
                            }}
                        >
                            {/* Logo */}
                            <View className="items-center mb-8">
                                <SvgIcon source={LOGO_URI} size={100} />
                            </View>

                            {/* Email field */}
                            <View
                                className="flex-row items-center rounded-full px-4 mb-4"
                                style={{
                                    borderWidth: 1.5,
                                    borderColor: COLOR.dark,
                                    height: 52,
                                }}
                            >
                                <SvgIcon source={MAIL_URI} size={18} color={COLOR.placeholder} />
                                <TextInput
                                    className="flex-1 ml-3 text-sm"
                                    style={{
                                        color: COLOR.dark,
                                        fontFamily: "StackSans-Text",
                                    }}
                                    placeholder="Email"
                                    placeholderTextColor={COLOR.placeholder}
                                    value={email}
                                    onChangeText={(t) => {
                                        setEmail(t);
                                        if (error) setError(null);
                                    }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType="next"
                                />
                            </View>

                            {/* Password field */}
                            <View
                                className="flex-row items-center rounded-full px-4 mb-6"
                                style={{
                                    borderWidth: 1.5,
                                    borderColor: COLOR.dark,
                                    height: 52,
                                }}
                            >
                                <SvgIcon source={LOCK_URI} size={18} color={COLOR.placeholder} />
                                <TextInput
                                    className="flex-1 ml-3 text-sm"
                                    style={{
                                        color: COLOR.dark,
                                        fontFamily: "StackSans-Text",
                                    }}
                                    placeholder="Password"
                                    placeholderTextColor={COLOR.placeholder}
                                    value={password}
                                    onChangeText={(t) => {
                                        setPassword(t);
                                        if (error) setError(null);
                                    }}
                                    secureTextEntry={!showPassword}
                                    returnKeyType="done"
                                    onSubmitEditing={handleLogin}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword((v) => !v)}
                                    accessibilityLabel={
                                        showPassword ? "Hide password" : "Show password"
                                    }
                                >
                                    <SvgIcon
                                        source={showPassword ? EYE_OPEN_URI : EYE_CLOSE_URI}
                                        size={20}
                                        color={COLOR.placeholder}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Login button */}
                            <TouchableOpacity
                                onPress={handleLogin}
                                disabled={loading}
                                className="rounded-full items-center justify-center"
                                style={{
                                    backgroundColor: COLOR.green,
                                    height: 52,
                                    opacity: loading ? 0.75 : 1,
                                }}
                                accessibilityRole="button"
                                accessibilityLabel="Log in"
                            >
                                <Text
                                    className="text-base"
                                    style={{
                                        color: COLOR.white,
                                        fontFamily: "StackSans-Headline",
                                    }}
                                >
                                    {loading ? "Logging in…" : "Login"}
                                </Text>
                            </TouchableOpacity>

                            {/* Sign-up link */}
                            <View className="flex-row justify-center mt-5">
                                <Text
                                    className="text-sm"
                                    style={{
                                        color: COLOR.dark,
                                        fontFamily: "StackSans-Text",
                                    }}
                                >
                                    Need an account?{" "}
                                </Text>
                                <TouchableOpacity onPress={onSignup}>
                                    <Text
                                        className="text-sm"
                                        style={{
                                            color: COLOR.green,
                                            fontFamily: "StackSans-Headline",
                                        }}
                                    >
                                        Signup
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}