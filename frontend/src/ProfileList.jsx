import React from "react"

const ProfileList = ({profiles}) => {
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
                            <button>Update Profile</button>
                            <button>Delete Profile</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}
export default ProfileList