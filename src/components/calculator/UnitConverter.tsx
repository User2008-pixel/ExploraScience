import React, { useState, useMemo } from 'react';
import { Formula } from '../common/Formula';
import {
  ArrowRightLeft,
  Copy,
  Check,
  Gauge,
  Thermometer,
  Zap,
  Target,
  Ruler,
  Scale,
  Activity,
  Flame,
  Sparkles,
  Info,
  Layers,
  RotateCcw,
} from 'lucide-react';

export type MeasurementCategory =
  | 'pressure'
  | 'temperature'
  | 'energy'
  | 'force'
  | 'length'
  | 'mass'
  | 'power';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  system: 'SI' | 'Imperial' | 'CGS' | 'Special';
  // Conversion to base SI unit: valInBase = (val * factor) + offset
  toBaseFactor: number;
  toBaseOffset?: number;
  description: string;
}

export interface CategoryData {
  id: MeasurementCategory;
  name: string;
  icon: any;
  baseUnitSymbol: string;
  baseUnitName: string;
  dimensionSymbol: string;
  dimensionName: string;
  description: string;
  units: UnitDefinition[];
  benchmarks: { label: string; value: number; unitId: string; note: string }[];
}

export const CATEGORIES_DATA: Record<MeasurementCategory, CategoryData> = {
  pressure: {
    id: 'pressure',
    name: 'Pressure',
    icon: Gauge,
    baseUnitSymbol: 'Pa',
    baseUnitName: 'Pascal (N/m²)',
    dimensionSymbol: '[M][L]⁻¹[T]⁻²',
    dimensionName: 'Force per unit area',
    description: 'Compressive force exerted perpendicular to an enclosed boundary or surface.',
    units: [
      { id: 'pa', name: 'Pascal', symbol: 'Pa', system: 'SI', toBaseFactor: 1, description: 'Standard SI unit: 1 N/m²' },
      { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', system: 'SI', toBaseFactor: 1e3, description: '1,000 Pa (common weather and fluid unit)' },
      { id: 'mpa', name: 'Megapascal', symbol: 'MPa', system: 'SI', toBaseFactor: 1e6, description: '1,000,000 Pa (materials engineering & yield strength)' },
      { id: 'bar', name: 'Bar', symbol: 'bar', system: 'Special', toBaseFactor: 1e5, description: 'Exactly 100,000 Pa (meteorological & dive pressure)' },
      { id: 'atm', name: 'Standard Atmosphere', symbol: 'atm', system: 'Special', toBaseFactor: 101325, description: 'Mean sea level atmospheric pressure = 101,325 Pa' },
      { id: 'torr', name: 'Torr (mmHg)', symbol: 'Torr', system: 'Special', toBaseFactor: 101325 / 760, description: '1/760 atm ≈ 133.322 Pa (manometer height)' },
      { id: 'psi', name: 'Pounds per square inch', symbol: 'psi (lbf/in²)', system: 'Imperial', toBaseFactor: 6894.757, description: 'Imperial force of 1 lbf over 1 in²' },
      { id: 'psf', name: 'Pounds per square foot', symbol: 'psf (lbf/ft²)', system: 'Imperial', toBaseFactor: 47.88026, description: '1 psi / 144 ≈ 47.88 Pa' },
      { id: 'inhg', name: 'Inches of Mercury', symbol: 'inHg', system: 'Imperial', toBaseFactor: 3386.389, description: 'Imperial barometric barometer unit at 0°C' },
    ],
    benchmarks: [
      { label: 'Standard Sea-Level Atmosphere', value: 1, unitId: 'atm', note: '101.325 kPa or 14.696 psi' },
      { label: 'Car Tire Normal Pressure', value: 32, unitId: 'psi', note: '≈ 2.2 bar or 220.6 kPa' },
      { label: 'Blood Pressure Systolic Normal', value: 120, unitId: 'torr', note: '120 mmHg ≈ 16 kPa' },
      { label: 'Deep Ocean Trench (Mariana)', value: 1086, unitId: 'bar', note: '≈ 108.6 MPa (15,750 psi)' },
    ],
  },

  temperature: {
    id: 'temperature',
    name: 'Temperature',
    icon: Thermometer,
    baseUnitSymbol: 'K',
    baseUnitName: 'Kelvin',
    dimensionSymbol: '[Θ]',
    dimensionName: 'Thermodynamic kinetic energy',
    description: 'Measure of the average microscopic kinetic energy of particles in a thermal system.',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', system: 'SI', toBaseFactor: 1, toBaseOffset: 273.15, description: 'Metric scale calibrated on pure H₂O freezing/boiling' },
      { id: 'k', name: 'Kelvin', symbol: 'K', system: 'SI', toBaseFactor: 1, toBaseOffset: 0, description: 'Absolute thermodynamic SI base unit (0 K = Absolute Zero)' },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', system: 'Imperial', toBaseFactor: 5 / 9, toBaseOffset: 273.15 - (32 * 5) / 9, description: 'Imperial scale: 32°F freezing, 212°F boiling' },
      { id: 'r', name: 'Rankine', symbol: '°R', system: 'Imperial', toBaseFactor: 5 / 9, toBaseOffset: 0, description: 'Absolute Imperial temperature scale' },
    ],
    benchmarks: [
      { label: 'Absolute Zero (0 K)', value: 0, unitId: 'k', note: '-273.15 °C or -459.67 °F' },
      { label: 'Water Freezing Point', value: 0, unitId: 'c', note: '273.15 K or 32 °F' },
      { label: 'Human Body Core', value: 37, unitId: 'c', note: '98.6 °F or 310.15 K' },
      { label: 'Water Boiling Point (1 atm)', value: 100, unitId: 'c', note: '373.15 K or 212 °F' },
      { label: 'Surface of the Sun', value: 5778, unitId: 'k', note: '≈ 5505 °C or 9940 °F' },
    ],
  },

  energy: {
    id: 'energy',
    name: 'Energy & Work',
    icon: Zap,
    baseUnitSymbol: 'J',
    baseUnitName: 'Joule (N·m)',
    dimensionSymbol: '[M][L]²[T]⁻²',
    dimensionName: 'Work, Heat, & Mechanical Energy',
    description: 'Capacity to do mechanical work, transfer thermal heat, or emit electromagnetic radiation.',
    units: [
      { id: 'j', name: 'Joule', symbol: 'J', system: 'SI', toBaseFactor: 1, description: 'Standard SI unit: 1 N · 1 m = 1 kg·m²/s²' },
      { id: 'kj', name: 'Kilojoule', symbol: 'kJ', system: 'SI', toBaseFactor: 1e3, description: '1,000 J (standard chemical reaction enthalpy ΔH)' },
      { id: 'mj', name: 'Megajoule', symbol: 'MJ', system: 'SI', toBaseFactor: 1e6, description: '1,000,000 J (food metabolism & electrical work)' },
      { id: 'cal', name: 'Thermochemical Calorie', symbol: 'cal', system: 'Special', toBaseFactor: 4.184, description: 'Heat to raise 1 g of water by 1°C = 4.184 J' },
      { id: 'kcal', name: 'Kilocalorie (Food Calorie)', symbol: 'kcal', system: 'Special', toBaseFactor: 4184, description: '1,000 cal = 1 food dietary Calorie' },
      { id: 'ev', name: 'Electron-Volt', symbol: 'eV', system: 'Special', toBaseFactor: 1.602176634e-19, description: 'Energy gained by electron across 1 Volt' },
      { id: 'kwh', name: 'Kilowatt-Hour', symbol: 'kWh', system: 'SI', toBaseFactor: 3.6e6, description: 'Electrical energy of 1 kW running for 1 hour = 3.6 MJ' },
      { id: 'btu', name: 'British Thermal Unit', symbol: 'BTU', system: 'Imperial', toBaseFactor: 1055.06, description: 'Imperial heat to warm 1 lb of water by 1°F' },
      { id: 'ftlb', name: 'Foot-Pound-Force', symbol: 'ft·lbf', system: 'Imperial', toBaseFactor: 1.355818, description: 'Imperial mechanical work: 1 lbf moved over 1 ft' },
    ],
    benchmarks: [
      { label: 'ATP Hydrolysis in Biology', value: 30.5, unitId: 'kj', note: 'Standard biochemical energy currency per mole' },
      { label: 'Photon of Green Light', value: 2.35, unitId: 'ev', note: 'λ ≈ 528 nm; h·c/λ' },
      { label: 'Household Electricity Unit', value: 1, unitId: 'kwh', note: '3,600,000 Joules (3.6 MJ)' },
      { label: '1 Gallon of Gasoline Energy', value: 120, unitId: 'mj', note: '≈ 33.3 kWh or 114,000 BTU' },
    ],
  },

  force: {
    id: 'force',
    name: 'Force',
    icon: Target,
    baseUnitSymbol: 'N',
    baseUnitName: 'Newton (kg·m/s²)',
    dimensionSymbol: '[M][L][T]⁻²',
    dimensionName: 'Interaction accelerating mass',
    description: 'Mechanical push or pull capable of altering the state of rest or motion of a mass.',
    units: [
      { id: 'n', name: 'Newton', symbol: 'N', system: 'SI', toBaseFactor: 1, description: 'SI base: 1 kg accelerated at 1 m/s²' },
      { id: 'kn', name: 'Kilonewton', symbol: 'kN', system: 'SI', toBaseFactor: 1e3, description: '1,000 N (structural & rocket aerospace loads)' },
      { id: 'mn', name: 'Meganewton', symbol: 'MN', system: 'SI', toBaseFactor: 1e6, description: '1,000,000 N (rocket booster thrust)' },
      { id: 'dyn', name: 'Dyne', symbol: 'dyn', system: 'CGS', toBaseFactor: 1e-5, description: 'CGS unit: 1 g·cm/s² = 10⁻⁵ N' },
      { id: 'kgf', name: 'Kilogram-Force (Kilopond)', symbol: 'kgf', system: 'Special', toBaseFactor: 9.80665, description: 'Gravity force on 1 kg at standard g = 9.80665 N' },
      { id: 'lbf', name: 'Pound-Force', symbol: 'lbf', system: 'Imperial', toBaseFactor: 4.448222, description: 'Imperial force on 1 lb mass under standard gravity' },
      { id: 'ozf', name: 'Ounce-Force', symbol: 'ozf', system: 'Imperial', toBaseFactor: 0.2780139, description: '1/16 of 1 lbf ≈ 0.278 N' },
      { id: 'kip', name: 'Kip (Kilo-Pound)', symbol: 'kip', system: 'Imperial', toBaseFactor: 4448.222, description: '1,000 lbf (structural beam ratings)' },
    ],
    benchmarks: [
      { label: 'Weight of an Average Apple', value: 1, unitId: 'n', note: 'Mass ≈ 102 grams on Earth surface' },
      { label: 'Average Human Punch', value: 3000, unitId: 'n', note: '≈ 3.0 kN or 675 lbf' },
      { label: 'Saturn V Rocket Liftoff Thrust', value: 34.5, unitId: 'mn', note: '≈ 34,500,000 N (7.75 million lbf)' },
      { label: 'Weight of 1 US Pound Mass', value: 1, unitId: 'lbf', note: 'Exactly 4.448222 Newtons' },
    ],
  },

  length: {
    id: 'length',
    name: 'Length & Distance',
    icon: Ruler,
    baseUnitSymbol: 'm',
    baseUnitName: 'Meter',
    dimensionSymbol: '[L]',
    dimensionName: 'Spatial displacement',
    description: 'Distance separating two spatial coordinates in physical Euclidean space.',
    units: [
      { id: 'm', name: 'Meter', symbol: 'm', system: 'SI', toBaseFactor: 1, description: 'SI base: distance light travels in 1/299,792,458 s' },
      { id: 'km', name: 'Kilometer', symbol: 'km', system: 'SI', toBaseFactor: 1000, description: '1,000 meters' },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', system: 'SI', toBaseFactor: 0.01, description: '1/100 meter' },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', system: 'SI', toBaseFactor: 0.001, description: '1/1,000 meter' },
      { id: 'um', name: 'Micrometer (Micron)', symbol: 'µm', system: 'SI', toBaseFactor: 1e-6, description: '10⁻⁶ m (cellular biological dimensions)' },
      { id: 'nm', name: 'Nanometer', symbol: 'nm', system: 'SI', toBaseFactor: 1e-9, description: '10⁻⁹ m (optical wavelengths & DNA diameter)' },
      { id: 'angstrom', name: 'Angstrom', symbol: 'Å', system: 'Special', toBaseFactor: 1e-10, description: '10⁻¹⁰ m (atomic bond lengths)' },
      { id: 'in', name: 'Inch', symbol: 'in', system: 'Imperial', toBaseFactor: 0.0254, description: 'Exactly 25.4 mm' },
      { id: 'ft', name: 'Foot', symbol: 'ft', system: 'Imperial', toBaseFactor: 0.3048, description: '12 inches = exactly 0.3048 m' },
      { id: 'yd', name: 'Yard', symbol: 'yd', system: 'Imperial', toBaseFactor: 0.9144, description: '3 feet = 0.9144 m' },
      { id: 'mi', name: 'Statute Mile', symbol: 'mi', system: 'Imperial', toBaseFactor: 1609.344, description: '5,280 feet ≈ 1.609344 km' },
    ],
    benchmarks: [
      { label: 'DNA Double Helix Diameter', value: 2, unitId: 'nm', note: '2.0 × 10⁻⁹ m (20 Å)' },
      { label: 'Visible Red Light Wavelength', value: 650, unitId: 'nm', note: '0.65 µm' },
      { label: 'Human Hair Thickness', value: 70, unitId: 'um', note: '≈ 0.07 mm or 0.0028 in' },
      { label: 'Olympic Sprint Track', value: 100, unitId: 'm', note: '≈ 328.084 feet' },
    ],
  },

  mass: {
    id: 'mass',
    name: 'Mass & Quantity',
    icon: Scale,
    baseUnitSymbol: 'kg',
    baseUnitName: 'Kilogram',
    dimensionSymbol: '[M]',
    dimensionName: 'Inertial resistance',
    description: 'Fundamental property of matter resisting acceleration under an applied force.',
    units: [
      { id: 'kg', name: 'Kilogram', symbol: 'kg', system: 'SI', toBaseFactor: 1, description: 'SI base defined by Planck constant h' },
      { id: 'g', name: 'Gram', symbol: 'g', system: 'SI', toBaseFactor: 0.001, description: '1/1,000 kg' },
      { id: 'mg', name: 'Milligram', symbol: 'mg', system: 'SI', toBaseFactor: 1e-6, description: '10⁻⁶ kg (pharmaceutical chemistry)' },
      { id: 'ton', name: 'Metric Tonne', symbol: 't', system: 'SI', toBaseFactor: 1000, description: '1,000 kg' },
      { id: 'u', name: 'Atomic Mass Unit', symbol: 'u (Da)', system: 'Special', toBaseFactor: 1.6605390666e-27, description: '1/12 mass of Carbon-12 atom' },
      { id: 'lb', name: 'Pound (Avoirdupois)', symbol: 'lb', system: 'Imperial', toBaseFactor: 0.45359237, description: 'Exactly 0.45359237 kg' },
      { id: 'oz', name: 'Ounce', symbol: 'oz', system: 'Imperial', toBaseFactor: 0.028349523, description: '1/16 pound ≈ 28.35 g' },
      { id: 'slug', name: 'Slug', symbol: 'slug', system: 'Imperial', toBaseFactor: 14.5939, description: 'Mass accelerated at 1 ft/s² by 1 lbf ≈ 14.59 kg' },
    ],
    benchmarks: [
      { label: 'Proton Rest Mass', value: 1.007276, unitId: 'u', note: '1.6726 × 10⁻²⁷ kg' },
      { label: '1 Liter of Water at 4°C', value: 1, unitId: 'kg', note: '≈ 2.20462 pounds' },
      { label: 'US Nickel Coin Mass', value: 5, unitId: 'g', note: 'Exactly 5.0 grams' },
    ],
  },

  power: {
    id: 'power',
    name: 'Power',
    icon: Activity,
    baseUnitSymbol: 'W',
    baseUnitName: 'Watt (J/s)',
    dimensionSymbol: '[M][L]²[T]⁻³',
    dimensionName: 'Rate of energy transfer',
    description: 'Time rate at which mechanical work is done or energy is transformed.',
    units: [
      { id: 'w', name: 'Watt', symbol: 'W', system: 'SI', toBaseFactor: 1, description: '1 Joule per second = 1 N·m/s' },
      { id: 'kw', name: 'Kilowatt', symbol: 'kW', system: 'SI', toBaseFactor: 1000, description: '1,000 Watts' },
      { id: 'mw', name: 'Megawatt', symbol: 'MW', system: 'SI', toBaseFactor: 1e6, description: '1,000,000 Watts (power generation)' },
      { id: 'hp', name: 'Horsepower (Mechanical)', symbol: 'hp', system: 'Imperial', toBaseFactor: 745.6999, description: '550 ft·lbf/s ≈ 745.7 W' },
      { id: 'hpm', name: 'Horsepower (Metric)', symbol: 'hp(M)', system: 'Special', toBaseFactor: 735.4988, description: '75 kgf·m/s ≈ 735.5 W' },
      { id: 'btuh', name: 'BTU per hour', symbol: 'BTU/h', system: 'Imperial', toBaseFactor: 0.293071, description: 'HVAC cooling and heating rating' },
    ],
    benchmarks: [
      { label: 'Human Basal Metabolic Rate', value: 100, unitId: 'w', note: 'Energy consumption at rest (resting human bulb)' },
      { label: 'Typical Modern Car Engine', value: 150, unitId: 'hp', note: '≈ 111.8 kW' },
      { label: 'Commercial Nuclear Reactor', value: 1000, unitId: 'mw', note: '1 Gigawatt electrical output' },
    ],
  },
};

