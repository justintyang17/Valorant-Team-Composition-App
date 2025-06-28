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
            padding: '5px 5px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: getColour(),
            boxSizing: 'border-box',
        }
        : {
            cursor: 'grab',
            willChange: 'transform',
            userSelect: 'none',
            padding: '5px 10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: getColour(),
            boxSizing: 'border-box',
        }


    const getAgentIcon = (ID) => {
        const agent = agentList.find(a => a.agentID == ID)
        return agent.agentImg
    }

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <img src={getAgentIcon(id)} width="50" height="50"/>
        </div>
    )
}

export default AgentDraggable