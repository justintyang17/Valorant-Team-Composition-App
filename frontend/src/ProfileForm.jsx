import { useState, useEffect } from "react"

import MapPool from './Temporary_Components/MapPool'
import { ProficiencyUpdateContext } from "./Temporary_Components/ProficiencyUpdateContext";

const ProfileForm = ({ existingProfile = {}, updateCallback }) => {
    // "Global Variables"
    // 1) playerName = current profile's name
    // 2) playerUser = current profile's username
    // 3) playerRank = current profile's rank
    // 4) playerMapPool = current profile's map pool

    const [playerName, setPlayerName] = useState(existingProfile.playerName || "")
    const [playerUser, setPlayerUser] = useState(existingProfile.playerUser || "")
    const [playerRank, setPlayerRank] = useState(existingProfile.playerRank || "")
    const [playerMapPool, setPlayerMapPool] = useState(existingProfile.playerMapPool || [])

    // For Rank Selection
    const ranks = [
        "IRON_1",
        "IRON_2",
        "IRON_3",
        "BRONZE_1",
        "BRONZE_2",
        "BRONZE_3",
        "SILVER_1",
        "SILVER_2",
        "SILVER_3",
        "GOLD_1",
        "GOLD_2",
        "GOLD_3",
        "PLATINUM_1",
        "PLATINUM_2",
        "PLATINUM_3",
        "DIAMOND_1",
        "DIAMOND_2",
        "DIAMOND_3",
        "ASCENDANT_1",
        "ASCENDANT_2",
        "ASCENDANT_3",
        "IMMORTAL_1",
        "IMMORTAL_2",
        "IMMORTAL_3",
        "RADIANT"
    ]

    // Variable used to determine whether or not modal is being used to create new profile or update existing profile;
    // if curr profile exists (aka a profile from the list was selected) then updating = true
    const updating = Object.entries(existingProfile).length !== 0

    // runFetchTemplate if currently creating a profile
    useEffect(() => {
        fetchTemplate()
    }, [])

    const fetchTemplate = async () => {
        if (!updating) {
            const response = await fetch("http://127.0.0.1:5000/template")
            const data = await response.json()
            setPlayerMapPool(data.template)
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        // Creates local variable with state variables
        const data = {
            playerName,
            playerUser,
            playerRank,
            playerMapPool
        }

        // Creates url variable based on whether user is creating or updating profile
        const url = "http://127.0.0.1:5000/" + (updating ? `update_profile/${existingProfile.id}` : "create_profile")

        // Converts data into JSON format
        const options = {
            method: (updating ? "PATCH" : "POST"),
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        // Runs the specified function (Create/Update)
        const response = await fetch(url, options)

        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json()
            alert(data.message)
        } else {
            // If successful, run onUpdate from App.jsx
            updateCallback()
        }
    }

    // Called whenever agent proficiency is altered to update state variable
    const updateAgentProficiency = (map, agentID, prof_value) => {
        // Create a new mappool object
        const newMapPool = playerMapPool.map(mapPoolEntry => {
            // Keeps all mappool entries the same besides given one 
            if (mapPoolEntry.map !== map) {
                return mapPoolEntry
            } else {
                // Create a new agentpool object
                const newAgentPool = mapPoolEntry.agentPool.map(agentPoolEntry => {
                    // Keeps all agentpool entries the same besides given one 
                    if (agentPoolEntry.agentID !== agentID) {
                        return agentPoolEntry

                    } else {
                        // Return agentpool with updated proficiency
                        return {
                            ...agentPoolEntry,
                            proficiency: prof_value
                        }
                    }
                })
                // Return map pool entry with updated agent pool
                return {
                    ...mapPoolEntry,
                    agentPool: newAgentPool
                }
            }
        })
        setPlayerMapPool(newMapPool)
    }

    // value => the default value that appears in the text box
    // onChange => if the value of text box changes, set the corresponding global variable to that value
    return (
        <form onSubmit={onSubmit} className="profile-form">
            <div className="form-element">
                <label htmlFor="playerName">Player's Name</label>
                <input
                    type="text"
                    id="playerName"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)} />
            </div>
            <div className="form-element">
                <label htmlFor="playerUser">Player's Username</label>
                <input
                    type="text"
                    id="playerUser"
                    value={playerUser}
                    onChange={(e) => setPlayerUser(e.target.value)} />
            </div>
            <div className="form-element">
                <label htmlFor="playerRank">Player's Rank</label>
                <select
                    id="playerRank"
                    value={playerRank}
                    onChange={(e) => setPlayerRank(e.target.value)}
                >
                    <option value="">-- Select Rank --</option>
                    {ranks.map(rank => (
                        <option key={rank} value={rank}>
                            {rank.replace('_', ' ')}
                        </option>
                    ))}
                </select>
            </div>

            <ProficiencyUpdateContext.Provider value={updateAgentProficiency}>
                {<MapPool existingProfileMapPool={playerMapPool} />}
            </ProficiencyUpdateContext.Provider>

            {/* BUTTON: Runs onSubmit when pressed */}
            <button type="submit">{updating ? "Update Profile" : "Add Profile"}</button>
        </form>
    );
};

export default ProfileForm