import { useState, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import { addBreadcrumb, captureException } from "@/lib/sentry";

interface ExportProgress {
  status: "idle" | "loading" | "success" | "error";
  error?: string;
}

export function useDataExport() {
  const [progress, setProgress] = useState<ExportProgress>({ status: "idle" });

  // Fetch all user data
  const exportData = useQuery(api.functions.users.index.exportUserData);

  const exportDataToFile = useCallback(async () => {
    if (!exportData) {
      Alert.alert("Error", "No data available to export");
      return;
    }

    setProgress({ status: "loading" });

    try {
      addBreadcrumb("Starting data export", "user_action", "info");

      // Convert data to JSON string with nice formatting
      const jsonString = JSON.stringify(exportData, null, 2);

      // Create a temporary file
      const fileName = `alora-export-${new Date().toISOString().split("T")[0]}.json`;
      const filePath = `${FileSystem.cacheDirectory}${fileName}`;

      // Write to file
      await FileSystem.writeAsStringAsync(filePath, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      addBreadcrumb("Data export file created", "user_action", "info", {
        fileName,
        fileSize: jsonString.length,
      });

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: "application/json",
          dialogTitle: "Export Your Alora Data",
          UTI: "public.json", // iOS
        });

        setProgress({ status: "success" });

        addBreadcrumb("Data export shared successfully", "user_action", "info");
      } else {
        throw new Error("Sharing is not available on this device");
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to export data";

      setProgress({ status: "error", error: errorMessage });

      captureException(error, { context: "data_export" });

      Alert.alert("Export Failed", errorMessage, [
        { text: "OK", style: "default" },
      ]);
    }
  }, [exportData]);

  const reset = useCallback(() => {
    setProgress({ status: "idle" });
  }, []);

  return {
    exportDataToFile,
    progress,
    reset,
    isLoading: progress.status === "loading",
    data: exportData,
  };
}
