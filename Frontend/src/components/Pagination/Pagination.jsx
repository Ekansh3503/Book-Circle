import React from 'react';
import { Pagination as MUIPagination } from '@mui/material';

const Pagination = ({ currentPage, totalResults, onPageChange, className }) => {
    const resultsPerPage = 10;

    const handleChange = (event, value) => {
        onPageChange(value);
    };

    const startRange = ((currentPage - 1) * resultsPerPage) + 1;
    const endRange = Math.min(currentPage * resultsPerPage, totalResults);

    return (
        <div className={`flex justify-between items-center p-5 py-8 pb-9 rounded-br-[var(--br-radius)] bg-white h-fill" ${className || ''}`}>
            <div className="flex items-center space-x-2">
                <h1 className="font-semibold">
                    Showing {startRange}-{endRange} of {totalResults} Results
                </h1>
            </div>

            <MUIPagination
                count={Math.ceil(totalResults / resultsPerPage)}
                page={currentPage}
                onChange={handleChange}
                sx={{
                    '& .MuiPaginationItem-root': {
                        color: '#0F172F',
                    },
                    '& .MuiPaginationItem-previousNext': {
                        backgroundColor: '#B5B5B5',
                        color: '#000',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        '&:hover': {
                            backgroundColor: '#B5B5B5',
                        },
                    },
                    '& .MuiPaginationItem-root.Mui-selected': {
                        backgroundColor: '#0F172F',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#0F172F',
                        },
                    },
                    '& .Mui-unselected': {
                        backgroundColor: '#D9D9D9',
                        },

                }}
                shape="rounded"
            />
        </div>
    );
};

export default Pagination;
