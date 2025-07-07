import { useEffect, useContext, useState } from 'react'
import { AgentListContext } from './AgentListContext'
import { TraitListContext } from './TraitListContext'

const TeamBuilder = ({ teamList = [] }) => {

    const [currMap, setCurrMap] = useState("BIND")
    const [completedComp, setCompletedComp] = useState([])

    const [teamBuilt, setTeamBuilt] = useState(false)

    const agents = useContext(AgentListContext)
    const traits = useContext(TraitListContext)

    const maps = [
        "BIND",
        "HAVEN",
        "SPLIT",
        "ASCENT",
        "ICEBOX",
        "BREEZE",
        "FRACTURE",
        "PEARL",
        "LOTUS",
        "SUNSET",
        "ABYSS",
        "CORRODE"
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
            return <div className="warning">ERROR : Not Enough Players</div>
        else if (length > 5)
            return <div className="warning">ERROR : Too Many Players</div>
        else
            return null
    }

    useEffect(() => {
        if (teamList.length !== 5 && teamBuilt) {
            setTeamBuilt(false)
        }
    }, [teamList])

    useEffect(() => {
        if (teamBuilt) {
            setTeamBuilt(false)
        }
    }, [currMap])

    const buildComp = (teamList, mapName) => {
        let teamMapList = createTeamMapList(teamList, mapName)
        let traitIndex = 0
        let result = []
        bigloop: while (teamMapList.length !== 0) {
            let addedPlayer = false
            // trait trying to find
            const currTrait = traitList[traitIndex]
            // loop through each player
            for (const playerObj of teamMapList) {
                if (emptyPool(playerObj)) {
                    alert("ERROR: Ran out of agents to play!")
                    alert("Please add more agents to profiles")
                    return
                }
                // loop through each agent in prof = 2 list
                for (const agent of playerObj.high) {
                    const agentTraits = traits.filter(t => t.agentID === agent.agentID)
                    // if there is agent that has trait that matches curr trait
                    // 1) Add new pair obj to result
                    // 2) Increment traitIndex, restart traitIndex if goes out of bounds
                    // 3) Remove Player from teamMapList
                    // 4) Remove Agent from other player's pools
                    if (agentTraits.find(trait => trait.trait === currTrait) && !containsAgent(agent, result)) {
                        // 1)
                        const pairObj = { name: playerObj.name, agent: agents.find((a) => a.agentID == agent.agentID) }
                        result.push(pairObj)
                        // 2)
                        traitIndex = (traitIndex + 1) % traitList.length;
                        // 3) 
                        teamMapList = teamMapList.filter(player => player.name !== playerObj.name)
                        // 4) 
                        teamMapList = removeAgent(teamMapList, agent)
                        addedPlayer = true
                        continue bigloop
                    }
                }
            }
            if (!addedPlayer) {
                for (const playerObj of teamMapList) {
                    if (emptyPool(playerObj)) {
                        alert("ERROR: Ran out of agents to play!")
                        alert("Please add more agents to profiles")
                        return
                    }
                    for (const agent of playerObj.low) {
                        const agentTraits = traits.filter(t => t.agentID === agent.agentID)
                        if (agentTraits.find(trait => trait.trait === currTrait) && !containsAgent(agent, result)) {
                            const pairObj = { name: playerObj.name, agent: agents.find((a) => a.agentID == agent.agentID) }
                            result.push(pairObj)
                            traitIndex = (traitIndex + 1) % traitList.length;
                            teamMapList = teamMapList.filter(player => player.name !== playerObj.name)
                            teamMapList = removeAgent(teamMapList, agent)
                            addedPlayer = true
                            continue bigloop
                        }
                    }
                }
            }

            if (!addedPlayer) {
                traitIndex = (traitIndex + 1) % traitList.length;
            }
        }

        setCompletedComp(result)
        setTeamBuilt(true)
    }

    const createTeamMapList = (teamList, mapName) => {
        let teamMapList = []
        //create playerObj for each teammate (represents which agents they can play)
        for (let i = 0; i < 5; i++) {
            const playerMapPool = teamList[i].playerMapPool.find(m => m.map == mapName)
            //set up proficiency lists
            const highProfList = shuffleArray(playerMapPool.agentPool.filter(a => a.proficiency == 2))
            const lowProfList = shuffleArray(playerMapPool.agentPool.filter(a => a.proficiency == 1))

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
        const lowRisk = []
        const highRisk = []

        for (const playerObj of teamMapList) {
            if (playerObj.score <= 3) {
                lowRisk.push(playerObj)
            } else {
                highRisk.push(playerObj)
            }
        }
        const shuffledHighRisk = shuffleArray(highRisk)
        const finalList = [...lowRisk, ...shuffledHighRisk]

        return finalList
    }

    const shuffleArray = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    }

    const containsAgent = (agentName, playerObjList) => {
        const agents = []
        for (const player of playerObjList) {
            agents.push(player.agent)
        }
        return agents.includes(agentName)
    }

    const removeAgent = (teamList, agent) => {
        let newTeamList = teamList
        for (const player of newTeamList) {
            player.high = player.high.filter(a => a.agentID !== agent.agentID)
            player.low = player.low.filter(a => a.agentID !== agent.agentID)
        }
        return newTeamList
    }

    const emptyPool = (playerObj) => {
        return playerObj.high.length == 0 && playerObj.low.length == 0
    }

    const PlayerAgentCards = () => {
        let temp = []
        for (let i = 0; i < 5; i++) {
            if (teamList[i] != null) {
                temp.push(PlayerAgentCard(teamList[i]))
            } else {
                temp.push(unknownCard)
            }
        }
        return <div style={{ display: 'flex', gap: '40px', padding: '10px'}}>
            {temp.map((card, i) => (
                <div key={i}>{card}</div>
            ))}
        </div>
    }

    const unknownCard =
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <img src="../images/agents/unknown.png" width="100" height="100" />
            <label style={{ color: 'white' }}>???</label>
        </div>


    const PlayerAgentCard = (player) => {
        if (!teamBuilt) {
            return <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <img src="../images/agents/unknown.png" width="100" height="100" />
                <label style={{ color: 'white' }}>{player.playerName}</label>
            </div>
        } else {
            const agentImgString = completedComp.find((pair) => pair.name == player.playerName).agent.agentImg
            return <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <img src={agentImgString} width="100" height="100" />
                <label style={{ color: 'white' }}>{player.playerName}</label>
            </div>
        }
    }

    return <div className="team-builder-layout">
        <div className="team-names">
            <WarningMessage/>
            <PlayerAgentCards />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <label>Current Map:</label>
                    <select
                        id="mapSelector"
                        onChange={(e) => setCurrMap(e.target.value)}>
                        <option value="" disabled>Select a map</option>
                        {maps.map((map) => (
                            <option key={map} value={map}>{map}</option>
                        ))}
                    </select>
                </div>
                <button disabled={teamList.length != 5 || currMap == null} onClick={() => buildComp(teamList, currMap)}>{teamBuilt ? "Remake Team" : "Build Team"}</button>
            </div>
        </div>
    </div>
}


export default TeamBuilder