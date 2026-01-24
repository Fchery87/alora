# Alora Design System Quick Start

## 🚀 How to Use the New Design System

### 1. Import Theme Tokens

```typescript
import { GRADIENTS, SHADOWS, RADIUS, COLORS } from "@/lib/theme";
```

### 2. Use Gradients

```typescript
<LinearGradient
  colors={[GRADIENTS.primary.start, GRADIENTS.primary.end]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
  {/* Content */}
</LinearGradient>
```

### 3. Add Shadows

```typescript
<View style={{ ...SHADOWS.md }}>
  {/* Content with medium shadow */}
</View>
```

### 4. Use Glass Card

```typescript
import { GlassCard } from "@/components/atoms/GlassCard";

<GlassCard variant="primary" size="md" animated delay={100}>
  {/* Content */}
</GlassCard>
```

### 5. Use Gradient Icon

```typescript
import { GradientIcon } from "@/components/atoms/GradientIcon";

<GradientIcon
  name="heart"
  variant="accent"
  size={24}
  animated
  delay={200}
/>
```

### 6. Add Animations

```typescript
import { staggeredFadeIn, softSpring } from "@/lib/animations";

<MotiView {...staggeredFadeIn(index, 100)}>
  {/* Content with staggered fade-in */}
</MotiView>

<MotiView
  from={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={softSpring}
>
  {/* Content with soft spring animation */}
</MotiView>
```

### 7. Use Modern Header

```typescript
import { ModernHeader } from "@/components/atoms/ModernHeader";

<ModernHeader
  title="My Baby"
  subtitle="2 months old"
  showBackButton
  showNotifications
  notificationCount={3}
  onBackPress={() => router.back()}
  onNotificationPress={() => {/* */}}
  backgroundColor="glass"
/>
```

### 8. Use Modern Tab Bar

```typescript
import { ModernTabBar } from "@/components/atoms/ModernTabBar";

<Tabs>
  <Tabs.Screen
    name="(tabs)"
    options={{
      tabBar: (props) => <ModernTabBar {...props} />
    }}
  >
    {/* Tab screens */}
  </Tabs.Screen>
</Tabs>
```

### 9. Use Modern Dashboard

```typescript
import { ModernDashboard } from "@/components/organisms/ModernDashboard";

<ModernDashboard
  todayFeeds={3}
  todayDiapers={5}
  todaySleep="2h 30m"
  moodTrend="stable"
  activityFeed={<ActivityFeed babyId={babyId} />}
/>
```

### 10. Use Alora Logo

```typescript
import { AloraLogo } from "@/components/atoms/AloraLogo";

<AloraLogo size={120} showText={true} />
```

## 🎨 Styling Components

### Glassmorphism Background

```typescript
<View style={{
  backgroundColor: "rgba(255, 255, 255, 0.75)",
  backdropFilter: "blur(20px)",
  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.5)",
  ...SHADOWS.md,
}}>
  {/* Glass content */}
</View>
```

### Gradient Button

```typescript
<LinearGradient
  colors={[GRADIENTS.primary.start, GRADIENTS.primary.end]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
  <TouchableOpacity
    style={{
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: RADIUS.md,
      ...SHADOWS.glow,
    }}
    onPress={onPress}
  >
    <Text style={{
      color: "#ffffff",
      fontSize: 15,
      fontWeight: "600",
      letterSpacing: 0.3,
      textTransform: "uppercase"
    }}>
      Save
    </Text>
  </TouchableOpacity>
</LinearGradient>
```

### Press Animation

```typescript
<TouchableOpacity
  onPress={onPress}
  activeOpacity={0.8}
  style={({ pressed }) => [
    styles.button,
    pressed && { scale: 0.96, opacity: 0.8 }
  ]}
>
  {/* Button content */}
</TouchableOpacity>
```

## 🎭 Animation Patterns

### Staggered List

```typescript
{items.map((item, index) => (
  <MotiView
    key={item.id}
    from={{ opacity: 0, translateY: 20 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{
      delay: 100 + (index * 50), // Stagger by 50ms
      dampingRatio: 0.8,
      stiffness: 150,
    }}
  >
    {/* Item */}
  </MotiView>
))}
```

### Scale In on Mount

```typescript
<MotiView
  from={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{
    dampingRatio: 0.7,
    stiffness: 180,
  }}
>
  {/* Content */}
</MotiView>
```

### Slide In

```typescript
<MotiView
  from={{ opacity: 0, translateX: -30 }}
  animate={{ opacity: 1, translateX: 0 }}
  transition={{
    dampingRatio: 0.8,
    stiffness: 150,
  }}
>
  {/* Content */}
</MotiView>
```

