import { DndContext, closestCorners } from '@dnd-kit/core'
import { useState, useEffect, useContext } from "react"
import { ProficiencyUpdateContext } from "./ProficiencyUpdateContext"

import AgentContainer from './AgentContainer'
import AgentDraggable from './AgentDraggable'

const AgentPool2 = ({ mapAgentPool, map }) => {
    // Represents containers and their items
    const [items, setItems] = useState({
        prof_2: [],
        prof_1: [],
        prof_0: []
    })

    const updateAgentProficiency = useContext(ProficiencyUpdateContext)

    // At start of rendering, use mapAgentPool to fill up containers
    useEffect(() => {
        fillContainers()
    }, [])

    //Adds in agent IDs to containers based on proficiency
    const fillContainers = () => {
        const tempItems = {
            prof_2: [],
            prof_1: [],
            prof_0: []
        };
        for (const agent of mapAgentPool) {
            switch (agent.proficiency) {
                case 2:
                    tempItems.prof_2.push(agent.agentID);
                    break
                case 1:
                    tempItems.prof_1.push(agent.agentID);
                    break
                default:
                    tempItems.prof_0.push(agent.agentID);
                    break
            }
        }
        setItems(tempItems)
    }

    function findContainer(id) {
        if (id in items) {
            return id
        } else {
            return Object.keys(items).find((key) => items[key].includes(id))
        }
    }

    function handleDragStart(event) {
        const { active } = event
    }

    function handleDragOver(event) {
        const { active, over } = event;
        if (!over) return;

        // Active = Original Container
        // Over = New Container
        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (!activeContainer || !overContainer || activeContainer === overContainer) return;

        // Removes item from Original Container and Adds it to New Container
        // prev = Original set of containers + their items
        setItems((prev) => {
            const activeItems = prev[activeContainer].filter((item) => item !== active.id);
            const overItems = [...prev[overContainer], active.id];

            return {
                ...prev,
                [activeContainer]: activeItems,
                [overContainer]: overItems
            }
        })

        // Update proficiency based on New Container
        switch (overContainer) {
            case ("prof_2"):
                updateAgentProficiency(map, active.id, 2)
                break
            case ("prof_1"):
                updateAgentProficiency(map, active.id, 1)
                break
            default:
                updateAgentProficiency(map, active.id, 0)
                break
        }
    }

    return (
        <div>
            <DndContext
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}>

                <h4>Proficiency: High</h4>
                <AgentContainer id="prof_2" items={items.prof_2} />
                <h4>Proficiency: Low</h4>
                <AgentContainer id="prof_1" items={items.prof_1} />
                <h4>Proficiency: None</h4>
                <AgentContainer id="prof_0" items={items.prof_0} />
                
            </DndContext>
        </div>
    )
}

export default AgentPool2