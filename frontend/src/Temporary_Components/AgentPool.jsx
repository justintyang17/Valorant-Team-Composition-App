import React from "react"
import AgentProficiency from './AgentProficiency'

const AgentPool = ({mapAgentPool=[], agentList  = []}) => {

    const getAgentName = (ID) => {
        const agent = agentList.find(a => a.agentID == ID)
        return agent.agentName
    }

    return (
        <ul>
            {mapAgentPool.map((agent, i) => (
                <div key={i}>
                    <AgentProficiency agentObj={agent} proficiency={agent.proficiency} agentName={getAgentName(agent.agentID)}/>
                </div>
                
            ))}
        </ul>
    )
}
export default AgentPool