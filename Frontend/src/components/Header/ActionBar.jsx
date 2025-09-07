import React, { useState } from 'react';
import SearchBar from '../Forms/SearchBar';
import { ArrowUpNarrowWide } from 'lucide-react';
import UserSortBy from '../Dropdowns/UserSortBy';
import UserFilters from '../Dropdowns/UserFilters';

export default function ActionBar({
  onSearch,
  onSort,
  onFilter,
  currentSort,
  currentFilters,
  isClubAdmin = false,
  clubId = null
}) {
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = (query) => {
    onSearch(query);
  };

  return (
    <div className="relative">
      <div className="flex p-3 items-center space-x-3 bg-br-white rounded-t-[var(--br-radius)]">
        <SearchBar placeholder="Name, Email, Phone no." onSearch={handleSearch} />
      </div>
    </div>
  );
}
