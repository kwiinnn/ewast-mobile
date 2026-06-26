import ThemesView from "@/components/admin-themes";
import { useState } from "react";
import { FlatList, Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

type Report = {
  report_id: number;
  type: string;
  latitude: number;
  longitude: number;
  address: string;
};

function ReportModal({ report, onClose }: { report: Report; onClose: () => void }) {
  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-2xl" style={{ maxHeight: "85%" }}>
          <ScrollView className="px-5 py-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-900">Report Details</Text>
              <TouchableOpacity onPress={onClose} className="bg-gray-100 rounded-full px-3 py-1">
                <Text className="text-sm text-gray-500">Close</Text>
              </TouchableOpacity>
            </View>

            <View className="py-3 border-b border-gray-100">
              <Text className="text-sm text-gray-400">Report ID</Text>
              <Text className="text-sm text-gray-800 mt-0.5">{report.report_id}</Text>
            </View>
            <View className="py-3 border-b border-gray-100">
              <Text className="text-sm text-gray-400">Type</Text>
              <Text className="text-sm text-gray-800 mt-0.5">{report.type}</Text>
            </View>
            <View className="py-3 border-b border-gray-100">
              <Text className="text-sm text-gray-400">Address</Text>
              <Text className="text-sm text-gray-800 mt-0.5">{report.address}</Text>
            </View>
            <View className="py-3 border-b border-gray-100">
              <Text className="text-sm text-gray-400">Latitude</Text>
              <Text className="text-sm text-gray-800 mt-0.5">{report.latitude}</Text>
            </View>
            <View className="py-3">
              <Text className="text-sm text-gray-400">Longitude</Text>
              <Text className="text-sm text-gray-800 mt-0.5">{report.longitude}</Text>
            </View>
            <View className="py-3 border-b border-gray-100">
              <Text className="text-sm text-gray-400">Date Reported</Text>
              <Text className="text-sm text-gray-800 mt-0.5">
                {new Date(report.date_reported).toLocaleString()}
              </Text>
            </View>
 
            {report.image_url ? (
              <View className="py-3 border-b border-gray-100">
                <Text className="text-sm text-gray-400 mb-2">Image</Text>
                <Image
                  source={{ uri: report.image_url }}
                  className="w-full h-48 rounded-xl bg-gray-100"
                  resizeMode="cover"
                />
              </View>
            ) : null}
 
            {report.report_summary ? (
              <View className="py-3 border-b border-gray-100">
                <Text className="text-sm text-gray-400">Summary</Text>
                <Text className="text-sm text-gray-800 mt-0.5 leading-5">{report.report_summary}</Text>
              </View>
            ) : null}
 
            {report.report_themes?.length > 0 ? (
              <View className="py-3">
                <Text className="text-sm text-gray-400 mb-2">Report Themes</Text>
                <ThemesView data={report.report_themes} />
              </View>
            ) : null}

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function ReportRow({ report, onViewPress }: { report: Report; onViewPress: () => void }) {
  return (
    <View className="flex-row items-center bg-white border border-gray-100 rounded-xl px-4 py-3 mb-2 gap-3">
      <Text className="text-xs font-bold text-gray-400 w-8">{report.report_id}</Text>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>{report.type}</Text>
        <Text className="text-xs text-gray-400 mt-0.5" numberOfLines={1}>{report.address}</Text>
        <Text className="text-xs text-gray-300 mt-0.5">{report.latitude}, {report.longitude}</Text>
      </View>
      <TouchableOpacity onPress={onViewPress} className="bg-[#21AAE5] rounded-xl px-3 py-1.5">
        <Text className="font-bold text-white ">Show More</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function RecentReports({ data = [] }: { data: Report[] }) {
  const [selected, setSelected] = useState<Report | null>(null);

  return (
    <View className="bg-white w-full flex-1 px-4 pt-6 rounded-2xl border border-[#DAD0D0] overflow-hidden">
      <Text className="font-bold text-gray-900 mb-4">Recent Reports</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.report_id.toString()}
        renderItem={({ item }) => (
          <ReportRow report={item} onViewPress={() => setSelected(item)} />
        )}
        ListEmptyComponent={
          <Text className="text-sm text-gray-400 text-center mt-10">No reports found.</Text>
        }
      />

      {selected ? (
        <ReportModal report={selected} onClose={() => setSelected(null)} />
      ) : null}
    </View>
  );
}