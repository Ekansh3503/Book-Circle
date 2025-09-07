
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import useSelectClub from "../../hooks/useSelectClub";

const ClubDropdown = ({ onSelect, setClub }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const { options , isLoading, error } = useSelectClub();

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    if(setClub) setClub(option);
    if (onSelect) onSelect(option);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md text-center py-3">Loading clubs...</div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md text-center py-3 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border bg-white border-gray-300 rounded-lg px-4 py-3 text-left text-br-blue-medium font-semibold flex justify-between items-center"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selected ? selected.label : "Select a club"}
        <ChevronDown className="h-5 w-5 text-br-blue-medium" />
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-auto max-h-60"
          role="listbox"
        >
          {options.length > 0 ? (
            options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                role="option"
                aria-selected={selected?.value === option.value}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-br-blue-medium">
                    {option.label}
                  </span>
                  <span className="text-sm text-gray-500">{option.role}</span>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-gray-500">No clubs available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default ClubDropdown;
