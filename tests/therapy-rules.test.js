import { describe, expect, test } from "bun:test";
import { daysForFrequency, effortAdjustmentDirection, nextTargetReps } from "../lib/therapy-rules.ts";

describe("therapy scheduling rules", () => {
  test("maps requested weekly frequency to balanced weekdays", () => {
    expect(daysForFrequency(1)).toEqual([1]);
    expect(daysForFrequency(3)).toEqual([1, 3, 5]);
    expect(daysForFrequency(5)).toEqual([1, 2, 3, 5, 6]);
  });

  test("clamps invalid frequencies into the supported range", () => {
    expect(daysForFrequency(0)).toEqual([1]);
    expect(daysForFrequency(9)).toEqual([1, 2, 3, 5, 6]);
  });
});

describe("therapy progression rules", () => {
  test("reduces targets after high effort", () => {
    expect(effortAdjustmentDirection(5, [])).toBe("reduce");
    expect(nextTargetReps(12, "reduce")).toBe(11);
  });

  test("increases targets after low effort", () => {
    expect(effortAdjustmentDirection(1, [])).toBe("increase");
    expect(nextTargetReps(10, "increase")).toBe(11);
  });

  test("maintains targets for moderate effort", () => {
    expect(effortAdjustmentDirection(3, [3, 3])).toBe("maintain");
    expect(nextTargetReps(8, "maintain")).toBe(8);
  });

  test("uses recent effort history when current effort is neutral", () => {
    expect(effortAdjustmentDirection(3, [4, 5])).toBe("reduce");
    expect(effortAdjustmentDirection(3, [1, 2])).toBe("increase");
  });
});
