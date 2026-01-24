// =======================
// NATURAL SPRING ANIMATIONS
// =======================

/**
 * Soft, gentle spring animation for nurturing feel
 */
export const softSpring = {
  type: "spring" as const,
  damping: 15,
};

/**
 * Bouncy, playful animation for interactions
 */
export const bouncySpring = {
  type: "spring" as const,
  damping: 10,
};

/**
 * Quick, snappy animation for micro-interactions
 */
export const quickSpring = {
  type: "spring" as const,
  damping: 12,
};

// =======================
// STAGGERED REVEAL ANIMATIONS
// =======================

/**
 * Calculate delay for staggered animations
 */
export function getStaggerDelay(index: number, baseDelay: number = 0, interval: number = 50): number {
  return baseDelay + (index * interval);
}

/**
 * Staggered fade-in from bottom
 */
export function staggeredFadeIn(index: number, baseDelay: number = 0) {
  return {
    from: {
      opacity: 0,
      translateY: 20,
    },
    animate: {
      opacity: 1,
      translateY: 0,
    },
    transition: {
      ...softSpring,
      delay: getStaggerDelay(index, baseDelay),
    },
  };
}

/**
 * Staggered scale-in from center
 */
export function staggeredScaleIn(index: number, baseDelay: number = 0) {
  return {
    from: {
      opacity: 0,
      scale: 0.8,
    },
    animate: {
      opacity: 1,
      scale: 1,
    },
    transition: {
      ...softSpring,
      delay: getStaggerDelay(index, baseDelay),
    },
  };
}

/**
 * Staggered slide-in from left
 */
export function staggeredSlideInLeft(index: number, baseDelay: number = 0) {
  return {
    from: {
      opacity: 0,
      translateX: -30,
    },
    animate: {
      opacity: 1,
      translateX: 0,
    },
    transition: {
      ...softSpring,
      delay: getStaggerDelay(index, baseDelay),
    },
  };
}

/**
 * Staggered slide-in from right
 */
export function staggeredSlideInRight(index: number, baseDelay: number = 0) {
  return {
    from: {
      opacity: 0,
      translateX: 30,
    },
    animate: {
      opacity: 1,
      translateX: 0,
    },
    transition: {
      ...softSpring,
      delay: getStaggerDelay(index, baseDelay),
    },
  };
}

// =======================
// SCREEN TRANSITIONS
// =======================

/**
 * Fade-in screen transition
 */
export function screenFadeIn() {
  return {
    from: {
      opacity: 0,
      translateY: 10,
    },
    animate: {
      opacity: 1,
      translateY: 0,
    },
    transition: {
      ...softSpring,
      duration: 400,
    },
  };
}

/**
 * Fade-out screen transition
 */
export function screenFadeOut() {
  return {
    from: {
      opacity: 1,
      translateY: 0,
    },
    animate: {
      opacity: 0,
      translateY: -10,
    },
    transition: {
      ...quickSpring,
      duration: 300,
    },
  };
}

// =======================
// MICRO-INTERACTION ANIMATIONS
// =======================

/**
 * Button press animation
 */
export function buttonPress(pressed: boolean) {
  return {
    scale: pressed ? 0.96 : 1,
    opacity: pressed ? 0.8 : 1,
  };
}

/**
 * Card hover/touch animation
 */
export function cardPress(pressed: boolean) {
  return {
    scale: pressed ? 0.98 : 1,
    shadowOpacity: pressed ? 0.5 : 1,
    shadowRadius: pressed ? 8 : 16,
  };
}

/**
 * Icon tap animation
 */
export function iconTap(pressed: boolean) {
  return {
    scale: pressed ? 0.85 : 1,
    opacity: pressed ? 0.7 : 1,
  };
}

// =======================
// LOADING ANIMATIONS
// =======================

/**
 * Pulse animation for loading state
 */
export function pulseAnimation() {
  return {
    loop: true,
    from: {
      opacity: 0.6,
      scale: 1,
    },
    animate: {
      opacity: 0.4,
      scale: 1.05,
    },
    transition: {
      duration: 1000,
    },
  };
}

/**
 * Spin animation for loading
 */
export function spinAnimation() {
  return {
    loop: true,
    from: {
      rotate: "0deg",
    },
    animate: {
      rotate: "360deg",
    },
    transition: {
      duration: 1000,
    },
  };
}

/**
 * Shimmer animation for skeleton loading
 */
export function shimmerAnimation() {
  return {
    loop: true,
    from: {
      translateX: "-100%",
    },
    animate: {
      translateX: "100%",
    },
    transition: {
      duration: 1500,
    },
  };
}

// =======================
// SUCCESS/CELEBRATION ANIMATIONS
// =======================

/**
 * Confetti pop-in animation
 */
export function confettiPopIn(index: number) {
  return {
    from: {
      opacity: 0,
      scale: 0,
      translateY: 0,
      rotate: "0deg",
    },
    animate: {
      opacity: 1,
      scale: 1,
      translateY: -100,
      rotate: `${Math.random() * 360}deg`,
    },
    transition: {
      ...bouncySpring,
      delay: index * 30,
    },
  };
}

/**
 * Success checkmark animation
 */
export function checkmarkSuccess() {
  return {
    from: {
      scale: 0,
      rotate: "-180deg",
    },
    animate: {
      scale: 1,
      rotate: "0deg",
    },
    transition: {
      type: "spring" as const,
      damping: 8,
    },
  };
}

// =======================
// HELPER FUNCTIONS
// =======================

/**
 * Create delay object for use in animations
 */
export function createDelay(ms: number) {
  return { delay: ms };
}

/**
 * Combine multiple transition props
 */
export function combineTransitions(...transitions: any[]) {
  return Object.assign({}, ...transitions);
}

/**
 * Get random delay for more natural feel
 */
export function getRandomDelay(base: number, variation: number = 50): number {
  return base + Math.random() * variation;
}
