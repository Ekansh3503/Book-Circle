import { useState } from 'react'
import Pagination from '../../components/Pagination/Pagination';
import Titlebox from '../../components/Header/TitleBox';
import Clubs from '../../components/Listing/Clubs';
import ClubDialog from '../../components/Dialogs/ClubDialog';

function ClubListing() {
  const [reloadKey, setReloadKey] = useState(0);

  const handleClubAdded = () => {
    setReloadKey((prev) => prev + 1);
  };

  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOptions, setSortOptions] = useState({
    field: 'createdAt',
    order: 'DESC'
  });
  const [currentFilters, setCurrentFilters] = useState({
    status: null,
    memberCount: null,
    bookCount: null
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1)
  }

  const handleSort = (sortOptions) => {
    setSortOptions(sortOptions);
    setCurrentPage(1)
  }

  const handleFilter = (newFilters) => {
    setCurrentFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleTotalResults = (total) => {
    setTotalResults(total)
  }

  return (
    <div className='w-full h-fit space-y-1 bg-br-blue-light'>
      <Titlebox
        pageTitle={"Club List"}
        customButton={<ClubDialog onClubAdded={handleClubAdded} />}
        onSearch={handleSearch}
        placeholder="Search by Club Name, Location"
      />
      <div className='mt-2'>
        <Clubs
          key={reloadKey} // Use reloadKey to force re-render
          currentPage={currentPage}
          onTotalResults={handleTotalResults}
          sortOptions={sortOptions}
          setSortOptions={setSortOptions}
          searchQuery={searchQuery}
          filters={currentFilters}
          onFilter={handleFilter} />
      </div>
      <div className="mt-1 rounded-bl-2xl">
        <Pagination
          currentPage={currentPage}
          totalResults={totalResults}
          onPageChange={handlePageChange}
          className="rounded-bl-[var(--br-radius)]"
        />
      </div>
    </div>
  )
}

export default ClubListing