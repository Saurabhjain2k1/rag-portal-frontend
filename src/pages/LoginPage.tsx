import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Link as MUILink,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginUser({ email, password });
      navigate("/app/chat");
    } catch (e: any) {
      console.error(e);
      setError(e?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background:
          "radial-gradient(circle at top left, #dbeafe, transparent), #eff6ff",
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Login to RAG Portal
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Use your email and password. Admins can manage users and documents,
            regular users can chat over tenant knowledge.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              label="Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            {/* Link to tenant registration */}
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                New here?{" "}
                <MUILink
                  component={RouterLink}
                  to="/register-tenant"
                  underline="hover"
                >
                  Register a new tenant
                </MUILink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
