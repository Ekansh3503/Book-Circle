import React from 'react';
import {
    Box,
    Popper,
    Paper,
    FormControlLabel,
    Checkbox,
    Typography,
    Divider,
    ClickAwayListener
} from '@mui/material';

const ColumnFilter = ({
    anchorEl,
    open,
    onClose,
    options,
    onSelect,
    selectedValue,
    title
}) => {
    const handleCheckboxChange = (value) => {
        // Prevent event propagation
        event.stopPropagation();
        onSelect(value === selectedValue ? null : value);
    };

    return (
        <Popper
            open={open}
            anchorEl={anchorEl}
            placement="bottom-start"
            style={{ zIndex: 1300 }}
        >
            <ClickAwayListener onClickAway={onClose}>
                <Paper className="min-w-[200px] shadow-lg">
                    <Box className="p-2">
                        <Typography variant="subtitle2" className="px-2 py-1 text-br-gray-dark">
                            Filter by {title}
                        </Typography>
                        <Divider />
                        <Box className="py-1">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={!selectedValue}
                                        onChange={() => handleCheckboxChange(null)}
                                        size="small"
                                        onClick={(e) => e.stopPropagation()} // Stop click propagation
                                    />
                                }
                                label="All"
                                className="px-2 w-full text-sm"
                            />
                            {options.map((option) => (
                                <FormControlLabel
                                    key={option.value}
                                    control={
                                        <Checkbox
                                            checked={selectedValue === option.value}
                                            onChange={() => handleCheckboxChange(option.value)}
                                            size="small"
                                            onClick={(e) => e.stopPropagation()} // Stop click propagation
                                        />
                                    }
                                    label={option.label}
                                    className="px-2 w-full text-sm"
                                />
                            ))}
                        </Box>
                    </Box>
                </Paper>
            </ClickAwayListener>
        </Popper>
    );
};
export default ColumnFilter;