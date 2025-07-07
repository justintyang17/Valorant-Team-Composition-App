import React from "react"
import { useState, useContext } from "react"
import { ProficiencyUpdateContext } from "./ProficiencyUpdateContext"


const AgentProficiency = ({agentObj, proficiency, agentName, map}) => {
    const [proficiencyVal, setProficiencyVal] = useState(proficiency)

    const updateAgentProficiency = useContext(ProficiencyUpdateContext)

    // function to set new state variable and update player's mappool
    const setAndUpdate = (prof_val) => {
        setProficiencyVal(prof_val)
        updateAgentProficiency(map, agentObj.agentID, prof_val)
    }

    return (
        <div>
            <label>{agentName}</label>
            <input
                id="proficiency"
                value={proficiencyVal}
                onChange={e => setAndUpdate(e.target.value)}
                type="number"
                max="2"
                min="0"
            />
        </div>
    )
}
export default AgentProficiency