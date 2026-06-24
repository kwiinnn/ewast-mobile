import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
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

// Brand assets for the showcase panel
import Truck from '@/assets/icons/truck2.svg';
import Showcase from '@/assets/showcase.svg';
import Logo from '@/components/logo';

// Shared auth components
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

// ─── Inject CSS grid layout (web only) ───────────────────────────────────────

function useWebStyles() {
    useEffect(() => {
        const id = 'ewast-signup-web-styles';
        if (document.getElementById(id)) return;
        const el = document.createElement('style');
        el.id = id;
        el.textContent = `
            .ewast-signup-root {
                display: flex;
                flex: 1;
                min-height: 100%;
                flex-direction: row;
                align-items: flex-start;
                padding: 40px 48px 60px 48px;
                gap: 48px;
                box-sizing: border-box;
            }
            .ewast-signup-left {
                flex: 0 0 420px;
                min-width: 0;
            }
            .ewast-signup-right {
                flex: 1 1 0;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 0;
                padding-top: 48px;
            }
            .ewast-signup-signin-hint {
                display: none;
            }

            /* ── Mobile: hide the device showcase entirely, center the card ── */
            @media (max-width: 768px) {
                .ewast-signup-signin-hint {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    margin-top: 20px;
                    padding-bottom: 8px;
                }
                .ewast-signup-root {
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 24px 20px;
                    gap: 0;
                }
                .ewast-signup-left {
                    flex: 0 0 auto;
                    width: 100%;
                    max-width: 420px;
                }
                .ewast-signup-right {
                    display: none;
                }
            }
        `;
        document.head.appendChild(el);
        return () => { el.remove(); };
    }, []);
}

// ─── Device Mockup ────────────────────────────────────────────────────────────

function DeviceMockup() {
    return (
        <View style={{ alignItems: 'center' }}>
            {/* Wrapper that establishes a local stacking context for the phone overlap */}
            <View style={{ position: 'relative', width: 520, height: 346 }}>

                {/* ── Monitor bezel ── */}
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 460,
                        height: 310,
                        backgroundColor: '#1a1a1a',
                        borderRadius: 16,
                        padding: 10,
                        shadowColor: '#000',
                        shadowOpacity: 0.3,
                        shadowRadius: 24,
                        shadowOffset: { width: 0, height: 8 },
                    }}
                >
                    {/* Screen */}
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#ffffff',
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 16,
                        }}
                    >
                        <Logo height={70} />
                        <Truck width={101} height={75} className="ml-8" />
                    </View>
                </View>

                {/* ── Smartphone (overlaps bottom-right of monitor) ── */}
                <View
                    style={{
                        position: 'absolute',
                        top: 40,
                        right: 0,
                        width: 155,
                        height: 300,
                        backgroundColor: '#111',
                        borderRadius: 30,
                        padding: 7,
                        shadowColor: '#000',
                        shadowOpacity: 0.45,
                        shadowRadius: 20,
                        shadowOffset: { width: 0, height: 6 },
                        borderWidth: 1,
                        borderColor: '#2a2a2a',
                    }}
                >
                    {/* Dynamic island pill */}
                    <View
                        style={{
                            alignSelf: 'center',
                            width: 36,
                            height: 10,
                            backgroundColor: '#000',
                            borderRadius: 5,
                            marginBottom: 4,
                        }}
                    />

                    {/* Phone screen */}
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            borderRadius: 22,
                            overflow: 'hidden',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Showcase />
                    </View>

                    {/* Home bar */}
                    <View
                        style={{
                            alignSelf: 'center',
                            marginTop: 6,
                            width: 44,
                            height: 4,
                            backgroundColor: '#444',
                            borderRadius: 2,
                        }}
                    />
                </View>

                {/* ── Monitor stand ── */}
                <View
                    style={{
                        position: 'absolute',
                        top: 310,
                        left: 0,
                        width: 460,
                        alignItems: 'center',
                    }}
                >
                    <View style={{ width: 38, height: 26, backgroundColor: '#2a2a2a' }} />
                    <View style={{ width: 130, height: 10, backgroundColor: '#2a2a2a', borderRadius: 5 }} />
                </View>
            </View>
        </View>
    );
}

