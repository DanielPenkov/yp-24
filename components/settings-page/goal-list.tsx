const GoalList = ({ goals, handleEditGoal, toggleCategory, openCategories, handleAddGoal }) => {
    const groupedGoals = goals.reduce((acc, goal) => {
        const categoryName = goal.category.name;
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(goal);
        return acc;
    }, {});

    return (
        <div>
            {/* Add New Goal Button */}
            <div className="mb-8 text-right">
                <button
                    onClick={handleAddGoal}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                    Add New Goal
                </button>
            </div>

            {/* Accordion Layout for Goals Grouped by Category */}
            {Object.keys(groupedGoals).map((categoryName) => (
                <div key={categoryName} className="mb-4">
                    {/* Accordion Header with Arrow */}
                    <button
                        className="w-full flex justify-between items-center bg-gray-100 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:bg-gray-200"
                        onClick={() => toggleCategory(categoryName)}
                    >
                        <h3 className="text-xl font-semibold">{categoryName}</h3>
                        <span className={`transform transition-transform duration-300 ${openCategories[categoryName] ? 'rotate-90' : ''}`}>
                            &#9656;
                        </span>
                    </button>

                    {/* Accordion Body (Goals List) */}
                    {openCategories[categoryName] && (
                        <div className="mt-2 space-y-4">
                            {groupedGoals[categoryName].map((goal) => (
                                <div
                                    key={goal.id}
                                    className="bg-white shadow-sm rounded-lg p-4 flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-medium">{goal.name}</p>
                                        <p className="text-gray-500">
                                            Current: {goal.current_value} / Target: {goal.target}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleEditGoal(goal)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default GoalList;