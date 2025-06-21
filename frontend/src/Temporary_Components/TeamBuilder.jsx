const TeamBuilder = ({teamList=[]}) => {
    function WarningMessage() {
        const length = teamList.length
        if (length < 5) 
            return <h5>Not Enough Players</h5>
        else if (length > 5)
            return <h5>Too Many Players</h5>
        else 
            return null
    }

    return <div>
        <h3>Current Team</h3>
        <ul horizontal>
            {teamList.map((player) => (
                <li key={player.id}>{player.playerName}</li>
            ))}
        </ul>
        <WarningMessage/>
        <button disabled={teamList.length != 5} onClick={() => buildTeam()}>Build Team</button>

    </div>
}


export default TeamBuilder