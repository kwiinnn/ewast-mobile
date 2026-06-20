import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '@/components/AuthContext';

export default function ProfileScreen() {
  const { isLoggedIn, toggleAuth } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-[#F5F7F5]">
      <Text className="text-xl font-bold text-[#233329] mb-4">
        {isLoggedIn ? 'Profile Screen' : 'Login Screen'}
      </Text>
      <TouchableOpacity 
        onPress={toggleAuth}
        className="bg-[#16A637] px-6 py-3 rounded-full"
      >
        <Text className="text-white font-bold">
          Toggle Auth State
        </Text>
      </TouchableOpacity>
    </View>
  );
}
