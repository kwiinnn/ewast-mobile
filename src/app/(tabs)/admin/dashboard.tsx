import { ScrollView, Text, View } from "react-native";
import SidebarLayout from "../../../components/admin-sidebar.web";

export default function AdminDashboard() {
    return (
        <View className="flex-row h-full">
            <SidebarLayout></SidebarLayout>

            <ScrollView className="w-full flex-1 p-6">
                <Text>Sample Content</Text>
            </ScrollView>
        </View>
    );
}