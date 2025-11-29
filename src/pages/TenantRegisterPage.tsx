// src/pages/TenantRegisterPage.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Snackbar,
  TextField,
  Typography,
  Link as MUILink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { registerTenant } from "../api/authApi";

const TenantRegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [tenantName, setTenantName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarError, setSnackbarError] = useState(false);

  const showSnackbar = (msg: string, isError = false) => {
    setSnackbarMessage(msg);
    setSnackbarError(isError);
    setSnackbarOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!tenantName || !adminEmail || !adminPassword || !confirmPassword) {
      setFormError("All fields are required");
      return;
    }

    if (adminPassword !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (adminPassword.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);
    try {
      await registerTenant({
        tenant_name: tenantName.trim(),
        admin_email: adminEmail.trim(),
        admin_password: adminPassword,
      });

      showSnackbar("Tenant registered. You can now log in.", false);

      // Small delay to let user see the message, then go to login
      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ??
        "Failed to register tenant";
      showSnackbar(detail, true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Register new tenant
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create a tenant and an admin account to manage it.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Tenant name"
              fullWidth
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
            />

            <TextField
              label="Admin email"
              fullWidth
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />

            <TextField
              label="Admin password"
              fullWidth
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              helperText="At least 8 characters"
            />

            <TextField
              label="Confirm password"
              fullWidth
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {formError && (
              <Typography color="error" variant="body2">
                {formError}
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <MUILink component={Link} to="/login" variant="body2">
                Back to login
              </MUILink>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
              >
                {submitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Register tenant"
                )}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

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

export default TenantRegisterPage;
