// src/pages/UsersPage.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Paper,
  TextField,
  TablePagination,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
  fetchUsers,
  deleteUser,
} from "../api/userApi";
import type { UserDTO } from "../api/userApi";
import EditUserModal from "../components/Users/EditUserModal";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(false);

  // pagination state (0-based page index, like MUI TablePagination)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // search
  const [search, setSearch] = useState("");

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDTO | null>(null);

  // snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarError, setSnackbarError] = useState(false);

  const showSnackbar = (msg: string, isError = false) => {
    setSnackbarMessage(msg);
    setSnackbarError(isError);
    setSnackbarOpen(true);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetchUsers(page, rowsPerPage, search);
      setUsers(res.items);
      setTotal(res.total);
    } catch {
      showSnackbar("Failed to load users", true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, [page, rowsPerPage, search]);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      showSnackbar("User deleted");
      await loadUsers();
    } catch {
      showSnackbar("Failed to delete user", true);
    }
  };

  const openEdit = (user: UserDTO) => {
    setEditingUser(user);
    setEditOpen(true);
  };

  return (
    <Container maxWidth="md">
      {/* Header */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage all users in your tenant.
          </Typography>
        </Box>

        <Tooltip title="Refresh">
          <span>
            <IconButton onClick={() => void loadUsers()} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      </Box>

      {/* Table */}
      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No users found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.email}</TableCell>

                  <TableCell>
                    <Chip
                      label={u.role}
                      size="small"
                      color={u.role === "admin" ? "primary" : "default"}
                    />
                  </TableCell>

                  <TableCell>
                    {new Date(u.created_at).toLocaleString()}
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => openEdit(u)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(u.id)}>
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination bar - same style as Documents page */}
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Rows per page:"
        />
      </Paper>

      {/* Edit user modal */}
      <EditUserModal
        open={editOpen}
        user={editingUser}
        onClose={() => setEditOpen(false)}
        onUpdated={loadUsers}
        showSnackbar={showSnackbar}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={3000}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: {
            bgcolor: snackbarError ? "error.main" : "grey.900",
            color: "white",
          },
        }}
      />
    </Container>
  );
};

export default UsersPage;
