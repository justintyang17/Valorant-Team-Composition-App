import React from "react"
import AgentProficiency from './AgentProficiency'
import { AgentListContext } from "./AgentListContext";
import { useContext } from "react";

const AgentPool = ({mapAgentPool=[], map}) => {

    const agentList = useContext(AgentListContext);

    const getAgentName = (ID) => {
        const agent = agentList.find(a => a.agentID == ID)
        return agent.agentName
    }

    return (
        <ul>
            {mapAgentPool.map((agent, i) => (
                <div key={i}>
                    <AgentProficiency agentObj={agent} proficiency={agent.proficiency} agentName={getAgentName(agent.agentID)} map={map}/>
                </div>
                
            ))}
        </ul>
    )
}
export default AgentPool