import { useState, useEffect } from 'react'
import ProfileList from './ProfileList'
import ProfileForm from './ProfileForm'
import './App.css'
import { AgentListContext } from './Temporary_Components/AgentListContext'
import { TraitListContext } from './Temporary_Components/TraitListContext'
import TeamBuilder from './Temporary_Components/TeamBuilder'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'

// App component
function App() {

    const [profiles, setProfiles] = useState([])
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const [isSortModalOpen, setIsSortModalOpen] = useState(false)
    const [currentProfile, setCurrentProfile] = useState([])

    const [sortField, setSortField] = useState("none")
    const [sortBy, setSortBy] = useState("none")

    const [team, setTeam] = useState([])

    const [agents, setAgents] = useState([])
    const [traits, setTraits] = useState([])

    // fetchProfiles ran ONCE when component (aka page) is opened or when explicitly called
    useEffect(() => {
        fetchProfiles()
        fetchAgents()
        fetchTraits()
    }, [])

    // retrive player profiles from database
    const fetchProfiles = async () => {
        const response = await fetch("http://127.0.0.1:5000/profiles")
        const data = await response.json()
        setProfiles(data.profiles)
        return data.profiles
    }

    // retrive agents from database
    const fetchAgents = async () => {
        const response = await fetch("http://127.0.0.1:5000/agents")
        const data = await response.json()
        setAgents(data.agents)
    }

    // retrive traits from database
    const fetchTraits = async () => {
        const response = await fetch("http://127.0.0.1:5000/traits")
        const data = await response.json()
        setTraits(data.traits)
    }

    // sets isProfileModalOpen = False and clears currentProfile
    const closeProfileModal = () => {
        setIsProfileModalOpen(false)
        setCurrentProfile({})
    }

    // sets isSortModalOpen = False and clears currentProfile
    const closeSortModal = () => {
        setIsSortModalOpen(false)
    }

    // Create Profile: sets isProfileModalOpen = True if it isn't already open
    const openCreateModal = () => {
        if (!isProfileModalOpen) {
            setIsProfileModalOpen(true)
        }
    }

    // sets isSortModalOpen = True if it isn't already open
    const openSortModal = () => {
        if (!isSortModalOpen) {
            setIsSortModalOpen(true)
        }
    }

    // Update Profile: sets isModalOpen = False and sets currentProfile = given profile if it isn't open
    const openEditModal = (profile) => {
        if (isProfileModalOpen) {
            return
        } else {
            setCurrentProfile(profile)
            setIsProfileModalOpen(true)
        }
    }

    // Update Profile: closes Modal and refreshes Profile List
    const onUpdate = async () => {
        closeProfileModal()
        const updatedProfiles = await fetchProfiles()
        const updatedProfile = updatedProfiles.find(p => p.id === currentProfile.id)
        updateTeam(updatedProfile)
    }

    //#region: SORTING
    // Update Profile: closes Modal and refreshes Profile List
    const onSort = () => {
        closeSortModal()
    }

    // sets sort field state
    const handleSortField = (field) => {
        setSortField(field)
    }

    // sets sort by state
    const handleSortBy = (by) => {
        setSortBy(by)
    }

    // whenever sortField or sortBy is changed, run sort function
    useEffect(() => {
        if (sortField !== "none" && sortBy !== "none") {
            handleSort(sortField, sortBy);
        }
    }, [sortField, sortBy]);

    // sort function
    const handleSort = (sortField, sortBy) => {
        const ascending = (sortBy == "ascending")
        switch (sortField) {
            case "name":
                sortByName(ascending)
                break
            case "username":
                sortByUsername(ascending)
                break
            case "rank":
                sortByRank(ascending)
                break
            case "agentProf":
                openSortModal()
            default:
                break
        }
    }

    // sort by name function 
    const sortByName = (ascending) => {
        const sortedprofiles = profiles.toSorted((a, b) => {
            const nameA = a.playerName.toUpperCase()
            const nameB = b.playerName.toUpperCase()
            return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        })
        setProfiles(sortedprofiles)
        onSort()
    }

    // sort by username function 
    const sortByUsername = (ascending) => {
        const sortedprofiles = profiles.toSorted((a, b) => {
            const usernameA = a.playerUser.toUpperCase()
            const usernameB = b.playerUser.toUpperCase()
            return ascending ? usernameA.localeCompare(usernameB) : usernameB.localeCompare(usernameA);
        })
        setProfiles(sortedprofiles)
    }

    const rankOrder = {
        UNRANKED: 0,
        IRON_1: 1,
        IRON_2: 2,
        IRON_3: 3,
        BRONZE_1: 4,
        BRONZE_2: 5,
        BRONZE_3: 6,
        SILVER_1: 7,
        SILVER_2: 8,
        SILVER_3: 9,
        GOLD_1: 10,
        GOLD_2: 11,
        GOLD_3: 12,
        PLATINUM_1: 13,
        PLATINUM_2: 14,
        PLATINUM_3: 15,
        DIAMOND_1: 16,
        DIAMOND_2: 17,
        DIAMOND_3: 18,
        ASCENDANT_1: 19,
        ASCENDANT_2: 20,
        ASCENDANT_3: 21,
        IMMORTAL_1: 22,
        IMMORTAL_2: 23,
        IMMORTAL_3: 24,
        RADIANT: 25
    }

    // sort by rank function 
    const sortByRank = (ascending) => {
        const sortedprofiles = profiles.toSorted((a, b) => {
            return ascending ? rankOrder[a.playerRank] - rankOrder[b.playerRank] : rankOrder[b.playerRank] - rankOrder[a.playerRank]
        })
        setProfiles(sortedprofiles)
    }

    // sort by agent proficiency function 
    const sortByAgentProficiency = (agentID) => {
        const ascending = (sortBy == "ascending")
        const sortedprofiles = profiles.toSorted((a, b) => {
            const agentProfA = getAgentProficiency(a, agentID)
            const agentProfB = getAgentProficiency(b, agentID)
            return ascending ? agentProfB - agentProfA : agentProfA - agentProfB
        })
        setProfiles(sortedprofiles)
        setIsSortModalOpen(false)
    }

    // gets sum of proficiencies over all maps for given player
    const getAgentProficiency = (profile, ID) => {
        let total = 0
        for (const map_pool_entry of profile.playerMapPool) {
            for (const agent_entry of map_pool_entry.agentPool)
                if (agent_entry.agentID == ID) {
                    total = total + agent_entry.proficiency
                }
        }
        return total
    }

    //#endregion

    //#region: TEAMBUIDLER

    // adds/removes player from current team
    const editTeam = (profile, onTeam) => {
        let newTeam = []
        if (onTeam) {
            if (!team.find(p => p.id === profile.id)) {
                newTeam = [...team, profile]
            }
        } else {
            newTeam = team.filter(p => p.id !== profile.id)
        }
        setTeam(newTeam)
    }

    // refreshes team information whenever profile edited
    const updateTeam = (profile) => {
        const tempTeam = [...team]
        const index = tempTeam.findIndex(p => p.id === profile.id)
        if (index !== -1) {
            tempTeam[index] = profile
            setTeam(tempTeam)
        }
    }
    //#endregion

    return (
        <>
            <h1> Valorant Composition Builder </h1>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'stretch' }}>
                {/* Displays the ProfileList */}
                <div>
                    <h2> Profiles</h2>
                    <ProfileList profiles={profiles} updateProfile={openEditModal} updateCallback={onUpdate} teamCallback={editTeam} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1% 0'}}>
                        <div>
                            <label>Sort Field:</label>
                            <select
                                id="sortField"
                                onChange={(e) => handleSortField(e.target.value)}>
                                <option value="none">None</option>
                                <option value="name">Name</option>
                                <option value="username">Username</option>
                                <option value="rank">Rank</option>
                                <option value="agentProf">Agent Proficiency</option>
                            </select>
                            <label>Sort By:</label>
                            <select
                                id="sortBy"
                                onChange={(e) => handleSortBy(e.target.value)}>
                                <option value="none">None</option>
                                <option value="ascending">Ascending</option>
                                <option value="descending">Descending</option>
                            </select>
                        </div>
                        {/* BUTTON: Calls openCreateModal when pressed */}
                        <button onClick={openCreateModal}>Create New Profile</button>
                    </div>

                </div>
                <div>
                    <h2> Current Team </h2>
                    {/* Displays the TeamBuilder */}
                    <AgentListContext.Provider value={agents}>
                        <TraitListContext.Provider value={traits}>
                            <TeamBuilder teamList={team} />
                        </TraitListContext.Provider>
                    </AgentListContext.Provider>
                </div>

            </div>

            {/* If creating/updating a profile, display the modal (aka pop-up) */}
            {isProfileModalOpen && <div className="modal">
                <div className="modal-content">

                    {/* BUTTON: Calls closeProfileModal when pressed */}
                    <span className="close" onClick={closeProfileModal}>&times;</span>

                    {/* Displays the ProfileForm */}
                    <AgentListContext.Provider value={agents}>

                        <ProfileForm existingProfile={currentProfile} updateCallback={onUpdate} />

                    </AgentListContext.Provider>
                </div>
            </div>
            }

            {isSortModalOpen &&
                <div className="modal">
                    <div className="modal-content">
                        {agents.map((agent, i) => (
                            <button key={i} onClick={() => sortByAgentProficiency(agent.agentID)}>
                                <img src={agent.agentImg} width="75" height="75" />
                            </button>
                        ))}
                    </div>
                </div>
            }
        </>
    );
};

export default App;
