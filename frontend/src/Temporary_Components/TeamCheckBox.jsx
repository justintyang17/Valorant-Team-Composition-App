import { useState } from "react"

const TeamCheckBox = ({profile, teamCallback}) => {

    const [onTeam, setOnTeam] = useState(false) 

    const handleChecked = (e) => {
        setOnTeam(e.target.checked)
        teamCallback(profile, e.target.checked)
    }

    return <div>
        <input type="checkbox" name="onTeam" id="onTeam"
        checked={onTeam}
        onChange={handleChecked}/>
    </div>
}

export default TeamCheckBox