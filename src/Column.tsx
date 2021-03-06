import React, { useRef } from "react"
import { Card } from "./Card"
import { ColumnContainer, ColumnTitle } from "./styles"
import { useDrop } from "react-dnd"
import { AddNewItem } from './AddNewItem'
import { useAppState } from "./AppStateContext"
import { useItemDrag } from './useItemDrag'
import { DragItem } from "./DragItem"
import { isHidden } from "./utils/isHidden"

interface ColumnProps {
    text: string
    index: number
    id: string
}

export const Column = ({ text, index, id }: ColumnProps) => {
  const { state, dispatch } = useAppState()
  const ref = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop({
    accept: "COLUMN",
    hover(item: DragItem) {
      if (item.type === "COLUMN") {
        const dragIndex = item.index
        const hoverIndex = index

        if (dragIndex === hoverIndex) {
          return
        }

        dispatch({ type: "MOVE_LIST", payload: { dragIndex, hoverIndex } })
        item.index = hoverIndex
      }
    }
  })

  const { drag } = useItemDrag({ type: "COLUMN", id, index, text })

  drag(drop(ref))


  return (
    <ColumnContainer ref={ref} isHidden={isHidden(state.draggedItem, "COLUMN", id)}> 
      <ColumnTitle>{text}</ColumnTitle> 
      {state.lists[index].tasks.map((task, i) => (
        <Card
          id={task.id}
          columnId={id}
          text={task.text}
          key={task.id}
          index={i}
        /> 
      ))}
      <AddNewItem
        toggleButtonText="+ Add another task"
        onAdd={text =>
          dispatch({ type: "ADD_TASK", payload: { text, listId: id } })
        }
        dark
      />
    </ColumnContainer>
  ) 
}