import { useDnDStore } from '../stores/store'
import { ref, watch } from 'vue'

export function useFindIntersection(centerPoint, dimension, panel, position) {

  const dndStore = useDnDStore()
  const onWidth = ref(false)
  const up = ref(false)
  const low = ref(false)

  watch(() => dndStore.upperBP, () => {

    if (dndStore.draggable.isDragged) {
      //height difference correction
      const pop = dimension.value.height >= 2*dndStore.draggable.height? dimension.value.height - 2*dndStore.draggable.height : 0

      onWidth.value = dndStore.upperBP.x < (centerPoint.value.x + dimension.value.width/2) && 
      dndStore.upperBP.x > (centerPoint.value.x - dimension.value.width/2)

      //upper breaking point on upper half of droppable
      const upperBPonUpper = dndStore.upperBP.y > (centerPoint.value.y - dimension.value.height/2 + pop) &&
      dndStore.upperBP.y < centerPoint.value.y
      
      //lower breaking point on upper half of droppable
      const lowerBPonUpper = dndStore.lowerBP.y > (centerPoint.value.y - dimension.value.height/2 + pop) &&
      dndStore.lowerBP.y < centerPoint.value.y
      
      //upper breaking point on lower half of droppable
      const upperBPonLower = dndStore.upperBP.y < (centerPoint.value.y + dimension.value.height/2 - pop) &&
      dndStore.upperBP.y > centerPoint.value.y

      //lower breaking point on lower half of droppable
      const lowerBPonLower = dndStore.lowerBP.y < (centerPoint.value.y + dimension.value.height/2 - pop) &&
      dndStore.lowerBP.y > centerPoint.value.y

      up.value = onWidth.value && upperBPonUpper

      if (panel == dndStore.placeholder.panel) {
        low.value = onWidth.value && lowerBPonLower
      } else {
        low.value = onWidth.value && upperBPonLower
      }

      if (position == 0) {
        up.value = onWidth.value && (lowerBPonUpper || upperBPonUpper)
      } 
    }
  })

  return {onWidth, up, low}
}