<template>
  <div class="block">
    <h1>Генератор координат</h1>
    <p>Задайте настройки и получите список случайных координат в указанном радиусе</p>
  </div>
  
  <SettingsForm 
    @generate="handleGenerate" 
    :loading="loading"
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
import { ref, reactive } from 'vue'
import SettingsForm from './components/SettingsForm.vue'
import ResultsList from './components/ResultsList.vue'
import MapComponent from './components/MapComponent.vue'
import { getRandomGeoPoints, getRandomOsmPoints } from './utils/coordinates.js'

export default {
  name: 'App',
  components: {
    SettingsForm,
    ResultsList,
    MapComponent
  },
  setup() {
    const loading = ref(false)
    const generatedPoints = ref([])
    const center = reactive({ lat: 56.326813, lng: 44.006200 })
    const mapRef = ref(null)

    const handleGenerate = async (settings) => {
      loading.value = true
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
            settings.maxRadiusKm
          )
        } else {
          points = getRandomGeoPoints(
            settings.centerLat, 
            settings.centerLng, 
            settings.minRadiusKm, 
            settings.maxRadiusKm, 
            settings.pointsCount, 
            settings.pointsOffsetAngle
          )
        }
        
        generatedPoints.value = points
        console.log('Generated points:', points)
      } catch (error) {
        console.error('Error generating points:', error)
        generatedPoints.value = []
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      generatedPoints,
      center,
      mapRef,
      handleGenerate
    }
  }
}
</script>