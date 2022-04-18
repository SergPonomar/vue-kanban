<script setup>
import { useDnDStore } from '../stores/store'
import { useFindIntersection } from '../composables/findIntersection'
import { useCalcGeometry } from '../composables/calcGeometry'
import { ref, watch } from 'vue'

const props = defineProps({
  position: Number,
  panel: String
})

const div = ref()

const dndStore = useDnDStore()
const {centerPoint, dimension} = useCalcGeometry(div)
const {onWidth, up, low} = 
  useFindIntersection(centerPoint, dimension, props.panel, props.position)

//CHECK FOR INTERCECTION
watch([up, low], () => {
  if ((up.value || low.value)) {
    dndStore.placeholder.index = props.position
    dndStore.placeholder.panel = props.panel

    dndStore.removeTask(props.panel)
    dndStore.addsTask(props.panel, props.position)
  } 
})
//CHECK FOR LEAVING
watch(onWidth, () => {
  if (!onWidth && props.panel == dndStore.placeholder.panel) {
    dndStore.placeholder.panel = null
    dndStore.placeholder.index = null
  }
})
</script>

<template> 
<div ref="div">
</div>  
</template>

<style scoped>
div {
  width: 100%;
  height: 80px;
  user-select: none;
}
</style>
