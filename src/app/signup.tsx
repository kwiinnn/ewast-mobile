import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SvgProps } from 'react-native-svg';

// Icons
import CheckIcon from '@/assets/icons/check.svg';
import EyeCloseIcon from '@/assets/icons/eye-close.svg';
import LockIcon from '@/assets/icons/lock.svg';
import MailIcon from '@/assets/icons/mail.svg';
import ReviewIcon from '@/assets/icons/review.svg';
import UserIcon from '@/assets/icons/user.svg';

// Shared auth components
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthInput } from '@/components/auth/AuthInput';
import { useAuth } from '@/components/AuthContext';
import { AuthColors } from '@/constants/auth-colors';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface FieldErrors {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

// ─── Step Indicator ──────────────────────────────────────────────────────────

const STEPS = [
    { label: 'Profile', Icon: UserIcon },
    { label: 'Security', Icon: LockIcon },
    { label: 'Review', Icon: ReviewIcon },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
    return (
        <View className="bg-white rounded-2xl px-6 py-5 mx-4 shadow-sm">
            <View className="flex-row items-center justify-center">
                {STEPS.map((step, index) => {
                    const stepNum = index + 1;
                    const isCompleted = stepNum < currentStep;
                    const isActive = stepNum === currentStep;
                    const isLast = index === STEPS.length - 1;

                    const circleBg = isCompleted || isActive ? AuthColors.green : 'transparent';
                    const circleBorder = isCompleted || isActive ? AuthColors.green : AuthColors.placeholder;
                    const iconColor = isCompleted || isActive ? '#fff' : AuthColors.placeholder;

                    return (
                        <React.Fragment key={step.label}>
                            <View className="items-center">
                                <View
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 24,
                                        backgroundColor: circleBg,
                                        borderWidth: isCompleted || isActive ? 0 : 2,
                                        borderColor: circleBorder,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {isCompleted ? (
                                        <CheckIcon width={22} height={22} color={iconColor} />
                                    ) : (
                                        <step.Icon width={22} height={22} color={iconColor} />
                                    )}
                                </View>
                                <Text
                                    style={{
                                        fontFamily: 'StackSans-Text',
                                        fontSize: 12,
                                        color: isCompleted || isActive ? AuthColors.dark : AuthColors.placeholder,
                                        marginTop: 6,
                                    }}
                                >
                                    {step.label}
                                </Text>
                            </View>

                            {!isLast && (
                                <View
                                    style={{
                                        flex: 1,
                                        height: 2,
                                        backgroundColor: stepNum < currentStep ? AuthColors.green : AuthColors.placeholder,
                                        marginBottom: 20,
                                        marginHorizontal: 4,
                                    }}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </View>
        </View>
    );
}

// ─── Step Banner ─────────────────────────────────────────────────────────────

function StepBanner({ step }: { step: number }) {
    return (
        <View
            style={{
                backgroundColor: AuthColors.greenLight,
                borderRadius: 10,
                marginHorizontal: 16,
                marginTop: 16,
                paddingVertical: 10,
                paddingHorizontal: 16,
            }}
        >
            <Text style={{ fontFamily: 'StackSans-Headline', fontSize: 14, color: AuthColors.green }}>
                Step {step} of 3
            </Text>
        </View>
    );
}

// ─── Step 1: Profile ─────────────────────────────────────────────────────────

function Step1Profile({
    data,
    errors,
    onChange,
    onContinue,
}: {
    data: FormData;
    errors: FieldErrors;
    onChange: (field: keyof FormData, value: string) => void;
    onContinue: () => void;
}) {
    return (
        <View className="bg-white rounded-2xl mx-4 mt-4 p-6 shadow-sm">
            <Text style={{ fontFamily: 'StackSans-Headline', fontSize: 22, color: AuthColors.dark, marginBottom: 4 }}>
                Your Profile
            </Text>
            <Text style={{ fontFamily: 'StackSans-Text', fontSize: 14, color: AuthColors.dark, opacity: 0.6, marginBottom: 20 }}>
                Tell us about yourself!
            </Text>

            <AuthInput
                label="Full Name"
                placeholder="Enter your full name"
                value={data.fullName}
                onChangeText={(v) => onChange('fullName', v)}
                error={errors.fullName}
                Icon={UserIcon}
                autoCapitalize="words"
            />
            <AuthInput
                label="Email"
                placeholder="Enter your email"
                value={data.email}
                onChangeText={(v) => onChange('email', v)}
                error={errors.email}
                Icon={MailIcon}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TouchableOpacity
                onPress={onContinue}
                style={{
                    backgroundColor: AuthColors.green,
                    borderRadius: 50,
                    paddingVertical: 16,
                    alignItems: 'center',
                    marginTop: 8,
                }}
                activeOpacity={0.85}
            >
                <Text style={{ fontFamily: 'StackSans-Headline', fontSize: 16, color: '#fff' }}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
}

// ─── Step 2: Security ────────────────────────────────────────────────────────

function Step2Security({
    data,
    errors,
    onChange,
    onContinue,
    onBack,
}: {
    data: FormData;
    errors: FieldErrors;
    onChange: (field: keyof FormData, value: string) => void;
    onContinue: () => void;
    onBack: () => void;
}) {
    return (
        <View className="bg-white rounded-2xl mx-4 mt-4 p-6 shadow-sm">
            <Text style={{ fontFamily: 'StackSans-Headline', fontSize: 22, color: AuthColors.dark, marginBottom: 4 }}>
                Account Security
            </Text>
            <Text style={{ fontFamily: 'StackSans-Text', fontSize: 14, color: AuthColors.dark, opacity: 0.6, marginBottom: 20 }}>
                Secure your account! Password must contain at least 8 characters
            </Text>

            <AuthInput
                label="Password"
                placeholder="Enter your password"
                value={data.password}
                onChangeText={(v) => onChange('password', v)}
                error={errors.password}
                Icon={LockIcon}
                secureTextEntry
            />
            <AuthInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={data.confirmPassword}
                onChangeText={(v) => onChange('confirmPassword', v)}
                error={errors.confirmPassword}
                Icon={LockIcon}
                secureTextEntry
            />

            <View className="flex-row mt-2" style={{ gap: 12 }}>
                <TouchableOpacity
                    onPress={onBack}
                    style={{
                        flex: 1,
                        borderWidth: 1.5,
                        borderColor: AuthColors.green,
                        borderRadius: 50,
                        paddingVertical: 14,
                        alignItems: 'center',
                    }}
                    activeOpacity={0.75}
                >
                    <Text style={{ fontFamily: 'StackSans-Headline', fontSize: 15, color: AuthColors.green }}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onContinue}
                    style={{
                        flex: 1,
                        backgroundColor: AuthColors.green,
                        borderRadius: 50,
                        paddingVertical: 14,
                        alignItems: 'center',
                    }}
                    activeOpacity={0.85}
                >
                    <Text style={{ fontFamily: 'StackSans-Headline', fontSize: 15, color: '#fff' }}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Step 3: Review ──────────────────────────────────────────────────────────

function ReviewRow({
    label,
    value,
    Icon,
    masked,
}: {
    label: string;
    value: string;
    Icon: React.FC<SvgProps>;
    masked?: boolean;
}) {
    return (
        <View className="mb-5">
            <Text style={{ fontFamily: 'StackSans-Text', fontSize: 12, color: AuthColors.green, marginBottom: 2 }}>
                {label}
            </Text>
            <View className="flex-row items-center" style={{ gap: 10 }}>
                <Icon width={18} height={18} color={AuthColors.dark} />
                <Text style={{ fontFamily: 'StackSans-Text', fontSize: 15, color: AuthColors.dark }}>
                    {masked ? '•'.repeat(Math.max(value.length, 10)) : value}
                </Text>
            </View>
        </View>
    );
}

function Step3Review({
    data,
    onBack,
    onCreate,
    loading,
}: {
    data: FormData;
    onBack: () => void;
    onCreate: () => void;
    loading: boolean;
}) {
    return (
        <View className="bg-white rounded-2xl mx-4 mt-4 p-6 shadow-sm">
            <Text style={{ fontFamily: 'StackSans-Headline', fontSize: 22, color: AuthColors.dark, marginBottom: 4 }}>
                Review Details
            </Text>
            <Text style={{ fontFamily: 'StackSans-Text', fontSize: 14, color: AuthColors.dark, opacity: 0.6, marginBottom: 20 }}>
                Almost done! Review and confirm your account details
            </Text>

            <ReviewRow label="Full Name" value={data.fullName} Icon={UserIcon} />
            <ReviewRow label="Email" value={data.email} Icon={MailIcon} />
            <ReviewRow label="Password" value={data.password} Icon={EyeCloseIcon} masked />

            <View className="flex-row mt-2" style={{ gap: 12 }}>
                <TouchableOpacity
                    onPress={onBack}
                    disabled={loading}
                    style={{
                        flex: 1,
                        borderWidth: 1.5,
                        borderColor: AuthColors.green,
                        borderRadius: 50,
                        paddingVertical: 14,
                        alignItems: 'center',
                    }}
                    activeOpacity={0.75}
                >
                    <Text style={{ fontFamily: 'StackSans-Headline', fontSize: 15, color: AuthColors.green }}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onCreate}
                    disabled={loading}
                    style={{
                        flex: 1,
                        backgroundColor: AuthColors.green,
                        borderRadius: 50,
                        paddingVertical: 14,
                        alignItems: 'center',
                        opacity: loading ? 0.75 : 1,
                    }}
                    activeOpacity={0.85}
                >
                    <Text style={{ fontFamily: 'StackSans-Headline', fontSize: 15, color: '#fff' }}>
                        {loading ? 'Creating…' : 'Create'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Root Screen ─────────────────────────────────────────────────────────────

export default function SignupScreen() {
    const { signup } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<FormData>({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<FieldErrors>({});

    const setField = (field: keyof FormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    // ── Validation ──────────────────────────────────────────────────────────

    const validateStep1 = (): boolean => {
        const newErrors: FieldErrors = {};
        if (!form.fullName.trim()) newErrors.fullName = 'Invalid';
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            newErrors.email = 'Invalid';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const newErrors: FieldErrors = {};
        if (form.password.length < 8) newErrors.password = 'Invalid';
        if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Invalid';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleStep1Continue = () => {
        if (validateStep1()) setStep(2);
    };

    const handleStep2Continue = () => {
        if (validateStep2()) setStep(3);
    };

    const handleCreate = async () => {
        setLoading(true);
        try {
            await signup({
                fullName: form.fullName,
                email: form.email,
                password: form.password,
            });
            router.replace('/(tabs)');
        } catch {
            // TODO: Show error
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: AuthColors.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 40 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* ── Header ── */}
                    <AuthHeader
                        title="CREATE ACCOUNT"
                        onBack={() => {
                            if (step > 1) setStep((s) => s - 1);
                            else router.back();
                        }}
                    />

                    {/* ── Step Indicator ── */}
                    <StepIndicator currentStep={step} />

                    {/* ── Step Banner ── */}
                    <StepBanner step={step} />

                    {/* ── Form Step ── */}
                    {step === 1 && (
                        <Step1Profile
                            data={form}
                            errors={errors}
                            onChange={setField}
                            onContinue={handleStep1Continue}
                        />
                    )}
                    {step === 2 && (
                        <Step2Security
                            data={form}
                            errors={errors}
                            onChange={setField}
                            onContinue={handleStep2Continue}
                            onBack={() => setStep(1)}
                        />
                    )}
                    {step === 3 && (
                        <Step3Review
                            data={form}
                            onBack={() => setStep(2)}
                            onCreate={handleCreate}
                            loading={loading}
                        />
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
