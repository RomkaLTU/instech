export const CAR_VALUE_MIN = 1;
export const CAR_VALUE_MAX = 1_000_000;
export const DRIVER_AGE_MIN = 18;
export const DRIVER_AGE_MAX = 100;
export const YOUNG_DRIVER_AGE = 25;

export type PremiumInput = { carValue: string; driverAge: string };
export type PremiumErrors = Partial<Record<keyof PremiumInput, string>>;

export type PremiumValidation =
  | { ok: true; carValue: number; driverAge: number }
  | { ok: false; errors: PremiumErrors };

const WHOLE_NUMBER = /^\d+$/;

function parseWholeNumber(raw: string) {
  const value = raw.trim();
  if (value === "") return { kind: "blank" } as const;
  if (!WHOLE_NUMBER.test(value)) return { kind: "invalid" } as const;
  return { kind: "number", value: Number(value) } as const;
}

function validateCarValue(raw: string) {
  const parsed = parseWholeNumber(raw);
  if (parsed.kind === "blank") return { error: "Enter the car value." };
  if (parsed.kind === "invalid") {
    return { error: "Enter the car value in whole euros, using digits only." };
  }
  if (parsed.value < CAR_VALUE_MIN || parsed.value > CAR_VALUE_MAX) {
    return { error: "Enter a car value from €1 to €1,000,000." };
  }
  return { value: parsed.value };
}

function validateDriverAge(raw: string) {
  const parsed = parseWholeNumber(raw);
  if (parsed.kind === "blank") return { error: "Enter the driver's age." };
  if (parsed.kind === "invalid") {
    return { error: "Enter the driver's age in whole years, using digits only." };
  }
  if (parsed.value < DRIVER_AGE_MIN || parsed.value > DRIVER_AGE_MAX) {
    return { error: "Enter a driver's age from 18 to 100." };
  }
  return { value: parsed.value };
}

export function validatePremiumInput(input: PremiumInput): PremiumValidation {
  const carValue = validateCarValue(input.carValue);
  const driverAge = validateDriverAge(input.driverAge);
  if (carValue.value === undefined || driverAge.value === undefined) {
    return {
      ok: false,
      errors: { carValue: carValue.error, driverAge: driverAge.error },
    };
  }
  return { ok: true, carValue: carValue.value, driverAge: driverAge.value };
}

export function monthlyPremiumCents(carValue: number, driverAge: number) {
  // Monthly cents = carValue × 3% × 100 × multiplier ÷ 12 = carValue × halves ÷ 8,
  // kept in integers so half cents round up exactly.
  const multiplierHalves = driverAge < YOUNG_DRIVER_AGE ? 3 : 2;
  return Math.floor((carValue * multiplierHalves + 4) / 8);
}

const euros = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEuroCents(cents: number) {
  return euros.format(cents / 100);
}
