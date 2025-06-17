import React from "react"
import AgentPool from './AgentPool'

const MapPool = ({existingProfileMapPool=[]}) => {
    return (
        <div>
             {existingProfileMapPool.map((mapObj, i) => (
                <div key={i}>
                    <h3>Agent Pool for {mapObj.map}</h3>
                    <AgentPool mapAgentPool={mapObj.agentPool} map = {mapObj.map}/>
                </div>
            ))}
        </div>
    ) 
}
export default MapPool