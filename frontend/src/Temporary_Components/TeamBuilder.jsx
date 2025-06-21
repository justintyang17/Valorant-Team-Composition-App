import { useContext, useState } from 'react'
import { AgentListContext } from './AgentListContext'

const TeamBuilder = ({teamList=[]}) => {

    const [currMap, setCurrMap] = useState()

    const agents = useContext(AgentListContext)

    const maps = [
        "BIND",
        "HAVEN",
        "SPLIT",
        "ASCENT",
        "ICEBOX"
    ]

    function WarningMessage() {
        const length = teamList.length
        if (length < 5) 
            return <h5>Not Enough Players</h5>
        else if (length > 5)
            return <h5>Too Many Players</h5>
        else 
            return null
    }

    const handleRadio = (e) => {
        setCurrMap(e.target.value)
    }

    const buildComp = (teamList, mapName) => {
        const teamMapList = []
        //create playerObj for each teammate (represents which agents they can play)
        for (let i = 0; i < 5; i++) {
            let agentScore = 0
            const playerMapPool = teamList[i].playerMapPool.find(m => m.map == mapName)
            const highProfList = playerMapPool.agentPool.filter(a => a.proficiency == 2)
            agentScore += highProfList.length * 2
            const lowProfList = playerMapPool.agentPool.filter(a => a.proficiency == 1)
            agentScore += lowProfList.length
            if (agentScore == 0) {
                alert("ERROR: " + teamList[i].playerName + " doesn't have any playable agents on " + mapName + ", please edit their profile and try again")
                return
            }
            const playerObj = {name: teamList[i].playerName, high: highProfList, low: lowProfList, score: agentScore}
            teamMapList.push(playerObj)
        }
        // sort list based on agent score
        teamMapList.sort((a, b) => {
            return a.score - b.score
        })
    }

    return <div>
        <h3>Current Team</h3>
        <ul>
            {teamList.map((player) => (
                <li key={player.id}>{player.playerName}</li>
            ))}
        </ul>
        <WarningMessage/>
        <div>
            {maps.map((map) => (
                <label key={map}>
                    <input type="radio" 
                    name="mapRadio" 
                    value={map} 
                    onChange={handleRadio}/>
                    {map}
                </label>
            ))}
        </div>
        <button disabled={teamList.length != 5 || currMap == null} onClick={() => buildComp(teamList, currMap)}>Build Comp</button>
    </div>
}


export default TeamBuilder