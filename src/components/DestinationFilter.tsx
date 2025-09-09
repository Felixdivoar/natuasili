import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Users, Calendar } from "lucide-react";
import { Destination } from "@/data/partners";
import { getAllDestinations, formatDestinationName, getDestinationPath } from "@/utils/destinationUtils";
import { Link } from "react-router-dom";

interface DestinationFilterProps {
  selectedDestinations: Destination[];
  onDestinationChange: (destinations: Destination[]) => void;
  showCounts?: boolean;
}

export default function DestinationFilter({ 
  selectedDestinations, 
  onDestinationChange,
  showCounts = true 
}: DestinationFilterProps) {
  const destinations = getAllDestinations();

  const toggleDestination = (destinationId: Destination) => {
    if (selectedDestinations.includes(destinationId)) {
      onDestinationChange(selectedDestinations.filter(d => d !== destinationId));
    } else {
      onDestinationChange([...selectedDestinations, destinationId]);
    }
  };

  const clearAll = () => {
    onDestinationChange([]);
  };

  const selectAll = () => {
    onDestinationChange(destinations.map(d => d.id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Destinations
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear All
            </Button>
            <Button variant="ghost" size="sm" onClick={selectAll}>
              Select All
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {destinations.map((destination) => {
            const isSelected = selectedDestinations.includes(destination.id);
            
            return (
              <div
                key={destination.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => toggleDestination(destination.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{destination.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {destination.themes.length} themes
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {destination.description}
                    </p>
                    
                    {showCounts && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{destination.experienceCount} experiences</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{destination.partnerCount} partners</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className={`w-4 h-4 rounded border-2 transition-colors ${
                      isSelected 
                        ? 'bg-primary border-primary' 
                        : 'border-muted-foreground'
                    }`}>
                      {isSelected && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-sm" />
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      to={`/destinations/${getDestinationPath(destination.id)}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="sm" className="text-xs">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedDestinations.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">Selected Destinations:</p>
              <div className="flex flex-wrap gap-2">
                {selectedDestinations.map((destId) => {
                  const dest = destinations.find(d => d.id === destId);
                  if (!dest) return null;
                  
                  return (
                    <Badge 
                      key={destId}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => toggleDestination(destId)}
                    >
                      {dest.name} ×
                    </Badge>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}