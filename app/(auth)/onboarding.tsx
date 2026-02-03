import { useCallback, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MotiView } from "moti";
import { router } from "expo-router";
import { useOrganizationList, useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import {
  getOnboardingRedirectHref,
  shouldAutoSelectSingleOrganization,
  shouldShowCreateBaby,
} from "@/lib/onboarding";

import { CreateBaby } from "@/components/organisms";

// Celestial Nurture Design System Colors
const COLORS = {
  background: "#FAF7F2",
  primary: "#D4A574", // Terracotta
  secondary: "#8B9A7D", // Sage
  accent: "#C9A227", // Gold
  textPrimary: "#2D2A26",
  textSecondary: "#6B6560",
  cream: "#FAF7F2",
  clay: "#B8956A",
  moss: "#7A8B6E",
};

export default function OnboardingScreen() {
  const { isSignedIn, orgId, getToken, isLoaded: isAuthLoaded } = useAuth();
  const { isLoaded, createOrganization, setActive, userMemberships } =
    useOrganizationList({ userMemberships: true });
  const [showCreateBaby, setShowCreateBaby] = useState(false);
  const autoSelectAttempted = useRef(false);
  const redirectToLoginAttempted = useRef(false);
  const redirectToDashboardAttempted = useRef(false);

  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [selectingOrgId, setSelectingOrgId] = useState<string | null>(null);
  const [orgActivationComplete, setOrgActivationComplete] = useState(false);

  const babies = useQuery(
    api.functions.babies.index.listByOrganization,
    isSignedIn && orgId ? {} : "skip"
  );

  const activateOrganization = useCallback(
    async (organizationId: string) => {
      setError("");
      setOrgActivationComplete(false);
      if (!setActive) {
        setError("Organizations are still loading. Please try again.");
        return;
      }
      try {
        await setActive({ organization: organizationId });
        await getToken({ template: "convex", skipCache: true });
        setOrgActivationComplete(true);
      } catch (err: any) {
        setError(
          err?.errors?.[0]?.message || "Failed to activate organization."
        );
      }
    },
    [getToken, setActive]
  );

  useEffect(() => {
    const href = getOnboardingRedirectHref({
      isAuthLoaded,
      isSignedIn: Boolean(isSignedIn),
      orgId,
      babiesCount: Array.isArray(babies) ? babies.length : null,
    });

    if (!href) return;

    if (href === "/(auth)/login") {
      const timer = setTimeout(() => {
        if (!redirectToLoginAttempted.current) {
          redirectToLoginAttempted.current = true;
          router.replace(href);
        }
      }, 300);

      return () => clearTimeout(timer);
    }

    if (!redirectToDashboardAttempted.current) {
      redirectToDashboardAttempted.current = true;
      router.replace(href as any);
    }
  }, [isAuthLoaded, isSignedIn, orgId, babies]);

  useEffect(() => {
    if (autoSelectAttempted.current) return;
    const membershipsCount = userMemberships.data?.length ?? null;

    if (
      shouldAutoSelectSingleOrganization({
        isOrgListLoaded: isLoaded,
        currentOrgId: orgId,
        membershipsCount,
      })
    ) {
      autoSelectAttempted.current = true;
      void activateOrganization(userMemberships.data![0].organization.id);
    }
  }, [activateOrganization, isLoaded, orgId, userMemberships.data]);

  useEffect(() => {
    const shouldShow = shouldShowCreateBaby({
      isAuthLoaded,
      isSignedIn: Boolean(isSignedIn),
      orgId,
      babiesCount: Array.isArray(babies) ? babies.length : null,
    });

    if (orgActivationComplete && shouldShow) setShowCreateBaby(true);
  }, [isAuthLoaded, isSignedIn, orgId, babies, orgActivationComplete]);

  const handleSelectOrganization = async (organizationId: string) => {
    try {
      setSelectingOrgId(organizationId);
      await activateOrganization(organizationId);
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Failed to select organization.");
    } finally {
      setSelectingOrgId(null);
    }
  };

  const handleCreateOrganization = async () => {
    const trimmedName = orgName.trim();
    if (!trimmedName) {
      setError("Please enter a family name.");
      return;
    }
    if (!createOrganization || !setActive) {
      setError("Organizations are still loading. Please try again.");
      return;
    }

    setCreating(true);
    setError("");
    try {
      const org = await createOrganization({ name: trimmedName });
      await activateOrganization(org.id);
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Failed to create organization.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Subtle gradient overlay */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: COLORS.background },
        ]}
      />

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 600 }}
        style={styles.container}
      >
        {/* Welcome illustration/icon area */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 800, delay: 200 }}
          style={styles.welcomeContainer}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="heart-outline" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.welcomeText}>Welcome to Alora</Text>
        </MotiView>

        <Text style={styles.title}>Set up your family</Text>
        <Text style={styles.subtitle}>
          Create a warm space to track your little one's precious moments
        </Text>

        <View style={styles.card}>
          {!isLoaded ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>
                Loading your family space...
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              {userMemberships.data?.length ? (
                <>
                  <Text style={styles.sectionTitle}>Your families</Text>
                  {userMemberships.data.map((membership) => (
                    <Pressable
                      key={membership.id}
                      onPress={() =>
                        handleSelectOrganization(membership.organization.id)
                      }
                      disabled={Boolean(selectingOrgId) || creating}
                      style={[
                        styles.orgButton,
                        selectingOrgId === membership.organization.id &&
                          styles.orgButtonActive,
                        Boolean(selectingOrgId) &&
                          selectingOrgId !== membership.organization.id &&
                          styles.orgButtonDisabled,
                      ]}
                    >
                      <View style={styles.orgButtonContent}>
                        <Ionicons
                          name="people-outline"
                          size={20}
                          color={
                            selectingOrgId === membership.organization.id
                              ? COLORS.primary
                              : COLORS.textSecondary
                          }
                        />
                        <Text
                          style={[
                            styles.orgName,
                            selectingOrgId === membership.organization.id &&
                              styles.orgNameActive,
                          ]}
                        >
                          {membership.organization.name}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={COLORS.textSecondary}
                      />
                    </Pressable>
                  ))}
                </>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="home-outline"
                    size={40}
                    color={COLORS.secondary}
                  />
                  <Text style={styles.emptyText}>
                    You haven't created a family space yet.
                  </Text>
                </View>
              )}

              <Text style={styles.createTitle}>Create a new family</Text>
              <TextInput
                value={orgName}
                onChangeText={setOrgName}
                placeholder="Family name (e.g., The Johnsons)"
                placeholderTextColor={COLORS.textSecondary}
                style={styles.input}
              />

              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="alert-circle"
                    size={18}
                    color={COLORS.primary}
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <Pressable
                onPress={handleCreateOrganization}
                disabled={creating || !isLoaded}
                style={[
                  styles.createButton,
                  creating
                    ? styles.createButtonDisabled
                    : styles.createButtonEnabled,
                ]}
              >
                {creating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      color="#fff"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.createButtonText}>
                      Create and continue
                    </Text>
                  </>
                )}
              </Pressable>
            </ScrollView>
          )}
        </View>

        <CreateBaby
          visible={showCreateBaby}
          onClose={() => setShowCreateBaby(false)}
          onSuccess={() => router.replace("/(tabs)/dashboard")}
        />
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(212, 165, 116, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "rgba(212, 165, 116, 0.3)",
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontFamily: "DMSans-Regular",
  },
  title: {
    fontSize: 34,
    fontFamily: "CrimsonPro-SemiBold",
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: COLORS.textSecondary,
    fontFamily: "DMSans-Regular",
    maxWidth: 280,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 24,
    padding: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(212, 165, 116, 0.2)",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontFamily: "DMSans-Regular",
    fontSize: 14,
  },
  scrollView: {
    maxHeight: 360,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "DMSans-SemiBold",
    color: COLORS.textSecondary,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  orgButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(139, 154, 125, 0.25)",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    marginBottom: 10,
  },
  orgButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(212, 165, 116, 0.08)",
  },
  orgButtonDisabled: {
    opacity: 0.5,
  },
  orgButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  orgName: {
    fontSize: 16,
    fontFamily: "DMSans-SemiBold",
    color: COLORS.textPrimary,
  },
  orgNameActive: {
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontFamily: "DMSans-Regular",
    textAlign: "center",
  },
  createTitle: {
    fontSize: 14,
    fontFamily: "DMSans-SemiBold",
    color: COLORS.textSecondary,
    marginTop: 24,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "rgba(212, 165, 116, 0.3)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    color: COLORS.textPrimary,
    fontFamily: "DMSans-Regular",
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(212, 165, 116, 0.1)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.primary,
    fontFamily: "DMSans-Medium",
    fontSize: 14,
    flex: 1,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  createButtonEnabled: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonDisabled: {
    backgroundColor: "rgba(212, 165, 116, 0.5)",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "DMSans-SemiBold",
  },
});
