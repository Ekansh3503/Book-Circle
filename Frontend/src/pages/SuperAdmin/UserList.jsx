import React, { useState } from "react";

import AddUser from "../../components/Dialogs/AddUser";
import { Box, CircularProgress } from "@mui/material";
import { useUsers } from "../../hooks/useUsers";
import { Ban, Check, Pencil, Plus } from "lucide-react";
import Pagination from "../../components/Pagination/Pagination";
import { useSelector } from "react-redux";
import Users from "../../components/Listing/Users";
import ActionBar from "../../components/Header/ActionBar";
import Titlebox from "../../components/Header/TitleBox";

function UserList() {
  const [reloadKey, setReloadKey] = useState(0);

  const handleUserAdded = () => {
    setReloadKey((prev) => prev + 1); // Change key to force re-render of Users
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOptions, setSortOptions] = useState({
    field: "name",
    order: "ASC",
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
      <Titlebox pageTitle={"User List"} customButton={<AddUser onUserAdded={handleUserAdded} ButtonTitle="Add User" />} onSearch={handleSearch} placeholder="Search by Name, Email and Phone no." />
      <div className="w-full h-fit rounded-lg space-y-1">
        <div className="mt-2">
          <Users
            key={reloadKey} // Use reloadKey to force re-render
            currentPage={currentPage}
            onTotalResults={handleTotalResults}
            sortOptions={sortOptions}
            onSort={handleSort}
            onFilter={handleFilter}
            searchQuery={searchQuery}
            filters={currentFilters}
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

export default UserList;
