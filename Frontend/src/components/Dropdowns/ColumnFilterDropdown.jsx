import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  Checkbox,
  Button,
  ListItemText,
  IconButton,
} from "@mui/material";
import { FilterIcon } from "lucide-react";

const ColumnFilterDropdown = ({
  label = "Filter",
  options = [],
  selectedValues = [],
  onChange = () => { },
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleToggle = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    onChange(newValues);
  };

  const selectedCount = selectedValues.length;

  return (
    <>
      <button
        onClick={handleOpen}
        className={`text-black rounded-md border-none py-1 flex items-center justify-start w-full  ${selectedCount > 0 ? "text-br-blue-medium" : "text-br-gray-dark"} font-semibold`}
      >
        <div className="flex items-center justify-between w-full">
          {label}
        </div>
        {selectedCount > 0 && ` (${selectedCount})`}
        <FilterIcon size={16} className="ml-1 justify-end" />
      </button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {options.map((option) => (
          <MenuItem
            key={option.id}
            onClick={() => handleToggle(option.id)}
            dense
          >
            <Checkbox
              checked={selectedValues.includes(option.id)}
              size="small"
            />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ColumnFilterDropdown;
