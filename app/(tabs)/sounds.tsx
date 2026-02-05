import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { SOUNDS, SOUND_CATEGORIES, getSoundsByCategory } from "@/lib/sounds";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import {
  TYPOGRAPHY,
  SHADOWS,
  TEXT,
  BACKGROUND,
  COLORS,
  RADIUS,
  GLASS,
} from "@/lib/theme";

type CategoryId = (typeof SOUND_CATEGORIES)[number]["id"];

export default function SoundsScreen() {
  const [category, setCategory] = useState<CategoryId>("all");
  const [playing, setPlaying] = useState<string | null>(null);
  const [volume] = useState(0.5);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const displayedSounds = getSoundsByCategory(category);

  const togglePlay = (soundId: string) => {
    if (playing === soundId) {
      setPlaying(null);
    } else {
      setPlaying(soundId);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Soothing Sounds" showBackButton={false} />

      <View style={styles.infoBanner}>
        <Ionicons name="information-circle" size={20} color={COLORS.sage} />
        <Text style={styles.infoText}>
          Help your baby sleep with calming sounds. Keep volume low.
        </Text>
      </View>

      <ScrollView
        horizontal
        style={styles.categoryRow}
        contentContainerStyle={styles.categoryContent}
        showsHorizontalScrollIndicator={false}
      >
        {SOUND_CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            style={[
              styles.categoryChip,
              category === cat.id && styles.categoryChipActive,
            ]}
            onPress={() => setCategory(cat.id)}
          >
            <Ionicons
              name={cat.icon as any}
              size={16}
              color={category === cat.id ? "#fff" : TEXT.secondary}
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
        <View style={styles.soundGrid}>
          {displayedSounds.map((sound) => (
            <Pressable
              key={sound.id}
              style={[
                styles.soundCard,
                playing === sound.id && styles.soundCardActive,
              ]}
              onPress={() => togglePlay(sound.id)}
            >
              <View
                style={[
                  styles.soundIcon,
                  playing === sound.id && styles.soundIconActive,
                ]}
              >
                <Ionicons
                  name={playing === sound.id ? "pause" : "play"}
                  size={32}
                  color={playing === sound.id ? "#fff" : COLORS.terracotta}
                />
              </View>
              <Text style={styles.soundName}>{sound.name}</Text>
              <Text style={styles.soundDesc}>{sound.description}</Text>

              {playing === sound.id && (
                <MotiView
                  from={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ stiffness: 200, damping: 20 }}
                  style={styles.playingIndicator}
                >
                  <View
                    style={[styles.waveBar, { backgroundColor: COLORS.sage }]}
                  />
                  <View
                    style={[
                      styles.waveBar,
                      styles.waveBarDelay1,
                      { backgroundColor: COLORS.terracotta },
                    ]}
                  />
                  <View
                    style={[
                      styles.waveBar,
                      styles.waveBarDelay2,
                      { backgroundColor: COLORS.gold },
                    ]}
                  />
                </MotiView>
              )}
            </Pressable>
          ))}
        </View>

        {playing && (
          <View style={styles.playerBar}>
            <View style={styles.playerInfo}>
              <Text style={styles.playerLabel}>Now Playing</Text>
              <Text style={styles.playerSound}>
                {SOUNDS.find((s) => s.id === playing)?.name}
              </Text>
            </View>

            <Pressable
              style={styles.volumeButton}
              onPress={() => setShowVolumeSlider(!showVolumeSlider)}
            >
              <Ionicons
                name={
                  volume === 0
                    ? "volume-mute"
                    : volume < 0.5
                      ? "volume-low"
                      : "volume-high"
                }
                size={24}
                color="#fff"
              />
            </Pressable>

            <Pressable
              style={styles.stopButton}
              onPress={() => setPlaying(null)}
            >
              <Ionicons name="stop" size={24} color="#fff" />
            </Pressable>
          </View>
        )}

        {showVolumeSlider && playing && (
          <View style={styles.volumeSlider}>
            <Ionicons name="volume-low" size={20} color={COLORS.sage} />
            <View style={styles.sliderTrack}>
              <View
                style={[
                  styles.sliderProgress,
                  { width: `${volume * 100}%`, backgroundColor: COLORS.sage },
                ]}
              />
            </View>
            <Ionicons name="volume-high" size={20} color={COLORS.sage} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND.primary,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.sage}15`,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: RADIUS.lg,
    gap: 8,
    borderWidth: 1,
    borderColor: GLASS.light.border,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "CareJournalUI",
    color: COLORS.sage,
  },
  categoryRow: {
    backgroundColor: BACKGROUND.card,
    borderBottomWidth: 1,
    borderBottomColor: GLASS.light.border,
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
    backgroundColor: BACKGROUND.primary,
    marginRight: 8,
    borderWidth: 1,
    borderColor: GLASS.light.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.terracotta,
    borderColor: COLORS.terracotta,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "CareJournalUIMedium",
    color: TEXT.secondary,
  },
  categoryTextActive: {
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  soundGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  soundCard: {
    width: "47%",
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.xl,
    padding: 24,
    alignItems: "center",
    ...SHADOWS.sm,
    borderWidth: 2,
    borderColor: "transparent",
  },
  soundCardActive: {
    borderColor: COLORS.terracotta,
    backgroundColor: `${COLORS.terracotta}08`,
  },
  soundIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${COLORS.terracotta}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  soundIconActive: {
    backgroundColor: COLORS.terracotta,
  },
  soundName: {
    fontSize: 16,
    fontFamily: "CareJournalUIMedium",
    color: TEXT.primary,
    textAlign: "center",
    marginBottom: 4,
  },
  soundDesc: {
    fontSize: 12,
    fontFamily: "CareJournalUI",
    color: TEXT.secondary,
    textAlign: "center",
  },
  playingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    marginTop: 12,
    height: 24,
  },
  waveBar: {
    width: 4,
    height: 12,
    backgroundColor: COLORS.terracotta,
    borderRadius: 2,
  },
  waveBarDelay1: {
    height: 18,
  },
  waveBarDelay2: {
    height: 24,
  },
  playerBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.sage,
    borderRadius: RADIUS.xl,
    padding: 16,
    marginTop: 16,
    gap: 12,
    ...SHADOWS.md,
  },
  playerInfo: {
    flex: 1,
  },
  playerLabel: {
    fontSize: 11,
    fontFamily: "CareJournalUI",
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  playerSound: {
    fontSize: 16,
    fontFamily: "CareJournalHeadingMedium",
    color: "#fff",
  },
  volumeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  stopButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  volumeSlider: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BACKGROUND.card,
    borderRadius: RADIUS.xl,
    padding: 16,
    marginTop: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: GLASS.light.border,
    ...SHADOWS.sm,
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: GLASS.light.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  sliderProgress: {
    height: "100%",
    backgroundColor: COLORS.sage,
  },
});
