import BackIcon from "../../assets/icons/back.svg";
import ErrorIcon from "../../assets/icons/error.svg";
import EyeCloseIcon from "../../assets/icons/eye-close.svg";
import EyeOpenIcon from "../../assets/icons/eye-open.svg";
import LockIcon from "../../assets/icons/lock.svg";
import MailIcon from "../../assets/icons/mail.svg";
import Logo from "../../assets/logo.svg";

import { router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

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
// Props
// ---------------------------------------------------------------------------
interface LoginScreenProps {
    onLogin?: (email: string, password: string) => Promise<void> | void;
    onBack?: () => void;
    onSignup?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function LoginScreen({
    onLogin,
    onBack,
    onSignup = () => router.push("/signup"),
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

            {/* FIX #1: Wrapped Header in SafeAreaView */}
            <SafeAreaView style={{ backgroundColor: COLOR.background }}>
                {/* ── Header ───────────────────────────────────────────────────── */}
                <View
                    className="flex-row items-center px-4 pt-4 pb-4"
                    style={{ backgroundColor: COLOR.background }}
                >
                    {/* FIX #3: Use optional chaining via arrow function */}
                    <TouchableOpacity
                        onPress={() => onBack?.()}
                        className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                        style={{ backgroundColor: COLOR.green }}
                        accessibilityLabel="Go back"
                    >
                        {/* FIX #1 & #2: Use SVG component directly, no expo-image or tintColor */}
                        <BackIcon width={30} height={30} color={COLOR.white} fill={COLOR.white} />
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
            </SafeAreaView>

            {/* FIX #4: Use undefined instead of "height" on Android */}
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 px-5 py-2">

                        {/* ── Error banner ─────────────────────────────────────────── */}
                        <View
                            className="flex-row items-center rounded-xl px-4 py-3 mb-5"
                            style={{ 
                                backgroundColor: COLOR.errorBg,
                                opacity: error ? 1 : 0 // Retains layout space when hidden
                            }}
                            pointerEvents={error ? "auto" : "none"} // Prevents interaction when invisible
                        >
                            <ErrorIcon width={18} height={18} color={COLOR.errorText} />
                            <Text
                                className="ml-2 text-sm flex-1"
                                style={{
                                    color: COLOR.errorText,
                                    fontFamily: "StackSans-Text",
                                }}
                            >
                                {error || " "} 
                            </Text>
                        </View>

                        {/* ── Card ─────────────────────────────────────────────────── */}
                        <View
                            className="bg-white rounded-[32px] px-6 pt-10 pb-10 shadow-sm mt-6"
                            style={{
                                elevation: 2,
                            }}
                        >
                            {/* Logo — SVG component directly */}
                            <View className="items-center mb-3">
                                <Logo width={200} height={75} />
                            </View>

                            {/* Email field */}
                            <View
                                className="flex-row items-center border-[1.5px] border-[#233329] rounded-full px-5 h-[52px] mb-8 bg-[#F0F4F1]"
                                style={{
                                    borderWidth: 1.5,
                                    borderColor: COLOR.dark,
                                    height: 52,
                                }}
                            >
                                <MailIcon width={18} height={18} color={COLOR.placeholder} fill={COLOR.placeholder} stroke={COLOR.placeholder}/>
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
                                className="flex-row items-center border-[1.5px] border-[#233329] rounded-full px-5 h-[52px] mb-8 bg-[#F0F4F1]"
                                style={{
                                    borderWidth: 1.5,
                                    borderColor: COLOR.dark,
                                    height: 52,
                                }}
                            >
                                <LockIcon width={18} height={18} color={COLOR.placeholder} fill={COLOR.placeholder}/>
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
                                    {showPassword
                                        ? <EyeOpenIcon width={20} height={20} color={COLOR.placeholder} fill={COLOR.placeholder}/>
                                        : <EyeCloseIcon width={20} height={20} color={COLOR.placeholder} fill={COLOR.placeholder}/>
                                    }
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
                                <TouchableOpacity onPress={() => { alert("signup clicked"); router.push("/signup"); }}>
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