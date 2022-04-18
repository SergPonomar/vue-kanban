<script setup>
import { useDnDStore } from '../stores/store'
const dndStore = useDnDStore()
const props = defineProps({
  task: Object
})
</script>

<template>
  <div  
    :style="{ '--x': dndStore.position.x, 
    '--y': dndStore.position.y,
    width: dndStore.draggable.width + 'px',
    height: dndStore.draggable.height + 'px'}"
  >
    <span>{{task.text}}</span><br>
  </div>
</template>

<style scoped>
div {
  --x: 0;
  --y: 0;
  line-height: 1.4;
  padding: 12px;
  border-radius: 5px;
  position: fixed;
  left: 0;
  top: 0;
  background-color: white;  
  user-select: none;
  pointer-events: none;
  z-index: 99;
  box-shadow: 0 0 10px hsl(210, 30%, 80%, 1);
  transform: translate(
    calc(var(--x) * 1px), 
    calc(var(--y) * 1px));
}
</style>