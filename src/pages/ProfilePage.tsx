// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import type { MeResponse } from "../api/profileApi";
import { fetchMe, changePassword } from "../api/profileApi";

const ProfilePage: React.FC = () => {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loadingMe, setLoadingMe] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarError, setSnackbarError] = useState(false);

  const showSnackbar = (msg: string, isError = false) => {
    setSnackbarMessage(msg);
    setSnackbarError(isError);
    setSnackbarOpen(true);
  };

  const loadProfile = async () => {
    setLoadingMe(true);
    try {
      const data = await fetchMe();
      setMe(data);
    } catch {
      showSnackbar("Failed to load profile", true);
    } finally {
      setLoadingMe(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setFormError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError("New password and confirmation do not match");
      return;
    }

    if (newPassword.length < 8) {
      setFormError("New password must be at least 8 characters");
      return;
    }

    if (currentPassword === newPassword) {
      setFormError("New password must be different from current password");
      return;
    }

    setChanging(true);
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      showSnackbar("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ??
        "Failed to change password";
      showSnackbar(msg, true);
    } finally {
      setChanging(false);
    }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 2, mb: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Profile
      </Typography>

      {/* Profile card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {loadingMe ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress />
            </Box>
          ) : me ? (
            <>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {me.email}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                Role
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {me.role}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                Tenant ID
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {me.tenant_id}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">
                Account created
              </Typography>
              <Typography variant="body2">
                {formatDate(me.created_at)}
              </Typography>
            </>
          ) : (
            <Typography color="text.secondary">
              Unable to load profile information.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Change password card */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Change password
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Update your account password. You&apos;ll use this on next login.
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box
            component="form"
            onSubmit={handleChangePassword}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Current password"
              type="password"
              fullWidth
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <TextField
              label="New password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="At least 8 characters"
            />

            <TextField
              label="Confirm new password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {formError && (
              <Typography color="error" variant="body2">
                {formError}
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={changing}
              >
                {changing ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Change password"
                )}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

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

export default ProfilePage;
