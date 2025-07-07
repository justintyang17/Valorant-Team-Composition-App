import React from 'react'
import { useDroppable} from '@dnd-kit/core'
import AgentDraggable from './AgentDraggable'

function AgentContainer (props) {
    const { id, items } = props
    const { setNodeRef } = useDroppable({ id })

    const containerStyle = {
        background: 'rgb(32, 35, 39)',
        padding: 10,
        margin: 10,
        flex: 1,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "8px",
        position: "relative",          
        boxSizing: "border-box",        
        borderRadius: "6px"
      };
      

    return (
        <div ref={setNodeRef} style={containerStyle}>
            {/*For each item in Container, render the Draggle Agent item*/}
            {items.map((agentID) => (
                <AgentDraggable key={agentID} id={agentID}/>
            ))}
        </div>
    )
}

export default AgentContainer