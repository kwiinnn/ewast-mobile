import AdminHeatmap from "@/components/admin-heatmap";
import MetricCard from "@/components/admin-metric";
import RecentReports from "@/components/admin-reports";
import SidebarLayout from "@/components/admin-sidebar.web";
import ThemesView from "@/components/admin-themes";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function AdminDashboard() {
    const [reportData, setReportData] = useState([]);
    const [reportError, setReportError] = useState<string | null>(null);
    const [themesData, setThemesData] = useState([]);
    const [themesError, setThemesError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/reports/stats/report-themes");
                if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
                const data = await res.json();
                setThemesData(data);
            } catch (err) {
                setThemesError(err instanceof Error ? err.message : "Something went wrong");
            }

            try {
                const res = await fetch("http://localhost:8000/api/reports");
                if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
                const data = await res.json();
                setReportData(data);
            } catch (err) {
                setReportError(err instanceof Error ? err.message : "Something went wrong");
            }
        };

        fetchData();
    }, []);


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
                        <RecentReports data={reportData}></RecentReports>
                    </View>



                    {/* Thematic Analysis Breakdown */}
                    <View className="flex w-full bg-white rounded-2xl border border-[#DAD0D0] overflow-hidden">
                        <View className="px-5 py-4 border-b border-gray-100">
                            <Text className="font-bold text-gray-900">Report Description Analysis</Text>
                        </View>

                        {!themesError && (<ThemesView data={themesData}></ThemesView>)}
                        {themesError && (<Text>Network Error when attempting to fetch resource</Text>)}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}