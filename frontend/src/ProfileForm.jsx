import { useState } from "react"

import MapPool from './Temporary_Components/MapPool'

const ProfileForm = ({existingProfile ={}, updateCallback, agents = []}) => {
    // "Global Variables"
    // 1) playerName = curr profile's name
    // 2) playerUser = curr profile's username
    // 3) playerRank = curr profile's rank

    const [playerName, setPlayerName] = useState(existingProfile.playerName || "")
    const [playerUser, setPlayerUser] = useState(existingProfile.playerUser || "")
    const [playerRank, setPlayerRank] = useState(existingProfile.playerRank || "")

    // For Rank Selection
    const ranks = [
        "IRON_1",
        "IRON_2",
        "IRON_3",
        "BRONZE_1",
        "BRONZE_2",
        "BRONZE_3"
      ];

    // Variable used to determine whether or not modal is being used to create new profile or update existing profile;
    // if curr profile exists (aka a profile from the list was selected) then updating = true
    const updating = Object.entries(existingProfile).length !== 0


    const onSubmit = async (e) => {
        e.preventDefault()

        // Creates local variable with inputted information
        const data = {
            playerName,
            playerUser,
            playerRank,
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

    // value => the default value that appears in the text box
    // onChange => if the value of text box changes, set the corresponding global variable to that value
    return (
    <form onSubmit = {onSubmit}>
        <div>
            <label htmlFor="playerName">Player's Name</label>
            <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}/>
        </div>
        <div>
            <label htmlFor="playerUser">Player's Username</label>
            <input
                type="text"
                id="playerUser"
                value={playerUser}
                onChange={(e) => setPlayerUser(e.target.value)}/>
        </div>
        <div>
            <label htmlFor="playerRank">Player's Rank</label>
            <select
                id="playerRank"
                value={playerRank}
                onChange={(e) => setPlayerRank(e.target.value)}
            >
                <option value="">-- Select Rank --</option>
                {ranks.map(rank => (
                    <option key={rank} value ={rank}>
                        {rank.replace('_', ' ')}
                    </option>
                ))}
            </select>
        </div>
        {updating && <MapPool existingProfileMapPool={existingProfile.playerMapPool} agentList = {agents}/>}
        {/* BUTTON: Runs onSubmit when pressed */}
        <button type="submit">{updating ? "Update Profile" : "Add Profile"}</button>
    </form>
    );
};

export default ProfileForm