export const UnitConverter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<MeasurementCategory>('pressure');
  const catData = CATEGORIES_DATA[selectedCategory];

  // Selected Units
  const [fromUnitId, setFromUnitId] = useState<string>(catData.units[4]?.id || catData.units[0].id); // default atm
  const [toUnitId, setToUnitId] = useState<string>(catData.units[6]?.id || catData.units[1].id); // default psi

  // Input value
  const [fromValue, setFromValue] = useState<string>('1');
  const [precision, setPrecision] = useState<number>(4);
  const [isScientific, setIsScientific] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // When category changes, ensure valid units
  const handleCategoryChange = (newCat: MeasurementCategory) => {
    setSelectedCategory(newCat);
    const newUnits = CATEGORIES_DATA[newCat].units;
    setFromUnitId(newUnits[0].id);
    setToUnitId(newUnits[newUnits.length > 1 ? 1 : 0].id);
  };

  const fromUnit = useMemo(
    () => catData.units.find((u) => u.id === fromUnitId) || catData.units[0],
    [catData, fromUnitId]
  );
  const toUnit = useMemo(
    () => catData.units.find((u) => u.id === toUnitId) || catData.units[1] || catData.units[0],
    [catData, toUnitId]
  );

  // Perform Unit Conversion
  const { convertedValue, baseValue, formulaExplanation } = useMemo(() => {
    const num = parseFloat(fromValue);
    if (isNaN(num)) {
      return { convertedValue: NaN, baseValue: NaN, formulaExplanation: '' };
    }

    let base = 0;
    // Step 1: Convert to SI base unit
    if (selectedCategory === 'temperature') {
      if (fromUnit.id === 'c') base = num + 273.15;
      else if (fromUnit.id === 'k') base = num;
      else if (fromUnit.id === 'f') base = ((num - 32) * 5) / 9 + 273.15;
      else if (fromUnit.id === 'r') base = (num * 5) / 9;
    } else {
      base = num * fromUnit.toBaseFactor;
    }

    // Step 2: Convert from SI base unit to target unit
    let target = 0;
    if (selectedCategory === 'temperature') {
      if (toUnit.id === 'c') target = base - 273.15;
      else if (toUnit.id === 'k') target = base;
      else if (toUnit.id === 'f') target = ((base - 273.15) * 9) / 5 + 32;
      else if (toUnit.id === 'r') target = (base * 9) / 5;
    } else {
      target = base / toUnit.toBaseFactor;
    }

    // Mathematical formula derivation text
    let explanation = '';
    if (selectedCategory === 'temperature') {
      if (fromUnit.id === 'c' && toUnit.id === 'f') {
        explanation = `T_F = T_C \\times \\frac{9}{5} + 32 = ${num} \\times 1.8 + 32 = ${target.toFixed(precision)}\\,^\\circ\\text{F}`;
      } else if (fromUnit.id === 'f' && toUnit.id === 'c') {
        explanation = `T_C = (T_F - 32) \\times \\frac{5}{9} = (${num} - 32) \\times \\frac{5}{9} = ${target.toFixed(precision)}\\,^\\circ\\text{C}`;
      } else if (fromUnit.id === 'c' && toUnit.id === 'k') {
        explanation = `T_K = T_C + 273.15 = ${num} + 273.15 = ${target.toFixed(precision)}\\,\\text{K}`;
      } else if (fromUnit.id === 'k' && toUnit.id === 'c') {
        explanation = `T_C = T_K - 273.15 = ${num} - 273.15 = ${target.toFixed(precision)}\\,^\\circ\\text{C}`;
      } else {
        explanation = `T_{\\text{base}} = ${base.toFixed(2)}\\,\\text{K} \\implies ${target.toFixed(precision)}\\,${toUnit.symbol}`;
      }
    } else {
      const ratio = fromUnit.toBaseFactor / toUnit.toBaseFactor;
      explanation = `1\\,${fromUnit.symbol} = ${ratio < 0.001 || ratio > 10000 ? ratio.toExponential(4) : ratio.toFixed(4)}\\,${toUnit.symbol} \\quad \\implies \\quad ${num}\\,${fromUnit.symbol} \\times ${ratio < 0.001 || ratio > 10000 ? ratio.toExponential(4) : ratio.toFixed(4)} = ${target < 0.001 || target > 10000 ? target.toExponential(precision) : target.toFixed(precision)}\\,${toUnit.symbol}`;
    }

    return { convertedValue: target, baseValue: base, formulaExplanation: explanation };
  }, [fromValue, fromUnit, toUnit, selectedCategory, precision]);

  // Format Output Number
  const formattedOutput = useMemo(() => {
    if (isNaN(convertedValue)) return '—';
    if (isScientific) {
      return convertedValue.toExponential(precision);
    }
    // Automatically use scientific if extremely large or tiny
    if (Math.abs(convertedValue) > 0 && (Math.abs(convertedValue) < 1e-4 || Math.abs(convertedValue) >= 1e8)) {
      return convertedValue.toExponential(precision);
    }
    return Number(convertedValue.toFixed(precision)).toString();
  }, [convertedValue, precision, isScientific]);

  // Swap Units
  const handleSwapUnits = () => {
    const prevFrom = fromUnitId;
    const prevTo = toUnitId;
    setFromUnitId(prevTo);
    setToUnitId(prevFrom);
    if (!isNaN(convertedValue)) {
      setFromValue(formattedOutput);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${formattedOutput} ${toUnit.symbol}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyBenchmark = (b: { value: number; unitId: string }) => {
    setSelectedCategory(catData.id);
    setFromUnitId(b.unitId);
    setFromValue(b.value.toString());
  };

  return (
    <div className="space-y-6">
      {/* Category Navigation Bar */}
      <div className="bg-[#131E36] p-3 rounded-2xl border border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {(Object.keys(CATEGORIES_DATA) as MeasurementCategory[]).map((catKey) => {
          const cat = CATEGORIES_DATA[catKey];
          const Icon = cat.icon;
          const isActive = selectedCategory === catKey;

          return (
            <button
              key={catKey}
              onClick={() => handleCategoryChange(catKey)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Two-Way Conversion Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Converter Unit (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#131E36] p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    {catData.name} Converter
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                    SI Base: {catData.baseUnitSymbol}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{catData.description}</p>
              </div>

              {/* Formatting tools */}
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <button
                  onClick={() => setIsScientific(!isScientific)}
                  className={`px-2 py-1 rounded-lg border transition ${
                    isScientific
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                  title="Toggle scientific notation (e.g. 1.01e5)"
                >
                  Sci (10ⁿ)
                </button>
                <select
                  value={precision}
                  onChange={(e) => setPrecision(parseInt(e.target.value))}
                  className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-cyan-500"
                  title="Decimal precision"
                >
                  <option value={2}>2 Decimals</option>
                  <option value={4}>4 Decimals</option>
                  <option value={6}>6 Decimals</option>
                  <option value={8}>8 Decimals</option>
                </select>
              </div>
            </div>

            {/* Two-Way Input Box Interface */}
            <div className="space-y-4">
              {/* FROM Input Box */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-300">
                    From ({fromUnit.system})
                  </span>
                  <span className="text-[11px] text-cyan-400 font-sans">{fromUnit.description}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="number"
                    value={fromValue}
                    onChange={(e) => setFromValue(e.target.value)}
                    placeholder="Enter value..."
                    className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3 text-lg sm:text-xl font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                  <select
                    value={fromUnitId}
                    onChange={(e) => setFromUnitId(e.target.value)}
                    className="w-full sm:w-56 bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3 py-3 text-sm font-semibold focus:outline-none focus:border-cyan-500"
                  >
                    {catData.units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.symbol}) — {u.system}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button Divider */}
              <div className="flex items-center justify-center relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <button
                  onClick={handleSwapUnits}
                  className="relative z-10 p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 hover:text-white transition shadow-lg hover:scale-105 active:scale-95"
                  title="Swap From and To units"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* TO Output Box */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-cyan-500/30 space-y-2 relative group">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-cyan-400">
                    To Result ({toUnit.system})
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans">{toUnit.description}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 bg-gradient-to-r from-slate-900 to-[#101C38] border border-cyan-500/40 text-cyan-300 rounded-xl px-4 py-3 text-lg sm:text-xl font-mono font-bold flex items-center justify-between overflow-x-auto">
                    <span>{formattedOutput}</span>
                    <button
                      onClick={handleCopy}
                      className="ml-2 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs font-sans font-normal"
                      title="Copy result"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <select
                    value={toUnitId}
                    onChange={(e) => setToUnitId(e.target.value)}
                    className="w-full sm:w-56 bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3 py-3 text-sm font-semibold focus:outline-none focus:border-cyan-500"
                  >
                    {catData.units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.symbol}) — {u.system}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Dimensional Analysis & Formula Derivation Card */}
            {formulaExplanation && (
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-cyan-400 font-bold uppercase">
                    <Info className="w-3.5 h-3.5" />
                    Dimensional Analysis & Conversion Formula:
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Dimension: {catData.dimensionSymbol}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 overflow-x-auto text-center">
                  <Formula tex={formulaExplanation} inline={false} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Benchmarks & Multi-Unit Comparison Grid (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Scientific Benchmarks */}
          <div className="bg-[#131E36] p-4 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Standard Scientific Benchmarks
            </h3>

            <div className="space-y-2">
              {catData.benchmarks.map((b, bIdx) => (
                <button
                  key={bIdx}
                  onClick={() => handleApplyBenchmark(b)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between group"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition">
                      {b.label}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{b.note}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold shrink-0">
                    {b.value} {catData.units.find((u) => u.id === b.unitId)?.symbol}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Cross-Unit Equivalent Table for Current Input */}
          <div className="bg-[#131E36] p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                All Units Equivalency Table
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {fromValue || '1'} {fromUnit.symbol} equals:
              </span>
            </div>

            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
              {catData.units.map((u) => {
                let eqVal = 0;
                if (selectedCategory === 'temperature') {
                  if (u.id === 'c') eqVal = baseValue - 273.15;
                  else if (u.id === 'k') eqVal = baseValue;
                  else if (u.id === 'f') eqVal = ((baseValue - 273.15) * 9) / 5 + 32;
                  else if (u.id === 'r') eqVal = (baseValue * 9) / 5;
                } else {
                  eqVal = baseValue / u.toBaseFactor;
                }

                const isCurrent = u.id === fromUnit.id;
                const formatted = isNaN(eqVal)
                  ? '—'
                  : Math.abs(eqVal) > 0 && (Math.abs(eqVal) < 1e-3 || Math.abs(eqVal) >= 1e7)
                  ? eqVal.toExponential(3)
                  : Number(eqVal.toFixed(3)).toString();

                return (
                  <div
                    key={u.id}
                    onClick={() => setToUnitId(u.id)}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition ${
                      isCurrent
                        ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-bold'
                        : 'bg-slate-950/60 hover:bg-slate-900 border border-slate-800/80 text-slate-300'
                    }`}
                    title={`Click to set ${u.name} as target unit`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          u.system === 'SI'
                            ? 'bg-blue-500/20 text-blue-400'
                            : u.system === 'Imperial'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {u.system}
                      </span>
                      <span className="truncate max-w-[140px]">{u.name}</span>
                    </div>
                    <span className="font-mono font-semibold">
                      {formatted} {u.symbol}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
