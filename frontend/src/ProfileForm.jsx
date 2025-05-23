import { useState } from "react"

const ProfileForm = ({existingProfile ={}, updateCallback}) => {
    const [playerName, setPlayerName] = useState(existingProfile.playerName || "")
    const [playerUser, setPlayerUser] = useState(existingProfile.playerUser || "")
    const [playerRank, setPlayerRank] = useState(existingProfile.playerRank || "")

    const updating = Object.entries(existingProfile).length !== 0


    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            playerName,
            playerUser,
            playerRank
        }
        const url = "http://127.0.0.1:5000/" + (updating ? `update_profile/${existingProfile.id}` : "create_profile")
        const options = {
            method: (updating ? "PATCH" : "POST"),
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options)
        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json()
            alert(data.message)
        } else {
            updateCallback()
        }
    }

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
            <input
                type="text"
                id="playerRank"
                value={playerRank}
                onChange={(e) => setPlayerRank(e.target.value)}/>
        </div>
        <button type="submit">{updating ? "Update Profile" : "Add Profile"}</button>
    </form>
    );
};

export default ProfileForm