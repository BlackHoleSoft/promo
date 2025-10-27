<template>
  <div class="block">
    <h1>Генератор координат</h1>
    <p>Задайте настройки и получите список случайных координат в указанном радиусе</p>
  </div>
  
  <SettingsForm 
    @generate="handleGenerate" 
    :loading="loading"
    :status="status"
  />
  
  <div class="block">
    <h3>Результат</h3>
    
    <ResultsList :points="generatedPoints" />
    
    <MapComponent 
      :center="center" 
      :points="generatedPoints" 
      ref="mapRef"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import SettingsForm from './components/SettingsForm.vue'
import ResultsList from './components/ResultsList.vue'
import MapComponent from './components/MapComponent.vue'
import { getRandomGeoPoints, getRandomOsmPoints } from './utils/coordinates.ts'
import { parseDotsFromUrl, updateUrlWithDots } from './utils/urlUtils.js'

export default {
  name: 'App',
  components: {
    SettingsForm,
    ResultsList,
    MapComponent
  },
  setup() {
    const loading = ref(false)
    const status = ref('')
    const generatedPoints = ref([])
    const center = reactive({ lat: 56.326813, lng: 44.006200 })
    const mapRef = ref(null)

    // При инициализации проверяем URL на наличие точек
    onMounted(() => {
      const dotsFromUrl = parseDotsFromUrl();
      if (dotsFromUrl.length > 0) {
        generatedPoints.value = dotsFromUrl;
        status.value = `Загружено ${dotsFromUrl.length} точек из URL`;
      }
    });

    const handleGenerate = async (settings) => {
      loading.value = true
      status.value = ''
      center.lat = settings.centerLat
      center.lng = settings.centerLng
      
      try {
        let points
        if (settings.attractionsEnabled) {
          points = await getRandomOsmPoints(
            settings.centerLat, 
            settings.centerLng, 
            settings.pointsCount, 
            settings.minRadiusKm, 
            settings.maxRadiusKm,
            settings.directions,
            settings.osmTypes
          )
        } else {
          points = getRandomGeoPoints(
            settings.centerLat, 
            settings.centerLng, 
            settings.minRadiusKm, 
            settings.maxRadiusKm, 
            settings.pointsCount, 
            settings.pointsOffsetAngle,
            settings.directions
          )
        }
        
        generatedPoints.value = points
        status.value = 'Готово'
        console.log('Generated points:', points)
        
        // Сохраняем точки в URL
        updateUrlWithDots(points);
      } catch (error) {
        console.error('Error generating points:', error)
        generatedPoints.value = []
        status.value = 'Возникла ошибка'
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      status,
      generatedPoints,
      center,
      mapRef,
      handleGenerate
    }
  }
}
</script>
