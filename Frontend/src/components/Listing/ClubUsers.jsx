import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Snackbar,
} from "@mui/material";
import { MdEdit } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { useSelector } from "react-redux";
import { deleteMember, fetchuserList } from "../../services/userService";
import MuiAlert from "@mui/material/Alert";
import { ChevronUp, FilterIcon } from "lucide-react";
import ColumnFilterDropdown from "../Dropdowns/ColumnFilterDropdown";

const roleMap = {
  0: "Super Admin",
  1: "Clubadmin",
  2: "Member",
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ClubUsers = ({ currentPage, onTotalResults, sortOptions, searchQuery, filters, onSort, onFilter }) => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { clubId, role } = useSelector((state) => state.clubSession);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const openDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setUserToDelete(null);
    setDeleteDialogOpen(false);
  };
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const loadUsers = async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
      };

      if (searchQuery?.trim()) params.search = searchQuery.trim();
      if (sortOptions?.field) params.sortBy = sortOptions.field;
      if (sortOptions?.order) params.sortOrder = sortOptions.order;

      if (filters?.status?.length) params.status = filters.status;
      if (filters?.role?.length) params.filterRole = filters.role.join(",");
      params.clubs = clubId.toString();

      console.log("Fetching user list with params: ", params, "Role: ", role);
      const result = await fetchuserList(params, role);

      console.log("User List Result: ", result);
      if (result.success) {
        setUsers(result.users);
        onTotalResults(result.total);
      } else {
        setUsers([]);
        onTotalResults(0);
        setError("Something went wrong.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setLoading(true);
      const res = await deleteMember({ userId: userToDelete.id, clubId, role });
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        showSnackbar("Member Removed successfully", "success");
        closeDeleteDialog();
      } else {
        showSnackbar("Failed to delete user", "error");
      }
    } catch (error) {
      showSnackbar("Error deleting user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleColumnSort = (field) => {
    const newOrder = sortOptions.field === field && sortOptions.order === "ASC" ? "DESC" : "ASC";
    const newSortOptions = {
      field,
      order: newOrder
    };
    onSort(newSortOptions);
  }

  useEffect(() => {
    loadUsers();
  }, [currentPage, sortOptions, searchQuery, filters]);

  return (
    <Box className="p-0 w-full overflow-x-auto">
      {/* Header row */}
      <Box className="bg-white flex flex-row items-center justify-between py-4 px-4 gap-1 text-sm font-semibold text-br-gray-dark mb-1 rounded-t-2xl shadow-sm">
        <div className="w-2/10 flex flex-row justify-between items-center cursor-pointer px-2" onClick={() => handleColumnSort('name')}>
          <span className={`${sortOptions.field === 'name' ? 'text-br-blue-dark' : ''}`}>
            Name
          </span>
          <div className="flex flex-col ml-1 justify-end">
            <ChevronUp size={16} className={`${sortOptions.field === 'name' && sortOptions.order === 'ASC' ? 'text-br-blue-dark' : 'text-gray-400'} transition-transform duration-200`} />
            <ChevronUp size={16} className={`${sortOptions.field === 'name' && sortOptions.order === 'DESC' ? 'text-br-blue-dark' : 'text-gray-400'} transform rotate-180 transition-transform duration-200`} />
          </div>
        </div>
        <Divider orientation="vertical" flexItem className="mx-4" />
        <div className="w-2/10">Email</div>
        <Divider orientation="vertical" flexItem className="mx-4" />
        <div className="w-1/10">Phone</div>
        <Divider orientation="vertical" flexItem className="mx-4" />
        <div className="w-1/10">
          <ColumnFilterDropdown
            label="Role"
            options={[
              { id: "1", label: "Club Admin" },
              { id: "2", label: "Member" }
            ]}
            selectedValues={filters.role || []}
            onChange={(values) => onFilter({ ...filters, role: values })}
          />
        </div>
        <Divider orientation="vertical" flexItem className="mx-4" />
        <div className="w-1/10 flex items-center justify-between cursor-pointer group" onClick={() => handleColumnSort('createdAt')}>
          <span className={`${sortOptions.field === 'createdAt' ? 'text-br-blue-dark' : ''} `}>
            Joined At
          </span>
          <div className="flex flex-col justify-end">
            <ChevronUp size={16} className={`${sortOptions.field === 'createdAt' && sortOptions.order === 'ASC' ? 'text-br-blue-dark' : 'text-gray-400'} transition-transform duration-200`} />
            <ChevronUp size={16} className={`${sortOptions.field === 'createdAt' && sortOptions.order === 'DESC' ? 'text-br-blue-dark' : 'text-gray-400'} transform rotate-180 transition-transform duration-200`} />
          </div>
        </div>
        <Divider orientation="vertical" flexItem className="mx-4" />
        <div className="w-1/10 align-center">
          <ColumnFilterDropdown
            label="Status"
            options={[
              { id: true, label: "Active" },
              { id: false, label: "Inactive" }
            ]}
            selectedValues={filters.status || []}
            onChange={(values) => onFilter({ ...filters, status: values })}
          />
        </div>
        <Divider orientation="vertical" flexItem className="mx-4" />
        <div className="w-2/10 text-right">Actions</div>
      </Box>

      {/* Data rows */}
      <div className="space-y-1">
        {loading ? (
          <Box className="p-6 text-center bg-white">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box className="p-6 text-center bg-white text-red-600">
            {error.message || String(error)}
          </Box>
        ) : !users || users.length === 0 ? (
          <Box className="bg-white p-6 text-center">No users found.</Box>
        ) : (
          users.map((user) => (
            <Box
              key={user.id}
              className="bg-white flex flex-row items-center justify-between py-4 px-4 text-sm hover:shadow-sm transition-shadow duration-150"
            >
              <div className="w-2/10 font-medium">{user.name}</div>
              <div className="w-2/10 truncate">{user.email}</div>
              <div className="w-1/10">{user.phone_no}</div>
              <div className="w-1/10 items-center justify-start">
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mr-1">
                  {roleMap[user?.clubusers[0]?.role]}
                </span>
              </div>
              <div className="w-1/10 flex items-center justify-start">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>

              <div className="w-1/10 capitalize font-semibold align-middle">
                <span
                  className={`px-2 py-1 rounded-full text-xs 
                                  ${user.status
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                    }`}
                >
                  {user.status ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="w-2/10 flex justify-end space-x-3">
                <button className="cursor-pointer px-2 py-2 bg-br-blue-dark text-white rounded-lg hover:bg-br-blue-medium transition-colors duration-200 flex items-center gap-1">
                  <MdEdit size={18} />
                </button>
                <button
                  onClick={() => openDeleteDialog(user)}
                  className={`flex px-2 py-2 cursor-pointer text-white gap-1 rounded-lg transition-colors duration-200 items-center bg-[var(--color-br-red-medium)] hover:bg-red-400`}
                >
                  <TiDelete size={18} />
                </button>
              </div>
            </Box>
          ))
        )}
      </div>

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to Remove <strong>{userToDelete?.name}</strong>{" "}
          from Club?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClubUsers;
