export type EffortDirection = "reduce" | "increase" | "maintain";

export function daysForFrequency(frequency: number) {
  const normalized = Math.min(5, Math.max(1, Math.round(frequency || 1)));
  const patterns: Record<number, number[]> = {
    1: [1],
    2: [1, 4],
    3: [1, 3, 5],
    4: [1, 2, 4, 6],
    5: [1, 2, 3, 5, 6],
  };
  return patterns[normalized];
}

export function effortAdjustmentDirection(currentEffort: number, recentEfforts: Array<number | null | undefined> = []): EffortDirection {
  const highEfforts = recentEfforts.filter((effort) => (effort || 0) >= 4).length;
  const lowEfforts = recentEfforts.filter((effort) => (effort || 0) <= 2 && (effort || 0) > 0).length;

  if (currentEffort >= 4 || highEfforts >= 2) return "reduce";
  if (currentEffort <= 2 || lowEfforts >= 2) return "increase";
  return "maintain";
}

export function nextTargetReps(currentReps: number | null | undefined, direction: EffortDirection) {
  const baseReps = Math.max(1, currentReps || 1);
  if (direction === "reduce") return Math.max(1, Math.round(baseReps * 0.9));
  if (direction === "increase") return Math.max(1, Math.round(baseReps * 1.1));
  return baseReps;
}
