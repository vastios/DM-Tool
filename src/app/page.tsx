'use client'

import React, { useState } from 'react'
import { Pencil, RotateCcw, Sword, Shield, Heart, Sparkles, Scroll, Package, FileText } from 'lucide-react'
import { FlippableCard } from '@/components/FlippableCard'

// D&D 5e Ability Scores
const ABILITIES = [
  { name: 'FORZA', abbr: 'FOR', value: 16 },
  { name: 'DESTREZZA', abbr: 'DES', value: 14 },
  { name: 'COSTITUZIONE', abbr: 'COS', value: 16 },
  { name: 'INTELLIGENZA', abbr: 'INT', value: 10 },
  { name: 'SAGGEZZA', abbr: 'SAG', value: 12 },
  { name: 'CARISMA', abbr: 'CAR', value: 8 },
]

// D&D 5e Skills with associated abilities
const SKILLS = [
  { name: 'Acrobazia', ability: 'DES', proficient: true },
  { name: 'Addestrare Animali', ability: 'SAG', proficient: false },
  { name: 'Arcano', ability: 'INT', proficient: false },
  { name: 'Atletica', ability: 'FOR', proficient: true },
  { name: 'Cercare', ability: 'SAG', proficient: false },
  { name: 'Conoscenza', ability: 'INT', proficient: false },
  { name: 'Inganno', ability: 'CAR', proficient: false },
  { name: 'Intimidire', ability: 'CAR', proficient: true },
  { name: 'Intuizione', ability: 'SAG', proficient: false },
  { name: 'Investigare', ability: 'INT', proficient: false },
  { name: 'Medicina', ability: 'SAG', proficient: false },
  { name: 'Natura', ability: 'INT', proficient: false },
  { name: 'Percezione', ability: 'SAG', proficient: true },
  { name: 'Persuasione', ability: 'CAR', proficient: false },
  { name: 'Rapidità di Mano', ability: 'DES', proficient: false },
  { name: 'Religione', ability: 'INT', proficient: false },
  { name: 'Sopravvivenza', ability: 'SAG', proficient: false },
  { name: 'Storia', ability: 'INT', proficient: false },
]

// Saving Throws
const SAVING_THROWS = [
  { name: 'Forza', proficient: true },
  { name: 'Destrezza', proficient: false },
  { name: 'Costituzione', proficient: true },
  { name: 'Intelligenza', proficient: false },
  { name: 'Saggezza', proficient: false },
  { name: 'Carisma', proficient: false },
]

// Spells by level
const SPELLS = {
  'Trucchetti': ['Luce', 'Prestidigitazione', 'Rilevare Magia'],
  'Livello 1': ['Cura Ferite', 'Scudo di Fede', 'Benedizione'],
  'Livello 2': ['Cura Ferite Maggiori', 'Arma Spirituale', 'Silenzio'],
}

// Sample character data
const CHARACTER = {
  name: 'Thorin Ironforge',
  class: 'Guerriero',
  level: 5,
  race: 'Nano',
  alignment: 'Legale Buono',
  background: 'Soldato',
  experience: 6500,
  hitPoints: 45,
  maxHitPoints: 45,
  hitDice: '5d10',
  speed: '7.5m (5m con armatura)',
  initiative: 2,
  proficiencyBonus: 3,
}

// Calculate modifier
function getModifier(value: number): number {
  return Math.floor((value - 10) / 2)
}

