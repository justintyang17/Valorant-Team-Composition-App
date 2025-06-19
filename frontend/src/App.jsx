import { useState, useEffect } from 'react'
import ProfileList from './ProfileList'
import ProfileForm from './ProfileForm'
import SortForm from './Temporary_Components/SortForm'
import './App.css'
import { AgentListContext } from './Temporary_Components/AgentListContext'

// App component
function App() {
    // "Global Variables"
    // 1) profiles = all profiles in db
    // 2) isModalOpen = if ProfileForm is open
    // 3) currentProfile = profile that is being created/updated

    const [profiles, setProfiles] = useState([])
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const [isSortModalOpen, setIsSortModalOpen] = useState(false)
    const [currentProfile, setCurrentProfile] = useState([])

    const [agents, setAgents] = useState([])

    // fetchProfiles ran ONCE when component (aka page) is opened or when explicitly called
    useEffect(() => {
        fetchProfiles()
        fetchAgents()
    }, [])

    // retrive player profiles from database
    const fetchProfiles = async () => {
        const response = await fetch("http://127.0.0.1:5000/profiles")
        const data = await response.json()
        setProfiles(data.profiles)
    }

    // retrive agents from database
    const fetchAgents = async () => {
        const response = await fetch("http://127.0.0.1:5000/agents")
        const data = await response.json()
        setAgents(data.agents)
    }


    // sets isModalOpen = False and clears currentProfile
    const closeProfileModal = () => {
        setIsProfileModalOpen(false)
        setCurrentProfile({})
    }

    // sets isModalOpen = False and clears currentProfile
    const closeSortModal = () => {
        setIsSortModalOpen(false)
    }

    // Create Profile: sets isModalOpen = True if it isn't already open
    const openCreateModal =() => {
        if (!isProfileModalOpen) {
            setIsProfileModalOpen(true)
        }
    }

    const openSortModal= () => {
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
    const onUpdate = () => {
        closeProfileModal()
        fetchProfiles()
    }

    // Update Profile: closes Modal and refreshes Profile List
    const onSort = () => {
        closeSortModal()
    }

    return (
        <>
        {/* Displays the ProfileList */}
        <ProfileList profiles={profiles} updateProfile = {openEditModal} updateCallback={onUpdate}/>

        {/* BUTTON: Calls openSortModal when pressed */}
        <button onClick={openSortModal}>Sort by</button>
        {/* BUTTON: Calls openCreateModal when pressed */}
        <button onClick={openCreateModal}>Create New Profile</button>
        

        {/* If creating/updating a profile, display the modal (aka pop-up) */}
        {isProfileModalOpen && <div className="modal">
            <div className="modal-content">

                {/* BUTTON: Calls closeProfileModal when pressed */}
                <span className="close" onClick={closeProfileModal}>&times;</span>

                {/* Displays the ProfileForm */}
                <AgentListContext.Provider value = {agents}>
                    <ProfileForm existingProfile={currentProfile} updateCallback={onUpdate}/>
                </AgentListContext.Provider>      
                
                </div>
            </div>
            }
        
        {/* If sorting list, display the modal (aka pop-up) */}
        {isSortModalOpen && <div className="modal">
            <div className="modal-content">

                {/* BUTTON: Calls closeSortModal when pressed */}
                <span className="close" onClick={closeSortModal}>&times;</span>

                {/* Displays the SortForm */}
                <AgentListContext.Provider value = {agents}>
                    <SortForm profileList = {profiles} setProfileList = {setProfiles} sortCallback={onSort}/>  
                </AgentListContext.Provider>   
                
                </div>
            </div>
            }
        </>
    );
};

export default App;
