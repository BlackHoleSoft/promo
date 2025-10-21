function getLatLng(lat, lng, angle, randomRadiusRad) {
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

export function getRandomGeoPoints(lat, lng, minRadiusKm, maxRadiusKm, count, maxOffsetInRad) {
  const earthRadiusKm = 6371;

  // Преобразуем радиусы в радианы
  const minRadiusRad = minRadiusKm / earthRadiusKm;
  const maxRadiusRad = maxRadiusKm / earthRadiusKm;            

  // Случайный угол
  const baseAngle = Math.random() * 2 * Math.PI;
  const angles = new Array(count).fill(null).map(() => baseAngle + Math.random() * maxOffsetInRad);

  return angles.map(angle => {
    // Случайный радиус в пределах кольца
    const randomRadiusRad = Math.sqrt(Math.random() * (maxRadiusRad ** 2 - minRadiusRad ** 2) + minRadiusRad ** 2);
    return getLatLng(lat, lng, angle, randomRadiusRad)
  });
}

export async function getOsmAttractions(lat, lng, radius) {
  const api = 'https://maps.mail.ru/osm/tools/overpass/api/interpreter';
  // const api = 'https://overpass-api.de/api/interpreter';
  const result = await fetch(api, {
    method: 'POST',
    body: `data=
[out:json][timeout:25];
(
  node["building"="ruins"](around:${radius},${lat},${lng});
  node["tourism"="information"](around:${radius},${lat},${lng});
  node["tourism"="attraction"](around:${radius},${lat},${lng});
  node["tourism"="viewpoint"](around:${radius},${lat},${lng});
  node["tourism"="museum"](around:${radius},${lat},${lng});
  node["tourism"="gallery"](around:${radius},${lat},${lng});
  node["amenity"="place_of_worship"](around:${radius},${lat},${lng});
  node["amenity"="theatre"](around:${radius},${lat},${lng});
  node["amenity"="cinema"](around:${radius},${lat},${lng});
  node["amenity"="fountain"](around:${radius},${lat},${lng});
  node["amenity"="monument"](around:${radius},${lat},${lng});
  node["leisure"~"park"](around:${radius},${lat},${lng});  
  node["natural"~"water"](around:${radius},${lat},${lng});
  node["natural"~"peak"](around:${radius},${lat},${lng});
  node["historic"](around:${radius},${lat},${lng});
);
out body 200;
    `,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  });

  const data = await result.json();
  return data.elements.map(el => ({ lat: el.lat, lng: el.lon, name: el.tags?.name }));
}

export async function getRandomOsmPoints(lat, lng, count, minRange, maxRange) {
  const basePoint = getRandomGeoPoints(lat, lng, minRange, maxRange, 1, 0)[0];

  const attractions = await getOsmAttractions(basePoint.lat, basePoint.lng, Math.max(20, (maxRange / 4)) * 1000);
  console.log('attractions', attractions);

  // Перемешиваем массив
  for (let i = attractions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [attractions[i], attractions[j]] = [attractions[j], attractions[i]];
  }

  return attractions.slice(0, count);
}