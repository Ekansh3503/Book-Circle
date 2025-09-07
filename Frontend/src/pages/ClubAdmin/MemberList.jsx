import React, { useState } from 'react'
import AddUser from "../../components/Dialogs/AddUser";
import { Box, CircularProgress } from "@mui/material";
import { useUsers } from "../../hooks/useUsers";
import { Ban, Check, Pencil, Plus } from "lucide-react";
import Pagination from "../../components/Pagination/Pagination";
import { useSelector } from "react-redux";
import Users from "../../components/Listing/Users";
import ActionBar from "../../components/Header/ActionBar";
import Titlebox from "../../components/Header/TitleBox";
import ClubUsers from '../../components/Listing/ClubUsers';

function MemberList() {
  const [reloadKey, setReloadKey] = useState(0);

  const handleUserAdded = () => {
    setReloadKey((prev) => prev + 1); // Change key to force re-render of Users
  };
  const clubId = useSelector((state) => state.clubSession.clubId);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOptions, setSortOptions] = useState({
    field: "createdAt",
    order: "DESC",
  });
  const [currentFilters, setCurrentFilters] = useState({
    status: null,
    role: null,
    clubs: null,
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSort = (sortOptions) => {
    console.log("Sort options:", sortOptions);
    setSortOptions(sortOptions);
    setCurrentPage(1);
  };

  const handleFilter = (filterOptions) => {
    setCurrentFilters(filterOptions);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleTotalResults = (total) => {
    setTotalResults(total);
  };
  return (
    <div className="w-full h-fit space-y-3 bg-br-blue-light">
      <Titlebox pageTitle={"Member List"} customButton={<AddUser onUserAdded={handleUserAdded} clubId={clubId} ButtonTitle="Add Member" />}  onSearch={handleSearch} placeholder="Search by name, email, phoneno" />
      <div className="w-full h-fit rounded-lg space-y-1">
        <div className="mt-2">
          <ClubUsers
            key={reloadKey} // Use reloadKey to force re-render
            currentPage={currentPage}
            onTotalResults={handleTotalResults}
            sortOptions={sortOptions}
            searchQuery={searchQuery}
            filters={currentFilters}
            onSort={handleSort}
            onFilter={handleFilter}
          />
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
    </div>
  );
}

export default MemberList
