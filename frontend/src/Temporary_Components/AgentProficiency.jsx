import React from "react"
import { useState } from "react"

const AgentProficiency = ({agentObj, proficiency, agentName}) => {
    const [proficiencyVal, setProficiencyVal] = useState(proficiency)

    return (
        <div>
            <label>{agentName}</label>
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