import { useState } from "react";
import { ChevronDown } from "lucide-react";

const ROLE_OPTIONS = [
  { label: "Club Admin", value: 1 },
  { label: "Member", value: 2 },
];

const SimpleRoleDropdown = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelect) onSelect(option); // send only value (1 or 2)
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border bg-white border-gray-300 rounded-lg px-4 py-3 text-left text-br-blue-medium font-semibold flex justify-between items-center"
      >
        {selected ? selected.label : "Select a role"}
        <ChevronDown className="h-5 w-5 text-br-blue-medium" />
      </button>

      {isOpen && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {ROLE_OPTIONS.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
            >
              <span className="text-br-blue-medium">{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SimpleRoleDropdown;
