import { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MotiView } from "moti";
import { router } from "expo-router";
import { useOrganizationList, useAuth } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

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

  const babies = useQuery(
    api.functions.babies.index.listByOrganization,
    isSignedIn && orgId ? {} : "skip"
  );

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (isSignedIn) return;

    const timer = setTimeout(() => {
      if (!redirectToLoginAttempted.current) {
        redirectToLoginAttempted.current = true;
        router.replace("/(auth)/login");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isAuthLoaded, isSignedIn]);

  useEffect(() => {
    if (!isLoaded || orgId) return;
    if (autoSelectAttempted.current) return;
    const memberships = userMemberships.data ?? [];
    if (memberships.length === 1) {
      if (!setActive) return;
      autoSelectAttempted.current = true;
      void setActive({ organization: memberships[0].organization.id });
    }
  }, [isLoaded, orgId, userMemberships.data, setActive]);

  useEffect(() => {
    if (isSignedIn && orgId && !redirectToDashboardAttempted.current) {
      redirectToDashboardAttempted.current = true;
      router.replace("/(tabs)/dashboard");
    }
  }, [isSignedIn, orgId]);

  useEffect(() => {
    if (
      isSignedIn &&
      orgId &&
      Array.isArray(babies) &&
      babies.length > 0 &&
      !showCreateBaby &&
      !redirectToDashboardAttempted.current
    ) {
      redirectToDashboardAttempted.current = true;
      router.replace("/(tabs)/dashboard");
    }
  }, [isSignedIn, orgId, babies, showCreateBaby]);

  const handleSelectOrganization = async (organizationId: string) => {
    setError("");
    if (!setActive) {
      setError("Organizations are still loading. Please try again.");
      return;
    }
    try {
      await setActive({ organization: organizationId });
      await getToken({ template: "convex", skipCache: true });
      setShowCreateBaby(true);
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Failed to select organization.");
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
      await setActive({ organization: org.id });
      await getToken({ template: "convex", skipCache: true });
      setShowCreateBaby(true);
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
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        Set up your family
      </Text>
      <Text
        style={{
          fontSize: 16,
          textAlign: "center",
          marginBottom: 24,
          color: "#666",
        }}
      >
        Create or select a family organization to continue.
      </Text>

      <GlassCard style={{ width: "100%", padding: 20 }}>
        {!isLoaded ? (
          <View style={{ alignItems: "center", paddingVertical: 24 }}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : (
          <ScrollView style={{ maxHeight: 320 }}>
            {userMemberships.data?.length ? (
              <>
                <Text
                  style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}
                >
                  Your organizations
                </Text>
                {userMemberships.data.map((membership) => (
                  <Pressable
                    key={membership.id}
                    onPress={() =>
                      handleSelectOrganization(membership.organization.id)
                    }
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 14,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      marginBottom: 10,
                    }}
                  >
                    <Text style={{ fontSize: 16, fontWeight: "600" }}>
                      {membership.organization.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                      Tap to select
                    </Text>
                  </Pressable>
                ))}
              </>
            ) : (
              <Text style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>
                You don’t have any organizations yet.
              </Text>
            )}

            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 12 }}>
              Create a new family
            </Text>
            <TextInput
              value={orgName}
              onChangeText={setOrgName}
              placeholder="Family name (e.g., The Johnsons)"
              placeholderTextColor="#9ca3af"
              style={{
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 12,
                marginTop: 10,
                marginBottom: 12,
                color: "#111827",
              }}
            />

            {error ? (
              <Text style={{ color: "#ef4444", marginBottom: 10 }}>
                {error}
              </Text>
            ) : null}

            <Pressable
              onPress={handleCreateOrganization}
              disabled={creating || !isLoaded}
              style={{
                backgroundColor: creating ? "#a5b4fc" : "#6366f1",
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              {creating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}
                >
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