// ─── Step Indicator ──────────────────────────────────────────────────────────

const STEPS = [
    { label: 'Profile', Icon: UserIcon },
    { label: 'Security', Icon: LockIcon },
    { label: 'Review', Icon: ReviewIcon },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
    return (
        <View style={{ backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 24, paddingVertical: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
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
                            <View style={{ alignItems: 'center' }}>
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
                                    className="font-semibold"
                                    style={{
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
        <View style={{ backgroundColor: '#fff', borderRadius: 16, marginTop: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}>
            <Text className="font-extrabold" style={{ fontSize: 25, color: AuthColors.dark, marginBottom: 4 }}>
                Your Profile
            </Text>
            <Text style={{ fontSize: 14, color: AuthColors.dark, opacity: 0.6, marginBottom: 20 }}>
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
                <Text className="font-bold" style={{ fontSize: 16, color: '#fff' }}>Continue</Text>
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
        <View style={{ backgroundColor: '#fff', borderRadius: 16, marginTop: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}>
            <Text className="font-extrabold" style={{ fontSize: 22, color: AuthColors.dark, marginBottom: 4 }}>
                Account Security
            </Text>
            <Text style={{ fontSize: 14, color: AuthColors.dark, opacity: 0.6, marginBottom: 20 }}>
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

            <View style={{ flexDirection: 'row', marginTop: 8, gap: 12 }}>
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
                    <Text className="font-bold" style={{ fontSize: 15, color: AuthColors.green }}>Back</Text>
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
                    <Text className="font-bold" style={{ fontSize: 15, color: '#fff' }}>Continue</Text>
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
        <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 12, color: AuthColors.green, marginBottom: 2 }}>
                {label}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Icon width={18} height={18} color={AuthColors.dark} />
                <Text style={{ fontSize: 15, color: AuthColors.dark }}>
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
        <View style={{ backgroundColor: '#fff', borderRadius: 16, marginTop: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}>
            <Text className="font-extrabold" style={{ fontSize: 22, color: AuthColors.dark, marginBottom: 4 }}>
                Review Details
            </Text>
            <Text style={{ fontSize: 14, color: AuthColors.dark, opacity: 0.6, marginBottom: 20 }}>
                Almost done! Review and confirm your account details
            </Text>

            <ReviewRow label="Full Name" value={data.fullName} Icon={UserIcon} />
            <ReviewRow label="Email" value={data.email} Icon={MailIcon} />
            <ReviewRow label="Password" value={data.password} Icon={EyeCloseIcon} masked />

            <View style={{ flexDirection: 'row', marginTop: 8, gap: 12 }}>
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
                    <Text className="font-bold" style={{ fontSize: 15, color: AuthColors.green }}>Back</Text>
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
                    <Text className="font-bold" style={{ fontSize: 15, color: '#fff' }}>
                        {loading ? 'Creating…' : 'Create'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SignupScreenWeb() {
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

    useWebStyles();

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
        <ScrollView
            style={{ flex: 1, backgroundColor: AuthColors.background }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            {/* @ts-ignore — className is web-only */}
            <View className="ewast-signup-root">

                {/* ── LEFT: title + stepper + form ── */}
                {/* @ts-ignore — className is web-only */}
                <View className="ewast-signup-left">

                    {/* Step Indicator */}
                    <StepIndicator currentStep={step} />

                    {/* Form Step */}
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

                    <View className="ewast-signup-signin-hint">
                        <Text style={{ fontSize: 14, color: AuthColors.dark }}>
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={{ fontSize: 14, color: AuthColors.green}}>
                                Sign in
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── RIGHT: device showcase ── */}
                {/* @ts-ignore — className is web-only */}
                <View className="ewast-signup-right">
                    <DeviceMockup />
                </View>

            </View>
        </ScrollView>
    );
}