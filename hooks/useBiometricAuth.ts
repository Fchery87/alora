import { useCallback } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { useToast } from "../components/atoms/Toast";

export function useBiometricAuth() {
  const toast = useToast();

  const authenticateForJournal = useCallback(async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();

      if (!hasHardware) {
        toast.info(
          "Biometrics Not Available",
          "Your device doesn't support biometric authentication"
        );
        return true;
      }

      const hasEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasEnrolled) {
        toast.warning(
          "No Biometrics Enrolled",
          "Please set up Face ID or Touch ID in your device settings"
        );
        return true;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access journal",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
        fallbackLabel: "Use Passcode",
      });

      if (result.success) {
        return true;
      }

      if (result.error === "user_cancel") {
        return false;
      }

      toast.error(
        "Authentication Failed",
        "Please try again or use your device passcode"
      );

      return false;
    } catch (error) {
      console.error("[useBiometricAuth] Error:", error);
      toast.error(
        "Authentication Error",
        "Unable to authenticate. Please try again."
      );
      return false;
    }
  }, [toast]);

  const checkBiometricSupport = useCallback(async (): Promise<{
    available: boolean;
    enrolled: boolean;
    type: LocalAuthentication.AuthenticationType | null;
  }> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();

      if (!hasHardware) {
        return { available: false, enrolled: false, type: null };
      }

      const hasEnrolled = await LocalAuthentication.isEnrolledAsync();

      const types =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      return {
        available: hasHardware,
        enrolled: hasEnrolled,
        type:
          types.length > 0
            ? (types[0] as LocalAuthentication.AuthenticationType)
            : null,
      };
    } catch {
      return { available: false, enrolled: false, type: null };
    }
  }, []);

  return {
    authenticateForJournal,
    checkBiometricSupport,
  };
}
