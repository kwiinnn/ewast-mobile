import { useAuth } from '@/components/AuthContext';
import Logo from '@/components/logo';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { Bell, Home, Map, PlusSquare, User, UserPlus } from 'lucide-react-native';
import { Platform, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DESKTOP_BREAKPOINT = 768;

// ── Shared Web Header (desktop nav + mobile hamburger) ──────────────────────
function WebHeader() {
    const { isLoggedIn } = useAuth();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { width } = useWindowDimensions();

    const isDesktop = width >= DESKTOP_BREAKPOINT;
    const isAdmin = usePathname().startsWith("/admin");

    const navigateTo = (path: string) => {
        router.push(path as any);
    };

    return (
        <>
            {/* Desktop Nav Bar (admin side) */}
            {isDesktop && isAdmin && (
                <View
          className="flex-row items-center justify-between bg-[#F0F4F1] px-10 border border-[#DAD0D0]"
                    style={{ height: 64 }}
                >
                    <TouchableOpacity
                        className='flex-row items-center'
                        onPress={() => navigateTo('/admin/dashboard')}
                    >
                        <Logo height={38} />
                        <Text className='font-bold' style={
                            {
                                fontSize: 38*0.65,
                                color: '#74B3CE',
                                lineHeight: 38*0.65*1.05,
                                letterSpacing: 38*0.65*0.04
                            }
                            }>:ADMIN</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Desktop Nav Bar (citizen side) */}
            {isDesktop && !isAdmin && (
                <View
                    className="flex-row items-center justify-between bg-[#F0F4F1] px-10"
                    style={{ height: 64 }}
                >
                    <TouchableOpacity onPress={() => navigateTo('/')}>
                        <Logo height={38} />
                    </TouchableOpacity>

                    <View className="flex-row items-center" style={{ gap: 56 }}>
                        <TouchableOpacity onPress={() => navigateTo('/')}>
                            <Text className="text-sm font-extrabold tracking-widest text-[#16A637]">HOME</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigateTo('/report')}>
                            <Text className="text-sm font-bold tracking-widest text-[#233329]">REPORT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigateTo('/routes')}>
                            <Text className="text-sm font-bold tracking-widest text-[#233329]">ROUTES</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center" style={{ gap: 20 }}>
                        {isLoggedIn ? (
                            <>
                                <TouchableOpacity className="relative" onPress={() => navigateTo('/notifs')}>
                                    <Bell size={22} color="#233329" />
                                    <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#F0F4F1]" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigateTo('/profile')}>
                                    <Text className="text-sm font-bold tracking-widest text-[#233329]">PROFILE</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                className="bg-[#16A637] rounded-full px-7 h-[38px] items-center justify-center"
                                onPress={() => navigateTo('/login')}
                            >
                                <Text className="text-white font-bold text-sm tracking-widest">LOGIN</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}

            {/* Mobile Header (No Hamburger) */}
            {!isDesktop && !isAdmin && (
                <View className="flex-row justify-between items-center px-6 py-4" style={{ marginTop: insets.top }}>
                    <Logo height={50} />
                    <View className="flex-row items-center">
                        {isLoggedIn && (
                            <TouchableOpacity className="relative mr-2" onPress={() => navigateTo('/notifs')}>
                                <Bell size={26} color="#233329" />
                                <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#F0F4F1]" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </>
    );
}

// ── Native Bottom Tab Bar ────────────────────────────────────────────────────
function CustomTabBar({ state, descriptors, navigation }: any) {
    const { isLoggedIn } = useAuth();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isDesktop = width >= DESKTOP_BREAKPOINT;

    if (Platform.OS === 'web' && isDesktop) return null;

    const isWeb = Platform.OS === 'web';

    return (
        <View
            className="flex-row items-center justify-around bg-[#E5E7EB] rounded-t-[32px] shadow-lg"
            style={{
                position: isWeb ? ('fixed' as any) : 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                width: '100%',
                paddingBottom: insets.bottom || 24,
                paddingTop: 16,
                height: 80 + (insets.bottom || 24),
                zIndex: 50,
            }}
        >
            {state.routes
                .filter((route: any) => ['index', 'report', 'routes', 'profile'].includes(route.name))
                .map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === state.routes.findIndex((r: any) => r.key === route.key);

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                let label = '';
                if (route.name === 'index') label = 'Home';
                else if (route.name === 'report') label = 'Report';
                else if (route.name === 'routes') label = 'Routes';
                else if (route.name === 'profile') label = isLoggedIn ? 'Profile' : 'Login';

                const color = isFocused ? '#FFFFFF' : '#8F9BB3';

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        onPress={onPress}
                        className={`items-center justify-center ${isFocused ? 'bg-[#16A637] w-[76px] h-[64px] rounded-full shadow' : 'w-[64px] h-[64px]'}`}
                    >
                        {route.name === 'index' && <Home size={24} color={color} />}
                        {route.name === 'report' && <PlusSquare size={24} color={color} />}
                        {route.name === 'routes' && <Map size={24} color={color} />}
                        {route.name === 'profile' && isLoggedIn && <User size={24} color={color} />}
                        {route.name === 'profile' && !isLoggedIn && <UserPlus size={24} color={color} />}
                        <Text className="text-xs mt-1 font-bold" style={{ color }}>{label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// ── Layout ───────────────────────────────────────────────────────────────────
export default function TabsLayout() {
    return (
        <View className="flex-1 bg-[#F0F4F1]">
            {/* Web header rendered above all tab screens */}
            {Platform.OS === 'web' && <WebHeader />}

            <Tabs
                tabBar={(props) => <CustomTabBar {...props} />}
                screenOptions={{ headerShown: false }}
            >
                <Tabs.Screen name="index" />
                <Tabs.Screen name="report" />
                <Tabs.Screen name="routes" />
                <Tabs.Screen name="profile" />
                <Tabs.Screen name="login" options={{ href: null }} />
                <Tabs.Screen name="signup" options={{ href: null }} />
            </Tabs>
        </View>
    );
}