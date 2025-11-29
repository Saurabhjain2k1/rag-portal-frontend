// src/components/EditUserModal.tsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material";

import type { UserDTO, UpdateUserRequest } from "../../api/userApi";
import { updateUser } from "../../api/userApi";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: UserDTO | null;
  onUpdated: () => void; // callback to reload users list
  showSnackbar: (msg: string, isError?: boolean) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onClose,
  user,
  onUpdated,
  showSnackbar,
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  // When modal opens or user changes, sync local state
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setRole(user.role);
      setPassword("");
    }
  }, [user, open]);

  const handleSave = async () => {
    if (!user) return;

    // Build payload carefully – don't send empty strings
    const payload: UpdateUserRequest = {};

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (trimmedEmail && trimmedEmail !== user.email) {
      payload.email = trimmedEmail;
    }

    if (role && role !== user.role) {
      payload.role = role;
    }

    if (trimmedPassword) {
      payload.password = trimmedPassword;
    }

    // If nothing changed, avoid calling API
    if (Object.keys(payload).length === 0) {
      showSnackbar("No changes to save");
      return;
    }

    setSaving(true);
    try {
      await updateUser(user.id, payload);
      showSnackbar("User updated successfully");
      onUpdated(); // reload list
      onClose();
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ??
        "Failed to update user";
      showSnackbar(detail, true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth>
      <DialogTitle>Edit User</DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            select
            fullWidth
            label="Role"
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "admin" | "user")
            }
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          <TextField
            label="Reset Password (optional)"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave empty to keep current password"
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserModal;
