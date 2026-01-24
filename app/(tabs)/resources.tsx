import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import {
  RESOURCES,
  CATEGORIES,
  getResourcesByCategory,
  searchResources,
} from "@/lib/resources";
import { Ionicons } from "@expo/vector-icons";

type CategoryId = (typeof CATEGORIES)[number]["id"];

export default function ResourcesScreen() {
  const [category, setCategory] = useState<CategoryId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedResource, setExpandedResource] = useState<string | null>(null);

  const displayedResources = searchQuery
    ? searchResources(searchQuery)
    : getResourcesByCategory(category);

  const toggleResource = (id: string) => {
    setExpandedResource(expandedResource === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <Header title="Resource Library" showBackButton={false} />

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search resources..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView
        horizontal
        style={styles.categoryRow}
        contentContainerStyle={styles.categoryContent}
        showsHorizontalScrollIndicator={false}
      >
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            style={[
              styles.categoryChip,
              category === cat.id && styles.categoryChipActive,
            ]}
            onPress={() => {
              setCategory(cat.id);
              setSearchQuery("");
            }}
          >
            <Ionicons
              name={cat.icon as any}
              size={16}
              color={category === cat.id ? "#fff" : "#64748b"}
            />
            <Text
              style={[
                styles.categoryText,
                category === cat.id && styles.categoryTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultsCount}>
          {displayedResources.length}{" "}
          {displayedResources.length === 1 ? "article" : "articles"}
        </Text>

        {displayedResources.map((resource) => (
          <Pressable
            key={resource.id}
            style={styles.resourceCard}
            onPress={() => toggleResource(resource.id)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {resource.category.charAt(0).toUpperCase() +
                      resource.category.slice(1)}
                  </Text>
                </View>
                <Text style={styles.readTime}>
                  <Ionicons name="time" size={12} color="#9ca3af" />{" "}
                  {resource.readTime} min
                </Text>
              </View>
              <Text style={styles.resourceTitle}>{resource.title}</Text>
            </View>

            <View style={styles.tagRow}>
              {resource.tags.slice(0, 3).map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>

            {expandedResource === resource.id && (
              <View style={styles.expandedContent}>
                <Text style={styles.contentText}>{resource.content}</Text>
              </View>
            )}

            <View style={styles.cardFooter}>
              <Text style={styles.expandText}>
                {expandedResource === resource.id ? "Show less" : "Read more"}
              </Text>
              <Ionicons
                name={
                  expandedResource === resource.id
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={18}
                color="#6366f1"
              />
            </View>
          </Pressable>
        ))}

        {displayedResources.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyStateTitle}>No resources found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or category
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
  },
  categoryRow: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#6366f1",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  categoryTextActive: {
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 12,
  },
  resourceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
  },
  readTime: {
    fontSize: 12,
    color: "#9ca3af",
    flexDirection: "row",
    alignItems: "center",
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    lineHeight: 24,
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: "#0369a1",
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    marginTop: 12,
    paddingTop: 12,
  },
  contentText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f8fafc",
  },
  expandText: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
});
