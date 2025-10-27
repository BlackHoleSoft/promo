/**
 * Парсит параметры dot из URL
 * @returns {Array} Массив точек с координатами
 */
export function parseDotsFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const dots = urlParams.getAll('dot');
  
  return dots.map(dot => {
    const [lat, lng] = dot.split(';').map(Number);
    return { lat, lng, name: '' };
  }).filter(dot => !isNaN(dot.lat) && !isNaN(dot.lng));
}

/**
 * Обновляет URL с параметрами точек
 * @param {Array} points Массив точек
 */
export function updateUrlWithDots(points) {
  // Ограничиваем количество точек до 8
  const limitedPoints = points.slice(0, 8);
  
  // Создаем новый объект URLSearchParams
  const urlParams = new URLSearchParams(window.location.search);
  
  // Удаляем все существующие параметры dot
  urlParams.delete('dot');
  
  // Добавляем точки в параметры (округляем до 4 знаков после запятой)
  limitedPoints.forEach(point => {
    const lat = Number(point.lat).toFixed(4);
    const lng = Number(point.lng).toFixed(4);
    urlParams.append('dot', `${lat};${lng}`);
  });
  
  // Обновляем URL без перезагрузки страницы
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState({}, '', newUrl);
}
