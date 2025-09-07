import { useState } from "react";
import useSelectClub from "../../hooks/useSelectClub";
import { ChevronDown } from "lucide-react";
import useSelectAllClub from "../../hooks/useSelectAllClubs";

const SimpleClubDropdown = ({ onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(null);
  
    const { options, isLoading, error } = useSelectAllClub();
  
    const handleSelect = (option) => {
      setSelected(option);
      setIsOpen(false);
      if (onSelect) onSelect(option);
    };
  
    if (isLoading) {
      return <div className="py-3 text-center w-full">Loading clubs...</div>;
    }
  
    if (error) {
      return (
        <div className="py-3 text-center text-red-500 w-full">{error}</div>
      );
    }
  
    return (
      <div className="relative w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full border bg-white border-gray-300 rounded-lg px-4 py-3 text-left text-br-blue-medium font-semibold flex justify-between items-center"
        >
          {selected ? selected.name : "Select a club"}
          <ChevronDown className="h-5 w-5 text-br-blue-medium" />
        </button>
  
        {isOpen && (
          <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.length > 0 ? (
              options.map((option) => (
                <li
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors"
                >
                  <span className="text-br-blue-medium">{option.name}</span>
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
  

  export default SimpleClubDropdown;