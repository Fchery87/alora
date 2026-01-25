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
import {
  getOnboardingRedirectHref,
  shouldAutoSelectSingleOrganization,
  shouldShowCreateBaby,
} from "@/lib/onboarding";

import { GlassCard } from "@/components/atoms/GlassCard";
import { CreateBaby } from "@/components/organisms";

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
      router.replace(href);
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
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 600 }}
      style={styles.screen}
    >
      <Text style={styles.title}>Set up your family</Text>
      <Text style={styles.subtitle}>
        Create or select a family organization to continue.
      </Text>

      <GlassCard style={styles.card}>
        {!isLoaded ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : (
          <ScrollView style={styles.scroll}>
            {userMemberships.data?.length ? (
              <>
                <Text style={styles.sectionTitle}>Your organizations</Text>
                {userMemberships.data.map((membership) => (
                  <Pressable
                    key={membership.id}
                    onPress={() =>
                      handleSelectOrganization(membership.organization.id)
                    }
                    disabled={Boolean(selectingOrgId) || creating}
                    style={[
                      styles.orgItem,
                      Boolean(selectingOrgId) &&
                        selectingOrgId !== membership.organization.id &&
                        styles.orgItemDisabled,
                    ]}
                  >
                    <Text style={styles.orgName}>
                      {membership.organization.name}
                    </Text>
                    <Text style={styles.orgHint}>Tap to select</Text>
                  </Pressable>
                ))}
              </>
            ) : (
              <Text style={styles.emptyText}>
                You don’t have any organizations yet.
              </Text>
            )}

            <Text style={styles.sectionTitleWithTopMargin}>
              Create a new family
            </Text>
            <TextInput
              value={orgName}
              onChangeText={setOrgName}
              placeholder="Family name (e.g., The Johnsons)"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              onPress={handleCreateOrganization}
              disabled={creating || !isLoaded}
              style={[
                styles.primaryButton,
                creating
                  ? styles.primaryButtonDisabled
                  : styles.primaryButtonEnabled,
              ]}
            >
              {creating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  Create and continue
                </Text>
              )}
            </Pressable>
          </ScrollView>
        )}
      </GlassCard>

      <CreateBaby
        visible={showCreateBaby}
        onClose={() => setShowCreateBaby(false)}
        onSuccess={() => router.replace("/(tabs)/dashboard")}
      />
    </MotiView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
  },
  card: {
    width: "100%",
    padding: 20,
  },
  loading: {
    alignItems: "center",
    paddingVertical: 24,
  },
  scroll: {
    maxHeight: 320,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  sectionTitleWithTopMargin: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  orgItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 10,
  },
  orgItemDisabled: {
    opacity: 0.6,
  },
  orgName: {
    fontSize: 16,
    fontWeight: "600",
  },
  orgHint: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 12,
    color: "#111827",
  },
  error: {
    color: "#ef4444",
    marginBottom: 10,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonEnabled: {
    backgroundColor: "#6366f1",
  },
  primaryButtonDisabled: {
    backgroundColor: "#a5b4fc",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