## 🎯 Best Practices

### 1. Use Consistent Spacing
```typescript
// ✅ Good
padding: SPACING.md, // 16px
margin: SPACING.lg, // 24px

// ❌ Bad
padding: 14,
margin: 23
```

### 2. Use Design Tokens
```typescript
// ✅ Good
borderRadius: RADIUS.lg,
...SHADOWS.md,

// ❌ Bad
borderRadius: 16,
shadowOffset: { width: 0, height: 4 }
```

### 3. Use Gradient Variants
```typescript
// ✅ Good
<GlassCard variant="primary" />

// ❌ Bad
<GlassCard customGradient={["#6366f1", "#8b5cf6"]} />
```

### 4. Use Staggered Animations
```typescript
// ✅ Good
<MotiView {...staggeredFadeIn(index, 100)}>

// ❌ Bad
<MotiView transition={{ delay: index * 50 }}>
```

### 5. Use Soft Springs for Calm Feel
```typescript
// ✅ Good
transition={softSpring} // Gentle, nurturing

// ❌ Bad
transition={{ dampingRatio: 0.5, stiffness: 200 }} // Too bouncy
```

## 🔄 Migrating Old Components

### Old Basic Card
```typescript
// ❌ Before
<View style={{ backgroundColor: "#ffffff", padding: 12 }}>
  {/* Content */}
</View>
```

### New Glass Card
```typescript
// ✅ After
import { GlassCard } from "@/components/atoms/GlassCard";

<GlassCard variant="default" size="md" animated delay={100}>
  {/* Content */}
</GlassCard>
```

### Old Flat Icon
```typescript
// ❌ Before
<Ionicons name="heart" size={24} color="#6366f1" />
```

### New Gradient Icon
```typescript
// ✅ After
import { GradientIcon } from "@/components/atoms/GradientIcon";

<GradientIcon
  name="heart"
  variant="primary"
  size={24}
  animated
/>
```

### Old Basic Button
```typescript
// ❌ Before
<TouchableOpacity style={{ backgroundColor: "#6366f1" }}>
  <Text>Save</Text>
</TouchableOpacity>
```

### New Gradient Button
```typescript
// ✅ After
<LinearGradient colors={[GRADIENTS.primary.start, GRADIENTS.primary.end]}>
  <TouchableOpacity
    style={{
      padding: 12,
      borderRadius: 12,
      ...SHADOWS.glow
    }}
  >
    <Text style={{ color: "#ffffff", fontWeight: "600", textTransform: "uppercase" }}>
      Save
    </Text>
  </TouchableOpacity>
</LinearGradient>
```

## 📋 Checklist for Updating Screens

- [ ] Replace basic cards with `GlassCard`
- [ ] Replace flat icons with `GradientIcon`
- [ ] Add staggered animations to lists
- [ ] Use `ModernHeader` instead of basic header
- [ ] Apply shadows using `SHADOWS` tokens
- [ ] Use `RADIUS` tokens for border radius
- [ ] Add press animations to buttons
- [ ] Use gradients for primary actions
- [ ] Add glassmorphism to modals
- [ ] Update colors to use `COLORS` tokens

## 🎨 Design System Files

- **Theme Tokens:** `lib/theme.ts` (All design constants)
- **Animations:** `lib/animations.ts` (Animation helpers)
- **Components:**
  - `components/atoms/AloraLogo.tsx`
  - `components/atoms/GlassCard.tsx`
  - `components/atoms/GradientIcon.tsx`
  - `components/atoms/ModernHeader.tsx`
  - `components/atoms/ModernTabBar.tsx`
- **Organisms:**
  - `components/organisms/ModernDashboard.tsx`
- **Screens:**
  - `app/splash.tsx`
- **Documentation:**
  - `docs/MODERN_DESIGN_GUIDE.md` (Complete design guide)
  - `docs/DESIGN_TRANSFORMATION_SUMMARY.md` (Before/After)
  - `docs/DESIGN_QUICK_START.md` (This file)

## 💡 Tips

1. **Start Small:** Update one screen at a time
2. **Test Often:** Run app after each change
3. **Be Consistent:** Use design tokens, not hardcoded values
4. **Keep It Calm:** Use soft springs, not bouncy ones
5. **Add Delight:** Stagger animations, micro-interactions

## 🆘 Need Help?

Check the complete documentation:
- `docs/MODERN_DESIGN_GUIDE.md` - Full design system
- `docs/DESIGN_TRANSFORMATION_SUMMARY.md` - Before/After comparison
- `lib/theme.ts` - All design tokens
- `lib/animations.ts` - Animation helpers

---

**Ready to make Alora look stunning!** 🚀
