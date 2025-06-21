import React from "react"
import TeamCheckBox from "./Temporary_Components/TeamCheckBox"

const ProfileList = ({profiles, updateProfile, updateCallback, teamCallback}) => {

    const onDelete = async (id) => {
        // Try to delete the profile based on the ID
        try {
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://127.0.0.1:5000/delete_profile/${id}`, options)
            // If deletion successful, run onUpdate from App.jsx (aka close modal + refresh list)
            if (response.status === 200) {
                updateCallback()
            } else {
                console.error("Failed to Delete")
            }
        } catch (error) {
            alert(error)
        }
    }

    return <div>
        <table>
            {/* Header Information */}
            <thead></thead>
                <tr>    
                    <th>Player Name</th>
                    <th>Player User</th>
                    <th>Player Rank</th>
                    <th>Actions</th>
                    <th>Add to Team</th>
                </tr>
            <tbody>
                {/* For each Profile in given list, displays information + buttons */}
                {profiles.map((profile) => (
                    <tr key= {profile.id}>
                        <td>{profile.playerName}</td>
                        <td>{profile.playerUser}</td>
                        <td>{profile.playerRank.replace("_", " ")}</td>
                        <td>
                            {/* BUTTON: Calls openEditModal from App.jsx (aka opens the edit modal for given player) */}
                            <button onClick={() => updateProfile(profile)}>Edit</button>
                            {/* BUTTON: Calls onDelete when pressed */}
                            <button onClick={() => onDelete(profile.id)}>Delete</button>
                        </td>
                        <td>
                            <TeamCheckBox profile={profile} teamCallback={teamCallback}/>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}
export default ProfileList