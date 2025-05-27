import React from "react"

const ProfileList = ({profiles, updateProfile, updateCallback}) => {
    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            }
            const response = await fetch(`http://127.0.0.1:5173/delete_profile/${id}`, options)
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
        <h2> Profiles</h2>
        <table>
            <thead></thead>
                <tr>    
                    <th>Player Name</th>
                    <th>Player User</th>
                    <th>Player Rank</th>
                    <th>Actions</th>
                </tr>
            <tbody>
                {profiles.map((profile) => (
                    <tr key= {profile.id}>
                        <td>{profile.playerName}</td>
                        <td>{profile.playerUser}</td>
                        <td>{profile.playerRank}</td>
                        <td>
                            <button onClick={() => updateProfile(profile)}>Edit</button>
                            <button onClick={() => onDelete(profile.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}
export default ProfileList