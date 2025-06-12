import React from "react"
import AgentProficiency from './AgentProficiency'

const AgentPool = ({mapAgentPool=[]}) => {
    return (
        <ul>
            {mapAgentPool.map((agent, i) => (
                <div key={i}>
                    <AgentProficiency agentID={agent.agentID} proficiency={agent.proficiency}/>
                </div>
                
            ))}
        </ul>
    )
}
export default AgentPool