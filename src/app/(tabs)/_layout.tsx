import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Home, PlusSquare, Map, User, UserPlus } from 'lucide-react-native';
import { useAuth } from '@/components/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const { isLoggedIn } = useAuth();
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      className="flex-row items-center justify-around bg-[#E5E7EB] rounded-t-[32px] absolute bottom-0 w-full shadow-lg" 
      style={{ paddingBottom: insets.bottom || 24, paddingTop: 16, height: 80 + (insets.bottom || 24) }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        
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
        if (route.name === 'index') {
          label = 'Home';
        } else if (route.name === 'report') {
          label = 'Report';
        } else if (route.name === 'routes') {
          label = 'Routes';
        } else if (route.name === 'profile') {
          label = isLoggedIn ? 'Profile' : 'Login';
        }

        const isHome = route.name === 'index';
        const color = isFocused && !isHome ? '#16A637' : (isFocused && isHome ? '#FFFFFF' : '#8F9BB3');
        
        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            className={`items-center justify-center ${isFocused && isHome ? 'bg-[#16A637] w-[72px] h-[72px] rounded-full -mt-10 shadow-md' : 'w-[72px] h-[72px]'}`}
            style={isFocused && isHome ? { elevation: 4 } : {}}
          >
            {route.name === 'index' && <Home size={24} color={color} />}
            {route.name === 'report' && <PlusSquare size={24} color={color} />}
            {route.name === 'routes' && <Map size={24} color={color} />}
            {route.name === 'profile' && isLoggedIn && <User size={24} color={color} />}
            {route.name === 'profile' && !isLoggedIn && <UserPlus size={24} color={color} />}
            
            <Text className={`text-xs mt-1 font-bold`} style={{ color }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="report" />
      <Tabs.Screen name="routes" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
