import React from "react";

const DropdownComponent = ({ groupBy, setGroupBy, orderBy, setOrderBy, showDropdown }) => {
    console.log("DropdownComponent", showDropdown);

    // Handle Group By change
    const handleGroupByChange = (event) => {
        setGroupBy(event.target.value);
    };

    // Handle Order By change
    const handleOrderByChange = (event) => {
        setOrderBy(event.target.value);
    };

    return (
        showDropdown && (
            <div
                style={{
                    position: "absolute", // Ensures the dropdown appears above other components
                    top: "70px", // Adjusts the vertical position
                    left: "50px", // Adjusts the horizontal position
                    zIndex: 999, // Ensures the dropdown stays on top of other components
                    backgroundColor: "white", // Sets a white background for the dropdown
                    padding: "20px",
                    borderRadius: "5px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    display: "flex", // Uses flexbox to align elements
                    flexDirection: "column", // Stacks the dropdowns vertically
                    gap: "20px", // Adds space between the dropdowns
                    width: "90%", // Default width for smaller screens
                    maxWidth: "300px", // Sets a maximum width for larger screens
                    boxSizing: "border-box", // Includes padding and border in the element's total width
                }}
            >
                {/* Group By */}
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <label
                        style={{
                            marginRight: "10px",
                            color: "grey",
                            fontWeight: "bold",
                            flex: "1",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Group By:
                    </label>
                    <select
                        style={{
                            flex: "2",
                            padding: "5px",
                            borderRadius: "3px",
                            border: "1px solid #ccc",
                        }}
                        value={groupBy}
                        onChange={handleGroupByChange}
                    >
                        <option value="status">Status</option>
                        <option value="userId">User</option>
                        <option value="priority">Priority</option>
                    </select>
                </div>

                {/* Order By */}
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <label
                        style={{
                            marginRight: "10px",
                            color: "grey",
                            fontWeight: "bold",
                            flex: "1",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Order By:
                    </label>
                    <select
                        style={{
                            flex: "2",
                            padding: "5px",
                            borderRadius: "3px",
                            border: "1px solid #ccc",
                        }}
                        value={orderBy}
                        onChange={handleOrderByChange}
                    >
                        <option value="priority">Priority</option>
                        <option value="title">Title</option>
                    </select>
                </div>
            </div>
        )
    );
};

export default DropdownComponent;
