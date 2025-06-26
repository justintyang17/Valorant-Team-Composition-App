import React, { useContext } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { AgentListContext } from './AgentListContext'


function AgentDraggable(props) {

    const agentList = useContext(AgentListContext)

    const { id } = props
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })

    const getColour = () => {
        const agent = agentList.find(a => a.agentID == id)
        switch(agent.agentRole) {
            case ("DUELIST"):
                return 'Salmon'
            case ("INITIATOR"):
                return 'Gold'
            case ("CONTROLLER"):
                return 'LightGreen'
            default:
                return 'DodgerBlue'
        }
    }

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
            cursor: 'grab',
            willChange: 'transform',
            userSelect: 'none',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: getColour(),
            minWidth: '80px',
            textAlign: 'center',
            boxSizing: 'border-box',
        }
        : {
            cursor: 'grab',
            willChange: 'transform',
            userSelect: 'none',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: getColour(),
            minWidth: '80px',
            textAlign: 'center',
            boxSizing: 'border-box',
        }


    const getAgentName = (ID) => {
        const agent = agentList.find(a => a.agentID == ID)
        return agent.agentName
    }

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {getAgentName(id)}
        </div>
    )
}

export default AgentDraggable