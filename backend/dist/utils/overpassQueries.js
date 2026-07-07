/**
 * Utilities for Overpass queries
 */
export const buildOverpassQuery = (lat, lng, radius) => {
    return `
    [out:json][timeout:25];
    (
      // Schools
      nwr["amenity"="school"](around:${radius},${lat},${lng});
      nwr["amenity"="university"](around:${radius},${lat},${lng});
      nwr["amenity"="college"](around:${radius},${lat},${lng});
      
      // Hospitals
      nwr["amenity"="hospital"](around:${radius},${lat},${lng});
      nwr["amenity"="clinic"](around:${radius},${lat},${lng});
      
      // Industrial
      nwr["landuse"="industrial"](around:${radius},${lat},${lng});
      nwr["man_made"="works"](around:${radius},${lat},${lng});
      nwr["industrial"](around:${radius},${lat},${lng});
      
      // Forests / Greens
      nwr["landuse"="forest"](around:${radius},${lat},${lng});
      nwr["natural"="wood"](around:${radius},${lat},${lng});
      nwr["leisure"="park"](around:${radius},${lat},${lng});
      
      // Water
      nwr["waterway"="river"](around:${radius},${lat},${lng});
      nwr["natural"="water"](around:${radius},${lat},${lng});
      
      // Waste / Facilities
      nwr["landuse"="landfill"](around:${radius},${lat},${lng});
      nwr["amenity"="recycling"](around:${radius},${lat},${lng});
      nwr["man_made"="wastewater_plant"](around:${radius},${lat},${lng});
      nwr["man_made"="sewage"](around:${radius},${lat},${lng});
      
      // Energy / Construction
      nwr["power"="plant"](around:${radius},${lat},${lng});
      nwr["landuse"="construction"](around:${radius},${lat},${lng});
    );
    out center;
  `;
};
