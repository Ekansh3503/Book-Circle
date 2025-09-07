import { useState } from 'react'
import BookFilters from '../../components/Dropdowns/BookFilters'
import BookGrid from '../../components/Listing/BookGrid'
import TitleBox from '../../components/Header/TitleBox'
import BookSortingDropdown from '../../components/Dropdowns/BookSortingDropdown'

const BookListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOptions, setSortOptions] = useState({
    field: 'title',
    order: 'ASC'
  });

  const [filters, setFilters] = useState({
    status: "",
    categories: [],
    languages: []
  });

  const handleFilterChange = (newFilters) => {
    // console.log("Filters changed:", newFilters);
    setFilters(newFilters);
  };

  const handleSortChange = (newSortOption) => {
    // console.log("Sort option changed:", newSortOption);
    setSortOptions(newSortOption);
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
  }
  return (
    <div className='w-full h-fit space-y-3 bg-br-blue-light'>
      <TitleBox pageTitle="Book List" placeholder="Search By Book Name, Author" customButton={<BookSortingDropdown
        onSortChange={handleSortChange}
        initialSort={sortOptions}
      />
      } onSearch={handleSearch} />
      <div className='h-fit space-y-1 overflow-hidden'>
        <div className='flex space-x-1 h-full'>
          <BookFilters onFilterChange={handleFilterChange} />
          <div className='space-y-1 w-full h-full'>
            <BookGrid
              searchQuery={searchQuery}
              filters={filters}
              sortOptions={sortOptions}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookListing