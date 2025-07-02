import { use, useContext, useState } from 'react'
import { AgentListContext } from './AgentListContext'
import { TraitListContext } from './TraitListContext'

const TeamBuilder = ({ teamList = [] }) => {

    const [currMap, setCurrMap] = useState("BIND")
    const [builtTeam, setBuiltTeam] = useState([])
    const [teamModalOpen, setTeamModalOpen] = useState(false)

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

    const handleRadio = (e) => {
        setCurrMap(e.target.value)
    }

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

        setBuiltTeam(result)
        setTeamModalOpen(true)
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

    const closeTeamModal = () => {
        setTeamModalOpen(false)
    }

    return <div className="team-builder-layout">
        <div className="team-names">
            {teamList.map((player) => (
                <div className="team-chip" key={player.id}>
                    {player.playerName}
                </div>
            ))}
            <div>
                <label>Select Map:</label>
                <select
                    id="mapSelector"
                    onChange={(e) => setCurrMap(e.target.value)}>
                    <option value="" disabled>Select a map</option>
                    {maps.map((map) => (
                        <option key={map} value={map}>{map}</option>
                    ))}
                </select>
            </div>
            <WarningMessage />
            <button disabled={teamList.length != 5 || currMap == null} onClick={() => buildComp(teamList, currMap)}>Build Comp</button>
           
        </div>



        {/*<div className='map-radio'>
            {maps.map((map) => (
                <label className='map-option' key={map}>
                    <input type="radio"
                        name="mapRadio"
                        value={map}
                        onChange={handleRadio} />
                    {map}
                </label>
            ))}
        </div> */}

        {teamModalOpen && <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeTeamModal}>&times;</span>
                <h3 style={{ textAlign: "center" }}>TEAM COMPOSITION FOR {currMap}</h3>
                <div style={{ display: "flex", flexDirection: "row", gap: "40px", padding: "20px", justifyContent: "center" }}>
                    {builtTeam.map((player, i) => (
                        <div key={i} style={{ textAlign: "center" }}>
                            <label>{player.name}</label>
                            <img src={player.agent.agentImg} width="100" length="100" />
                        </div>
                    ))}
                </div>
                <button style={{ margin: "auto", display: "block" }} onClick={() => buildComp(teamList, currMap)}>Remake</button>
            </div>
        </div>}
    </div>
}


export default TeamBuilder