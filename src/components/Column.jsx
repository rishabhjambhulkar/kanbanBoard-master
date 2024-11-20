import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Card from "./Card"; // Import your Card component

export default function Column({  title, groupBy, tasks, id, onToggleCompleted }) {
console.log("user", typeof(id), groupBy, tasks, title)

    // Function to render an icon based on the status
    const renderStatusIcon = (status) => {
        switch (status) {
            case 'Todo':
                return <img src="/To-do.svg" alt="Todo" style={{ width: '24px', height: '24px', marginRight: '5px' }} />;
            case 'In Progress':
                return <img src="/in-progress.svg" alt="In Progress" style={{ width: '24px', height: '24px', marginRight: '5px' }} />;
            case 'Backlog':
                return <img src="/backlog.svg" alt="Backlog" style={{ width: '24px', height: '24px', marginRight: '5px' }} />;
            case 'Done':
                return <img src="/Done.svg" alt="Done" style={{ width: '24px', height: '24px', marginRight: '5px' }} />;
            case 'Canceled':
                return <img src="/Cancelled.svg" alt="Canceled" style={{ width: '24px', height: '24px', marginRight: '5px' }} />;
            default:
                return null;
        }
    };

  
    const renderPriorityIcon = (id) => {

        console.log("group: ",  id)
        switch (id) {
            
            case '0':
                return <img src="/No-priority.svg" alt="Priority 0" style={{ width: '24px', height: '24px', marginRight: '5px' }} />;
            case '1':
                return <img src="/Img - Low Priority.svg" alt="Priority 1" style={{ width: '24px', height: '24px', marginRight: '5px' }} />;
            case '2':
                return <img src="/Img - Medium Priority.svg" alt="Priority 2" style={{ width: '24px', height: '24px', marginRight: '5px' }} />;
            case '3':
                return <img src="/Img - High Priority.svg" alt="Priority 3" style={{ width: '24px', height: '24px', marginRight: '5px' }} />;
            case '4':
                return <img src="/SVG - Urgent Priority colour.svg" alt="Priority 4" style={{ width: '24px', height: '24px', marginRight: '5px' }} />;
            default:
                return null;
        }
    };

 
    

    return (
        <div style={{ width: "300px", margin: "0 10px" }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              
                {groupBy === 'status' && renderStatusIcon(title)}
                {groupBy === 'priority' && renderPriorityIcon(id)} 
                
            
                <h3>{title}</h3>
                {tasks && tasks.length > 0 && (
                    <span style={{ color: 'grey', marginLeft: '15px', fontWeight:"bold" }}>
                        {tasks.length} 
                    </span>
                )}
                
           
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    <img src="/add.svg" alt="Common Icon 1" style={{ width: '24px', height: '24px', marginLeft: '10px' }} />
                    <img src="/3 dot menu.svg" alt="Common Icon 2" style={{ width: '24px', height: '24px', marginLeft: '10px' }} />
                </div>

                
                </div>




            <Droppable droppableId={id}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {tasks.map((task, index) => (
                            <Card
                                key={task.id}
                                task={task}
                                index={index}
                                onToggleCompleted={onToggleCompleted}
                                groupBy={groupBy}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
