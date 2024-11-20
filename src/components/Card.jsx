import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { Avatar } from "antd";

// Styled Components
const Container = styled.div`
    border-radius: 5px;
    box-shadow: 2px 2px 2px  lightgrey;
    padding: 8px;
    color: #000;
    margin-bottom: 8px;
    min-height: 130px;
    margin-right: 10px;
    background-color: ${(props) => bgcolorChange(props)};
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const TextContent = styled.div`
    font-size: 16px;
    text-align: left;
    padding-left: 10px;
    font-weight: bold;
`;

const Icons = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const ToggleButton = styled.button`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white; /* Always white background */
    border: ${(props) => (props.toggled ? "none" : "1px solid #ddd")}; /* Border when not toggled */
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-right: 10px;

    /* Remove the blue border when focused */
    &:focus {
        outline: none;
    }

    /* Show the SVG only when toggled */
    svg {
        display: ${(props) => (props.toggled ? "block" : "none")};
        width: 16px;
        height: 16px;
    }
`;



const FeatureRequest = styled.div`
    background-color: whiite;
    border: 0.5px solid #ddd;
    border-radius: 5px;
    padding: 3px;
    color: grey;
    font-size: 14px;
    Font-weight: 500;
    text-align: center;
    margin-top: 5px;
    width:70%;
`;

// Function to dynamically set the background color
function bgcolorChange(props) {
    return props.isDragging
        ? "lightgreen"
        : props.isDraggable
        ? props.isBacklog
            ? "#F2D7D5"
            : "#DCDCDC"
        : props.isBacklog
        ? "#F2D7D5"
        : "#FFFFFF"; // Change the background to white
}
const FeatureRequestContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: white;
    border: 0.5px solid #ddd;
    border-radius: 5px;
    padding: 3px 8px;
    color: grey;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    margin-top: 5px;
    width: 60%;
`;

const FeatureText = styled.span`
    margin-left: 8px;
`;
export default function Card({ task, index, groupByStatus, onToggleCompleted }) {
    const [toggled, setToggled] = useState(false);

    const handleToggleClick = () => {
        setToggled(!toggled);
        if (onToggleCompleted) {
            onToggleCompleted(task.id); 
        } else {
            console.error('onToggleCompleted function is not passed correctly');
        }
    };

    return (
        <Draggable draggableId={`${task.id}`} key={task.id} index={index}>
            {(provided, snapshot) => (
                <Container
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                >
                    {/* First Row: Task Index and Avatar */}
                    <Row>
                        {/* Task Index */}
                        <span>
                            <small>{task.id}</small>
                        </span>

                        {/* Avatar */}
                        <Icons>
                            <Avatar
                                onClick={() => console.log(task)}
                                src={`https://joesch.moe/api/v1/random?key=${task.id}`}
                            />
                        </Icons>
                    </Row>

                    {/* Second Row: Task Title */}
                    <Row>
                        {/* Only show Toggle Button if not grouped by status */}
                        {!groupByStatus && (
                         <ToggleButton
                         toggled={toggled}
                         onClick={handleToggleClick}
                         style={{ outline: "none" }} // Removes the default blue border
                       >
                         {/* Show SVG image when toggled, or nothing when not toggled */}
                         {toggled ? (
                           <img
                             src="/Done.svg"
                             alt="toggle"
                             width="20px"
                             height="20px"
                           />
                         ) : null} {/* Render nothing when not toggled */}
                       </ToggleButton>
                       
                        )}

                        {/* Task Title */}
                        <TextContent>{task.title}</TextContent>
                    </Row>

                    {/* Feature Request Section */}
                    {/* <FeatureRequest>Feature Request</FeatureRequest>

                    {provided.placeholder} */}

                    <FeatureRequestContainer>
    <Avatar
        size="smaller"
        src={`https://joesch.moe/api/v1/random?key=feature-${task.id}`}
    />
    <FeatureText>Feature Request</FeatureText>
</FeatureRequestContainer>
                </Container>
            )}
        </Draggable>
    );
}
