import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Header } from "@/components/layout/Header";
import { Text } from "@/components/ui/Text";
import { Card } from "@/components/ui/Card";
import { OrganicBackground } from "@/components/atoms/OrganicBackground";
import {
  CATEGORIES,
  getResourcesByCategory,
  searchResources,
} from "@/lib/resources";
import { Ionicons } from "@expo/vector-icons";
import { BACKGROUND, COLORS, SHADOWS } from "@/lib/theme";

type CategoryId = (typeof CATEGORIES)[number]["id"];

export default function ResourcesScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<CategoryId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedResource, setExpandedResource] = useState<string | null>(null);

  const displayedResources = searchQuery
    ? searchResources(searchQuery)
    : getResourcesByCategory(category);

  const toggleResource = (id: string) => {
    setExpandedResource(expandedResource === id ? null : id);
  };

  const exploreItems = [
    {
      icon: "people",
      label: "Partner Support",
      description: "Strengthen your co-parenting connection",
      color: COLORS.terracotta,
      route: "/(tabs)/partner-support",
    },
    {
      icon: "heart",
      label: "Wellness",
      description: "Health insights and reminders",
      color: COLORS.sage,
      route: "/(tabs)/wellness",
    },
    {
      icon: "musical-notes",
      label: "Sounds",
      description: "Calming sounds for baby",
      color: COLORS.gold,
      route: "/(tabs)/sounds",
    },
    {
      icon: "home",
      label: "Family",
      description: "Manage family access",
      color: COLORS.moss,
      route: "/(tabs)/family",
    },
    {
      icon: "book",
      label: "Journal",
      description: "Daily reflections and memories",
      color: COLORS.clay,
      route: "/(tabs)/journal",
    },
  ];

  return (
    <OrganicBackground>
      <View style={styles.container}>
        <Header title="Explore" showBackButton={false} />

        {/* Quick Access Menu */}
        <View style={styles.quickAccessSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            {exploreItems.map((item) => (
              <Pressable
                key={item.label}
                style={styles.quickAccessCard}
                onPress={() => router.push(item.route as any)}
              >
                <View
                  style={[
                    styles.quickAccessIcon,
                    { backgroundColor: `${item.color}15` },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={item.color}
                  />
                </View>
                <Text style={styles.quickAccessLabel}>{item.label}</Text>
                <Text style={styles.quickAccessDescription}>
                  {item.description}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Resource Library Section */}
        <View style={styles.librarySection}>
          <Text style={styles.sectionTitle}>Resource Library</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={COLORS.stone} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search resources..."
              placeholderTextColor={COLORS.stone}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <Pressable onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color={COLORS.stone} />
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
                color={category === cat.id ? "#fff" : COLORS.warmDark}
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
              style={styles.cardWrapper}
              onPress={() => toggleResource(resource.id)}
            >
              <Card variant="elevated" style={styles.resourceCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleRow}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {resource.category.charAt(0).toUpperCase() +
                          resource.category.slice(1)}
                      </Text>
                    </View>
                    <View style={styles.readTime}>
                      <Ionicons name="time" size={12} color={COLORS.stone} />
                      <Text style={styles.readTimeText}>
                        {resource.readTime} min
                      </Text>
                    </View>
                  </View>
                  <Text
                    variant="h3"
                    color="primary"
                    style={styles.resourceTitle}
                  >
                    {resource.title}
                  </Text>
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
                    <Text
                      variant="body"
                      color="secondary"
                      style={styles.contentText}
                    >
                      {resource.content}
                    </Text>
                  </View>
                )}

                <View style={styles.cardFooter}>
                  <Text style={styles.expandText}>
                    {expandedResource === resource.id
                      ? "Show less"
                      : "Read more"}
                  </Text>
                  <Ionicons
                    name={
                      expandedResource === resource.id
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={18}
                    color={COLORS.terracotta}
                  />
                </View>
              </Card>
            </Pressable>
          ))}

          {displayedResources.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={56} color={COLORS.sage} />
              <Text
                variant="h3"
                color="secondary"
                style={styles.emptyStateTitle}
              >
                No resources found
              </Text>
              <Text
                variant="caption"
                color="tertiary"
                style={styles.emptyStateText}
              >
                Try adjusting your search or category
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </OrganicBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  quickAccessSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "CareJournalUIMedium",
    color: COLORS.stone,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  quickAccessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickAccessCard: {
    width: "48%",
    backgroundColor: BACKGROUND.card,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
  },
  quickAccessIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickAccessLabel: {
    fontSize: 16,
    fontFamily: "CareJournalUIMedium",
    color: COLORS.warmDark,
    marginBottom: 4,
  },
  quickAccessDescription: {
    fontSize: 12,
    fontFamily: "CareJournalUI",
    color: COLORS.stone,
    lineHeight: 16,
  },
  librarySection: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BACKGROUND.card,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: COLORS.warmDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.warmDark,
    fontFamily: "CareJournalUI",
  },
  categoryRow: {
    maxHeight: 64,
    backgroundColor: "transparent",
  },
  categoryContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: BACKGROUND.card,
    marginRight: 4,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
    shadowColor: COLORS.warmDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryChipActive: {
    backgroundColor: COLORS.terracotta,
    borderColor: COLORS.terracotta,
    shadowColor: COLORS.terracotta,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.warmDark,
    fontFamily: "CareJournalUI",
  },
  categoryTextActive: {
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: COLORS.stone,
    marginBottom: 16,
    fontFamily: "CareJournalUI",
    fontWeight: "500",
  },
  cardWrapper: {
    marginBottom: 16,
  },
  resourceCard: {
    padding: 18,
    ...SHADOWS.sm,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: `${COLORS.terracotta}12`,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.terracotta,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "CareJournalUIMedium",
  },
  readTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  readTimeText: {
    fontSize: 12,
    color: COLORS.stone,
    fontFamily: "CareJournalUI",
    fontWeight: "500",
  },
  resourceTitle: {
    lineHeight: 26,
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "rgba(139, 154, 125, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(139, 154, 125, 0.2)",
  },
  tagText: {
    fontSize: 12,
    color: COLORS.sage,
    fontFamily: "CareJournalUI",
    fontWeight: "500",
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: "rgba(212, 165, 116, 0.15)",
    marginTop: 12,
    paddingTop: 14,
  },
  contentText: {
    lineHeight: 24,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(139, 154, 125, 0.1)",
  },
  expandText: {
    fontSize: 14,
    color: COLORS.terracotta,
    fontWeight: "600",
    fontFamily: "CareJournalUIMedium",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 56,
  },
  emptyStateTitle: {
    marginTop: 20,
  },
  emptyStateText: {
    marginTop: 8,
  },
});
