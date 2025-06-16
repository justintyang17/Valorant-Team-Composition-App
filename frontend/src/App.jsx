import { useState, useEffect } from 'react'
import ProfileList from './ProfileList'
import ProfileForm from './ProfileForm'
import './App.css'
import { AgentListContext } from './Temporary_Components/AgentListContext'

// App component
function App() {
    // "Global Variables"
    // 1) profiles = all profiles in db
    // 2) isModalOpen = if ProfileForm is open
    // 3) currentProfile = profile that is being created/updated

    const [profiles, setProfiles] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentProfile, setCurrentProfile] = useState([])

    const [agents, setAgents] = useState([])

    // fetchProfiles ran ONCE when component (aka page) is opened or when explicitly called
    useEffect(() => {
        fetchProfiles()
        fetchAgents()
    }, [])

    // 
    const fetchProfiles = async () => {
        const response = await fetch("http://127.0.0.1:5000/profiles")
        const data = await response.json()
        setProfiles(data.profiles)
    }

    const fetchAgents = async () => {
        const response = await fetch("http://127.0.0.1:5000/agents")
        const data = await response.json()
        setAgents(data.agents)
    }


    // sets isModalOpen = False and clears currentProfile
    const closeModal = () => {
        setIsModalOpen(false)
        setCurrentProfile({})
    }

    // Create Profile: sets isModalOpen = True if it isn't already open
    const openCreateModal =() => {
        if (!isModalOpen) {
            setIsModalOpen(true)
        }
    }

    // Update Profile: sets isModalOpen = False and sets currentProfile = given profile if it isn't open
    const openEditModal = (profile) => {
        if (isModalOpen) {
            return
        } else {
            setCurrentProfile(profile)
            setIsModalOpen(true)
        }
    }

    // Update Profile: closes Modal and refreshes Profile List
    const onUpdate = () => {
        closeModal()
        fetchProfiles()
    }

    return (
        <>
        {/* Displays the ProfileList */}
        <ProfileList profiles={profiles} updateProfile = {openEditModal} updateCallback={onUpdate}/>
        {/* BUTTON: Calls openCreateModal when pressed */}
        <button onClick={openCreateModal}>Create New Profile</button>
        {/* If creating/updating a profile, display the modal (aka pop-up) */}
        {isModalOpen && <div className="modal">
            <div className="modal-content">
                {/* BUTTON: Calls closeModal when pressed */}
                <span className="close" onClick={closeModal}>&times;</span>
                {/* Displays the ProfileForm */}
                <AgentListContext.Provider value = {agents}>
                    <ProfileForm existingProfile={currentProfile} updateCallback={onUpdate}/>
                </AgentListContext.Provider>      
                </div>
            </div>
            }
        </>
    );
};

export default App;
