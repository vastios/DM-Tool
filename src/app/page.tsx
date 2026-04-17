'use client'

import { useState } from 'react'
import { MapPin, Users, Shield, Castle, Sword, Compass, BookOpen, Plus, Edit, Trash2, Search, ChevronRight, Map, Building, Trees, Mountain, Landmark, Home, Image as ImageIcon, X, Palette, Globe, Waves, Sun, Moon, Cloud, Castle as CastleIcon, Tent, Store, Church, Ship, Anchor } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

// Types
interface Tag {
  id: string
  name: string
  color: string
  description?: string
}

interface LinkedNPC {
  id: string
  name: string
  role?: string
  npcId: string
}

interface LinkedFaction {
  id: string
  name: string
  description?: string
  factionId: string
}

interface Location {
  id: string
  name: string
  description?: string
  type?: string
  parentId?: string
  parentName?: string
  imageUrl?: string
  notes?: string
  isVisited: boolean
  tags: Tag[]
  linkedNPCs?: LinkedNPC[]
  linkedFactions?: LinkedFaction[]
}

interface SimpleNPC {
  id: string
  name: string
  race?: string
  class?: string
}

interface SimpleFaction {
  id: string
  name: string
  type?: string
}

// Main navigation sections
const mainSections = [
  { id: 'campagna', label: 'Campagna', icon: Castle },
  { id: 'personaggi', label: 'Personaggi', icon: Users },
  { id: 'mondo', label: 'Mondo', icon: Map },
  { id: 'combattimento', label: 'Combattimento', icon: Sword },
  { id: 'esplorazione', label: 'Esplorazione', icon: Compass },
  { id: 'compendium', label: 'Compendium', icon: BookOpen },
]

// Subsections per main section
const subSections: Record<string, { id: string; label: string; hasTag?: boolean; tagColor?: string }[]> = {
  'campagna': [
    { id: 'overview', label: 'Panoramica' },
    { id: 'diario', label: 'Diario' },
    { id: 'secrets', label: 'Segreti', hasTag: true, tagColor: '#7c3aed' },
  ],
  'personaggi': [
    { id: 'pg', label: 'PG', hasTag: true, tagColor: '#059669' },
    { id: 'npc', label: 'NPC', hasTag: true, tagColor: '#dc2626' },
    { id: 'fazioni', label: 'Fazioni', hasTag: true, tagColor: '#ea580c' },
  ],
  'mondo': [
    { id: 'luoghi', label: 'Luoghi', hasTag: true, tagColor: '#0891b2' },
    { id: 'storia', label: 'Storia' },
    { id: 'leggende', label: 'Leggende' },
  ],
  'combattimento': [
    { id: 'encounters', label: 'Encounters' },
    { id: 'mostri', label: 'Mostri' },
  ],
  'esplorazione': [
    { id: 'mappe', label: 'Mappe' },
    { id: 'travel', label: 'Viaggio' },
  ],
  'compendium': [
    { id: 'rules', label: 'Regole' },
    { id: 'items', label: 'Oggetti' },
    { id: 'spells', label: 'Incantesimi' },
  ],
}

// Expanded location types with categories
const locationTypes = [
  // Insediamenti
  { value: 'regno', label: 'Regno', icon: CastleIcon, category: 'Insediamenti' },
  { value: 'citta', label: 'Città', icon: Building, category: 'Insediamenti' },
  { value: 'villaggio', label: 'Villaggio', icon: Home, category: 'Insediamenti' },
  { value: 'accampamento', label: 'Accampamento', icon: Tent, category: 'Insediamenti' },
  { value: 'avamposto', label: 'Avamposto', icon: Store, category: 'Insediamenti' },
  // Luoghi di interesse
  { value: 'dungeon', label: 'Dungeon', icon: Landmark, category: 'Luoghi di Interesse' },
  { value: 'rovine', label: 'Rovine', icon: Landmark, category: 'Luoghi di Interesse' },
  { value: 'tempio', label: 'Tempio', icon: Church, category: 'Luoghi di Interesse' },
  { value: 'torre', label: 'Torre', icon: Castle, category: 'Luoghi di Interesse' },
  { value: 'nascondiglio', label: 'Nascondiglio', icon: Landmark, category: 'Luoghi di Interesse' },
  // Natura
  { value: 'foresta', label: 'Foresta', icon: Trees, category: 'Natura' },
  { value: 'montagna', label: 'Montagna', icon: Mountain, category: 'Natura' },
  { value: 'deserto', label: 'Deserto', icon: Sun, category: 'Natura' },
  { value: 'pianura', label: 'Pianura', icon: Globe, category: 'Natura' },
  { value: 'palude', label: 'Palude', icon: Waves, category: 'Natura' },
  // Acqua
  { value: 'mare', label: 'Mare', icon: Waves, category: 'Acqua' },
  { value: 'lago', label: 'Lago', icon: Waves, category: 'Acqua' },
  { value: 'fiume', label: 'Fiume', icon: Waves, category: 'Acqua' },
  { value: 'porto', label: 'Porto', icon: Anchor, category: 'Acqua' },
  { value: 'nave', label: 'Nave', icon: Ship, category: 'Acqua' },
  // Piani dimensionali
  { value: 'piano_materiale', label: 'Piano Materiale', icon: Globe, category: 'Piani' },
  { value: 'piano_etereo', label: 'Piano Etereo', icon: Cloud, category: 'Piani' },
  { value: 'piano_ombre', label: 'Piano delle Ombre', icon: Moon, category: 'Piani' },
  { value: 'piano_elementale', label: 'Piano Elementale', icon: Waves, category: 'Piani' },
  // Altro
  { value: 'altro', label: 'Altro', icon: MapPin, category: 'Altro' },
]

