<script setup>
import { useDnDStore } from '../stores/store'
import { useFindIntersection } from '../composables/findIntersection'
import { useCalcGeometry } from '../composables/calcGeometry'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'

import Cancel from './icons/Cancel.vue'
import Pencil from './icons/Pencil.vue'
import Save from './icons/Save.vue'
import Button from './Button.vue'

const dndStore = useDnDStore()

const props = defineProps({
  task: Object,
  position: Number,
  panel: String
})

const div = ref()
const {centerPoint, dimension} = useCalcGeometry(div)
const {onWidth, up, low} = 
  useFindIntersection(centerPoint, dimension, props.panel, props.position)

const input = ref("")
const hoverActive = ref(true)
const isEdit = ref(false)

const under = computed(() => 
  dndStore.draggable.isDragged 
    && dndStore.draggable.task == props.task
)

onMounted(() => {
  input.value = props.task.text
})
//TURN OFF/ON HOVER EFFECT
watchEffect(() => {
  if (dndStore.draggable.isDragged) {
    hoverActive.value = false
  } else {
    setTimeout(() => hoverActive.value = true, 250)
  }
})
//CHECK FOR INTERSECTION
watch([up, low, under], () => {
  if ((up.value || low.value) && !under.value) {
    dndStore.placeholder.index = props.position
    dndStore.placeholder.panel = props.panel

    dndStore.droppable.height = dimension.value.height

    dndStore.removeTask(props.panel)
    dndStore.addsTask(props.panel, props.position)
  } 
})
//CHECK FOR LEAVING
watch([onWidth, under], () => {
  if (!onWidth.value && under.value) {
    dndStore.removeTask(props.panel)
    if (props.panel == dndStore.placeholder.panel) {
      dndStore.placeholder.panel = null
      dndStore.placeholder.index = null
    }
  }
})
//CALCULATE NEW Y COORDINATE
watch(() => props.position, (pos, posOld) => {
  if (pos < posOld) {
    if(!under.value) {
      centerPoint.value.y -= dndStore.draggable.height
    } else {
      centerPoint.value.y -= dndStore.droppable.height
    }
  } else {
    if(!under.value) {
      centerPoint.value.y += dndStore.draggable.height
    } else {
      centerPoint.value.y += dndStore.droppable.height
    }
  }
})

function dragHandler(e) {
  dndStore.draggable.isDragged = true
  dndStore.draggable.task = props.task
  dndStore.draggable.pointerPosition = 
    { 
      x: e.clientX, 
      y: e.clientY,
      dx: e.offsetX,
      dy: e.offsetY,
    }
  dndStore.draggable.width = dimension.value.width
  dndStore.draggable.height = dimension.value.height

  dndStore.droppable.height = dimension.value.height

  dndStore.placeholder.panel = props.panel
  dndStore.placeholder.index = props.position
  dndStore.placeholder.firstClick.panel = props.panel
  dndStore.placeholder.firstClick.index = props.position
}

function onSave() {
  dndStore.editTask(props.panel, props.position, input.value)
  setInitialText()
}

function setInitialText() {
  isEdit.value = false
  input.value = props.task.text
}
</script>

<template> 
<div 
  ref="div"
  class="base"
>  
  <!--PLACEHOLDER-->
  <div 
    v-if="under"
    class="placeholder"
    :style="{ width: dndStore.draggable.width + 'px',
    height: dndStore.draggable.height + 'px'}"
  ></div>
  <div
    v-else="under"
  >
    <!--VISIBLE TASK-->
    <div
      v-if="!isEdit"
      class="task"
      :class="{ visible: hoverActive}"
      @mousedown="dragHandler"
    > 
      <span>{{task.text}}</span>
      <Button 
        class="controls" 
        @mousedown.stop="isEdit = true"
      >
        <Pencil/>
      </Button>
    </div>
    <!--EDIT WINDOW-->
    <div
      class="task editable"
      v-else="!isEdit"
    >
      <textarea
        v-model="input"
        name="text"
        :style="{ height : dimension.height + 'px'}"
      />
      <div class="controls" style="top:12px">
        <Button @click="onSave">
          <Save class="save"/>
        </button>
        <Button @click="setInitialText">
          <Cancel class="cancel"/>
        </button>     
      </div>
    </div>
  </div>
</div>  
</template>

<style scoped>
.base {
  margin: 5px 0 5px 0;
}
.task, .placeholder, textarea {
  padding: 12px 26px 12px 12px;
  border-radius: 5px;
  min-height: 80px;
  line-height: 1.4;
}
textarea {
  padding-right: 12px;
  width: calc(100%);
  font-size: 16px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  border: 1px solid #2c3e50;
  color: #2c3e50;
  resize: none;
}
.task {
  background-color: white;
  user-select: none;
  position: relative;
  transition: background-color 0.25s;
}
.visible:hover {
  background-color: hsla(210, 29%, 54%, 0.25);
}
.placeholder {
  opacity: 0;
}
.editable {
  padding: 0;
  padding-right: 28px;
}
.controls {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  flex-direction: column;
}
.save {
  color: green;
}
.cancel {
  color: hsl(9, 95%, 49%);
}
</style>