<template>
  <div class="block">
    <h3>Настройки</h3>

    <div class="field">
      <label>Центр</label>
      <div class="row">
        <input type="number" v-model.number="settings.centerLat" step="0.000001" />
        <input type="number" v-model.number="settings.centerLng" step="0.000001" />
      </div>
    </div>

    <div class="field">
      <label>Учитывать достопримечательности</label>
      <input type="checkbox" v-model="settings.attractionsEnabled" />
    </div>

    <div class="field">
      <label>Мин. расстояние (км)</label>
      <input type="number" v-model.number="settings.minRadiusKm" min="1" />
    </div>

    <div class="field">
      <label>Макс. расстояние (км)</label>
      <input type="number" v-model.number="settings.maxRadiusKm" min="1" />
    </div>

    <div class="field">
      <label>Кол-во точек</label>
      <input type="number" v-model.number="settings.pointsCount" min="1" max="50" />
    </div>

    <div class="field">
      <label>Разбег между точками (рад.)</label>
      <input type="number" v-model.number="settings.pointsOffsetAngle" step="0.1" min="0" />
    </div>

    <button @click="generate" :disabled="loading">
      {{ loading ? 'Загрузка...' : 'Сгенерировать' }}
    </button>
    
    <div id="status" v-if="status">{{ status }}</div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'

export default {
  name: 'SettingsForm',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['generate'],
  setup(props, { emit }) {
    const settings = reactive({
      centerLat: 56.326813,
      centerLng: 44.006200,
      attractionsEnabled: true,
      minRadiusKm: 50,
      maxRadiusKm: 200,
      pointsCount: 3,
      pointsOffsetAngle: 0.5
    })

    const status = ref('')

    const generate = () => {
      if (props.loading) return
      
      status.value = props.loading ? 'Загрузка...' : 'Готово'
      emit('generate', { ...settings })
      
      setTimeout(() => {
        status.value = props.loading ? 'Попробуйте еще раз' : 'Готово'
      }, 100)
    }

    return {
      settings,
      status,
      generate
    }
  }
}
</script>