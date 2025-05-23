import { useState, useEffect } from 'react'
import ProfileList from './ProfileList'
import ProfileForm from './ProfileForm'
import './App.css'


function App() {
    const [profiles, setProfiles] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentProfile, setCurrentProfile] = useState([])

    useEffect(() => {
        fetchProfiles()
    }, [])

    const fetchProfiles = async () => {
        const response = await fetch("http://127.0.0.1:5000/profiles")
        const data = await response.json()
        setProfiles(data.profiles)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setCurrentProfile({})
    }

    const openCreateModal =() => {
        if (!isModalOpen) {
            setIsModalOpen(true)
        }
    }

    const openEditModal = (profile) => {
        if (isModalOpen) {
            return
        } else {
            setCurrentProfile(profile)
            setIsModalOpen(true)
        }
    }

    const onUpdate = () => {
        closeModal()
        fetchProfiles()
    }

    return (
        <>
        <ProfileList profiles={profiles} updateProfile = {openEditModal} updateCallback={onUpdate}/>
        <button onClick={openCreateModal}>Create New Profile</button>
        {isModalOpen && <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <ProfileForm existingProfile={currentProfile} updateCallback={onUpdate}/>
                </div>
            </div>
            }
        </>
    );
};

export default App;
