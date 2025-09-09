import { useState, useMemo } from 'react';
import { Experience } from '@/types';
import { Destination, Theme } from '@/data/partners';

interface UseDestinationFilteringProps {
  experiences: Experience[];
}

// Convert Experience theme to Theme for filtering
const convertThemeToPartnerTheme = (theme: string): Theme => {
  switch (theme) {
    case 'Wildlife Conservation': return 'Wildlife conservation';
    case 'Conservation Education': return 'Conservation education';
    case 'Cultural Exploration': return 'Community & cultural exploration';
    default: return 'Wildlife conservation';
  }
};

// Convert location text to destination
const getDestinationFromLocation = (locationText: string): Destination => {
  if (locationText.includes('Nairobi')) return 'nairobi';
  if (locationText.includes('Coast') || locationText.includes('Coastal')) return 'coastal-kenya';
  if (locationText.includes('Samburu')) return 'samburu';
  if (locationText.includes('Maasai Mara') || locationText.includes('Mara')) return 'masai-mara';
  if (locationText.includes('Laikipia')) return 'laikipia';
  return 'nairobi'; // default
};

export const useDestinationFiltering = ({ experiences }: UseDestinationFilteringProps) => {
  const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<Theme[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter experiences based on selected criteria
  const filteredExperiences = useMemo(() => {
    let filtered = experiences;

    // Filter by destinations
    if (selectedDestinations.length > 0) {
      filtered = filtered.filter(exp => {
        const expDestination = getDestinationFromLocation(exp.location_text);
        return selectedDestinations.includes(expDestination);
      });
    }

    // Filter by themes within selected destinations
    if (selectedThemes.length > 0) {
      filtered = filtered.filter(exp => {
        const expTheme = convertThemeToPartnerTheme(exp.theme);
        return selectedThemes.includes(expTheme);
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(exp =>
        exp.title.toLowerCase().includes(term) ||
        exp.description.toLowerCase().includes(term) ||
        exp.search_text.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [experiences, selectedDestinations, selectedThemes, searchTerm]);

  // Get available themes for selected destinations
  const availableThemes = useMemo(() => {
    let relevantExperiences = experiences;
    
    if (selectedDestinations.length > 0) {
      relevantExperiences = experiences.filter(exp => {
        const expDestination = getDestinationFromLocation(exp.location_text);
        return selectedDestinations.includes(expDestination);
      });
    }

    const themes = new Set<Theme>();
    relevantExperiences.forEach(exp => {
      const expTheme = convertThemeToPartnerTheme(exp.theme);
      themes.add(expTheme);
    });
    
    return Array.from(themes);
  }, [experiences, selectedDestinations]);

  // Statistics
  const stats = useMemo(() => {
    return {
      totalExperiences: experiences.length,
      filteredExperiences: filteredExperiences.length,
      selectedDestinationsCount: selectedDestinations.length,
      selectedThemesCount: selectedThemes.length,
      hasActiveFilters: selectedDestinations.length > 0 || selectedThemes.length > 0 || searchTerm.trim().length > 0
    };
  }, [experiences, filteredExperiences, selectedDestinations, selectedThemes, searchTerm]);

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedDestinations([]);
    setSelectedThemes([]);
    setSearchTerm('');
  };

  return {
    // State
    selectedDestinations,
    selectedThemes, 
    searchTerm,
    
    // Setters
    setSelectedDestinations,
    setSelectedThemes,
    setSearchTerm,
    
    // Computed
    filteredExperiences,
    availableThemes,
    stats,
    
    // Actions
    clearAllFilters
  };
};