import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Pressable,
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
import { getClerkJwtTemplateCandidates } from "@/lib/clerk-jwt-template";

import {
  getOnboardingRedirectHref,
  shouldAutoSelectSingleOrganization,
  shouldShowCreateBaby,
} from "@/lib/onboarding";

import { CreateBaby } from "@/components/organisms";
import { AloraLogo } from "@/components/atoms/AloraLogo";
import { GlassCard } from "@/components/atoms/GlassCard";
import { GradientButton } from "@/components/atoms/GradientButton";
import { Input } from "@/components/atoms/Input";
import { Text } from "@/components/ui/Text";
import { COLORS, SHADOWS, BACKGROUND } from "@/lib/theme";

export default function OnboardingScreen() {
  const {
    isSignedIn,
    orgId,
    getToken,
    isLoaded: isAuthLoaded,
  } = useAuth({
    treatPendingAsSignedOut: false,
  });
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
        for (const template of getClerkJwtTemplateCandidates()) {
          const token = await getToken({ template, skipCache: true });
          if (token) break;
        }
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
    <View style={{ flex: 1, backgroundColor: BACKGROUND.primary }}>
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
          <AloraLogo size={80} showText={false} />
          <Text style={styles.welcomeText} variant="body" color="secondary">
            Welcome to Alora
          </Text>
        </MotiView>

        <Text variant="h2" color="primary" style={styles.title}>
          Set up your family
        </Text>
        <Text variant="body" color="secondary" style={styles.subtitle}>
          Create a warm space to track your little one's precious moments
        </Text>

        <GlassCard variant="default" size="lg" style={styles.card}>
          {!isLoaded ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.terracotta} />
              <Text style={styles.loadingText} color="secondary">
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
                  <Text style={styles.sectionTitle} color="secondary">
                    Your families
                  </Text>
                  {userMemberships.data.map((membership, index) => (
                    <MotiView
                      key={membership.id}
                      from={{ opacity: 0, translateX: -20 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      transition={{ delay: index * 100 }}
                    >
                      <Pressable
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
                                ? COLORS.terracotta
                                : COLORS.sage
                            }
                          />
                          <Text
                            style={[
                              styles.orgName,
                              selectingOrgId === membership.organization.id &&
                                styles.orgNameActive,
                            ]}
                            color="primary"
                          >
                            {membership.organization.name}
                          </Text>
                        </View>
                        {selectingOrgId === membership.organization.id ? (
                          <ActivityIndicator
                            size="small"
                            color={COLORS.terracotta}
                          />
                        ) : (
                          <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={COLORS.sage}
                          />
                        )}
                      </Pressable>
                    </MotiView>
                  ))}
                </>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="home-outline" size={40} color={COLORS.sage} />
                  <Text style={styles.emptyText} color="secondary">
                    You haven't created a family space yet.
                  </Text>
                </View>
              )}

              <Text style={styles.createTitle} color="secondary">
                Create a new family
              </Text>

              <Input
                placeholder="Family name (e.g., The Johnsons)"
                value={orgName}
                onChangeText={setOrgName}
                leftIcon={
                  <Ionicons name="home-outline" size={20} color={COLORS.sage} />
                }
                animated={false}
              />

              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="alert-circle"
                    size={18}
                    color={COLORS.terracotta}
                  />
                  <Text style={styles.errorText} color="terracotta">
                    {error}
                  </Text>
                </View>
              ) : null}

              <GradientButton
                variant="primary"
                onPress={handleCreateOrganization}
                loading={creating}
                disabled={!isLoaded}
                size="lg"
                style={styles.createButton}
                icon={
                  <Ionicons name="add-circle-outline" size={20} color="#fff" />
                }
              >
                Create and continue
              </GradientButton>
            </ScrollView>
          )}
        </GlassCard>

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
  welcomeText: {
    marginTop: 12,
    fontFamily: "CareJournalUI",
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 280,
    fontFamily: "CareJournalUI",
  },
  card: {
    width: "100%",
    maxWidth: 380,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 12,
    fontFamily: "CareJournalUI",
    fontSize: 14,
  },
  scrollView: {
    maxHeight: 360,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "CareJournalUISemiBold",
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
    borderColor: BACKGROUND.tertiary,
    backgroundColor: BACKGROUND.primary,
    marginBottom: 10,
  },
  orgButtonActive: {
    borderColor: COLORS.terracotta,
    backgroundColor: BACKGROUND.secondary,
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
    fontFamily: "CareJournalUISemiBold",
    marginLeft: 12,
  },
  orgNameActive: {
    color: COLORS.terracotta,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "CareJournalUI",
    textAlign: "center",
  },
  createTitle: {
    fontSize: 14,
    fontFamily: "CareJournalUISemiBold",
    marginTop: 24,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: BACKGROUND.secondary,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BACKGROUND.tertiary,
  },
  errorText: {
    fontFamily: "CareJournalUIMedium",
    fontSize: 14,
    flex: 1,
  },
  createButton: {
    marginTop: 8,
    ...SHADOWS.md,
  },
});
