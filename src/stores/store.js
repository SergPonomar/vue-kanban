import { defineStore } from 'pinia'

let id = 0

export const useDnDStore = defineStore('tasks', {
  state: ()  => ({
    todo: [
		  { id: id++, text: 'Heat the oil in a medium pan over a medium heat' },
		  { id: id++, text: 'Fry the onion and garlic for 8-10 mins until soft' },
		  { id: id++, text: 'Add the chorizo and fry for 5 mins more' }
		],
    inProgress: [
		  { id: id++, text: 'Tip in the tomatoes and sugar, and season' },
		  { id: id++, text: 'Bring to a simmer, then add the gnocchi and cook for 8 mins, stirring often, until soft' },
		  { id: id++, text: 'Heat the grill to high' }
		],
    done: [
		  { id: id++, text: 'Stir ¾ of the mozzarella and most of the basil through the gnocchi' },
		  { id: id++, text: 'Divide the mixture between six ovenproof ramekins, or put in one baking dish' },
		  { id: id++, text: 'Top with the remaining mozzarella, then grill for 3 mins, or until the cheese is melted and golden. Season, scatter over the remaining basil and serve with green salad.' }
		],
		draggable: {
			isDragged: false,
			task: undefined,
			pointerPosition: {x:0, y:0, dx:0, dy:0},
			width: 0,
			height:	0,
		},
		droppable: {
			height:	0,
		},
		resize: {
			timer: null,
			flag: false
		},
		placeholder: {
			panel: null,
			index: null,
			firstClick: {
				panel: null,
				index: null
			}
		}
  }),
  getters: {
    panels (state) {
      return {
      	todo: state.todo,
      	inProgress: state.inProgress,
      	done: state.done
      }
    },
    //BP - breakingPoint
		upperBP (state) {
			return {
				x: state.draggable.pointerPosition.x - state.draggable.pointerPosition.dx 
					+ state.draggable.width/2,
    		y: state.draggable.pointerPosition.y - state.draggable.pointerPosition.dy
			}
		},		
		lowerBP (state) {
			return {
				x: state.draggable.pointerPosition.x - state.draggable.pointerPosition.dx 
					+ state.draggable.width/2,
    		y: state.draggable.pointerPosition.y - state.draggable.pointerPosition.dy + 
    		state.draggable.height
			}
		},
		position (state) {
			return {
				x: state.draggable.pointerPosition.x - state.draggable.pointerPosition.dx,
    		y: state.draggable.pointerPosition.y - state.draggable.pointerPosition.dy
			}
		},		
  },
  actions: {
    removeTask (category) {
    	this[category] = this[category].filter(t => t !== this.draggable.task)
    },
    addsTask (category, position, newTask = false) {
    	if (!newTask) {
    		this[category].splice(position, 0, this.draggable.task)
    	} else {
    		this[category].splice(position, 0, { id: id++, text: 'New task' })
    	}
    },
    editTask (category, position, text) {
  		this[category][position].text = text
    }
  }
})