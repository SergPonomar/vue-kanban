<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import DummyTask from './DummyTask.vue'
import Plus from './icons/Plus.vue'
import Task from './Task.vue'
import Button from './Button.vue'
import { camelToFirstUpper } from '../utils/utils'
import { useDnDStore } from '../stores/store'

const dndStore = useDnDStore()

const props = defineProps({
  tasks: Object,
  panel: String
})

const div = ref()
const marginY = 10
const minHeight = 80
const height = ref(undefined)
const isUpAnimation = ref(false)

const panelStyle = computed(() => 
  height.value? ({ height: height.value + 'px'}) : ({})
)
const openDummy = computed(() => props.tasks.length == 0)

onMounted(() => {
  calculateGeometry()
})
//CHECK IF RESIZE
watch(() => dndStore.resize.flag, (flag) => {
  height.value = undefined
  if (flag) nextTick(() => calculateGeometry())
})
//CALCULATE NEW Y HEIGHT
watch(() => props.tasks.length, (lg, lgOld) => { 
  if (dndStore.draggable.isDragged) {
    if (lg < lgOld) {
      height.value -= dndStore.draggable.height + marginY
      isUpAnimation.value = true
    } else {
      height.value += dndStore.draggable.height + marginY
      isUpAnimation.value = false
    } 
  } else {
    height.value += minHeight + marginY
    isUpAnimation.value = false
  }
})

function calculateGeometry() {
  const rect = div.value?.getBoundingClientRect()
  height.value = rect.height
}

function addTask() {
  dndStore.addsTask(props.panel, 0, true)
  dndStore.draggable.height = minHeight
}
</script>

<template>
<div class="panel">
  <div class="header">
    <Button @click="addTask"><Plus/></Button>
    <span>{{camelToFirstUpper(panel)}}</span>
  </div>
  <div
    class="content"
    ref="div"
    :style="panelStyle"
    :class="{ up: isUpAnimation }"
  >
    <TransitionGroup 
      name="list"
    >
      <Task
        v-for="(task, index) in tasks"
        :key="task.id"
        :task="task"
        :position="index"
        :panel="panel"
      ></Task>
    </TransitionGroup>
    <DummyTask
      v-if="openDummy"
      :position="0"
      :panel="panel"      
    >
    </DummyTask>
  </div>
</div>
</template>

<style scoped>
.header {
  user-select: none;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 8px;
  background-color: grey;
  background-color: hsl(210, 29%, 50%);
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
}
.header svg {
  transform: translateY(1px);
}
.panel {
  padding: 10px;
  border-radius: 1px;
  width: calc(100% / 3);
}
.panel, .content {
  display: flex;
  flex-direction: column;
  background-color: hsl(210, 30%, 95%);
}
.content {
  transition: height 0.2s cubic-bezier(0.1, 0.1, 1.0, 1.0);
  min-height: 80px;
  min-width: 90px;
}
.up {
  transition: height 0.5s cubic-bezier(0.1, 0.1, 1.0, 1.0);
  transition-delay: 100ms;
}
.list-move {
  transition: transform 0.3s cubic-bezier(0.1, 0.1, 1.0, 1.0);
}
.list-leave-active {
  position: absolute;
}
</style>