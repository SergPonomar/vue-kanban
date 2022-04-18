<script setup>
import Task from './components/Task.vue'
import DraggableTask from './components/DraggableTask.vue'
import Panel from './components/Panel.vue'
import { onMounted } from 'vue'
import { useDnDStore } from './stores/store'

const dndStore = useDnDStore()

onMounted(() => {
  const body = document.querySelector('body')
  body.addEventListener("mousemove", moveHandler)
  body.addEventListener("mouseup", dropHandler)
  window.addEventListener("resize", resizeHandler)
})

function moveHandler(e) {
  dndStore.draggable.pointerPosition.x = e.clientX
  dndStore.draggable.pointerPosition.y = e.clientY
}

function dropHandler() {
  if (dndStore.draggable.isDragged) {
    dndStore.draggable.isDragged = false
    if (!dndStore.placeholder.panel) {
      dndStore.addsTask(dndStore.placeholder.firstClick.panel, dndStore.placeholder.firstClick.index)
    }
  }
}

function resizeHandler() {
  dndStore.resize.flag = false
  clearTimeout(dndStore.resize.timer);
  dndStore.resize.timer = setTimeout(() => {
    dndStore.resize.flag = true
  }, 250);
}
</script>

<template>
<div class="wrapper">  
  <Panel 
    v-for="(panel, panelName) in dndStore.panels"
    :panel="panelName"
    :tasks="panel"
  >
  </Panel>
</div>
<Teleport to="body">
  <DraggableTask
    v-if="dndStore.draggable.isDragged"
    :task="dndStore.draggable.task"
  ></DraggableTask>
</Teleport>
</template>

<style>
#app {
  display: flex;
  justify-content: center;
}
.wrapper {
  padding: 80px 10px 80px 10px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  max-width: 1200px;
  gap: 10px;
}
</style>