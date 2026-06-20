import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SvgProps } from 'react-native-svg';

// SVG Icon imports — adjust paths to match your project structure
import BackIcon from '../../assets/icons/back.svg';
import CheckIcon from '../../assets/icons/check.svg';
import EyeCloseIcon from '../../assets/icons/eye-close.svg';
import EyeOpenIcon from '../../assets/icons/eye-open.svg';
import LockIcon from '../../assets/icons/lock.svg';
import MailIcon from '../../assets/icons/mail.svg';
import ReviewIcon from '../../assets/icons/review.svg';
import UserIcon from '../../assets/icons/user.svg';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
    bg: '#F5F7F5',
    text: '#233329',
    card: '#FFFFFF',
    green: '#16A637',
    greenLight: '#E8F5EC',
    placeholder: '#C7CBD2',
    error: '#E53935',
    border: '#233329',
    stepLine: '#16A637',
    stepInactive: '#C7CBD2',
};

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
interface StepIndicatorProps {
    currentStep: number; // 1, 2, or 3
}

const STEPS = [
    { label: 'Profile', Icon: UserIcon },
    { label: 'Security', Icon: LockIcon },
    { label: 'Review', Icon: ReviewIcon },
];

function StepIndicator({ currentStep }: StepIndicatorProps) {
    return (
        <View className="bg-white rounded-2xl px-6 py-5 mx-4 shadow-sm">
            <View className="flex-row items-center justify-center">
                {STEPS.map((step, index) => {
                    const stepNum = index + 1;
                    const isCompleted = stepNum < currentStep;
                    const isActive = stepNum === currentStep;
                    const isLast = index === STEPS.length - 1;

                    const circleBg = isCompleted || isActive ? C.green : 'transparent';
                    const circleBorder = isCompleted || isActive ? C.green : C.stepInactive;
                    const iconColor = isCompleted || isActive ? '#fff' : C.stepInactive;

                    return (
                        <React.Fragment key={step.label}>
                            <View className="items-center">
                                {/* Circle */}
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
                                {/* Label */}
                                <Text
                                    style={{
                                        fontFamily: 'StackSansText',
                                        fontSize: 12,
                                        color: isCompleted || isActive ? C.text : C.stepInactive,
                                        marginTop: 6,
                                    }}
                                >
                                    {step.label}
                                </Text>
                            </View>

                            {/* Connector line */}
                            {!isLast && (
                                <View
                                    style={{
                                        flex: 1,
                                        height: 2,
                                        backgroundColor: stepNum < currentStep ? C.green : C.stepInactive,
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
            style={{ backgroundColor: C.greenLight, borderRadius: 10, marginHorizontal: 16, marginTop: 16, paddingVertical: 10, paddingHorizontal: 16 }}
        >
            <Text style={{ fontFamily: 'StackSansHeadline', fontSize: 14, color: C.green }}>
                Step {step} of 3
            </Text>
        </View>
    );
}

// ─── Input Field ─────────────────────────────────────────────────────────────
interface InputFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    LeftIcon: React.FC<SvgProps>;
    secureTextEntry?: boolean;
    showToggle?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;
    keyboardType?: 'default' | 'email-address';
    autoCapitalize?: 'none' | 'sentences' | 'words';
}

function InputField({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    LeftIcon,
    secureTextEntry = false,
    showToggle = false,
    showPassword = false,
    onTogglePassword,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
}: InputFieldProps) {
    return (
        <View className="mb-4">
            {/* Label row */}
            <View className="flex-row justify-between mb-1">
                <Text style={{ fontFamily: 'StackSansText', fontSize: 13, color: C.green }}>{label}</Text>
                {error ? (
                    <Text style={{ fontFamily: 'StackSansText', fontSize: 13, color: C.error }}>{error}</Text>
                ) : null}
            </View>

            {/* Input row */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1.5,
                    borderColor: error ? C.error : C.border,
                    borderRadius: 50,
                    paddingHorizontal: 16,
                    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
                    backgroundColor: C.card,
                }}
            >
                <LeftIcon width={18} height={18} color={C.placeholder} style={{ marginRight: 10 }} />
                <TextInput
                    style={{
                        flex: 1,
                        fontFamily: 'StackSansText',
                        fontSize: 14,
                        color: C.text,
                    }}
                    placeholder={placeholder}
                    placeholderTextColor={C.placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry && !showPassword}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                />
                {showToggle && onTogglePassword && (
                    <TouchableOpacity onPress={onTogglePassword} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        {showPassword ? (
                            <EyeOpenIcon width={20} height={20} color={C.placeholder} />
                        ) : (
                            <EyeCloseIcon width={20} height={20} color={C.placeholder} />
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

// ─── Step 1: Profile ─────────────────────────────────────────────────────────
interface Step1Props {
    data: FormData;
    errors: FieldErrors;
    onChange: (field: keyof FormData, value: string) => void;
    onContinue: () => void;
}

function Step1Profile({ data, errors, onChange, onContinue }: Step1Props) {
    return (
        <View className="bg-white rounded-2xl mx-4 mt-4 p-6 shadow-sm">
            <Text style={{ fontFamily: 'StackSansHeadline', fontSize: 22, color: C.text, marginBottom: 4 }}>
                Your Profile
            </Text>
            <Text style={{ fontFamily: 'StackSansText', fontSize: 14, color: C.text, opacity: 0.6, marginBottom: 20 }}>
                Tell us about yourself!
            </Text>

            <InputField
                label="Full Name"
                placeholder="Enter your full name"
                value={data.fullName}
                onChangeText={(v) => onChange('fullName', v)}
                error={errors.fullName}
                LeftIcon={UserIcon}
                autoCapitalize="words"
            />
            <InputField
                label="Email"
                placeholder="Enter your email"
                value={data.email}
                onChangeText={(v) => onChange('email', v)}
                error={errors.email}
                LeftIcon={MailIcon}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TouchableOpacity
                onPress={onContinue}
                style={{ backgroundColor: C.green, borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginTop: 8 }}
                activeOpacity={0.85}
            >
                <Text style={{ fontFamily: 'StackSansHeadline', fontSize: 16, color: '#fff' }}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
}

// ─── Step 2: Security ────────────────────────────────────────────────────────
interface Step2Props {
    data: FormData;
    errors: FieldErrors;
    onChange: (field: keyof FormData, value: string) => void;
    onContinue: () => void;
    onBack: () => void;
}

function Step2Security({ data, errors, onChange, onContinue, onBack }: Step2Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <View className="bg-white rounded-2xl mx-4 mt-4 p-6 shadow-sm">
            <Text style={{ fontFamily: 'StackSansHeadline', fontSize: 22, color: C.text, marginBottom: 4 }}>
                Account Security
            </Text>
            <Text style={{ fontFamily: 'StackSansText', fontSize: 14, color: C.text, opacity: 0.6, marginBottom: 20 }}>
                Secure your account! Password must contain at least 8 characters
            </Text>

            <InputField
                label="Password"
                placeholder="Enter your password"
                value={data.password}
                onChangeText={(v) => onChange('password', v)}
                error={errors.password}
                LeftIcon={LockIcon}
                secureTextEntry
                showToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((p) => !p)}
            />
            <InputField
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={data.confirmPassword}
                onChangeText={(v) => onChange('confirmPassword', v)}
                error={errors.confirmPassword}
                LeftIcon={LockIcon}
                secureTextEntry
                showToggle
                showPassword={showConfirm}
                onTogglePassword={() => setShowConfirm((p) => !p)}
            />

            <View className="flex-row gap-3 mt-2" style={{ gap: 12 }}>
                <TouchableOpacity
                    onPress={onBack}
                    style={{
                        flex: 1,
                        borderWidth: 1.5,
                        borderColor: C.green,
                        borderRadius: 50,
                        paddingVertical: 14,
                        alignItems: 'center',
                    }}
                    activeOpacity={0.75}
                >
                    <Text style={{ fontFamily: 'StackSansHeadline', fontSize: 15, color: C.green }}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onContinue}
                    style={{ flex: 1, backgroundColor: C.green, borderRadius: 50, paddingVertical: 14, alignItems: 'center' }}
                    activeOpacity={0.85}
                >
                    <Text style={{ fontFamily: 'StackSansHeadline', fontSize: 15, color: '#fff' }}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Step 3: Review ──────────────────────────────────────────────────────────
interface Step3Props {
    data: FormData;
    onBack: () => void;
    onCreate: () => void;
}

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
            <Text style={{ fontFamily: 'StackSansText', fontSize: 12, color: C.green, marginBottom: 2 }}>{label}</Text>
            <View className="flex-row items-center" style={{ gap: 10 }}>
                <Icon width={18} height={18} color={C.text} />
                <Text style={{ fontFamily: 'StackSansText', fontSize: 15, color: C.text }}>
                    {masked ? '•'.repeat(Math.max(value.length, 10)) : value}
                </Text>
            </View>
        </View>
    );
}

function Step3Review({ data, onBack, onCreate }: Step3Props) {
    return (
        <View className="bg-white rounded-2xl mx-4 mt-4 p-6 shadow-sm">
            <Text style={{ fontFamily: 'StackSansHeadline', fontSize: 22, color: C.text, marginBottom: 4 }}>
                Review Details
            </Text>
            <Text style={{ fontFamily: 'StackSansText', fontSize: 14, color: C.text, opacity: 0.6, marginBottom: 20 }}>
                Almost done! Review and confirm your account details
            </Text>

            <ReviewRow label="Full Name" value={data.fullName} Icon={UserIcon} />
            <ReviewRow label="Email" value={data.email} Icon={MailIcon} />
            <ReviewRow label="Password" value={data.password} Icon={EyeCloseIcon} masked />

            <View className="flex-row mt-2" style={{ gap: 12 }}>
                <TouchableOpacity
                    onPress={onBack}
                    style={{
                        flex: 1,
                        borderWidth: 1.5,
                        borderColor: C.green,
                        borderRadius: 50,
                        paddingVertical: 14,
                        alignItems: 'center',
                    }}
                    activeOpacity={0.75}
                >
                    <Text style={{ fontFamily: 'StackSansHeadline', fontSize: 15, color: C.green }}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onCreate}
                    style={{ flex: 1, backgroundColor: C.green, borderRadius: 50, paddingVertical: 14, alignItems: 'center' }}
                    activeOpacity={0.85}
                >
                    <Text style={{ fontFamily: 'StackSansHeadline', fontSize: 15, color: '#fff' }}>Create</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Root Screen ─────────────────────────────────────────────────────────────
export default function SignupScreen() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<FormData>({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<FieldErrors>({});

    const setField = (field: keyof FormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        // Clear error on type
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    // ── Validation ──────────────────────────────────────────────────────────
    const validateStep1 = (): boolean => {
        const newErrors: FieldErrors = {};
        if (!form.fullName.trim()) newErrors.fullName = 'Invalid';
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid';
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

    const handleCreate = () => {
        // Replace with your actual account creation logic
        console.log('Creating account:', form);
        // router.replace('/home');
    };

    const goBack = () => {
        if (step > 1) {
            setStep((s) => s - 1);
        } else {
            router.back();
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 40 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* ── Header ── */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 16,
                            paddingTop: 16,
                            paddingBottom: 20,
                            gap: 14,
                        }}
                    >
                        <TouchableOpacity
                            onPress={goBack}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                backgroundColor: C.green,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            activeOpacity={0.8}
                        >
                            <BackIcon width={20} height={20} color="#fff" />
                        </TouchableOpacity>
                        <Text
                            style={{
                                fontFamily: 'StackSansHeadline',
                                fontSize: 20,
                                color: C.text,
                                letterSpacing: 0.5,
                            }}
                        >
                            CREATE ACCOUNT
                        </Text>
                    </View>

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
                        />
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}