import React from "react"
import AgentPool from './AgentPool'

const MapPool = ({existingProfileMapPool=[], agentList=[]}) => {
    return (
        <div>
             {existingProfileMapPool.map((mapObj, i) => (
                <div key={i}>
                    <h3>Agent Pool for {mapObj.map}</h3>
                    <AgentPool mapAgentPool={mapObj.agentPool} agentList={agentList}/>
                </div>
            ))}
        </div>
    ) 
}
export default MapPool