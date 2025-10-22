export interface GeoPoint {
  lat: number;
  lng: number;
  name?: string;
}

export interface Directions {
  north: boolean;
  east: boolean;
  south: boolean;
  west: boolean;
}

export interface OsmTypes {
  ruins: boolean;
  information: boolean;
  attraction: boolean;
  viewpoint: boolean;
  museum: boolean;
  gallery: boolean;
  placeOfWorship: boolean;
  theatre: boolean;
  cinema: boolean;
  fountain: boolean;
  monument: boolean;
  park: boolean;
  water: boolean;
  peak: boolean;
  historic: boolean;
}

interface AngleRange {
  min: number;
  max: number;
}

interface OsmElement {
  lat: number;
  lon: number;
  tags?: {
    name?: string;
  };
}

interface OsmResponse {
  elements: OsmElement[];
}

function getLatLng(lat: number, lng: number, angle: number, randomRadiusRad: number): GeoPoint {
  // Вычисляем координаты
  const newLat = Math.asin(
    Math.sin(lat * Math.PI / 180) * Math.cos(randomRadiusRad) +
    Math.cos(lat * Math.PI / 180) * Math.sin(randomRadiusRad) * Math.cos(angle)
  ) * 180 / Math.PI;

  const newLng = lng + Math.atan2(
    Math.sin(angle) * Math.sin(randomRadiusRad) * Math.cos(lat * Math.PI / 180),
    Math.cos(randomRadiusRad) - Math.sin(lat * Math.PI / 180) * Math.sin(newLat * Math.PI / 180)
  ) * 180 / Math.PI;

  return { lat: newLat, lng: newLng };
}

function getAngleRange(directions: Directions): AngleRange[] {
  // Определяем допустимые диапазоны углов на основе выбранных направлений
  // Север: -45° до 45° (315° до 45°)
  // Восток: 45° до 135°
  // Юг: 135° до 225°
  // Запад: 225° до 315°
  const ranges: AngleRange[] = [];
  
  if (directions.north) {
    ranges.push({ min: -Math.PI / 4, max: Math.PI / 4 }); // -45° to 45°
  }
  if (directions.east) {
    ranges.push({ min: Math.PI / 4, max: 3 * Math.PI / 4 }); // 45° to 135°
  }
  if (directions.south) {
    ranges.push({ min: 3 * Math.PI / 4, max: 5 * Math.PI / 4 }); // 135° to 225°
  }
  if (directions.west) {
    ranges.push({ min: 5 * Math.PI / 4, max: 7 * Math.PI / 4 }); // 225° to 315°
  }
  
  return ranges;
}

function getRandomAngleInRanges(ranges: AngleRange[]): number {
  if (ranges.length === 0) return Math.random() * 2 * Math.PI;
  
  // Выбираем случайный диапазон
  const range = ranges[Math.floor(Math.random() * ranges.length)];
  
  // Генерируем случайный угол в выбранном диапазоне
  return range.min + Math.random() * (range.max - range.min);
}

export function getRandomGeoPoints(
  lat: number,
  lng: number,
  minRadiusKm: number,
  maxRadiusKm: number,
  count: number,
  maxOffsetInRad: number,
  directions: Directions | null = null
): GeoPoint[] {
  const earthRadiusKm = 6371;

  // Преобразуем радиусы в радианы
  const minRadiusRad = minRadiusKm / earthRadiusKm;
  const maxRadiusRad = maxRadiusKm / earthRadiusKm;            

  // Определяем допустимые диапазоны углов
  const angleRanges = directions ? getAngleRange(directions) : null;

  // Случайный угол
  const baseAngle = angleRanges ? getRandomAngleInRanges(angleRanges) : Math.random() * 2 * Math.PI;
  const angles = new Array(count).fill(null).map(() => {    
    return baseAngle + Math.random() * maxOffsetInRad - maxOffsetInRad / 2;
  });

  return angles.map(angle => {
    // Случайный радиус в пределах кольца
    const randomRadiusRad = Math.sqrt(Math.random() * (maxRadiusRad ** 2 - minRadiusRad ** 2) + minRadiusRad ** 2);
    return getLatLng(lat, lng, angle, randomRadiusRad)
  });
}

export async function getOsmAttractions(
  lat: number, 
  lng: number, 
  radius: number, 
  osmTypes: OsmTypes
): Promise<GeoPoint[]> {
  const queries: string[] = [];

  if (osmTypes.ruins) {
    queries.push(`  node["building"="ruins"](around:${radius},${lat},${lng});`);
  }
  if (osmTypes.information) {
    queries.push(`  node["tourism"="information"](around:${radius},${lat},${lng});`);
  }
  if (osmTypes.attraction) {
    queries.push(`  node["tourism"="attraction"](around:${radius},${lat},${lng});`);
  }
  if (osmTypes.viewpoint) {
    queries.push(`  node["tourism"="viewpoint"](around:${radius},${lat},${lng});`);
  }
  if (osmTypes.museum) {
    queries.push(`  node["tourism"="museum"](around:${radius},${lat},${lng});`);
  }
  if (osmTypes.gallery) {
    queries.push(`  node["tourism"="gallery"](around:${radius},${lat},${lng});`);
  }
  if (osmTypes.placeOfWorship) {
    queries.push(`  node["amenity"="place_of_worship"](around:${radius},${lat},${lng});`);
  }
  if (osmTypes.theatre) {
    queries.push(`  node["amenity"="theatre"](around:${radius},${lat},${lng});`);
  }
  if (osmTypes.cinema) {
    queries.push(`  node["amenity"="cinema"](around:${radius},${lat},${lng});`);
  }
  if (osmTypes.fountain) {
    queries.push(`  node["amenity"="fountain"](around:${radius},${lat},${lng});`);
  }
  if (osmTypes.monument) {
    queries.push(`  node["amenity"="monument"](around:${radius},${lat},${lng});`);
  }
  if (osmTypes.park) {
    queries.push(`  node["leisure"~"park"](around:${radius},${lat},${lng});`);
  }
  if (osmTypes.water) {
    queries.push(`  node["natural"~"water"](around:${radius},${lat},${lng});`);
  }
  if (osmTypes.peak) {
    queries.push(`  node["natural"~"peak"](around:${radius},${lat},${lng});`);
  }
  if (osmTypes.historic) {
    queries.push(`  node["historic"](around:${radius},${lat},${lng});`);
  }

  if (queries.length === 0) {
    return [];
  }

  const api = 'https://maps.mail.ru/osm/tools/overpass/api/interpreter';
  // const api = 'https://overpass-api.de/api/interpreter';
  const result = await fetch(api, {
    method: 'POST',
    body: `data=
[out:json][timeout:25];
(
${queries.join('\n')}
);
out body 200;
    `,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  });

  const data = await result.json() as OsmResponse;
  return data.elements.map((el: OsmElement): GeoPoint => ({ lat: el.lat, lng: el.lon, name: el.tags?.name }));
}

export async function getRandomOsmPoints(
  lat: number,
  lng: number,
  count: number,
  minRange: number,
  maxRange: number,
  directions: Directions | null = null,
  osmTypes: OsmTypes
): Promise<GeoPoint[]> {
  const basePoint = getRandomGeoPoints(lat, lng, minRange, maxRange, 1, 0, directions)[0];

  const attractions = await getOsmAttractions(basePoint.lat, basePoint.lng, Math.max(20, (maxRange / 4)) * 1000, osmTypes);
  console.log('attractions', attractions);

  // Перемешиваем массив
  for (let i = attractions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [attractions[i], attractions[j]] = [attractions[j], attractions[i]];
  }

  return attractions.slice(0, count);
}
