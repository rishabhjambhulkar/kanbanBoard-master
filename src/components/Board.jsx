import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column"; // Assuming you have a Column component
import DropdownComponent from "./Display.jsx"; // Assuming you have a separate dropdown component

export default function Board() {
    const [tickets, setTickets] = useState([]);
    const [groupBy, setGroupBy] = useState("status");
    const [orderBy, setOrderBy] = useState("priority");
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const savedTickets = localStorage.getItem("tickets");
        const savedGroupBy = localStorage.getItem("groupBy");
        const savedOrderBy = localStorage.getItem("orderBy");

        if (savedTickets) {
            setTickets(JSON.parse(savedTickets));
        } else {
            fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
                .then((response) => response.json())
                .then((data) => {
                    const updatedTickets = data.tickets.map(ticket => ({
                        ...ticket,
                        completed: false, // Default value
                    }));
                    setTickets(updatedTickets);
                    localStorage.setItem("tickets", JSON.stringify(updatedTickets));
                })
                .catch((err) => console.error("Error fetching tickets:", err));
        }

        if (savedGroupBy) setGroupBy(savedGroupBy);
        if (savedOrderBy) setOrderBy(savedOrderBy);
    }, []);

    const groupTickets = (tickets, groupBy) => {
        const grouped = {};
        tickets.forEach((ticket) => {
            let groupKey;
            if (groupBy === "status") {
                groupKey = ticket[groupBy] === "In progress" ? "In Progress" : ticket[groupBy] || "Unassigned";
            } else if (groupBy === "priority") {
                groupKey = ticket.priority === 0 ? 0 : ticket.priority;
            } else if (groupBy === "userId") {
                groupKey = ticket[groupBy] || "Unassigned";
            }
            if (!grouped[groupKey]) grouped[groupKey] = [];
            grouped[groupKey].push(ticket);
        });
        return grouped;
    };

    const sortTickets = (tickets) => {
        return tickets.sort((a, b) => {
            if (orderBy === "priority") {
                return b.priority - a.priority;
            } else if (orderBy === "title") {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });
    };

    const toggleCompleted = (ticketId) => {
        const updatedTickets = tickets.map(ticket => {
            if (ticket.id === ticketId) {
                const updatedTicket = { ...ticket, completed: !ticket.completed };
                if (updatedTicket.completed) {
                    updatedTicket.status = "Done";
                }
                return updatedTicket;
            }
            return ticket;
        });

        setTickets(updatedTickets);
        localStorage.setItem("tickets", JSON.stringify(updatedTickets));
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const groupedTickets = groupTickets(tickets, groupBy);
        if (!groupedTickets[destination.droppableId]) {
            groupedTickets[destination.droppableId] = [];
        }

        const sourceGroup = groupedTickets[source.droppableId] || [];
        const destinationGroup = groupedTickets[destination.droppableId];
        const [movedTicket] = sourceGroup.splice(source.index, 1);

        if (groupBy === "priority") {
            movedTicket.priority = destination.droppableId === "No priority" ? 0 : Number(destination.droppableId);
        }

        if (groupBy === "status") {
            movedTicket.status = destination.droppableId;
        }

        if (groupBy === "userId") {
            movedTicket.userId = destination.droppableId === "Unassigned" ? null : destination.droppableId;
        }

        destinationGroup.splice(destination.index, 0, movedTicket);
        const updatedTickets = Object.keys(groupedTickets).flatMap(groupKey => groupedTickets[groupKey]);
        setTickets(updatedTickets);
        localStorage.setItem("tickets", JSON.stringify(updatedTickets));
    };

    const groupedTickets = groupTickets(tickets, groupBy);

    const priorityTitles = {
        4: "Urgent",
        3: "High",
        2: "Medium",
        1: "Low",
        0: "No priority",
    };

    // Toggle dropdown visibility
    const handleToggleDropdown = () => {
        console.log("Toggle dropdown visibility", showDropdown);
        setShowDropdown(!showDropdown);
    };

    return (
        <div>
            {/* Navbar Section */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px", backgroundColor: "#f8f9fa", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
                {/* Button to toggle dropdown visibility */}
                <button
                    onClick={handleToggleDropdown}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "white",
                        color: "#888",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "bold",
                    }}
                >
                    Display
                </button>

                {/* Dropdown Component */}
                <DropdownComponent
                    groupBy={groupBy}
                    setGroupBy={setGroupBy}
                    orderBy={orderBy}
                    setOrderBy={setOrderBy}
                    showDropdown={showDropdown}
                />
            </div>

            {/* Main Content Section */}
            <div
                    style={{
                        backgroundColor: "lightblue",
                        paddingLeft: "50px",
                        height: "100vh", // Full viewport height
                        display: "flex",
                        flexDirection: "column", // Ensure proper stacking of children
                        overflowY: "auto", // Handle overflow
                    }}
                >
                <DragDropContext onDragEnd={onDragEnd}>
                  
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {groupBy === "status" &&
                            ["Todo", "In Progress", "Backlog", "Done", "Canceled"].map((status) => (
                                <Column
                                    key={status}
                                    title={status}
                                    tasks={sortTickets(groupedTickets[status] || [])}
                                    id={status}
                                    groupBy={groupBy}
                                />
                            ))}

                        {groupBy === "priority" &&
                            [4, 3, 2, 1, 0].map((priorityLevel) => (
                                <Column
                                priorityLevel={priorityLevel}
                                    title={priorityTitles[priorityLevel]}
                                    tasks={sortTickets(groupedTickets[priorityLevel] || [])}
                                    id={String(priorityLevel)}
                                    onToggleCompleted={toggleCompleted}
                                    groupBy={groupBy}
                                />
                            ))}

                        {groupBy === "userId" &&
                            Object.keys(groupedTickets).map((userId) => (
                                <Column
                                    key={userId}
                                    title={userId === "Unassigned" ? "Unassigned" : userId}
                                    tasks={sortTickets(groupedTickets[userId] || [])}
                                    id={userId}
                                    onToggleCompleted={toggleCompleted}
                                    groupBy={groupBy}
                                />
                            ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
}
