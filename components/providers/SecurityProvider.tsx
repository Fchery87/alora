import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  AppState,
  AppStateStatus,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { SessionLockManager } from "@/lib/session-lock";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

interface SecurityState {
  isLocked: boolean;
  isAuthenticated: boolean;
  biometricType: LocalAuthentication.AuthenticationType | null;
  requireBiometrics: boolean;
  lockTimeoutMinutes: number;
  lock: () => Promise<void>;
  unlock: () => Promise<void>;
  authenticate: () => Promise<boolean>;
  setupAutoLock: () => void;
  clearSession: () => Promise<void>;
}

const SecurityContext = createContext<SecurityState | null>(null);

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
}

interface SecurityProviderProps {
  children: React.ReactNode;
  requireBiometrics?: boolean;
  lockTimeoutMinutes?: number;
}

export function SecurityProvider({
  children,
  requireBiometrics = false,
  lockTimeoutMinutes = 5,
}: SecurityProviderProps) {
  const { signOut } = useAuth();
  const [isLocked, setIsLocked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [biometricType, setBiometricType] =
    useState<LocalAuthentication.AuthenticationType | null>(null);
  const [showLockScreen, setShowLockScreen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const lastActivityTime = useRef(Date.now());
  const lockTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      const supported = await LocalAuthentication.hasHardwareAsync();
      if (supported) {
        const types =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.length > 0) {
          setBiometricType(types[0] as LocalAuthentication.AuthenticationType);
        }
      }
    };

    checkBiometricSupport();
    initializeSession();
  }, []);

  const initializeSession = async () => {
    const locked = await SessionLockManager.isSessionLocked();
    setIsLocked(locked);
    setShowLockScreen(locked);
    if (!locked) {
      setIsAuthenticated(true);
    }
  };

  const setupAutoLock = useCallback(() => {
    if (lockTimerRef.current) {
      clearInterval(lockTimerRef.current);
    }

    lockTimerRef.current = setInterval(() => {
      const inactiveTime = Date.now() - lastActivityTime.current;
      const timeoutMs = lockTimeoutMinutes * 60 * 1000;

      if (inactiveTime >= timeoutMs && !isLocked) {
        lock();
      }
    }, 30000);

    const resetTimer = () => {
      if (!isLocked) {
        lastActivityTime.current = Date.now();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      (state: AppStateStatus) => {
        if (state === "active") {
          resetTimer();
        } else if (state === "background") {
          lock();
        }
      }
    );

    return () => {
      if (lockTimerRef.current) {
        clearInterval(lockTimerRef.current);
      }
      subscription.remove();
    };
  }, [isLocked, lockTimeoutMinutes]);

  const lock = useCallback(async () => {
    setIsLocked(true);
    setIsAuthenticated(false);
    setShowLockScreen(true);
    await SessionLockManager.lock();
  }, []);

  const unlock = useCallback(async () => {
    setIsLocked(false);
    setIsAuthenticated(true);
    setShowLockScreen(false);
    await SessionLockManager.unlock();
    lastActivityTime.current = Date.now();
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (isAuthenticating) return false;

    setIsAuthenticating(true);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access Alora",
        cancelLabel: "Cancel",
        disableDeviceFallback: true,
      });

      if (result.success) {
        await unlock();
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, [isAuthenticating, unlock]);

  const clearSession = useCallback(async () => {
    setIsLocked(true);
    setIsAuthenticated(false);
    setShowLockScreen(true);
    await SessionLockManager.lock();
    await signOut();
    router.replace("/(auth)/login");
  }, [signOut]);

  const getBiometricIcon = () => {
    switch (biometricType) {
      case LocalAuthentication.AuthenticationType.FINGERPRINT:
        return "finger-print";
      case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
        return "face-id";
      case LocalAuthentication.AuthenticationType.IRIS:
        return "eye";
      default:
        return "lock-closed";
    }
  };

  const getBiometricLabel = () => {
    switch (biometricType) {
      case LocalAuthentication.AuthenticationType.FINGERPRINT:
        return "Touch the sensor";
      case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
        return "Look at your device";
      case LocalAuthentication.AuthenticationType.IRIS:
        return "Scan your iris";
      default:
        return "Authenticate";
    }
  };

  const value: SecurityState = {
    isLocked,
    isAuthenticated,
    biometricType,
    requireBiometrics,
    lockTimeoutMinutes,
    lock,
    unlock,
    authenticate,
    setupAutoLock,
    clearSession,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}

      <Modal
        visible={showLockScreen}
        animationType="fade"
        presentationStyle="fullScreen"
        transparent={false}
      >
        <View style={styles.lockContainer}>
          <View style={styles.lockContent}>
            <View style={styles.lockIconContainer}>
              <Ionicons
                name={getBiometricIcon() as any}
                size={64}
                color="#6366f1"
              />
            </View>

            <Text style={styles.lockTitle}>Welcome Back</Text>
            <Text style={styles.lockSubtitle}>
              {biometricType
                ? getBiometricLabel()
                : "Enter your PIN or passcode"}
            </Text>

            {isAuthenticating ? (
              <ActivityIndicator
                size="large"
                color="#6366f1"
                style={styles.loader}
              />
            ) : (
              <TouchableOpacity
                style={styles.authenticateButton}
                onPress={authenticate}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={getBiometricIcon() as any}
                  size={24}
                  color="#ffffff"
                />
                <Text style={styles.authenticateButtonText}>Authenticate</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.securityNote}>
              Your session has expired for security
            </Text>
          </View>
        </View>
      </Modal>
    </SecurityContext.Provider>
  );
}

const styles = StyleSheet.create({
  lockContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  lockContent: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  lockIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  lockTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  lockSubtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 32,
    textAlign: "center",
  },
  authenticateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 12,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  authenticateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  loader: {
    marginTop: 24,
  },
  securityNote: {
    marginTop: 32,
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
  },
});

export default SecurityProvider;
