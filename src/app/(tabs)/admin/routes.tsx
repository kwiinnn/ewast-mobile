import SidebarLayout from "@/components/admin-sidebar.web";
import { View } from "react-native";

export default function AdminRoutes() {
    return (
        <View className="flex-row h-full">
            <SidebarLayout></SidebarLayout>
        </View>
    );
}