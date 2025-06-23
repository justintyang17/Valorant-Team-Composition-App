import React from "react"
import AgentPool from './AgentPool'
import AgentPool2 from './AgentPool2'
import Accordion from '@mui/material/Accordion';
import Grid from '@mui/material/Grid';
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";


const MapPool = ({existingProfileMapPool=[]}) => {

    const warningmsg = "WARNING: No Agents Selected for this Map"

    function Message({agentPool}) {
        for (const agent_entry of agentPool) {
            if (agent_entry.proficiency > 0) {
                return null
            }
        }
        return <h5>{warningmsg}</h5>
    } 

    return (
        <div>
             {existingProfileMapPool.map((mapObj, i) => (
                <div key={i}>
                    <Accordion>
                        <AccordionSummary>
                            <Grid>
                                <Grid item spacing={6}>
                                    <h3>Agent Pool for {mapObj.map}</h3>
                                </Grid>
                                <Grid item>
                                    <Message
                                    agentPool = {mapObj.agentPool}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            {/*<AgentPool mapAgentPool={mapObj.agentPool} map = {mapObj.map}/>*/}
                            <AgentPool2 mapAgentPool={mapObj.agentPool} map = {mapObj.map}/>
                        </AccordionDetails>
                    </Accordion>
                    
                    
                </div>
            ))}
        </div>
    ) 
}
export default MapPool