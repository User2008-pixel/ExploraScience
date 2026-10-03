import React, { useState } from 'react';
import { ConceptItem } from '../../types/science';
import { Formula } from '../common/Formula';
import { VariableSlider } from '../common/VariableSlider';
import { ProjectileMotionSim } from '../simulations/ProjectileMotionSim';
import { NewtonSecondLawSim } from '../simulations/NewtonSecondLawSim';
import { OhmsLawSim } from '../simulations/OhmsLawSim';
import { ReactionRateSim } from '../simulations/ReactionRateSim';
import { ElectrochemicalCellSim } from '../simulations/ElectrochemicalCellSim';
import { MolecularGeometrySim } from '../simulations/MolecularGeometrySim';
import { PhotosynthesisSim } from '../simulations/PhotosynthesisSim';
import { DNAReplicationSim } from '../simulations/DNAReplicationSim';
import { EnzymeActivitySim } from '../simulations/EnzymeActivitySim';
import { WaveOpticsSim } from '../simulations/WaveOpticsSim';
import { WorkEnergySim } from '../simulations/WorkEnergySim';
import { IdealGasSim } from '../simulations/IdealGasSim';
import { ChemicalEquilibriumSim } from '../simulations/ChemicalEquilibriumSim';
import { HumanCirculationSim } from '../simulations/HumanCirculationSim';
import { GeneticsSim } from '../simulations/GeneticsSim';
import { GravitationOrbitSim } from '../simulations/GravitationOrbitSim';
import { RayOpticsSim } from '../simulations/RayOpticsSim';
import { SHMSim } from '../simulations/SHMSim';
import { ElectrostaticsSim } from '../simulations/ElectrostaticsSim';
import { ThermodynamicsSim } from '../simulations/ThermodynamicsSim';
import { AtomicStructureSim } from '../simulations/AtomicStructureSim';
import { NervousSystemSim } from '../simulations/NervousSystemSim';
import { CellOsmosisSim } from '../simulations/CellOsmosisSim';
import { Class9ChemistrySim } from '../simulations/Class9ChemistrySim';
import { Class9BiologySim } from '../simulations/Class9BiologySim';
import { Class10PhysicsSim } from '../simulations/Class10PhysicsSim';
import {
  BookOpen,
  Eye,
  Sliders,
  HelpCircle,
  Globe,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Coins,
} from 'lucide-react';

interface ConceptVisualizerViewProps {
  concept: ConceptItem;
  onSelectConcept: (conceptId: string) => void;
  onBack: () => void;
  scienceCredits?: number;
  onEarnCredits?: (amount: number, reason: string) => void;
  onMasterConcept?: (conceptId: string) => void;
}

type StageTab = 'understand' | 'visualise' | 'manipulate' | 'investigate' | 'apply';

