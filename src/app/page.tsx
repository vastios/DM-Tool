'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Users, Shield, Castle, Sword, Compass, BookOpen, Plus, Edit, Trash2, Search, Tag, ChevronRight, X, Check, Map, Building, Trees, Mountain, Landmark, Home } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

// Types
interface Tag {
  id: string
  name: string
  color: string
  description?: string
}

interface Location {
  id: string
  name: string
  description?: string
  type?: string
  parentName?: string
  imageUrl?: string
  notes?: string
  isVisited: boolean
  tags: Tag[]
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

// Location types
const locationTypes = [
  { value: 'citta', label: 'Città', icon: Building },
  { value: 'villaggio', label: 'Villaggio', icon: Home },
  { value: 'dungeon', label: 'Dungeon', icon: Landmark },
  { value: 'foresta', label: 'Foresta', icon: Trees },
  { value: 'montagna', label: 'Montagna', icon: Mountain },
  { value: 'altro', label: 'Altro', icon: MapPin },
]

export default function DMTool() {
  const [activeSection, setActiveSection] = useState('mondo')
  const [activeSubSection, setActiveSubSection] = useState('luoghi')
  const [locations, setLocations] = useState<Location[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    parentName: '',
    notes: '',
    isVisited: false,
  })

  // Fetch locations
  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/locations')
      const data = await res.json()
      setLocations(data.locations || [])
      setTags(data.tags || [])
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }

  // Initial data fetch
  const [initialized, setInitialized] = useState(false)
  
  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
      fetchLocations()
    }
  }, [initialized])

  // Filter locations by search
  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle form submit
  const handleSubmit = async () => {
    if (!formData.name.trim()) return

    try {
      if (editingLocation) {
        // Update existing
        await fetch(`/api/locations/${editingLocation.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, tagIds: selectedTags }),
        })
      } else {
        // Create new
        await fetch('/api/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, tagIds: selectedTags }),
        })
      }
      
      setIsDialogOpen(false)
      resetForm()
      fetchLocations()
    } catch (error) {
      console.error('Error saving location:', error)
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo luogo?')) return
    
    try {
      await fetch(`/api/locations/${id}`, { method: 'DELETE' })
      fetchLocations()
    } catch (error) {
      console.error('Error deleting location:', error)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: '',
      parentName: '',
      notes: '',
      isVisited: false,
    })
    setSelectedTags([])
    setEditingLocation(null)
  }

  // Open edit dialog
  const openEditDialog = (location: Location) => {
    setFormData({
      name: location.name,
      description: location.description || '',
      type: location.type || '',
      parentName: location.parentName || '',
      notes: location.notes || '',
      isVisited: location.isVisited,
    })
    setSelectedTags(location.tags.map(t => t.id))
    setEditingLocation(location)
    setIsDialogOpen(true)
  }

  // Create new tag
  const handleCreateTag = async (tagName: string, color: string) => {
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tagName, color }),
      })
      const data = await res.json()
      setTags(prev => [...prev, data.tag])
      setSelectedTags(prev => [...prev, data.tag.id])
    } catch (error) {
      console.error('Error creating tag:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
              // Apply label style for tag-related subsections
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
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingLocation ? 'Modifica Luogo' : 'Nuovo Luogo'}
                      </DialogTitle>
                      <DialogDescription>
                        Inserisci i dettagli del luogo
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Nome del luogo"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="type">Tipo</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {locationTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="h-4 w-4" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="parentName">Luogo Padre</Label>
                        <Input
                          id="parentName"
                          value={formData.parentName}
                          onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                          placeholder="Es: Regione o area più ampia"
                        />
                      </div>

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

                      <div className="grid gap-2">
                        <Label htmlFor="notes">Note Segrete (DM)</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Note visibili solo al DM..."
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          id="isVisited"
                          checked={formData.isVisited}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVisited: checked }))}
                        />
                        <Label htmlFor="isVisited">Già visitato dal party</Label>
                      </div>

                      {/* Tags */}
                      <div className="grid gap-2">
                        <Label>Tag</Label>
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
                        <div className="flex gap-2 mt-2">
                          <Input
                            id="newTag"
                            placeholder="Nuovo tag..."
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const input = e.target as HTMLInputElement
                                if (input.value.trim()) {
                                  handleCreateTag(input.value.trim(), '#0891b2')
                                  input.value = ''
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Annulla
                      </Button>
                      <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
                        {editingLocation ? 'Salva Modifiche' : 'Crea Luogo'}
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
                {filteredLocations.map(location => (
                  <Card key={location.id} className="group hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                            <MapPin className="h-4 w-4 text-cyan-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{location.name}</CardTitle>
                            {location.type && (
                              <CardDescription className="capitalize">{location.type}</CardDescription>
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
                            onClick={() => handleDelete(location.id)}
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
                ))}
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
