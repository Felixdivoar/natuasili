// Plus Code to coordinates mapping for accurate location display
export const plusCodeToCoordinates: Record<string, [number, number]> = {
  // Nairobi locations
  "PRG7+CQ": [-1.2917, 36.8137], // Nairobi general area
  "JPFV+FP": [-1.2732, 36.7438], // Giraffe Centre, Nairobi
  "QR38+3V": [-1.2936, 36.8166], // Karura Forest, Nairobi
  "JV96+2C": [-1.2819, 36.8118], // Nairobi National Park
  "PM2P+HR": [-1.2133, 36.7368], // Adventure Farm Karen, Nairobi
  
  // Coast locations
  "PH6P+RRR": [-4.2331, 39.5792], // Diani Beach (REEFolution)
  "MH47+6WQ": [-4.3229, 39.5698], // Diani (Colobus Conservation)
  "JXFP+M4": [-3.3628, 40.0085], // Watamu (Local Ocean Conservation)
  
  // Laikipia/Central Kenya
  "2VC5+X9": [-0.0755, 36.9070], // Ol Pejeta Conservancy, Nanyuki
  
  // Samburu/Northern Kenya
  "95W5+QGR": [1.4472, 37.0942], // Sera Conservancy, Dol Dol
  "4F76+V3": [2.4647, 37.2103], // Reteti Elephant Sanctuary, Sereolipi
  
  // Baringo
  "J4RF+P9M": [0.6917, 36.0232], // Ruko Giraffe Sanctuary, Nosuguro
  
  // Maasai Mara
  "6GCQR5P4+24": [-1.2917, 35.1437], // Mara Elephant Project area
};

// Function to extract Plus Code from experience description
export const extractPlusCodeFromDescription = (description: string): string | null => {
  // Look for Plus Code pattern in "Where you'll be" section
  const plusCodeRegex = /Where you'll be\s+([A-Z0-9+]+)/i;
  const match = description.match(plusCodeRegex);
  
  if (match && match[1]) {
    // Clean up the Plus Code (remove any trailing text like "Nairobi")
    const plusCode = match[1].split(' ')[0];
    return plusCode;
  }
  
  return null;
};

// Function to get coordinates from Plus Code
export const getCoordinatesFromPlusCode = (plusCode: string): [number, number] | null => {
  return plusCodeToCoordinates[plusCode] || null;
};

// Function to get coordinates from experience description
export const getExperienceCoordinates = (description: string): [number, number] => {
  const plusCode = extractPlusCodeFromDescription(description);
  
  if (plusCode) {
    const coordinates = getCoordinatesFromPlusCode(plusCode);
    if (coordinates) {
      return coordinates;
    }
  }
  
  // Default to Nairobi coordinates if no Plus Code found or not in mapping
  return [-1.2921, 36.7378];
};