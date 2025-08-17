import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";
import { mockProjects } from "@/data/mockData";

export interface MoreFiltersState {
  theme: string;
  destination: string;
  duration: string;
  activityType: string;
  partner: string;
  availability: string;
  accessibility: string[];
  ageSuitability: string;
  impactType: string[];
}

interface MoreFiltersDialogProps {
  filters: MoreFiltersState;
  onFiltersChange: (filters: MoreFiltersState) => void;
}

const MoreFiltersDialog = ({ filters, onFiltersChange }: MoreFiltersDialogProps) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters: MoreFiltersState = {
      theme: "all",
      destination: "all", 
      duration: "all",
      activityType: "all",
      partner: "all",
      availability: "all",
      accessibility: [],
      ageSuitability: "all",
      impactType: []
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const updateFilter = (key: keyof MoreFiltersState, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'accessibility' | 'impactType', value: string) => {
    setLocalFilters(prev => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          More filters
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter experiences</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Theme */}
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={localFilters.theme} onValueChange={(value) => updateFilter('theme', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All themes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All themes</SelectItem>
                <SelectItem value="Wildlife Conservation">Wildlife conservation</SelectItem>
                <SelectItem value="Cultural Exploration">Cultural exploration</SelectItem>
                <SelectItem value="Conservation Education">Conservation education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label>Destination</Label>
            <Select value={localFilters.destination} onValueChange={(value) => updateFilter('destination', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All destinations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All destinations</SelectItem>
                <SelectItem value="nairobi">Nairobi</SelectItem>
                <SelectItem value="coast">Coast</SelectItem>
                <SelectItem value="laikipia">Laikipia</SelectItem>
                <SelectItem value="masai-mara">Masai Mara</SelectItem>
                <SelectItem value="samburu">Samburu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label>Duration</Label>
            <Select value={localFilters.duration} onValueChange={(value) => updateFilter('duration', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any duration</SelectItem>
                <SelectItem value="≤2h">≤2h</SelectItem>
                <SelectItem value="half-day">Half-day (3-5h)</SelectItem>
                <SelectItem value="full-day">Full-day (6-8h)</SelectItem>
                <SelectItem value="multi-day">Multi-day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activity Type */}
          <div className="space-y-2">
            <Label>Activity type</Label>
            <Select value={localFilters.activityType} onValueChange={(value) => updateFilter('activityType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All activities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All activities</SelectItem>
                <SelectItem value="tracking">Wildlife tracking</SelectItem>
                <SelectItem value="cleanup">Beach cleanup</SelectItem>
                <SelectItem value="cultural">Cultural visit</SelectItem>
                <SelectItem value="research">Research participation</SelectItem>
                <SelectItem value="education">Educational program</SelectItem>
                <SelectItem value="conservation">Conservation work</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Partner */}
          <div className="space-y-2">
            <Label>Conservation partner</Label>
            <Select value={localFilters.partner} onValueChange={(value) => updateFilter('partner', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All partners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All partners</SelectItem>
                {mockProjects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <Label>Availability</Label>
            <Select value={localFilters.availability} onValueChange={(value) => updateFilter('availability', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This week</SelectItem>
                <SelectItem value="this-month">This month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age Suitability */}
          <div className="space-y-2">
            <Label>Age suitability</Label>
            <Select value={localFilters.ageSuitability} onValueChange={(value) => updateFilter('ageSuitability', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All ages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ages</SelectItem>
                <SelectItem value="family">Family-friendly</SelectItem>
                <SelectItem value="adult">Adults only</SelectItem>
                <SelectItem value="teen">Teens (13+)</SelectItem>
                <SelectItem value="child">Children welcome</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Accessibility */}
          <div className="space-y-3">
            <Label>Accessibility</Label>
            <div className="space-y-2">
              {[
                { id: 'wheelchair', label: 'Wheelchair accessible' },
                { id: 'low-mobility', label: 'Low mobility friendly' },
                { id: 'visual-impaired', label: 'Visual impairment friendly' },
                { id: 'hearing-impaired', label: 'Hearing impairment friendly' }
              ].map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option.id}
                    checked={localFilters.accessibility.includes(option.id)}
                    onCheckedChange={() => toggleArrayFilter('accessibility', option.id)}
                  />
                  <Label htmlFor={option.id} className="text-sm font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Type */}
          <div className="space-y-3">
            <Label>Impact type</Label>
            <div className="space-y-2">
              {[
                { id: 'education', label: 'Education' },
                { id: 'research', label: 'Research' },
                { id: 'anti-poaching', label: 'Anti-poaching' },
                { id: 'marine', label: 'Marine conservation' },
                { id: 'habitat', label: 'Habitat restoration' },
                { id: 'community', label: 'Community development' }
              ].map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option.id}
                    checked={localFilters.impactType.includes(option.id)}
                    onCheckedChange={() => toggleArrayFilter('impactType', option.id)}
                  />
                  <Label htmlFor={option.id} className="text-sm font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset all
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoreFiltersDialog;