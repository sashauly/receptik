import { TFunction } from "i18next";

export type MeasurementSystem = "metric" | "us" | "imperial";
export type MeasurementType = "volume" | "weight" | "length" | "other"; // Added "other" type for non-standard units

// Define the base properties of each unit
interface BaseUnit {
  value: string;
  baseValue: number; // Base value in the "base" unit for its type (e.g., ml for volume)
  type: MeasurementType;
  systems: MeasurementSystem[];
}

// Define the structure for the units data
const unitsData: Record<MeasurementType, BaseUnit[]> = {
  volume: [
    // Metric Volume
    {
      value: "ml",
      baseValue: 1,
      type: "volume",
      systems: ["metric"],
    },
    {
      value: "l",
      baseValue: 1000,
      type: "volume",
      systems: ["metric"],
    },
    {
      value: "metric-cup",
      baseValue: 250,
      type: "volume",
      systems: ["metric"],
    },
    {
      value: "tbsp",
      baseValue: 15,
      type: "volume",
      systems: ["metric"],
    },
    {
      value: "tsp",
      baseValue: 5,
      type: "volume",
      systems: ["metric"],
    },

    // US Customary Volume
    {
      value: "gal-us",
      baseValue: 3785.41,
      type: "volume",
      systems: ["us"],
    },
    {
      value: "qt-us",
      baseValue: 946.353,
      type: "volume",
      systems: ["us"],
    },
    {
      value: "pt-us",
      baseValue: 473.176,
      type: "volume",
      systems: ["us"],
    },
    {
      value: "cup-us",
      baseValue: 236.588,
      type: "volume",
      systems: ["us"],
    },
    {
      value: "fl-oz-us",
      baseValue: 29.5735,
      type: "volume",
      systems: ["us"],
    },
    {
      value: "tbsp-us",
      baseValue: 14.7868,
      type: "volume",
      systems: ["us"],
    },
    {
      value: "tsp-us",
      baseValue: 4.92892,
      type: "volume",
      systems: ["us"],
    },

    // Imperial Volume
    {
      value: "gal-imp",
      baseValue: 4546.09,
      type: "volume",
      systems: ["imperial"],
    },
    {
      value: "qt-imp",
      baseValue: 1136.52,
      type: "volume",
      systems: ["imperial"],
    },
    {
      value: "pt-imp",
      baseValue: 568.261,
      type: "volume",
      systems: ["imperial"],
    },
    {
      value: "cup-imp",
      baseValue: 284.131,
      type: "volume",
      systems: ["imperial"],
    },
    {
      value: "fl-oz-imp",
      baseValue: 28.4131,
      type: "volume",
      systems: ["imperial"],
    },
    {
      value: "tbsp-imp",
      baseValue: 17.7582,
      type: "volume",
      systems: ["imperial"],
    },
    {
      value: "tsp-imp",
      baseValue: 5.91939,
      type: "volume",
      systems: ["imperial"],
    },
  ],
  weight: [
    // Metric Weight
    {
      value: "kg",
      baseValue: 1000, // baseValue in grams
      type: "weight",
      systems: ["metric"],
    },
    {
      value: "g",
      baseValue: 1, // baseValue in grams
      type: "weight",
      systems: ["metric"],
    },

    // US Customary and Imperial Weight (shared)
    {
      value: "lb",
      baseValue: 453.592, // baseValue in grams
      type: "weight",
      systems: ["us", "imperial"],
    },
    {
      value: "oz",
      baseValue: 28.3495, // baseValue in grams
      type: "weight",
      systems: ["us", "imperial"],
    },
  ],
  length: [
    // Metric Length
    {
      value: "m",
      baseValue: 1, // baseValue in meters
      type: "length",
      systems: ["metric"],
    },
    {
      value: "cm",
      baseValue: 0.01, // baseValue in meters
      type: "length",
      systems: ["metric"],
    },
    {
      value: "mm",
      baseValue: 0.001, // baseValue in meters
      type: "length",
      systems: ["metric"],
    },

    // US Customary Length
    {
      value: "yd",
      baseValue: 0.9144, // baseValue in meters
      type: "length",
      systems: ["us"],
    },
    {
      value: "ft",
      baseValue: 0.3048, // baseValue in meters
      type: "length",
      systems: ["us"],
    },
    {
      value: "in",
      baseValue: 0.0254, // baseValue in meters
      type: "length",
      systems: ["us"],
    },

    // Imperial Length (Note: Imperial length is generally the same as US Customary length)
    // We'll still list them explicitly if needed for clarity or future potential differences
    {
      value: "yd-imp",
      baseValue: 0.9144, // baseValue in meters
      type: "length",
      systems: ["imperial"],
    },
    {
      value: "ft-imp",
      baseValue: 0.3048, // baseValue in meters
      type: "length",
      systems: ["imperial"],
    },
    {
      value: "in-imp",
      baseValue: 0.0254, // baseValue in meters
      type: "length",
      systems: ["imperial"],
    },
  ],
  other: [
    // Units that don't fit into standard measurement systems or require conversion
    {
      value: "piece",
      baseValue: 1, // No base value for conversion, treated as individual items
      type: "other",
      systems: [], // These units are system-agnostic
    },
    {
      value: "clove",
      baseValue: 1, // No base value for conversion, treated as individual items
      type: "other",
      systems: [], // These units are system-agnostic
    },
    {
      value: "leaf",
      baseValue: 1,
      type: "other",
      systems: [],
    },
    {
      value: "feather",
      baseValue: 1,
      type: "other",
      systems: [],
    },
    {
      value: "pinch",
      baseValue: 1, // Can represent a small, indeterminate amount
      type: "other",
      systems: [],
    },
    {
      value: "sprig",
      baseValue: 1,
      type: "other",
      systems: [],
    },
    {
      value: "head",
      baseValue: 1,
      type: "other",
      systems: [],
    },
    {
      value: "slice",
      baseValue: 1,
      type: "other",
      systems: [],
    },
    {
      value: "drop",
      baseValue: 1, // Can represent a small, indeterminate amount
      type: "other",
      systems: [],
    },
    {
      value: "toTaste",
      baseValue: 0, // Represents no specific quantity
      type: "other",
      systems: [],
    },
    {
      value: "optional",
      baseValue: 0, // Represents no specific quantity
      type: "other",
      systems: [],
    },
  ],
};

