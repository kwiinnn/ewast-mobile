import { useAuth } from '@/components/AuthContext';
import Logo from '@/components/logo';
import { useRouter } from 'expo-router';
import { Bell, CalendarDays, Clock, Map as MapIcon, Search, Truck } from 'lucide-react-native';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { isLoggedIn } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // ── Guest view ──────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <View className="flex-1 bg-[#F0F4F1]" style={{ paddingTop: insets.top }}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            paddingHorizontal: 24,
            paddingBottom: 40,
            justifyContent: 'center',
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-white rounded-[32px] px-6 pt-10 pb-10 shadow-sm" style={{ elevation: 2 }}>
            <Text className="text-[28px] font-extrabold text-center text-[#233329] mb-1">
              Be Part of the{' '}
              <Text className="text-[#16A637]">Local</Text>
            </Text>
            <Text className="text-[28px] font-extrabold text-center text-[#16A637] mb-4">
              Waste Collection
            </Text>

            <Text className="text-center text-[#8F9BB3] text-sm mb-8 px-2 leading-5 font-medium">
              Get information about garbage collection and report scattered garbage around your area.{' '}
              <Text style={{ color: '#16A637' }} onPress={() => router.push('/login' as any)}>
                Login now!
              </Text>
            </Text>

            {/* CTA Buttons */}
            <View className="flex-row justify-between gap-3">
              <TouchableOpacity
                className="flex-1 bg-[#16A637] rounded-full h-[48px] items-center justify-center"
                onPress={() => router.push('/schedules' as any)}
              >
                <Text className="text-white font-extrabold text-xs tracking-widest uppercase">Schedules</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-[#16A637] rounded-full h-[48px] items-center justify-center"
                onPress={() => router.push('/data' as any)}
              >
                <Text className="text-white font-extrabold text-xs tracking-widest uppercase">Data</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-[#16A637] rounded-full h-[48px] items-center justify-center"
                onPress={() => router.push('/report' as any)}
              >
                <Text className="text-white font-extrabold text-xs tracking-widest uppercase">Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Logged-in view (unchanged) ───────────────────────────────────────────────
  return (
    <View className="flex-1 bg-[#F0F4F1]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4 mt-2">
        <View className="flex-row items-center">
          <Logo height={50} />
        </View>
        <TouchableOpacity className="relative mr-2">
          <Bell size={26} color="#233329" />
          <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#F0F4F1]" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-[32px] px-6 pt-10 pb-10 shadow-sm mt-6" style={{ elevation: 2 }}>
          <Text className="text-[28px] font-extrabold text-center text-[#233329] mb-1">
            Track Your Local
          </Text>
          <Text className="text-[28px] font-extrabold text-center text-[#233329] mb-4">
            Waste <Text className="text-[#16A637]">Collection</Text>
          </Text>
          <Text className="text-center text-[#8F9BB3] text-sm mb-8 px-2 leading-5 font-medium">
            Stay updated with live garbage truck locations and collection schedules
          </Text>
          <View className="flex-row items-center border-[1.5px] border-[#233329] rounded-full px-5 h-[52px] mb-8 bg-[#F0F4F1]">
            <TextInput
              className="flex-1 text-[#233329] font-medium text-base"
              placeholder="Search Location"
              placeholderTextColor="#8F9BB3"
            />
            <Search size={22} color="#233329" />
          </View>
          <View className="flex-row justify-between items-center mb-8 px-2">
            <View className="flex-row items-center">
              <Truck size={36} color="#16A637" />
              <Text className="text-xl font-bold text-[#233329] ml-3">Mintal</Text>
            </View>
            <View className="bg-[#E8F5E9] px-3 py-1.5 rounded-full flex-row items-center">
              <Clock size={12} color="#16A637" />
              <Text className="text-[10px] font-extrabold text-[#16A637] ml-1 tracking-wider">7:00 AM - 12:00 PM</Text>
            </View>
          </View>
          <TouchableOpacity className="bg-[#16A637] rounded-full h-[52px] flex-row items-center justify-center mb-8 mx-6">
            <View className="w-2.5 h-2.5 bg-white rounded-full mr-2.5" />
            <Text className="text-white font-bold text-base">Track Live</Text>
          </TouchableOpacity>
          <View className="flex-row justify-center gap-10 mt-2">
            <View className="items-center">
              <TouchableOpacity className="bg-[#233329] w-[76px] h-[76px] rounded-[24px] items-center justify-center mb-3 shadow-sm">
                <CalendarDays size={34} color="#FFFFFF" />
              </TouchableOpacity>
              <Text className="text-[#233329] font-medium text-base">Schedules</Text>
            </View>
            <View className="items-center">
              <TouchableOpacity className="bg-[#233329] w-[76px] h-[76px] rounded-[24px] items-center justify-center mb-3 shadow-sm">
                <MapIcon size={34} color="#FFFFFF" />
              </TouchableOpacity>
              <Text className="text-[#233329] font-medium text-base">Heatmap</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}