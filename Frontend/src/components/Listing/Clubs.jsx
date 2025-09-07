import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar
} from '@mui/material';
import { MdEdit } from 'react-icons/md';
import { TiDelete } from "react-icons/ti";
import { MdOutlineDone } from "react-icons/md";
import clubLogo from '../../assets/clubLogo.png';
import { useSelector } from 'react-redux';
import MuiAlert from "@mui/material/Alert";
import { deleteClubService, fetchClubs } from '../../services/clubService';
import EditClubDialog from '../Dialogs/EditClubDialog';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ColumnFilterDropdown from '../Dropdowns/ColumnFilterDropdown';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const memberCountOptions = [
  { id: 'small', label: 'Small(1-10)' },
  { id: 'medium', label: 'Medium(11-50)' },
  { id: 'large', label: 'Large(50+)' }
];

const bookCountOptions = [
  { id: 'zero', label: '0 Books' },
  { id: 'hasBooks', label: 'Atleast 1 Book' },
  { id: 'manyBooks', label: 'More than 50 Books' }
];

const statusOptions = [
  { id: "active", label: 'Active' },
  { id: "inactive", label: 'Inactive' }
];

const Clubs = ({ currentPage, onTotalResults, sortOptions, searchQuery, filters, setSortOptions, onFilter }) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null);

  const { role } = useSelector((state) => state.clubSession);

  const loadClubs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
      };
      if (searchQuery?.trim()) params.search = searchQuery.trim();
      if (sortOptions?.field && sortOptions.field !== 'createdAt') {
        params.sortField = sortOptions.field;
      }
      if (sortOptions?.order && sortOptions.order !== 'DESC') {
        params.sortOrder = sortOptions.order;
      }
      if (filters?.status) params.status = filters.status;
      if (filters?.memberCount) params.memberCount = filters.memberCount;
      if (filters?.bookCount || filters?.bookCount === 0) params.bookCount = filters.bookCount;

      const result = await fetchClubs(params, role);

      if (result.success) {
        setClubs(result.clubs);
        onTotalResults(result.count);
      } else {
        setClubs([]);
        onTotalResults(0);
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
      setError('Failed to fetch clubs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClubs();
  }, [currentPage, sortOptions, searchQuery, filters]);

  const handleDeleteClick = (club) => {
    setSelectedClub(club);
    setOpenDialog(true);
  };

  const handleColumnSort = (field) => {
    const newOrder = sortOptions.field === field && sortOptions.order === 'ASC' ? 'DESC' : 'ASC';
    const newSortOptions = {
      field,
      order: newOrder
    };
    setSortOptions(newSortOptions);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteClubService({ id: selectedClub.id });
      setSnackbar({ open: true, message: res.message || "Successfull", severity: "success" });
      setOpenDialog(false);
      setSelectedClub(null);
      loadClubs();
    } catch (error) {
      const msg = error?.response?.data?.message || "Error";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClub(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleEdit = (club) => {
    setEditingClub(club);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditingClub(null);
  };

  return (
    <Box className="p-0 w-full">
      <Box className="bg-white rounded-t-2xl flex flex-row items-center justify-between px-6 text-sm font-semibold text-br-gray-dark mb-1 border-br-gray-light">
        <div className="w-1/10 pl-4 py-3">Logo</div>

        {/* Sortable Club Name Column */}
        <div
          className="w-2/10 py-3 flex items-center cursor-pointer group"
          onClick={() => handleColumnSort('club_name')}
        >
          <div className="flex flex-col ml-1">
            <ChevronUp
              size={20}
              className={`${sortOptions.field === 'club_name' && sortOptions.order === 'ASC'
                ? 'text-br-blue-dark'
                : 'text-gray-300 group-hover:text-gray-400'
                } -mb-1`}
            />
            <ChevronDown
              size={20}
              className={`${sortOptions.field === 'club_name' && sortOptions.order === 'DESC'
                ? 'text-br-blue-dark'
                : 'text-gray-300 group-hover:text-gray-400'
                }`}
            />
          </div>
          <span className={` ${sortOptions.field === 'club_name' ? 'text-br-blue-dark' : 'text-br-gray-dark'} mx-1`}>Club Name</span>
        </div>

        {/* Sortable Created On Column */}
        <div
          className="w-1/10 py-3 flex items-center cursor-pointer group"
          onClick={() => handleColumnSort('createdAt')}
        >
          <div className="flex flex-col">
            <ChevronUp
              size={20}
              className={`${sortOptions.field === 'createdAt' && sortOptions.order === 'ASC'
                ? 'text-br-blue-dark'
                : 'text-gray-300 group-hover:text-gray-400'
                } -mb-1`}
            />
            <ChevronDown
              size={20}
              className={`${sortOptions.field === 'createdAt' && sortOptions.order === 'DESC'
                ? 'text-br-blue-dark'
                : 'text-gray-300 group-hover:text-gray-400'
                }`}
            />
          </div>
          <span className={` ${sortOptions.field === 'createdAt' ? 'text-br-blue-dark' : 'text-br-gray-dark'} mx-1`}>Created On</span>
        </div>

        <div className="w-2/10 py-3">Location</div>

        {/* Sortable Total Members Column */}
        <div
          className="w-1/10 py-3 flex items-center justify-center mr-1 cursor-pointer group"

        >
          <div className="flex flex-col mr-1" onClick={() => handleColumnSort('total_members')}>
            <ChevronUp
              size={20}
              className={`${sortOptions.field === 'total_members' && sortOptions.order === 'ASC'
                ? 'text-br-blue-dark'
                : 'text-gray-300 group-hover:text-gray-400'
                } -mb-1`}
            />
            <ChevronDown
              size={20}
              className={`${sortOptions.field === 'total_members' && sortOptions.order === 'DESC'
                ? 'text-br-blue-dark'
                : 'text-gray-300 group-hover:text-gray-400'
                }`}
            />
          </div>
          <div className="flex items-center">
            <span className={`${sortOptions.field === 'total_members' || filters.memberCount?.length
              ? 'text-br-blue-dark'
              : 'text-br-gray-dark'
              }`}> Members
            </span>
          </div>
          <div>
            <ColumnFilterDropdown
              label=""
              options={memberCountOptions}
              selectedValues={filters.memberCount || []}
              onChange={(values) => {
                onFilter({ ...filters, memberCount: values });
              }}
            />
          </div>
        </div>

        <div className="w-1/10 py-3 flex items-center justify-center ">
          <span className={`${filters.bookCount?.length
            ? 'text-br-blue-dark'
            : 'text-br-gray-dark'
            }`}> Books
          </span>
          <div>
            <ColumnFilterDropdown
              label=""
              options={bookCountOptions}
              selectedValues={filters.bookCount || []}
              onChange={(values) => {
                onFilter({ ...filters, bookCount: values });
              }}
            />
          </div>
        </div>

        <div className="w-1/10 flex py-3 text-center relative group justify-center items-center">
          <span className={`${filters.status?.length
            ? 'text-br-blue-dark'
            : 'text-br-gray-dark'
            }`}> Status
          </span>
          <div className="flex items-center justify-center">
            <ColumnFilterDropdown
              label=""
              options={statusOptions}
              selectedValues={filters.status || []}
              onChange={(values) => onFilter({ ...filters, status: values })}
            />
          </div>
        </div>
        <div className="w-1/10 py-3 text-right pr-4">Actions</div>
      </Box>

      <div className='space-y-1'>
        {loading ? (
          <Box className="p-4 text-center bg-white">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box className="p-4 text-center bg-white text-red-600">{error}</Box>
        ) : clubs.length === 0 ? (
          <Box className="bg-white p-4 text-center">No clubs found.</Box>
        ) : (
          clubs.map((club, index) => (
            <Box
              key={club.id || index}
              className="bg-white justify-between flex cursor-pointer flex-row items-center py-4 px-4 text-sm hover:bg-gray-50 border-br-gray-light"
            >
              <div className="w-1/10 pl-3">
                <img
                  src={club.club_thumbnail_url || clubLogo}
                  alt={`${club.club_name} logo`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>

              <div className="w-2/10 pl-9">{club.club_name}</div>
              <div className="w-1/10 pl-7">
                {new Date(club.createdAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
              <div className="w-2/10">{club.club_location}</div>



              <div className="w-1/10 text-center">{club.total_members || 0}</div>

              <div className="w-1/10 text-center">{club.total_books || 0}</div>

              <div className="w-1/10 text-center">
                <span className={`px-2 py-1 rounded-full text-xs ${club.club_status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {club.club_status ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="w-1/10 justify-end flex space-x-2">
                <button
                  onClick={() => handleEdit(club)}
                  className="cursor-pointer px-3 flex gap-1 p-2 bg-br-blue-dark text-white rounded-lg hover:bg-br-blue-medium transition-colors duration-200"
                >
                  <MdEdit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteClick(club)}
                  className={`flex px-3 cursor-pointer text-white py-2 gap-1 rounded-lg transition-colors duration-200 
                    ${club.club_status
                      ? "bg-[var(--color-br-red-medium)] hover:bg-red-400"
                      : "bg-[var(--color-br-green-medium)] hover:bg-green-400"}`}
                >
                  {club.club_status ? <TiDelete size={20} /> : <MdOutlineDone size={20} />}
                </button>
              </div>
            </Box>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm {selectedClub?.club_status ? "Deactivation" : "Activation"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {selectedClub?.club_status ? "deactivate" : "activate"} "{selectedClub?.club_name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button color={selectedClub?.club_status ? "error" : "success"} onClick={handleConfirmDelete}>
            {selectedClub?.club_status ? "Deactivate" : "Activate"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Edit Club Dialog */}
      <EditClubDialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        clubData={editingClub}
        onClubUpdated={loadClubs}
      />

    </Box>
  );
};

export default Clubs;