export type UnitValue =
  | (typeof unitsData)["volume"][number]["value"]
  | (typeof unitsData)["weight"][number]["value"]
  | (typeof unitsData)["length"][number]["value"]
  | (typeof unitsData)["other"][number]["value"];

export interface Unit extends BaseUnit {
  label: string; // Add the label property after fetching from translation
}

// Flatten the unitsData into a single array of BaseUnit
const allBaseUnits: BaseUnit[] = Object.values(unitsData).flat();

// Create a map for quick lookups
const baseUnitMap = new Map<string, BaseUnit>();
allBaseUnits.forEach((unit) => baseUnitMap.set(unit.value, unit));

export function getBaseUnitByValue(value: UnitValue): BaseUnit | undefined {
  return baseUnitMap.get(value);
}

export function getUnitTranslatedLabel(
  unitValue: UnitValue,
  unitType: MeasurementType,
  t: TFunction<"translation", undefined>
): string {
  // @ts-expect-error Incompatible types with locale resources
  return t(`units.${unitType}.${unitValue}`);
}

export function getAllUnitsWithTranslatedLabels(
  t: TFunction<"translation", undefined>
): Unit[] {
  return allBaseUnits.map((baseUnit) => ({
    ...baseUnit,
    label: getUnitTranslatedLabel(baseUnit.value, baseUnit.type, t),
  }));
}

export function convertUnits(
  value: number,
  fromUnitValue: UnitValue,
  toUnitValue: UnitValue
): number {
  const fromUnit = getBaseUnitByValue(fromUnitValue);
  const toUnit = getBaseUnitByValue(toUnitValue);

  if (!fromUnit) {
    throw new Error(`Unknown 'from' unit: ${fromUnitValue}`);
  }
  if (!toUnit) {
    throw new Error(`Unknown 'to' unit: ${toUnitValue}`);
  }
  if (fromUnit.type !== toUnit.type) {
    throw new Error(
      `Cannot convert between different unit types: ${fromUnit.type} to ${toUnit.type}`
    );
  }
  // Cannot convert 'other' type units
  if (fromUnit.type === "other") {
    if (fromUnit.value === toUnit.value) {
      return value; // Same 'other' unit, return the value
    }
    throw new Error(
      `Cannot convert 'other' unit type: ${fromUnit.value} to ${toUnit.value}`
    );
  }

  const baseValue = value * fromUnit.baseValue;

  return baseValue / toUnit.baseValue;
}

export function getUnitsBySystem(
  allUnitsWithLabels: Unit[],
  system: MeasurementSystem
): Unit[] {
  return allUnitsWithLabels.filter(
    (unit) => unit.systems.includes(system) && unit.type !== "other"
  );
}

export function getUnitsByType(
  allUnitsWithLabels: Unit[],
  type: MeasurementType
): Unit[] {
  return allUnitsWithLabels.filter((unit) => unit.type === type);
}