export const ConceptVisualizerView: React.FC<ConceptVisualizerViewProps> = ({
  concept,
  onSelectConcept,
  onBack,
  scienceCredits = 0,
  onEarnCredits = () => {},
  onMasterConcept = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<StageTab>('visualise');
  const [hasAwardedCredits, setHasAwardedCredits] = useState(false);

  // Variable values state
  const [varValues, setVarValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    concept.variables.forEach((v) => {
      init[v.id] = v.defaultValue;
    });
    return init;
  });

  // Prediction mode state
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [hasSubmittedPrediction, setHasSubmittedPrediction] = useState(false);

  // Render the appropriate simulation based on concept.simulationType
  const renderSimulation = () => {
    switch (concept.simulationType) {
      case 'projectile-motion':
        return (
          <ProjectileMotionSim
            velocity={varValues.velocity ?? 25}
            angle={varValues.angle ?? 45}
            gravity={varValues.gravity ?? 9.8}
            initialHeight={varValues.initialHeight ?? 0}
          />
        );
      case 'newtons-laws':
        return (
          <NewtonSecondLawSim
            appliedForce={varValues.appliedForce ?? 40}
            mass={varValues.mass ?? 5}
            frictionCoeff={varValues.frictionCoeff ?? 0.2}
          />
        );
      case 'ohms-law':
        return (
          <OhmsLawSim
            voltage={varValues.voltage ?? 12}
            resistance={varValues.resistance ?? 6}
          />
        );
      case 'reaction-rate':
        return (
          <ReactionRateSim
            temperature={varValues.temperature ?? 298}
            concentration={varValues.concentration ?? 1.0}
            activationEnergy={varValues.activationEnergy ?? 50}
          />
        );
      case 'electrochemical-cell':
        return (
          <ElectrochemicalCellSim
            zincConc={varValues.zincConc ?? 1.0}
            copperConc={varValues.copperConc ?? 1.0}
            temperatureK={varValues.temperatureK ?? 298}
          />
        );
      case 'molecular-geometry':
        return (
          <MolecularGeometrySim
            bondedPairs={varValues.bondedPairs ?? 4}
            lonePairs={varValues.lonePairs ?? 0}
          />
        );
      case 'photosynthesis':
        return (
          <PhotosynthesisSim
            lightIntensity={varValues.lightIntensity ?? 400}
            co2Concentration={varValues.co2Concentration ?? 400}
            tempC={varValues.tempC ?? 25}
          />
        );
      case 'dna-replication':
        return (
          <DNAReplicationSim
            replicationStep={varValues.replicationStep ?? 1}
            speed={varValues.speed ?? 500}
          />
        );
      case 'enzyme-activity':
        return (
          <EnzymeActivitySim
            substrateConc={varValues.substrateConc ?? 10}
            tempC={varValues.tempC ?? 37}
            phLevel={varValues.phLevel ?? 7.0}
          />
        );
      case 'wave-optics':
        return (
          <WaveOpticsSim
            wavelengthNm={varValues.wavelengthNm ?? 550}
            slitDistanceMm={varValues.slitDistanceMm ?? 0.3}
            screenDistanceM={varValues.screenDistanceM ?? 1.5}
          />
        );
      case 'work-energy':
        return (
          <WorkEnergySim
            initialHeightM={varValues.initialHeightM ?? 10}
            massKg={varValues.massKg ?? 10}
            frictionWorkPercent={varValues.frictionWorkPercent ?? 0}
          />
        );
      case 'states-of-matter':
        return (
          <IdealGasSim
            temperatureK={varValues.temperatureK ?? 300}
            volumeLiters={varValues.volumeLiters ?? 15}
            molesN={varValues.molesN ?? 1.0}
          />
        );
      case 'chemical-equilibrium':
        return (
          <ChemicalEquilibriumSim
            temperatureK={varValues.temperatureK ?? 500}
            totalPressureAtm={varValues.totalPressureAtm ?? 100}
            reactantRatio={varValues.reactantRatio ?? 3.0}
          />
        );
      case 'human-circulation':
        return (
          <HumanCirculationSim
            heartRateBpm={varValues.heartRateBpm ?? 72}
            endDiastolicVolumeMl={varValues.endDiastolicVolumeMl ?? 120}
            peripheralResistanceUnit={varValues.peripheralResistanceUnit ?? 1.0}
          />
        );
      case 'genetics':
        return (
          <GeneticsSim
            seedShapeDominance={varValues.seedShapeDominance ?? 1}
            seedColorDominance={varValues.seedColorDominance ?? 1}
          />
        );
      case 'gravitation-orbit':
        return (
          <GravitationOrbitSim
            centralMass={varValues.centralMass ?? 1.0}
            orbitalRadius={varValues.orbitalRadius ?? 1.0}
            eccentricity={varValues.eccentricity ?? 0.1}
          />
        );
      case 'ray-optics':
        return (
          <RayOpticsSim
            angle1={varValues.angle1 ?? 45}
            n1={varValues.n1 ?? 1.0}
            n2={varValues.n2 ?? 1.5}
          />
        );
      case 'shm-oscillator':
        return (
          <SHMSim
            amplitude={varValues.amplitude ?? 1.0}
            springConstant={varValues.springConstant ?? 40}
            mass={varValues.mass ?? 2.0}
            damping={varValues.damping ?? 0}
          />
        );
      case 'electrostatics':
        return (
          <ElectrostaticsSim
            charge1={varValues.charge1 ?? 5}
            charge2={varValues.charge2 ?? -5}
            distanceCm={varValues.distanceCm ?? 20}
          />
        );
      case 'thermodynamics-carnot':
        return (
          <ThermodynamicsSim
            hotReservoirTempK={varValues.hotReservoirTempK ?? 650}
            coldReservoirTempK={varValues.coldReservoirTempK ?? 300}
            compressionRatio={varValues.compressionRatio ?? 4}
          />
        );
      case 'atomic-structure':
        return (
          <AtomicStructureSim
            initialEnergyLevelN={varValues.initialEnergyLevelN ?? 3}
            targetEnergyLevelN={varValues.targetEnergyLevelN ?? 2}
            atomicNumberZ={varValues.atomicNumberZ ?? 1}
          />
        );
      case 'nervous-system':
        return (
          <NervousSystemSim
            stimulusIntensityMv={varValues.stimulusIntensityMv ?? 25}
            myelinationPercent={varValues.myelinationPercent ?? 80}
            extracellularNaMmol={varValues.extracellularNaMmol ?? 145}
          />
        );
      case 'cell-osmosis':
        return (
          <CellOsmosisSim
            externalSoluteConc={varValues.externalSoluteConc ?? 0.9}
            cellType="animal"
            temperatureC={varValues.temperatureC ?? 25}
          />
        );
      case 'class9-chemistry':
      case 'chem-reactions-conservation':
      case 'matter-surroundings':
      case 'solutions-colloids':
      case 'atoms-molecules-formula':
      case 'structure-of-atom':
      case 'bohr-model':
      case 'rutherford-scattering':
      case 'law-conservation-mass':
        return (
          <Class9ChemistrySim
            simulationType={concept.simulationType}
            conceptId={concept.id}
            variables={varValues}
          />
        );
      case 'class9-biology':
      case 'bio-cell-explorer':
      case 'cell-structure-organelles':
      case 'plant-vs-animal-cells':
      case 'cell-osmosis-plasmolysis':
      case 'plant-tissues':
      case 'animal-tissues':
      case 'cell-division-mitosis':
      case 'food-resources-crops':
        return (
          <Class9BiologySim
            simulationType={concept.simulationType}
            conceptId={concept.id}
            variables={varValues}
          />
        );
      case 'class10-physics':
        return (
          <Class10PhysicsSim
            simulationType={concept.simulationType}
            conceptId={concept.id}
            variables={varValues}
          />
        );
      default:
        // Automatic routing for Class 9 chemistry & biology and Class 10 physics
        if (concept.gradeLevel === 'Class 9' && concept.subject === 'chemistry') {
          return (
            <Class9ChemistrySim
              simulationType={concept.simulationType}
              conceptId={concept.id}
              variables={varValues}
            />
          );
        }
        if (concept.gradeLevel === 'Class 9' && concept.subject === 'biology') {
          return (
            <Class9BiologySim
              simulationType={concept.simulationType}
              conceptId={concept.id}
              variables={varValues}
            />
          );
        }
        if (concept.gradeLevel === 'Class 10' && concept.subject === 'physics') {
          return (
            <Class10PhysicsSim
              simulationType={concept.simulationType}
              conceptId={concept.id}
              variables={varValues}
            />
          );
        }
        return (
          <div className="p-8 text-center bg-slate-900 rounded-xl text-slate-400">
            Interactive simulation initialized.
          </div>
        );
    }
  };

  const currentChoice = concept.prediction.choices.find((c) => c.id === selectedPrediction);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
                concept.subject === 'physics'
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                  : concept.subject === 'chemistry'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {concept.subject} • {concept.gradeLevel}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{concept.title}</h1>
          <p className="text-slate-400 text-sm mt-1">{concept.tagline}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
          >
            ← Back to Library
          </button>
        </div>
      </div>

      {/* 5-Stage Core Learning Loop Tabs */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-1.5 flex flex-wrap gap-1 shadow-md">
        {[
          { id: 'understand', label: '1. Understand', icon: BookOpen },
          { id: 'visualise', label: '2. Visualise', icon: Eye },
          { id: 'manipulate', label: '3. Manipulate', icon: Sliders },
          { id: 'investigate', label: '4. Investigate (Predict)', icon: HelpCircle },
          { id: 'apply', label: '5. Real-World Applications', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as StageTab)}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-medium transition ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* STAGE 1: UNDERSTAND */}
      {activeTab === 'understand' && (
        <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wide">Scientific Principle</h3>
            <p className="text-slate-200 text-base leading-relaxed">{concept.description}</p>
          </div>

          {/* Governing Formula in KaTeX */}
          <div className="bg-slate-950/80 rounded-xl border border-cyan-800/60 p-4 space-y-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
              Fundamental Governing Equation
            </span>
            <Formula tex={concept.formulaLaTeX} className="text-center py-2 text-xl" />
            <p className="text-xs text-slate-400 italic text-center">{concept.formulaExplanation}</p>
          </div>

          {/* Physical Variable Explanations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Variables & Physical Quantities Breakdown
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {concept.variables.map((v) => (
                <div key={v.id} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-3">
                  <div className="bg-slate-950 px-2 py-1 rounded border border-slate-700/80 font-mono text-cyan-300 text-sm shrink-0">
                    <Formula tex={v.symbol} inline />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{v.name}</span>
                      <span className="text-xs text-slate-500 font-mono">[{v.unit || 'unitless'}]</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: VISUALISE & STAGE 3: MANIPULATE */}
      {(activeTab === 'visualise' || activeTab === 'manipulate') && (
        <div className="space-y-5">
          {/* Main Interactive Simulation Canvas */}
          {renderSimulation()}

          {/* Variable Sliders Panel */}
          <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Manipulate Experimental Variables
              </h3>
              <span className="text-xs text-slate-400">Sliders update vectors and graphs in real time</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {concept.variables.map((v) => (
                <VariableSlider
                  key={v.id}
                  name={v.name}
                  symbol={v.symbol}
                  unit={v.unit}
                  min={v.min}
                  max={v.max}
                  step={v.step}
                  value={varValues[v.id] ?? v.defaultValue}
                  description={v.description}
                  onChange={(val) => setVarValues((prev) => ({ ...prev, [v.id]: val }))}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: INVESTIGATE (Prediction Mode) */}
      {activeTab === 'investigate' && (
        <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <HelpCircle className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">{concept.prediction.prompt}</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800 mt-2">
              {concept.prediction.scenario}
            </p>
          </div>

          {/* 3 Prediction Options */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase">Select Your Prediction:</span>
            <div className="space-y-2">
              {concept.prediction.choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => {
                    setSelectedPrediction(choice.id);
                    setHasSubmittedPrediction(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    selectedPrediction === choice.id
                      ? 'border-cyan-400 bg-cyan-950/60 text-white shadow-md'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                        selectedPrediction === choice.id
                          ? 'border-cyan-400 bg-cyan-500 text-slate-950'
                          : 'border-slate-600'
                      }`}
                    >
                      {choice.id.replace('p', '')}
                    </span>
                    <span className="text-sm font-medium">{choice.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Prediction */}
          {!hasSubmittedPrediction ? (
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                type="button"
                disabled={!selectedPrediction}
                onClick={() => {
                  if (!selectedPrediction) return;
                  setHasSubmittedPrediction(true);
                  if (currentChoice?.isCorrect && !hasAwardedCredits) {
                    setHasAwardedCredits(true);
                    onEarnCredits(25, `Solved prediction hypothesis for "${concept.title}"!`);
                    onMasterConcept(concept.id);
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-sm shadow-md transition"
              >
                Run Simulation & Test Prediction
              </button>
              {!selectedPrediction && (
                <span className="text-xs text-amber-400 font-mono">
                  ⚠️ Mandatory: Select a prediction option above to test your hypothesis.
                </span>
              )}
            </div>
          ) : (
            <div className="space-y-4 pt-2 border-t border-slate-800">
              {/* Outcome Feedback */}
              {currentChoice?.isCorrect ? (
                <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-4 flex items-start gap-3 shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-emerald-300">Outstanding Deduction! Misconception Avoided</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <Coins className="w-3 h-3 text-amber-400" /> +25 Credits
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {concept.prediction.correctExplanation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-950/60 border border-amber-500/50 rounded-xl p-4 flex items-start gap-3 shadow-lg">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-2 w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-amber-300">Misconception Identified</h4>
                      <span className="text-[10px] font-mono text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                        0 Credits Awarded
                      </span>
                    </div>
                    <p className="text-xs text-amber-200 leading-relaxed">
                      {currentChoice?.misconceptionExplanation || 'This prediction relies on an intuitive bias that contradicts physical conservation laws.'}
                    </p>
                    <div className="bg-slate-950/70 p-3 rounded-lg border border-amber-900/50 space-y-1">
                      <span className="text-xs font-bold text-emerald-400 block">Correct Scientific Model: </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {concept.prediction.correctExplanation}
                      </p>
                    </div>
                    <div className="pt-1 flex items-center justify-between">
                      <p className="text-[11px] text-slate-400 italic">
                        Credits are awarded only when you test and select the scientifically accurate model.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setHasSubmittedPrediction(false);
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Re-evaluate Prediction
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* KaTeX Proof */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">
                  Mathematical Validation
                </span>
                <Formula tex={concept.prediction.relevantFormula} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* STAGE 5: REAL-WORLD APPLICATIONS */}
      {activeTab === 'apply' && (
        <div className="space-y-6">
          {/* Real-World Connections */}
          <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wide">
              Where Does This Appear in Real Life?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {concept.realWorldApplications.map((app, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">{app.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{app.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
