import React from 'react'
import {DndContext} from '@dnd-kit/core'
import { useState } from "react"

import AgentContainer from './AgentContainer'
import AgentDraggable from './AgentDraggable'

const AgentPool2 = (mapAgentPool, map) => {
    const containers = [2, 1, 0]
    const [parent, setParent] = useState(null)

    const draggableMarkup = (
        <AgentDraggable id="draggable">Drag Me</AgentDraggable>
    )

    function handleDragEnd(event) {
        const {over} = event
        setParent(over ? over.id : null)
    }

    return (
        <div>
            <DndContext onDragEnd = {handleDragEnd}>
                {parent === null ? draggableMarkup : null}
                {containers.map((id) => (
                    <AgentContainer key = {id} id = {id}>
                        {parent === id ? draggableMarkup : 'Drophere'}
                    </AgentContainer>
                ))}

            </DndContext>
        </div>
    )
}

export default AgentPool2