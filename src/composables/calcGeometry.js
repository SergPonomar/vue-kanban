import { useDnDStore } from '../stores/store'
import { onMounted, ref, watch } from 'vue'

export function useCalcGeometry(div) {
  const dndStore = useDnDStore()
  const centerPoint = ref({x: 0, y: 0})
  const dimension = ref({width: 0, height: 0})

  onMounted(() => {
    calculateGeometry()
  })

  watch(() => dndStore.resize.flag, (flag) => {
    if (flag) calculateGeometry()
  })

  function calculateGeometry() {
    const rect = div.value?.getBoundingClientRect()
    if (rect) {
      dimension.value.width = rect.width
      dimension.value.height = rect.height
      centerPoint.value.x = rect.x + rect.width/2
      centerPoint.value.y = rect.y + rect.height/2
    } 
  }

  return {centerPoint, dimension}
}