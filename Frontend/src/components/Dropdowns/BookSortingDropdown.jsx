import { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const sortOptions = [
  { label: 'Ascending (A-Z)', field: 'title', order: 'ASC' },
  { label: 'Descending (Z-A)', field: 'title', order: 'DESC' },
  // { label: 'Most Read', field: 'readCount', order: 'DESC' },
  { label: 'Newly Added', field: 'createdAt', order: 'DESC' },
  // { label: 'Top Rated', field: 'rating', order: 'DESC' },
];

const BookSortingDropdown = ({ onSortChange, initialSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const [selectedSort, setSelectedSort] = useState(initialSort);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelectedSort({ field: option.field, order: option.order });
    onSortChange({ field: option.field, order: option.order });
    setIsOpen(false);
  };

  // Get label to show on the button
  const getSelectedLabel = () => {
    const match = sortOptions.find(
      opt => opt.field === selectedSort.field && opt.order === selectedSort.order
    );
    return match ? match.label : 'Sort';
  };

  return (
    <div className="relative inline-block text-left " ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="inline-flex w-50 justify-between items-center cursor-pointer px-4 py-2 border-2 border-br-blue-medium bg-br-blue-medium text-white text-sm font-medium rounded-lg shadow hover:bg-br-blue-dark transition"
      >
        Sort: {getSelectedLabel()}
        <FaChevronDown className="ml-2 text-xs" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <ul className="py-1">
            {sortOptions.map((option, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleSelect(option)}
                  className={`block w-full text-left px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 ${
                    selectedSort.field === option.field && selectedSort.order === option.order
                      ? 'bg-gray-100 font-semibold'
                      : ''
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BookSortingDropdown;
