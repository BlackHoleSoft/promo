<template>
  <div class="spoiler">
    <button 
      class="spoiler-toggle" 
      @click="toggle"
      :aria-expanded="isOpen"
    >
      {{ isOpen ? 'Скрыть' : 'Раскрыть настройки' }}
    </button>
    <div 
      class="spoiler-content" 
      :class="{ 'spoiler-content--open': isOpen }"
      :style="{ gridTemplateRows: isOpen ? '1fr' : '0fr' }"
    >
      <div class="spoiler-content-inner">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Spoiler',
  setup() {
    const isOpen = ref(false)
    
    const toggle = () => {
      isOpen.value = !isOpen.value
    }
    
    return {
      isOpen,
      toggle
    }
  }
}
</script>

<style scoped>
.spoiler {
}

.spoiler-toggle {
  background: #446;
  color: white;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  text-align: left;
  transition: background-color 0.2s;
}

.spoiler-toggle:hover {
  background: #557;
}

.spoiler-content {
  display: grid;
  transition: grid-template-rows 0.3s ease-out;
  overflow: hidden;
}

.spoiler-content-inner {
  overflow: hidden;
}

.spoiler-content--open {
  /* Стили для открытого состояния */
}
</style>
