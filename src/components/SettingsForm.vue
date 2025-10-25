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

    <div class="field">
      <label>Направления</label>
      <div class="checkbox-group">
        <label><input type="checkbox" v-model="settings.directions.north" /> Север</label>
        <label><input type="checkbox" v-model="settings.directions.east" /> Восток</label>
        <label><input type="checkbox" v-model="settings.directions.south" /> Юг</label>
        <label><input type="checkbox" v-model="settings.directions.west" /> Запад</label>
      </div>
    </div>

    <div class="field">
      <label>Типы объектов OSM</label>
      <Spoiler>
        <div class="checkbox-group-vertical">
          <label :class="{ disabled: !settings.attractionsEnabled }">
            <input type="checkbox" v-model="settings.osmTypes.ruins" :disabled="!settings.attractionsEnabled" /> 
            Руины (building=ruins)
          </label>
          <label :class="{ disabled: !settings.attractionsEnabled }">
            <input type="checkbox" v-model="settings.osmTypes.information" :disabled="!settings.attractionsEnabled" /> 
            Информация (tourism=information)
          </label>
          <label :class="{ disabled: !settings.attractionsEnabled }">
            <input type="checkbox" v-model="settings.osmTypes.attraction" :disabled="!settings.attractionsEnabled" /> 
            Достопримечательности (tourism=attraction)
          </label>
          <label :class="{ disabled: !settings.attractionsEnabled }">
            <input type="checkbox" v-model="settings.osmTypes.viewpoint" :disabled="!settings.attractionsEnabled" /> 
            Смотровые площадки (tourism=viewpoint)
          </label>
          <label :class="{ disabled: !settings.attractionsEnabled }">
            <input type="checkbox" v-model="settings.osmTypes.museum" :disabled="!settings.attractionsEnabled" /> 
            Музеи (tourism=museum)
          </label>
          <label :class="{ disabled: !settings.attractionsEnabled }">
            <input type="checkbox" v-model="settings.osmTypes.gallery" :disabled="!settings.attractionsEnabled" /> 
            Галереи (tourism=gallery)
          </label>
          <label :class="{ disabled: !settings.attractionsEnabled }">
            <input type="checkbox" v-model="settings.osmTypes.placeOfWorship" :disabled="!settings.attractionsEnabled" /> 
            Места поклонения (amenity=place_of_worship)
          </label>
          <label :class="{ disabled: !settings.attractionsEnabled }">
            <input type="checkbox" v-model="settings.osmTypes.theatre" :disabled="!settings.attractionsEnabled" /> 
            Театры (amenity=theatre)
          </label>
          <label :class="{ disabled: !settings.attractionsEnabled }">
            <input type="checkbox" v-model="settings.osmTypes.cinema" :disabled="!settings.attractionsEnabled" /> 
            Кинотеатры (amenity=cinema)
          </label>
          <label :class="{ disabled: !settings.attractionsEnabled }">
            <input type="checkbox" v-model="settings.osmTypes.fountain" :disabled="!settings.attractionsEnabled" /> 
            Фонтаны (amenity=fountain)
          </label>
          <label :class="{ disabled: !settings.attractionsEnabled }">
            <input type="checkbox" v-model="settings.osmTypes.monument" :disabled="!settings.attractionsEnabled" /> 
            Памятники (amenity=monument)
          </label>
          <label :class="{ disabled: !settings.attractionsEnabled }">
            <input type="checkbox" v-model="settings.osmTypes.park" :disabled="!settings.attractionsEnabled" /> 
            Парки (leisure~park)
          </label>
          <label :class="{ disabled: !settings.attractionsEnabled }">
            <input type="checkbox" v-model="settings.osmTypes.water" :disabled="!settings.attractionsEnabled" /> 
            Водоемы (natural~water)
          </label>
          <label :class="{ disabled: !settings.attractionsEnabled }">
            <input type="checkbox" v-model="settings.osmTypes.peak" :disabled="!settings.attractionsEnabled" /> 
            Вершины (natural~peak)
          </label>
          <label :class="{ disabled: !settings.attractionsEnabled }">
            <input type="checkbox" v-model="settings.osmTypes.historic" :disabled="!settings.attractionsEnabled" /> 
            Исторические объекты (historic)
          </label>
        </div>
      </Spoiler>
    </div>

    <button @click="generate" :disabled="loading">
      {{ loading ? 'Загрузка...' : 'Сгенерировать' }}
    </button>
    
    <div id="status" v-if="status">{{ status }}</div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import Spoiler from './Spoiler.vue'

export default {
  name: 'SettingsForm',
  components: {
    Spoiler
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: ''
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
      pointsOffsetAngle: 0.5,
      directions: {
        north: true,
        east: true,
        south: true,
        west: true
      },
      osmTypes: {
        ruins: true,
        information: true,
        attraction: true,
        viewpoint: true,
        museum: true,
        gallery: true,
        placeOfWorship: true,
        theatre: true,
        cinema: true,
        fountain: true,
        monument: true,
        park: true,
        water: true,
        peak: true,
        historic: true
      }
    })

    const generate = () => {
      if (props.loading) return
      emit('generate', { ...settings })
    }

    return {
      settings,
      generate
    }
  }
}
</script>
