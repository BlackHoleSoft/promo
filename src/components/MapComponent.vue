<template>
  <div id="map" style="width: 100%; height: 400px; border-radius: 8px;"></div>
</template>

<script>
import { onMounted, onUnmounted, watch, ref } from 'vue'
import L from 'leaflet'

// Исправление иконок маркеров для Leaflet + Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png'

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerIconRetina,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

export default {
  name: 'MapComponent',
  props: {
    center: {
      type: Object,
      required: true
    },
    points: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const map = ref(null)
    const markerGroup = ref(null)

    onMounted(() => {
      // Инициализация карты
      map.value = L.map('map').setView([props.center.lat, props.center.lng], 7)

      // Добавление тайлов OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map.value)

      markerGroup.value = L.layerGroup().addTo(map.value)

      // Скрываем элементы управления Leaflet (как в оригинале)
      const controls = document.querySelectorAll('.leaflet-control')
      controls.forEach(control => {
        control.style.display = 'none'
      })
    })

    onUnmounted(() => {
      if (map.value) {
        map.value.remove()
      }
    })

    // Следим за изменениями центра карты
    watch(() => props.center, (newCenter) => {
      if (map.value) {
        map.value.setView([newCenter.lat, newCenter.lng], 7)
      }
    }, { deep: true })

    // Следим за изменениями точек
    watch(() => props.points, (newPoints) => {
      if (markerGroup.value) {
        // Очищаем существующие маркеры
        markerGroup.value.clearLayers()

        // Добавляем новые маркеры
        newPoints.forEach(({ lat, lng, name }, index) => {
          L.marker([lat, lng])
            .addTo(markerGroup.value)
            .bindPopup(name || `Точка ${index + 1}`)
        })
      }
    }, { deep: true })

    return {}
  }
}
</script>

<style>
/* Скрываем элементы управления Leaflet */
.leaflet-control {
  display: none !important;
}
</style>