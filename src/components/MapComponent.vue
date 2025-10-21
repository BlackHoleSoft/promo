<template>
  <div id="map" style="width: 100%; height: 400px; border-radius: 8px;"></div>
</template>

<script>
import { onMounted, onUnmounted, watch, ref, toRaw } from 'vue'
import L from 'leaflet'

const DefaultIcon = L.icon({
  iconUrl: '/images/marker-icon-min.png',
  shadowUrl: '/images/marker-shadow-min.png',
  iconRetinaUrl: '/images/marker-icon-min.png', // используем тот же файл для retina
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowSize: [32, 32],
})
// L.Marker.prototype.options.icon = DefaultIcon

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

      markerGroup.value = L.layerGroup().addTo(toRaw(map.value))

      // Скрываем элементы управления Leaflet (как в оригинале)
      const controls = document.querySelectorAll('.leaflet-control')
      controls.forEach(control => {
        control.style.display = 'none'
      })
    })

    onUnmounted(() => {
      if (map.value) {
        toRaw(map.value).remove()
      }
    })

    // Следим за изменениями центра карты
    watch(() => props.center, (newCenter) => {
      if (map.value) {
        toRaw(map.value).setView([newCenter.lat, newCenter.lng], 7)
      }
    }, { deep: true })

    // Следим за изменениями точек
    watch(() => props.points, (newPoints) => {
      if (markerGroup.value) {

        // Очищаем существующие маркеры более надежным способом
        const rawMarkerGroup = toRaw(markerGroup.value)
        rawMarkerGroup.eachLayer(function (layer) {
          if (layer instanceof L.Marker) {
            rawMarkerGroup.removeLayer(layer)
          }
        })

        // Добавляем новые маркеры
        newPoints.forEach(({ lat, lng, name }, index) => {
          L.marker([lat, lng], { icon: DefaultIcon })
            .addTo(rawMarkerGroup)
            .bindPopup(name || `Точка ${index + 1}`)
        })
        
        // Перемещаем карту к новым точкам
        if (map.value && newPoints.length > 0) {
          const rawMap = toRaw(map.value)
          if (newPoints.length === 1) {
            // Если одна точка, центрируем на ней
            rawMap.setView([newPoints[0].lat, newPoints[0].lng], 10)
          } else {
            // Если несколько точек, показываем все
            const rawMarkerGroup = toRaw(markerGroup.value)
            const group = new L.featureGroup(rawMarkerGroup.getLayers())
            rawMap.fitBounds(group.getBounds(), { padding: [20, 20] })
          }
        }
        
        // Принудительно перерисовываем карту
        // if (map.value) {
        //   setTimeout(() => {
        //     map.value.invalidateSize()
        //   }, 100)
        // }
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