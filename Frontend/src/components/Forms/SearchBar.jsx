import {useState, useCallback} from 'react'
import debounce from 'lodash/debounce';
import { SearchIcon } from 'lucide-react';

const SearchBar = ({ placeholder, onSearch }) => {
    const [input, setInput] = useState("");

    const debouncedSearch = useCallback(
        debounce((searchValue) => {
            onSearch(searchValue);
        }, 500),
        [onSearch]
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);
        debouncedSearch(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(input); 
    };

    return (
        <form onSubmit={handleSubmit}
        className="flex items-center bg-white text-black border border-br-gray-dark rounded-xl overflow-hidden text-md w-full h-full">
            <input
                type="text"
                placeholder={placeholder}
                value={input}
                onChange={handleChange}
                className="w-full px-3 py-2 focus:outline-none"
            />
            <div
                className="text-br-gray-dark font-extrabold px-3 py-1 transition duration-200">
                <SearchIcon size={16} />
            </div>
        </form>
    )
}

export default SearchBar