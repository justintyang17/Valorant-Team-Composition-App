import React from "react"
import AgentPool from './AgentPool'
import AgentPool2 from './AgentPool2'
import Accordion from '@mui/material/Accordion';
import Box from '@mui/material/Box'
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";


const MapPool = ({ existingProfileMapPool = [] }) => {

    const warningmsg = "WARNING: No Agents Selected for this Map"

    function Message({ agentPool }) {
        for (const agent_entry of agentPool) {
            if (agent_entry.proficiency > 0) {
                return null
            }
        }
        return <h5>{warningmsg}</h5>
    }

    const getMapImg = (mapString) => {
        return "../images/maps/" + mapString.toLowerCase() + ".webp"
    }

    return (
        <div>
            {existingProfileMapPool.map((mapObj, i) => (
                <div key={i}> 
                    <Accordion sx={{ bgcolor: 'rgb(32, 35, 39)', color: 'white', mb: 2, border: "#555", borderRadius: '8px' }}>
                        <AccordionSummary sx={{ bgcolor: 'rgb(32, 35, 39)', color: 'white'}}>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                width="100%"
                            >
                                <Box display="flex" alignItems="center" gap={2}>
                                        <h3>Agent Pool for {mapObj.map}</h3>
                                    <Message agentPool={mapObj.agentPool} />
                                </Box>

                                <img
                                    src={getMapImg(mapObj.map)}
                                    width="200"
                                    height="100"
                                    alt={`${mapObj.map} map`}
                                />
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ bgcolor: 'rgb(53, 57, 62)', color: 'white'}}>
                            <AgentPool2 mapAgentPool={mapObj.agentPool} map={mapObj.map} />
                            {/*<AgentPool mapAgentPool={mapObj.agentPool} map = {mapObj.map}/>*/}
                        </AccordionDetails>
                    </Accordion>


                </div>
            ))}
        </div>
    )
}
export default MapPool