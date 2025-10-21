<template>
  <div v-if="points.length === 0">
    Здесь появятся результаты
  </div>
  
  <div v-else>
    <div v-for="(point, index) in points" :key="index">
      {{ index + 1 }}: {{ point.lat }};{{ point.lng }} 
      <a 
        :href="`https://yandex.ru/maps/?mode=search&sll=${point.lng}%2C${point.lat}&text=${point.lat}%2C${point.lng}&z=10`"
        target="_blank"
        style="margin-left: 10px;"
      >
        На карте
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultsList',
  props: {
    points: {
      type: Array,
      default: () => []
    }
  }
}
</script>