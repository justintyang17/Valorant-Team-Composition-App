import { useContext, useState } from 'react'
import { AgentListContext } from './AgentListContext'
import { TraitListContext } from './TraitListContext'

const TeamBuilder = ({ teamList = [] }) => {

    const [currMap, setCurrMap] = useState()

    const agents = useContext(AgentListContext)
    const traits = useContext(TraitListContext)

    const maps = [
        "BIND",
        "HAVEN",
        "SPLIT",
        "ASCENT",
        "ICEBOX"
    ]

    const traitList = [
        "BALL_SMOKES",
        "FLASH",
        "RECON",
        "ENTRY",
        "TRIPS",
        "STALL"
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
        alert("traits length = " + traits.length)
        let teamMapList = []
        //create playerObj for each teammate (represents which agents they can play)
        for (let i = 0; i < 5; i++) {
            const playerMapPool = teamList[i].playerMapPool.find(m => m.map == mapName)
            //set up proficiency lists
            const highProfList = playerMapPool.agentPool.filter(a => a.proficiency == 2)
            const lowProfList = playerMapPool.agentPool.filter(a => a.proficiency == 1)

            //set up agent score
            let agentScore = 0
            agentScore += highProfList.length * 2
            agentScore += lowProfList.length
            if (agentScore == 0) {
                alert("ERROR: " + teamList[i].playerName + " doesn't have any playable agents on " + mapName + ", please edit their profile and try again")
                return
            }
            //create and add object
            const playerObj = { name: teamList[i].playerName, high: highProfList, low: lowProfList, score: agentScore }
            teamMapList.push(playerObj)
        }
        // sort list based on agent score
        teamMapList.sort((a, b) => {
            return a.score - b.score
        })

        alert("tempMapList created")
        let traitIndex = 0
        let result = []
        bigloop: while (teamMapList.length !== 0) {
            let addedPlayer = false
            // trait trying to find
            const currTrait = traitList[traitIndex]
            // loop through each player
            for (const playerObj of teamMapList) {
                // loop through each agent in prof = 2 list
                for (const agent of playerObj.high) {
                    const agentTraits = traits.filter(t => t.agentID === agent.agentID)
                    // if there is agent that has trait that matches curr trait
                    // 1) Add new pair obj to result
                    // 2) Increment traitIndex 
                    // 3) Remove Player from teamMapList
                    // 4) Restart traitIndex if goes out of bounds
                    if (agentTraits.find(trait => trait.trait === currTrait) && !containsAgent(agent, result)) {
                        const pairObj = { name: playerObj.name, agent: agents.find((a) => a.agentID == agent.agentID).agentName }
                        alert("Added Player: " + pairObj.name + " on agent " + pairObj.agent + " for " + currTrait)
                        result.push(pairObj)
                        traitIndex++
                        teamMapList = teamMapList.filter(player => player.name !== playerObj.name)
                        if (traitIndex == traitList.length) {
                            traitIndex = 0
                        }
                        addedPlayer = true
                        continue bigloop
                    }
                }
            }
            if (!addedPlayer) {
                for (const playerObj of teamMapList) {
                    for (const agent of playerObj.low) {
                        const agentTraits = traits.filter(t => t.agentID === agent.agentID)
                        if (agentTraits.find(trait => trait.trait === currTrait) && !containsAgent(agent, result)) {
                            const pairObj = { name: playerObj.name, agent: agents.find((a) => a.agentID == agent.agentID).agentName }
                            alert("Added Player: " + pairObj.name + " on agent " + pairObj.agent + " for " + currTrait)
                            result.push(pairObj)
                            traitIndex++
                            teamMapList = teamMapList.filter(player => player.name !== playerObj.name)
                            if (traitIndex == traitList.length) {
                                traitIndex = 0
                            }
                            addedPlayer = true
                            continue bigloop
                        }
                    }
                }
            }

            if (!addedPlayer) {
                traitIndex++
                if (traitIndex >= traitList.length) {
                    traitIndex = 0
                }
            }
        }
        let temp = 1
        for (const pair of result) {
            alert("Player " + temp + ": " + pair.name + " is using " + pair.agent)
            temp++
        }
    }

    const containsAgent = (agentName, playerObjList) => {
        const agents =[]
        for (const player of playerObjList) {
            agents.push(player.agent)
        }
        return agents.includes(agentName)
    }

    return <div>
        <h3>Current Team</h3>
        <ul>
            {teamList.map((player) => (
                <li key={player.id}>{player.playerName}</li>
            ))}
        </ul>
        <WarningMessage />
        <div>
            {maps.map((map) => (
                <label key={map}>
                    <input type="radio"
                        name="mapRadio"
                        value={map}
                        onChange={handleRadio} />
                    {map}
                </label>
            ))}
        </div>
        <button disabled={teamList.length != 5 || currMap == null} onClick={() => buildComp(teamList, currMap)}>Build Comp</button>
    </div>
}


export default TeamBuilder