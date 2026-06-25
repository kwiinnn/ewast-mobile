import AdminHeatmap from "@/components/admin-heatmap";
import MetricCard from "@/components/admin-metric";
import SidebarLayout from "@/components/admin-sidebar.web";
import { ScrollView, Text, View } from "react-native";

export default function AdminDashboard() {
    return (
        <View className="flex-row h-full">
            <SidebarLayout></SidebarLayout>

            {/* where the dashboard stuff is actually put*/}
            <ScrollView className="w-full">
                <View className="flex-col w-full p-6 gap-4">
                    {/* Heading */}
                    <Text className="text-2xl font-bold">Davao City</Text>

                    {/* Heatmap and AI Summary Container */}
                    <View className="flex-row gap-4">
                        <AdminHeatmap></AdminHeatmap>
                        <View className="bg-[rgba(234,196,53,0.25)] w-1/2 rounded-2xl border border-[#DAD0D0] overflow-hidden">
                            {/* heading */}
                            <View className="px-5 py-4">
                                <Text className="font-bold">AI Summary</Text>
                            </View>

                            <View className="px-5 py-4">
                                <Text className="font-normal">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ac arcu  ligula. In vestibulum vel augue vel convallis.  Aenean ut nisl lobortis,  convallis leo eu, luctus diam. Aenean vel faucibus quam. Sed imperdiet vitae dolor vel eleifend.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Metrics */}
                    <View className="w-full flex-row gap-4">
                        <MetricCard
                            className="flex-1"
                            heading="Most Frequently Reported"
                            endpoint="http://localhost:3000/api/rankings"> 
                            {/* test endpoint */}
                        </MetricCard>
                        <MetricCard
                            className="flex-1"
                            heading="Report Density"
                            endpoint="http://localhost:3000/api/rankings">
                        </MetricCard>
                        <MetricCard
                            className="flex-1"
                            heading="Report Tally Per Type"
                            endpoint="http://localhost:3000/api/rankings">
                        </MetricCard>
                    </View>

                    {/* Recent Reports */}
                    <View>
                        
                    </View>

                    {/* Thematic Analysis Breakdown */}
                    <View>

                    </View>
                </View>
            </ScrollView>
        </View>
    );
}