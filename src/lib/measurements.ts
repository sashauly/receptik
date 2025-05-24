export type MeasurementSystem = "metric" | "us" | "imperial";
export type MeasurementType = "volume" | "weight" | "length";

interface Unit {
  value: string;
  label: string;
  baseValue: number;
  type: MeasurementType;
  systems: MeasurementSystem[];
}

const allUnits = [
  // Metric Volume
  {
    value: "l",
    label: "Liter",
    baseValue: 1000,
    type: "volume",
    systems: ["metric"],
  },
  {
    value: "ml",
    label: "Milliliter",
    baseValue: 1,
    type: "volume",
    systems: ["metric"],
  },
  {
    value: "metric-cup",
    label: "Metric Cup",
    baseValue: 250,
    type: "volume",
    systems: ["metric"],
  },
  {
    value: "tbsp",
    label: "Tablespoon",
    baseValue: 15,
    type: "volume",
    systems: ["metric"],
  },
  {
    value: "tsp",
    label: "Teaspoon",
    baseValue: 5,
    type: "volume",
    systems: ["metric"],
  },

  // Metric Weight
  {
    value: "kg",
    label: "Kilogram",
    baseValue: 1000,
    type: "weight",
    systems: ["metric"],
  },
  {
    value: "g",
    label: "Gram",
    baseValue: 1,
    type: "weight",
    systems: ["metric"],
  },

  // Metric Length
  {
    value: "km",
    label: "Kilometer",
    baseValue: 1000,
    type: "length",
    systems: ["metric"],
  },
  {
    value: "m",
    label: "Meter",
    baseValue: 1,
    type: "length",
    systems: ["metric"],
  },
  {
    value: "cm",
    label: "Centimeter",
    baseValue: 0.01,
    type: "length",
    systems: ["metric"],
  },
  {
    value: "mm",
    label: "Millimeter",
    baseValue: 0.001,
    type: "length",
    systems: ["metric"],
  },

  // US Customary Volume
  {
    value: "gal-us",
    label: "Gallon (US)",
    baseValue: 3785.41,
    type: "volume",
    systems: ["us"],
  },
  {
    value: "qt-us",
    label: "Quart (US)",
    baseValue: 946.353,
    type: "volume",
    systems: ["us"],
  },
  {
    value: "pt-us",
    label: "Pint (US)",
    baseValue: 473.176,
    type: "volume",
    systems: ["us"],
  },
  {
    value: "cup-us",
    label: "Cup (US)",
    baseValue: 236.588,
    type: "volume",
    systems: ["us"],
  },
  {
    value: "fl-oz-us",
    label: "Fluid Ounce (US)",
    baseValue: 29.5735,
    type: "volume",
    systems: ["us"],
  },
  {
    value: "tbsp-us",
    label: "Tablespoon (US)",
    baseValue: 14.7868,
    type: "volume",
    systems: ["us"],
  },
  {
    value: "tsp-us",
    label: "Teaspoon (US)",
    baseValue: 4.92892,
    type: "volume",
    systems: ["us"],
  },

  // US Customary Weight
  {
    value: "lb",
    label: "Pound",
    baseValue: 453.592,
    type: "weight",
    systems: ["us", "imperial"],
  }, // Shared
  {
    value: "oz",
    label: "Ounce",
    baseValue: 28.3495,
    type: "weight",
    systems: ["us", "imperial"],
  }, // Shared

  // US Customary Length
  {
    value: "mi",
    label: "Mile",
    baseValue: 1609.34,
    type: "length",
    systems: ["us"],
  },
  {
    value: "yd",
    label: "Yard",
    baseValue: 0.9144,
    type: "length",
    systems: ["us"],
  },
  {
    value: "ft",
    label: "Foot",
    baseValue: 0.3048,
    type: "length",
    systems: ["us"],
  },
  {
    value: "in",
    label: "Inch",
    baseValue: 0.0254,
    type: "length",
    systems: ["us"],
  },

  // Imperial Volume
  {
    value: "gal-imp",
    label: "Gallon (Imperial)",
    baseValue: 4546.09,
    type: "volume",
    systems: ["imperial"],
  },
  {
    value: "qt-imp",
    label: "Quart (Imperial)",
    baseValue: 1136.52,
    type: "volume",
    systems: ["imperial"],
  },
  {
    value: "pt-imp",
    label: "Pint (Imperial)",
    baseValue: 568.261,
    type: "volume",
    systems: ["imperial"],
  },
  {
    value: "cup-imp",
    label: "Cup (Imperial)",
    baseValue: 284.131,
    type: "volume",
    systems: ["imperial"],
  },
  {
    value: "fl-oz-imp",
    label: "Fluid Ounce (Imperial)",
    baseValue: 28.4131,
    type: "volume",
    systems: ["imperial"],
  },
  {
    value: "tbsp-imp",
    label: "Tablespoon (Imperial)",
    baseValue: 17.7582,
    type: "volume",
    systems: ["imperial"],
  },
  {
    value: "tsp-imp",
    label: "Teaspoon (Imperial)",
    baseValue: 5.91939,
    type: "volume",
    systems: ["imperial"],
  },

  // Imperial Length
  {
    value: "mi-imp",
    label: "Mile (Imperial)",
    baseValue: 1609.344,
    type: "length",
    systems: ["imperial"],
  },
  {
    value: "yd-imp",
    label: "Yard (Imperial)",
    baseValue: 0.9144,
    type: "length",
    systems: ["imperial"],
  },
  {
    value: "ft-imp",
    label: "Foot (Imperial)",
    baseValue: 0.3048,
    type: "length",
    systems: ["imperial"],
  },
  {
    value: "in-imp",
    label: "Inch (Imperial)",
    baseValue: 0.0254,
    type: "length",
    systems: ["imperial"],
  },
] as const;

export type UnitValue = (typeof allUnits)[number]["value"];

const unitMap = new Map<string, Unit>();
(allUnits as unknown as Unit[]).forEach((unit) =>
  unitMap.set(unit.value, unit)
);

function getUnitByValue(value: UnitValue): Unit | undefined {
  return unitMap.get(value);
}

function getUnitsBySystem(system: MeasurementSystem): Unit[] {
  return (allUnits as unknown as Unit[]).filter((unit) =>
    unit.systems.includes(system)
  );
}

const metricSystem = getUnitsBySystem("metric");
const usSystem = getUnitsBySystem("us");
const imperialSystem = getUnitsBySystem("imperial");

export function convertUnits(
  value: number,
  fromUnitValue: UnitValue,
  toUnitValue: UnitValue
): number {
  const fromUnit = getUnitByValue(fromUnitValue);
  const toUnit = getUnitByValue(toUnitValue);

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

  const metricBaseValue = value * fromUnit.baseValue;

  return metricBaseValue / toUnit.baseValue;
}

export const metricUnitOptions = metricSystem.map((unit) => ({
  value: unit.value,
  label: unit.label,
}));

export const usUnitOptions = usSystem.map((unit) => ({
  value: unit.value,
  label: unit.label,
}));

export const imperialUnitOptions = imperialSystem.map((unit) => ({
  value: unit.value,
  label: unit.label,
}));
