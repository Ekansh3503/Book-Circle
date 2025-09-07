import React, { useState } from 'react';

const UserSortBy = ({ onClose, initialSort }) => {
    const [sortValue, setSortValue] = useState({
        field: initialSort?.field || 'name',
        order: initialSort?.order || 'ASC'
    });

    const handleSortChange = (field, order) => {
        setSortValue({ field, order });
    };

    const handleSeeResults = () => {
        onClose(sortValue);
    };

    return (
        <div className="p-5 px-8 border-1 border-gray-200 bg-white rounded-[var(--br-radius)] space-y-3">
            <h1 className="text-xl font-bold">Sort By</h1>
            <hr className="border-t-2 border-br-gray-light" />

            {/* Username Sorting */}
            <div className="sort-section space-y-2">
                <p className="text-lg font-semibold">name</p>
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                        <input
                            type="radio"
                            id="nameAsc"
                            name="sort"
                            onChange={() => handleSortChange('name', 'ASC')}
                            checked={sortValue.field === 'name' && sortValue.order === 'ASC'}
                        />
                        <label htmlFor="nameAsc">A-Z</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="radio"
                            id="usernameDesc"
                            name="sort"
                            onChange={() => handleSortChange('name', 'DESC')}
                            checked={sortValue.field === 'name' && sortValue.order === 'DESC'}
                        />
                        <label htmlFor="usernameDesc">Z-A</label>
                    </div>
                </div>
            </div>

            <hr className="border-t-2 border-br-gray-light" />

            {/* Creation Date Sorting */}
            <div className="sort-section space-y-2">
                <p className="text-lg font-semibold">Creation Date</p>
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                        <input
                            type="radio"
                            id="newest"
                            name="sort"
                            onChange={() => handleSortChange('createdAt', 'DESC')}
                            checked={sortValue.field === 'createdAt' && sortValue.order === 'DESC'}
                        />
                        <label htmlFor="newest">Newest First</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="radio"
                            id="oldest"
                            name="sort"
                            onChange={() => handleSortChange('createdAt', 'ASC')}
                            checked={sortValue.field === 'createdAt' && sortValue.order === 'ASC'}
                        />
                        <label htmlFor="oldest">Oldest First</label>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSeeResults}
                className="bg-br-blue-medium text-white px-2 py-2 rounded-lg transition hover:bg-br-blue-dark hover:cursor-pointer w-full"
            >
                See Results
            </button>
        </div>
    );
};

export default UserSortBy;
