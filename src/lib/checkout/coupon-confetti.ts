const CONFETTI_COLORS = ["#F97316", "#FDBA74", "#FFFFFF", "#22C55E", "#FDE68A"];

/** Center burst plus side showers when a checkout coupon is applied. */
export async function fireCouponConfetti(): Promise<void> {
  if (typeof window === "undefined") return;
  const confetti = (await import("canvas-confetti")).default;
  const zIndex = 225;

  void confetti({
    particleCount: 140,
    spread: 86,
    startVelocity: 48,
    origin: { x: 0.5, y: 0.42 },
    ticks: 220,
    scalar: 1.05,
    colors: CONFETTI_COLORS,
    zIndex,
  });

  window.setTimeout(() => {
    void confetti({
      particleCount: 70,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: CONFETTI_COLORS,
      zIndex,
    });
    void confetti({
      particleCount: 70,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: CONFETTI_COLORS,
      zIndex,
    });
  }, 180);
}
