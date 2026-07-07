export interface Location {
  latitude: number;
  longitude: number;
}

export interface Pollutants {
  PM25?: number;
  PM10?: number;
  NO2?: number;
  SO2?: number;
  CO?: number;
  O3?: number;
}

export interface AirQuality {
  aqi: number;
  pollutants: Pollutants;
  station: string;
  timestamp: string;
}

export interface Place {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string;
  distance?: number;
}

export interface EnvironmentalFeature {
  id: string;
  name: string;
  type: string;
  geometry?: any;
  latitude: number;
  longitude: number;
}

export interface PlacesGroup {
  schools: Place[];
  hospitals: Place[];
  petrolPumps: Place[];
  railwayStations: Place[];
  parks: Place[];
}

export interface EnvironmentGroup {
  forests: EnvironmentalFeature[];
  rivers: EnvironmentalFeature[];
  lakes: EnvironmentalFeature[];
  industries: EnvironmentalFeature[];
  factories: EnvironmentalFeature[];
  landfills: EnvironmentalFeature[];
  recyclingCenters: EnvironmentalFeature[];
  powerPlants: EnvironmentalFeature[];
  constructionSites: EnvironmentalFeature[];
}

export interface Summary {
  totalSchools: number;
  totalHospitals: number;
  totalIndustries: number;
  totalForests: number;
  totalLandfills: number;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
}

export interface UnifiedResponse {
  location: Location;
  airQuality: AirQuality;
  places: PlacesGroup;
  environment: EnvironmentGroup;
  summary: Summary;
}