// Format modifier with sign
function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`
}

export default function DDCharacterSheet() {
  // Initialize with localStorage value if available, otherwise default
  const [armorClass, setArmorClass] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedAC = localStorage.getItem('dnd-character-ac')
      if (savedAC) {
        return parseInt(savedAC, 10)
      }
    }
    return 16
  })
  const [isEditingAC, setIsEditingAC] = useState(false)
  const [tempAC, setTempAC] = useState('')

  // Save AC to localStorage
  const saveAC = (newAC: number) => {
    setArmorClass(newAC)
    localStorage.setItem('dnd-character-ac', newAC.toString())
    setIsEditingAC(false)
  }

  const handleEditAC = () => {
    setTempAC(armorClass.toString())
    setIsEditingAC(true)
  }

  const handleSaveAC = () => {
    const newAC = parseInt(tempAC, 10)
    if (!isNaN(newAC) && newAC >= 0) {
      saveAC(newAC)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveAC()
    } else if (e.key === 'Escape') {
      setIsEditingAC(false)
    }
  }

  // Get skill modifier
  const getSkillModifier = (skill: typeof SKILLS[0]) => {
    const ability = ABILITIES.find(a => a.abbr === skill.ability)
    if (!ability) return 0
    const mod = getModifier(ability.value)
    return skill.proficient ? mod + CHARACTER.proficiencyBonus : mod
  }

  // Get saving throw modifier
  const getSavingThrowModifier = (st: typeof SAVING_THROWS[0]) => {
    const ability = ABILITIES.find(a => a.name.toLowerCase() === st.name.toLowerCase())
    if (!ability) return 0
    const mod = getModifier(ability.value)
    return st.proficient ? mod + CHARACTER.proficiencyBonus : mod
  }

  // Identity Card Front
  const IdentityCard = (
    <div className="h-full parchment-card p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-amber-900 font-serif tracking-wide">{CHARACTER.name}</h1>
        <div className="text-amber-700">
          <Scroll className="w-6 h-6" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="info-row">
          <span className="text-amber-700 font-semibold">Classe:</span>
          <span className="text-amber-900 ml-2">{CHARACTER.class}</span>
        </div>
        <div className="info-row">
          <span className="text-amber-700 font-semibold">Livello:</span>
          <span className="text-amber-900 ml-2 font-bold text-lg">{CHARACTER.level}</span>
        </div>
        <div className="info-row">
          <span className="text-amber-700 font-semibold">Razza:</span>
          <span className="text-amber-900 ml-2">{CHARACTER.race}</span>
        </div>
        <div className="info-row">
          <span className="text-amber-700 font-semibold">Allineamento:</span>
          <span className="text-amber-900 ml-2">{CHARACTER.alignment}</span>
        </div>
        <div className="info-row col-span-2">
          <span className="text-amber-700 font-semibold">Background:</span>
          <span className="text-amber-900 ml-2">{CHARACTER.background}</span>
        </div>
        <div className="info-row col-span-2">
          <span className="text-amber-700 font-semibold">Punti Esperienza:</span>
          <span className="text-amber-900 ml-2 font-bold">{CHARACTER.experience.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-auto pt-4 text-center text-xs text-amber-600 italic">
        Clicca per vedere i dettagli di combattimento
      </div>
    </div>
  )

  // Combat Card Back
  const CombatCard = (
    <div className="h-full parchment-card p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-amber-900 font-serif flex items-center gap-2">
          <Sword className="w-5 h-5" />
          Combattimento
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Armor Class */}
        <div className="combat-stat">
          <div className="flex items-center justify-center gap-1">
            <Shield className="w-4 h-4 text-amber-700" />
            <span className="text-xs text-amber-600 uppercase tracking-wider">CA</span>
          </div>
          <div className="flex items-center justify-center gap-1 mt-1">
            {isEditingAC ? (
              <input
                type="number"
                value={tempAC}
                onChange={(e) => setTempAC(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSaveAC}
                className="w-16 h-10 text-2xl font-bold text-center bg-amber-50 border-2 border-amber-600 rounded-lg text-amber-900"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <>
                <span className="text-3xl font-bold text-amber-900">{armorClass}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditAC()
                  }}
                  className="p-1 hover:bg-amber-200 rounded transition-colors"
                  title="Modifica CA"
                >
                  <Pencil className="w-4 h-4 text-amber-600" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Hit Points */}
        <div className="combat-stat">
          <div className="flex items-center justify-center gap-1">
            <Heart className="w-4 h-4 text-red-600" />
            <span className="text-xs text-amber-600 uppercase tracking-wider">PF</span>
          </div>
          <div className="text-center mt-1">
            <span className="text-3xl font-bold text-amber-900">{CHARACTER.hitPoints}</span>
            <span className="text-lg text-amber-700">/{CHARACTER.maxHitPoints}</span>
          </div>
        </div>

        {/* Initiative */}
        <div className="combat-stat">
          <span className="text-xs text-amber-600 uppercase tracking-wider">Iniziativa</span>
          <div className="text-2xl font-bold text-amber-900 text-center mt-1">
            {formatModifier(CHARACTER.initiative)}
          </div>
        </div>

        {/* Speed */}
        <div className="combat-stat">
          <span className="text-xs text-amber-600 uppercase tracking-wider">Velocità</span>
          <div className="text-lg font-bold text-amber-900 text-center mt-1">
            {CHARACTER.speed}
          </div>
        </div>

        {/* Hit Dice */}
        <div className="combat-stat col-span-2">
          <span className="text-xs text-amber-600 uppercase tracking-wider">Dadi Vita</span>
          <div className="text-lg font-bold text-amber-900 text-center mt-1">
            {CHARACTER.hitDice}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 text-center text-xs text-amber-600 italic">
        Clicca per tornare all'identità
      </div>
    </div>
  )

  // Characteristics Card Front
  const CharacteristicsCard = (
    <div className="h-full parchment-card p-6 flex flex-col overflow-y-auto custom-scrollbar">
      {/* Abilities */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {ABILITIES.map((ability) => {
          const mod = getModifier(ability.value)
          return (
            <div key={ability.name} className="ability-box">
              <div className="text-xs text-amber-600 font-bold uppercase tracking-wider">
                {ability.name}
              </div>
              <div className="text-2xl font-bold text-amber-900 my-1">{ability.value}</div>
              <div className="text-lg font-bold text-amber-700 bg-amber-100 rounded px-2 py-0.5">
                {formatModifier(mod)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Skills */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
          <Scroll className="w-4 h-4" />
          Abilità
        </h3>
        <div className="grid grid-cols-2 gap-1 text-xs max-h-40 overflow-y-auto custom-scrollbar pr-1">
          {SKILLS.map((skill) => (
            <div key={skill.name} className="flex items-center gap-1 py-0.5">
              <div className={`w-3 h-3 border ${skill.proficient ? 'bg-amber-600 border-amber-700' : 'border-amber-400'} rounded-sm`} />
              <span className="text-black font-medium">{skill.name}</span>
              <span className="text-amber-800 ml-auto">
                {formatModifier(getSkillModifier(skill))}
              </span>
              <span className="text-amber-500 text-[10px]">({skill.ability})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Saving Throws */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Tiri Salvezza
        </h3>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {SAVING_THROWS.map((st) => (
            <div key={st.name} className="flex items-center gap-1 py-0.5">
              <div className={`w-3 h-3 border ${st.proficient ? 'bg-amber-600 border-amber-700' : 'border-amber-400'} rounded-sm`} />
              <span className="text-black font-medium">{st.name}</span>
              <span className="text-amber-800 ml-auto">
                {formatModifier(getSavingThrowModifier(st))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Magic */}
      <div className="mt-auto">
        <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Magia
        </h3>
        {Object.entries(SPELLS).map(([level, spells]) => (
          <div key={level} className="mb-2">
            <div className="text-xs font-bold text-amber-700 mb-1">{level}</div>
            <div className="flex flex-wrap gap-1">
              {spells.map((spell) => (
                <span key={spell} className="text-xs bg-amber-100 text-black px-2 py-0.5 rounded border border-amber-300">
                  {spell}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-center text-xs text-amber-600 italic">
        Clicca per vedere note ed equipaggiamento
      </div>
    </div>
  )

  // Notes Card Back
  const NotesCard = (
    <div className="h-full parchment-card p-6 flex flex-col overflow-y-auto custom-scrollbar">
      <h2 className="text-xl font-bold text-amber-900 font-serif flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5" />
        Note & Equipaggiamento
      </h2>

      {/* Equipment */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Equipaggiamento
        </h3>
        <ul className="text-xs text-black space-y-1">
          <li>• Armatura di Piastre</li>
          <li>• Scudo</li>
          <li>• Ascia da Guerra +1</li>
          <li>• Martello da Guerra</li>
          <li>• Arco Lungo con 20 frecce</li>
          <li>• Borsa da Avventuriero</li>
          <li>• Coperta invernale</li>
          <li>• Kit del medico</li>
          <li>• Pozione cura (2)</li>
          <li>• 150 mo</li>
        </ul>
      </div>

      {/* Features & Traits */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
          <Scroll className="w-4 h-4" />
          Tratti e Capacità
        </h3>
        <div className="text-xs text-black space-y-2">
          <div>
            <span className="font-bold text-amber-800">Resistenza Nanica:</span>
            vantaggio ai TS contro veleni, resistenza al danno da veleno
          </div>
          <div>
            <span className="font-bold text-amber-800">Visione al Buio:</span>
            18 metri
          </div>
          <div>
            <span className="font-bold text-amber-800">Competenza con le Pietre:</span>
            attenzione quando si passa a 3 metri da un'origine di pietra
          </div>
          <div>
            <span className="font-bold text-amber-800">Stile di Combattimento:</span>
            Difesa (+1 CA mentre indossi armatura)
          </div>
          <div>
            <span className="font-bold text-amber-800">Secondo Vento:</span>
            1d10+5 PF come azione bonus
          </div>
          <div>
            <span className="font-bold text-amber-800">Azione Furiosa:</span>
            attacchi extra quando ridotto a 0 PF
          </div>
          <div>
            <span className="font-bold text-amber-800">Miglioramento del Punteggio:</span>
            +2 FOR, +1 COS
          </div>
        </div>
      </div>

      {/* Background Notes */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Note sul Personaggio
        </h3>
        <div className="text-xs text-black italic bg-amber-50 p-2 rounded border border-amber-200">
          <p className="mb-2">
            Thorin Ironforge è un veterano dell'esercito nanico, congedato con onore dopo 
            50 anni di servizio. Ha combattuto nella Guerra delle Ombre contro gli orchi 
            delle Montagne Grigie.
          </p>
          <p className="mb-2">
            La sua famiglia gestisce una famosa fucina a Ironhold, e lui cerca un'arma 
            leggendaria perduta: il Martello di Thordak, appartenuto al suo bisnonno.
          </p>
          <p>
            <strong>Legame:</strong> "Proteggerò i miei compagni a costo della mia vita."
          </p>
        </div>
      </div>

      {/* Proficiencies */}
      <div>
        <h3 className="text-sm font-bold text-amber-900 mb-2">Competenze</h3>
        <div className="text-xs text-black">
          <p><strong>Armi:</strong> Armi semplici, armi da guerra</p>
          <p><strong>Armature:</strong> Tutte le armature, scudi</p>
          <p><strong>Strumenti:</strong> Nessuno</p>
          <p><strong>Lingue:</strong> Comune, Nanico</p>
        </div>
      </div>

      <div className="mt-auto pt-4 text-center text-xs text-amber-600 italic">
        Clicca per tornare alle caratteristiche
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 p-4 md:p-8">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 font-serif tracking-wider drop-shadow-lg">
            ⚔️ Scheda Personaggio D&D 5e ⚔️
          </h1>
          <div className="h-1 w-48 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-2" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Identity/Combat Card */}
          <div className="h-[450px] md:h-[500px]">
            <FlippableCard
              front={IdentityCard}
              back={CombatCard}
              className="w-full h-full"
            />
          </div>

          {/* Right Column - Characteristics/Notes Card */}
          <div className="h-[450px] md:h-[500px]">
            <FlippableCard
              front={CharacteristicsCard}
              back={NotesCard}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-amber-700 text-sm">
          <p className="flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Clicca sulle card per girarle
          </p>
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        .preserve-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        .parchment-card {
          background: linear-gradient(135deg, #f5e6c8 0%, #e8d4a8 50%, #f0dfc0 100%);
          border: 3px solid #8b6914;
          border-radius: 12px;
          box-shadow: 
            0 0 0 2px #c9a227,
            0 4px 20px rgba(139, 105, 20, 0.3),
            inset 0 0 30px rgba(139, 105, 20, 0.1);
          position: relative;
          overflow: hidden;
        }

        .parchment-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238b6914' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
        }

        .info-row {
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          border-left: 2px solid #c9a227;
        }

        .ability-box {
          background: linear-gradient(180deg, #fff 0%, #fef3c7 100%);
          border: 2px solid #8b6914;
          border-radius: 8px;
          padding: 8px 4px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(139, 105, 20, 0.2);
        }

        .combat-stat {
          background: rgba(255, 255, 255, 0.4);
          border: 2px solid #c9a227;
          border-radius: 8px;
          padding: 12px 8px;
          text-align: center;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 105, 20, 0.1);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 105, 20, 0.4);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 105, 20, 0.6);
        }
      `}</style>
    </div>
  )
}
