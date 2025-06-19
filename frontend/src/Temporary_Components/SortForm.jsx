import Grid from '@mui/material/Grid';
import { useState, useContext } from 'react'
import { AgentListContext } from './AgentListContext';

const SortForm = ({profileList, setProfileList, sortCallback}) => {
    const [isAgentModalOpen, setIsAgentModalOpen] = useState(false)

    const agentList = useContext(AgentListContext)

    const rankOrder = {
        UNRANKED: 0,
        IRON_1: 1,
        IRON_2: 2,
        IRON_3: 3,
        BRONZE_1: 4,
        BRONZE_2: 5,
        BRONZE_3: 6,
    };

    const sortByName = (ascending) => {
        const sortedprofiles = profileList.toSorted((a, b) => {
            const nameA = a.playerName.toUpperCase()
            const nameB = b.playerName.toUpperCase()
            return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        })
        finishSort(sortedprofiles)
    }

    const sortByUsername = (ascending) => {
        const sortedprofiles = profileList.toSorted((a, b) => {
            const usernameA = a.playerUser.toUpperCase()
            const usernameB = b.playerUser.toUpperCase()
            return ascending ? usernameA.localeCompare(usernameB) : usernameB.localeCompare(usernameA);
        })
        finishSort(sortedprofiles)
    }

    const sortByRank = (ascending) => {
        const sortedprofiles = profileList.toSorted((a, b) => {
            return ascending ? rankOrder[a.playerRank] - rankOrder[b.playerRank] : rankOrder[b.playerRank] - rankOrder[a.playerRank]} )
        finishSort(sortedprofiles)
    }

    const openAgentModal = () => {
        setIsAgentModalOpen(true)
    }
    
    const sortByAgentProficiency = (agentID) => {
        const sortedprofiles = profileList.toSorted((a, b) => {
            const agentProfA = getAgentProficiency(a, agentID)
            const agentProfB = getAgentProficiency(b, agentID)
            return agentProfB - agentProfA
        })
        finishSort(sortedprofiles)
        setIsAgentModalOpen(false)
    }

    const getAgentProficiency = (profile, ID) => {
        let total = 0
        for (const map_pool_entry of  profile.playerMapPool) {
            for (const agent_entry of  map_pool_entry.agentPool)
                if (agent_entry.agentID == ID) {
                    total = total + agent_entry.proficiency
                }
        }
        return total
    }

    const finishSort = (sortedProfiles) => {
        setProfileList(sortedProfiles)
        sortCallback()
    }

    return (
        <>
            {!isAgentModalOpen ? (
                <div>
                    <h3>Sort By:</h3>
                    <Grid container spacing={1}>
                        <button onClick={() => sortByName(true)}>Name Ascending</button>
                        <button onClick={() => sortByName(false)}>Name Descending</button>
                        <button onClick={() => sortByUsername(true)}>Username Ascending</button>
                        <button onClick={() => sortByUsername(false)}>Username Descending</button>
                        <button onClick={() => sortByRank(true)}>Rank Ascending</button>
                        <button onClick={() => sortByRank(false)}>Rank Descending</button>
                        <button onClick={openAgentModal}>Agent Proficiency</button>
                    </Grid>
                </div>
            ) : (
                <div>
                    {agentList.map((agent, i) => (
                        <button key = {i} onClick={() => sortByAgentProficiency(agent.agentID)}>
                            {agent.agentName}
                        </button>
                    ))}
                </div>
            )}
        </>
        

    )
}

export default SortForm