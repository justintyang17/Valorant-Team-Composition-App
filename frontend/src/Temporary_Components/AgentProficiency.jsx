import React from "react"
import { useState } from "react"

const AgentProficiency = ({agentID, proficiency}) => {
    const [proficiencyVal, setProficiencyVal] = useState(proficiency)

    const getAgentName = (ID) => {
        return ID
    }

    return (
        <div>
            <label>Agent ID: {getAgentName(agentID)}</label>
            <input
                id="proficiency"
                value={proficiencyVal}
                onChange={e => setProficiencyVal(e.target.value)}
                type="number"
                max="2"
                min="0"
            />
        </div>
    )
}
export default AgentProficiency