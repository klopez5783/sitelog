import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Card from "../../ui/Card";
import EmptyState from "./EmptyState";
import ChipSelector from "../../ui/ChipSelector";

const CATEGORIES = [
  {
    id: "contracts",
    name: "Contracts",
    description: "Agreements and signed contracts",
    emoji: "📝",
  },
  {
    id: "permits",
    name: "Permits",
    description: "Building permits and approvals",
    emoji: "🏛️",
  },
  {
    id: "plans",
    name: "Plans",
    description: "Blueprints and drawings",
    emoji: "📐",
  },
  {
    id: "photos",
    name: "Photos",
    description: "Site photos and progress images",
    emoji: "📸",
  },
];

export default function TabDocuments({ documents, jobId }) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(null); // null = All

  const filteredDocs = activeCategory
    ? documents.filter((d) => d.category === activeCategory)
    : documents;

  const getCategoryEmoji = (categoryId) =>
    CATEGORIES.find((c) => c.id === categoryId)?.emoji || "📄";

  const getCategoryName = (categoryId) =>
    CATEGORIES.find((c) => c.id === categoryId)?.name || categoryId;

  const categoryOptions = [
    { id: null, label: `All (${documents.length})` },
    ...CATEGORIES.map((c) => ({
      id: c.id,
      label: `${c.emoji} ${c.name}${
        documents.filter((d) => d.category === c.id).length > 0
          ? ` (${documents.filter((d) => d.category === c.id).length})`
          : ""
      }`,
    })),
  ];

  return (
    <ScrollView
      className="flex-1 px-4 pt-4"
      showsVerticalScrollIndicator={false}
    >
      {/* Upload button */}
      <TouchableOpacity
        className="bg-primary rounded-2xl py-4 items-center mb-4"
        onPress={() =>
          router.push(
            `/job/document/add?jobId=${jobId}${activeCategory ? `&category=${activeCategory}` : ""}`,
          )
        }
      >
        <Text className="text-white font-bold">+ Upload Document</Text>
      </TouchableOpacity>

      {/* Category filter chips */}
      <ChipSelector
        options={categoryOptions}
        selected={activeCategory}
        onSelect={setActiveCategory}
        peek={true} // no scroll hint needed — all chips visible by default
        allowDeselect={false} // tapping active category won't clear it (use "All" instead)
      />


      {/* Empty state — no documents at all */}
      {documents.length === 0 ? (
        <View className="gap-3">
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() =>
                router.push(
                  `/job/document/add?jobId=${jobId}&category=${cat.id}`,
                )
              }
              className="bg-surface border border-border rounded-2xl px-4 py-4 flex-row items-center gap-4"
            >
              <View className="w-12 h-12 bg-orange-100 rounded-2xl items-center justify-center">
                <Text className="text-2xl">{cat.emoji}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-title font-bold text-sm">{cat.name}</Text>
                <Text className="text-muted text-xs mt-0.5">
                  {cat.description}
                </Text>
              </View>
              <Text className="text-primary text-lg">+</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : filteredDocs.length === 0 ? (
        /* Empty state — category has no docs */
        <EmptyState
          emoji={getCategoryEmoji(activeCategory)}
          title={`No ${getCategoryName(activeCategory)} yet`}
          subtitle="Tap + Upload Document to add one."
        />
      ) : (
        /* Document list */
        filteredDocs.map((doc) => (
          <Card key={doc.id}>
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-orange-100 rounded-xl items-center justify-center">
                <Text className="text-lg">
                  {getCategoryEmoji(doc.category)}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-title font-semibold text-sm">
                  {doc.name}
                </Text>
                <View className="flex-row items-center gap-2 mt-0.5">
                  {doc.category && (
                    <View className="bg-orange-100 rounded-full px-2 py-0.5">
                      <Text className="text-primary text-xs font-semibold">
                        {getCategoryName(doc.category)}
                      </Text>
                    </View>
                  )}
                  <Text className="text-muted text-xs">
                    {new Date(
                      doc.uploadedAt?.toDate?.() || doc.uploadedAt,
                    ).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        ))
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
