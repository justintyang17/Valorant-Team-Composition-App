import { useState, useEffect } from 'react'
import ProfileList from './ProfileList'
import ProfileForm from './ProfileForm'
import './App.css'


function App() {
    const [profiles, setProfiles] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)

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
    }

    const openCreateModal =() => {
        if (!isModalOpen) {
            setIsModalOpen(true)
        }
    }

    return (
        <>
        <ProfileList profiles={profiles} />
        <button onClick={openCreateModal}>Create New Profile</button>
        {isModalOpen && <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <ProfileForm />
                </div>
            </div>
            }
        </>
    );
};

export default App;
