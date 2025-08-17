import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";
import { mockProjects } from "@/data/mockData";

export interface MoreFiltersState {
  duration: string;
  activityImpact: string;
  availability: string;
  ageSuitability: string;
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
      duration: "all",
      activityImpact: "all",
      availability: "all",
      ageSuitability: "all"
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const updateFilter = (key: keyof MoreFiltersState, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
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

          {/* Activity/Impact Type */}
          <div className="space-y-2">
            <Label>Activity/Impact type</Label>
            <Select value={localFilters.activityImpact} onValueChange={(value) => updateFilter('activityImpact', value)}>
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
                <SelectItem value="anti-poaching">Anti-poaching</SelectItem>
                <SelectItem value="marine">Marine conservation</SelectItem>
                <SelectItem value="habitat">Habitat restoration</SelectItem>
                <SelectItem value="community">Community development</SelectItem>
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