// Predefined tag colors
const predefinedTagColors = [
  '#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d', 
  '#16a34a', '#059669', '#0d9488', '#0891b2', '#0284c7',
  '#2563eb', '#4f46e5', '#7c3aed', '#9333ea', '#c026d3',
  '#db2777', '#e11d48', '#78716c', '#57534e', '#1f2937'
]

export default function DMTool() {
  const [activeSection, setActiveSection] = useState('mondo')
  const [activeSubSection, setActiveSubSection] = useState('luoghi')
  const [locations, setLocations] = useState<Location[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [npcs, setNpcs] = useState<SimpleNPC[]>([])
  const [factions, setFactions] = useState<SimpleFaction[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [linkedNPCs, setLinkedNPCs] = useState<{ npcId: string; role: string }[]>([])
  const [linkedFactions, setLinkedFactions] = useState<{ factionId: string; description: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    parentId: '',
    imageUrl: '',
    notes: '',
    isVisited: false,
  })

  // New tag state
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#0891b2')
  const [showColorPicker, setShowColorPicker] = useState(false)

  // Fetch locations
  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/locations')
      const data = await res.json()
      setLocations(data.locations || [])
      setTags(data.tags || [])
      setNpcs(data.npcs || [])
      setFactions(data.factions || [])
    } catch (error) {
      console.error('Error fetching locations:', error)
      toast.error('Errore nel caricamento dei luoghi')
    }
  }

  // Filter locations by search
  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get available parent locations (exclude current location when editing)
  const availableParents = locations.filter(loc => 
    !editingLocation || loc.id !== editingLocation.id
  )

  // Handle form submit
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Il nome è obbligatorio')
      return
    }

    setIsLoading(true)
    try {
      if (editingLocation) {
        // Update existing
        const res = await fetch(`/api/locations/${editingLocation.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...formData, 
            tagIds: selectedTags,
            linkedNPCs,
            linkedFactions
          }),
        })
        if (res.ok) {
          toast.success('Luogo aggiornato con successo')
        } else {
          throw new Error('Update failed')
        }
      } else {
        // Create new
        const res = await fetch('/api/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...formData, 
            tagIds: selectedTags,
            linkedNPCs,
            linkedFactions
          }),
        })
        if (res.ok) {
          toast.success('Luogo creato con successo')
        } else {
          throw new Error('Create failed')
        }
      }
      
      setIsDialogOpen(false)
      resetForm()
      fetchLocations()
    } catch (error) {
      console.error('Error saving location:', error)
      toast.error('Errore nel salvataggio del luogo')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Sei sicuro di voler eliminare "${name}"?`)) return
    
    setIsLoading(true)
    try {
      const res = await fetch(`/api/locations/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Luogo eliminato con successo')
        fetchLocations()
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      console.error('Error deleting location:', error)
      toast.error('Errore nell\'eliminazione del luogo')
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: '',
      parentId: '',
      imageUrl: '',
      notes: '',
      isVisited: false,
    })
    setSelectedTags([])
    setLinkedNPCs([])
    setLinkedFactions([])
    setEditingLocation(null)
    setNewTagName('')
    setNewTagColor('#0891b2')
  }

  // Open edit dialog
  const openEditDialog = (location: Location) => {
    setFormData({
      name: location.name,
      description: location.description || '',
      type: location.type || '',
      parentId: location.parentId || '',
      imageUrl: location.imageUrl || '',
      notes: location.notes || '',
      isVisited: location.isVisited,
    })
    setSelectedTags(location.tags.map(t => t.id))
    setLinkedNPCs(location.linkedNPCs?.map(n => ({ npcId: n.npcId, role: n.role || '' })) || [])
    setLinkedFactions(location.linkedFactions?.map(f => ({ factionId: f.factionId, description: f.description || '' })) || [])
    setEditingLocation(location)
    setIsDialogOpen(true)
  }

  // Create new tag
  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Inserisci un nome per il tag')
      return
    }

    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName.trim(), color: newTagColor }),
      })
      const data = await res.json()
      setTags(prev => [...prev, data.tag])
      setSelectedTags(prev => [...prev, data.tag.id])
      setNewTagName('')
      setNewTagColor('#0891b2')
      setShowColorPicker(false)
      toast.success('Tag creato con successo')
    } catch (error) {
      console.error('Error creating tag:', error)
      toast.error('Errore nella creazione del tag')
    }
  }

  // Add NPC link
  const addNPCLink = (npcId: string) => {
    if (!linkedNPCs.find(l => l.npcId === npcId)) {
      setLinkedNPCs(prev => [...prev, { npcId, role: '' }])
    }
  }

  // Remove NPC link
  const removeNPCLink = (npcId: string) => {
    setLinkedNPCs(prev => prev.filter(l => l.npcId !== npcId))
  }

  // Add Faction link
  const addFactionLink = (factionId: string) => {
    if (!linkedFactions.find(l => l.factionId === factionId)) {
      setLinkedFactions(prev => [...prev, { factionId, description: '' }])
    }
  }

  // Remove Faction link
  const removeFactionLink = (factionId: string) => {
    setLinkedFactions(prev => prev.filter(l => l.factionId !== factionId))
  }

  // Get location type info
  const getLocationTypeInfo = (type?: string) => {
    return locationTypes.find(t => t.value === type) || { label: type, icon: MapPin, category: '' }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">DM Tool</h1>
              <Badge variant="outline" className="text-xs">D&D 5e</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Sessione Attiva</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {mainSections.map(section => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id)
                    setActiveSubSection(subSections[section.id]?.[0]?.id || '')
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Sub Navigation */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {subSections[activeSection]?.map(sub => {
              const isActive = activeSubSection === sub.id
              const labelStyle = sub.hasTag ? {
                backgroundColor: sub.tagColor,
                color: 'white',
              } : {}
              
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubSection(sub.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                    ${sub.hasTag 
                      ? 'shadow-sm hover:opacity-90' 
                      : isActive 
                        ? 'bg-muted text-foreground' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  style={sub.hasTag ? labelStyle : {}}
                >
                  {sub.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Locations Section */}
        {activeSection === 'mondo' && activeSubSection === 'luoghi' && (
          <div className="space-y-6">
            {/* Header with search and add button */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-cyan-600" />
                  Luoghi
                </h2>
                <p className="text-muted-foreground">
                  Gestisci i luoghi del tuo mondo
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cerca luoghi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) resetForm()
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuovo Luogo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingLocation ? 'Modifica Luogo' : 'Nuovo Luogo'}
                      </DialogTitle>
                      <DialogDescription>
                        Inserisci i dettagli del luogo
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="basic">Base</TabsTrigger>
                        <TabsTrigger value="details">Dettagli</TabsTrigger>
                        <TabsTrigger value="links">Collegamenti</TabsTrigger>
                        <TabsTrigger value="tags">Tag</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="basic" className="space-y-4 py-4">
                        {/* Nome */}
                        <div className="grid gap-2">
                          <Label htmlFor="name">Nome *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Nome del luogo"
                          />
                        </div>
                        
                        {/* Tipo */}
                        <div className="grid gap-2">
                          <Label htmlFor="type">Tipo</Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona tipo" />
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              {Array.from(new Set(locationTypes.map(t => t.category))).map(category => (
                                <div key={category}>
                                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                                    {category}
                                  </div>
                                  {locationTypes.filter(t => t.category === category).map(type => (
                                    <SelectItem key={type.value} value={type.value}>
                                      <div className="flex items-center gap-2">
                                        <type.icon className="h-4 w-4" />
                                        {type.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </div>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Luogo Padre */}
                        <div className="grid gap-2">
                          <Label htmlFor="parentId">Luogo Padre</Label>
                          <Select
                            value={formData.parentId}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value === 'none' ? '' : value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona luogo padre (opzionale)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">
                                <span className="text-muted-foreground">Nessun padre</span>
                              </SelectItem>
                              {availableParents.map(loc => (
                                <SelectItem key={loc.id} value={loc.id}>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {loc.name}
                                    {loc.type && (
                                      <Badge variant="outline" className="text-xs">
                                        {locationTypes.find(t => t.value === loc.type)?.label || loc.type}
                                      </Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            Es: una città dentro un regno, una foresta dentro una regione
                          </p>
                        </div>

                        {/* Descrizione */}
                        <div className="grid gap-2">
                          <Label htmlFor="description">Descrizione</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Descrizione del luogo..."
                            rows={3}
                          />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="details" className="space-y-4 py-4">
                        {/* Immagine URL */}
                        <div className="grid gap-2">
                          <Label htmlFor="imageUrl">
                            <span className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4" />
                              URL Immagine
                            </span>
                          </Label>
                          <Input
                            id="imageUrl"
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                            placeholder="https://esempio.com/immagine.jpg"
                          />
                          {formData.imageUrl && (
                            <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border bg-muted">
                              <img 
                                src={formData.imageUrl} 
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none'
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Note Segrete */}
                        <div className="grid gap-2">
                          <Label htmlFor="notes">Note Segrete (DM)</Label>
                          <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Note visibili solo al DM..."
                            rows={4}
                          />
                        </div>

                        {/* Visitato */}
                        <div className="flex items-center gap-2">
                          <Switch
                            id="isVisited"
                            checked={formData.isVisited}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVisited: checked }))}
                          />
                          <Label htmlFor="isVisited">Già visitato dal party</Label>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="links" className="space-y-4 py-4">
                        {/* NPCs Collegati */}
                        <div className="grid gap-3">
                          <Label className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            NPC Presenti
                          </Label>
                          
                          {linkedNPCs.length > 0 && (
                            <div className="space-y-2">
                              {linkedNPCs.map((link) => {
                                const npc = npcs.find(n => n.id === link.npcId)
                                return (
                                  <div key={link.npcId} className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30">
                                    <Badge variant="outline">{npc?.name || 'NPC'}</Badge>
                                    <Input
                                      placeholder="Ruolo (es: Sindaco, Mercante)"
                                      value={link.role}
                                      onChange={(e) => setLinkedNPCs(prev => 
                                        prev.map(l => l.npcId === link.npcId ? { ...l, role: e.target.value } : l)
                                      )}
                                      className="flex-1 h-8"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => removeNPCLink(link.npcId)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                          
                          {npcs.length > 0 ? (
                            <Select onValueChange={addNPCLink}>
                              <SelectTrigger>
                                <SelectValue placeholder="+ Aggiungi NPC" />
                              </SelectTrigger>
                              <SelectContent>
                                {npcs.filter(n => !linkedNPCs.find(l => l.npcId === n.id)).map(npc => (
                                  <SelectItem key={npc.id} value={npc.id}>
                                    {npc.name} {npc.race && `(${npc.race})`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Nessun NPC disponibile. Creane qualcuno nella sezione Personaggi.
                            </p>
                          )}
                        </div>

                        {/* Fazioni Collegate */}
                        <div className="grid gap-3">
                          <Label className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Fazioni Presenti
                          </Label>
                          
                          {linkedFactions.length > 0 && (
                            <div className="space-y-2">
                              {linkedFactions.map((link) => {
                                const faction = factions.find(f => f.id === link.factionId)
                                return (
                                  <div key={link.factionId} className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30">
                                    <Badge variant="outline">{faction?.name || 'Fazione'}</Badge>
                                    <Input
                                      placeholder="Ruolo (es: Quartiere Generale, Territorio)"
                                      value={link.description}
                                      onChange={(e) => setLinkedFactions(prev => 
                                        prev.map(l => l.factionId === link.factionId ? { ...l, description: e.target.value } : l)
                                      )}
                                      className="flex-1 h-8"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => removeFactionLink(link.factionId)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                          
                          {factions.length > 0 ? (
                            <Select onValueChange={addFactionLink}>
                              <SelectTrigger>
                                <SelectValue placeholder="+ Aggiungi Fazione" />
                              </SelectTrigger>
                              <SelectContent>
                                {factions.filter(f => !linkedFactions.find(l => l.factionId === f.id)).map(faction => (
                                  <SelectItem key={faction.id} value={faction.id}>
                                    {faction.name} {faction.type && `(${faction.type})`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Nessuna fazione disponibile. Creane qualcuna nella sezione Personaggi.
                            </p>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="tags" className="space-y-4 py-4">
                        {/* Tag esistenti */}
                        <div className="grid gap-2">
                          <Label>Tag Esistenti</Label>
                          <div className="flex flex-wrap gap-2">
                            {tags.map(tag => (
                              <Badge
                                key={tag.id}
                                variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                                style={{ 
                                  backgroundColor: selectedTags.includes(tag.id) ? tag.color : 'transparent',
                                  borderColor: tag.color,
                                  color: selectedTags.includes(tag.id) ? 'white' : tag.color
                                }}
                                className="cursor-pointer"
                                onClick={() => {
                                  setSelectedTags(prev => 
                                    prev.includes(tag.id) 
                                      ? prev.filter(id => id !== tag.id)
                                      : [...prev, tag.id]
                                  )
                                }}
                              >
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Crea nuovo tag con color picker */}
                        <div className="grid gap-2">
                          <Label>Nuovo Tag</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Nome tag..."
                              value={newTagName}
                              onChange={(e) => setNewTagName(e.target.value)}
                              className="flex-1"
                            />
                            <div className="relative">
                              <Button
                                variant="outline"
                                className="w-12"
                                style={{ backgroundColor: newTagColor }}
                                onClick={() => setShowColorPicker(!showColorPicker)}
                              >
                                <Palette className="h-4 w-4 text-white" />
                              </Button>
                              {showColorPicker && (
                                <div className="absolute right-0 top-full mt-2 p-3 rounded-lg border bg-popover shadow-lg z-50">
                                  <div className="grid grid-cols-5 gap-2">
                                    {predefinedTagColors.map(color => (
                                      <button
                                        key={color}
                                        className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                                        style={{ 
                                          backgroundColor: color,
                                          borderColor: newTagColor === color ? 'white' : 'transparent'
                                        }}
                                        onClick={() => {
                                          setNewTagColor(color)
                                          setShowColorPicker(false)
                                        }}
                                      />
                                    ))}
                                  </div>
                                  <div className="mt-2 flex items-center gap-2">
                                    <Label className="text-xs">Custom:</Label>
                                    <input
                                      type="color"
                                      value={newTagColor}
                                      onChange={(e) => setNewTagColor(e.target.value)}
                                      className="w-8 h-8 rounded cursor-pointer"
                                    />
                                    <span className="text-xs text-muted-foreground">{newTagColor}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <Button onClick={handleCreateTag} disabled={!newTagName.trim()}>
                              Crea
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Annulla
                      </Button>
                      <Button onClick={handleSubmit} disabled={!formData.name.trim() || isLoading}>
                        {isLoading ? 'Salvataggio...' : editingLocation ? 'Salva Modifiche' : 'Crea Luogo'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Location Cards Grid */}
            {filteredLocations.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    {searchQuery 
                      ? 'Nessun luogo trovato per la ricerca'
                      : 'Nessun luogo ancora creato. Clicca "Nuovo Luogo" per iniziare.'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredLocations.map(location => {
                  const typeInfo = getLocationTypeInfo(location.type)
                  const TypeIcon = typeInfo.icon
                  
                  return (
                    <Card key={location.id} className="group hover:shadow-md transition-shadow">
                      {location.imageUrl && (
                        <div className="aspect-video relative overflow-hidden rounded-t-lg">
                          <img 
                            src={location.imageUrl} 
                            alt={location.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                              <TypeIcon className="h-4 w-4 text-cyan-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{location.name}</CardTitle>
                              {location.type && (
                                <CardDescription>{typeInfo.label}</CardDescription>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(location)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(location.id, location.name)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {location.parentName && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <ChevronRight className="h-3 w-3" />
                            <span>{location.parentName}</span>
                          </div>
                        )}
                        
                        {location.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {location.description}
                          </p>
                        )}
                        
                        {/* Linked NPCs */}
                        {location.linkedNPCs && location.linkedNPCs.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {location.linkedNPCs.slice(0, 3).map(npc => (
                              <Badge key={npc.id} variant="secondary" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                {npc.name}
                              </Badge>
                            ))}
                            {location.linkedNPCs.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{location.linkedNPCs.length - 3} altri
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {/* Linked Factions */}
                        {location.linkedFactions && location.linkedFactions.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {location.linkedFactions.map(faction => (
                              <Badge key={faction.id} variant="outline" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                {faction.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {/* Tags */}
                        {location.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {location.tags.map(tag => (
                              <Badge
                                key={tag.id}
                                variant="outline"
                                style={{ 
                                  borderColor: tag.color,
                                  color: tag.color
                                }}
                                className="text-xs"
                              >
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <Badge variant={location.isVisited ? 'default' : 'secondary'}>
                            {location.isVisited ? 'Visitato' : 'Non visitato'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Placeholder for other sections */}
        {!(activeSection === 'mondo' && activeSubSection === 'luoghi') && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">
                Sezione in costruzione...
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>DM Tool for D&D 5e</span>
            <span>{locations.length} luoghi</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
