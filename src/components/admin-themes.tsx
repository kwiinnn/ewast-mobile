import { SectionList, Text, View } from "react-native";

export default function ThemesView({ data = [] }) {
  const sections = data.map((item) => ({
    title: item.title,
    data: item.codes ?? [],
  }));

  return (
    <View className="px-5 pb-5">
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderSectionHeader={({ section }) => (
          <Text className="font-bold underline mt-4 mb-1">{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <Text className="font-base italic py-1">{item}</Text>
        )}
      />
    </View>
  );
}