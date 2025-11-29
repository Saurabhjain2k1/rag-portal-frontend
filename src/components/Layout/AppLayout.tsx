// src/components/Layout/AppLayout.tsx
import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import type { Theme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChatIcon from "@mui/icons-material/Chat";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupIcon from "@mui/icons-material/Group";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../../context/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";


const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 72;

const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [collapsed, setCollapsed] = React.useState(false);

  const isSmUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));
  const profileMenuOpen = Boolean(anchorEl);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleGoProfile = () => {
    handleProfileClose();
    navigate("/app/profile");
  };

  const handleLogout = () => {
    handleProfileClose();
    logout();
    navigate("/login");
  };

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  const initials =
    user?.email?.[0]?.toUpperCase() ?? user?.role?.[0]?.toUpperCase() ?? "?";

  // --- Reusable nav item component (handles collapsed mode & highlighting) ---
  const NavItem: React.FC<{
    to: string;
    icon: React.ReactElement;
    label: string;
  }> = ({ to, icon, label }) => (
    <ListItemButton
      component={Link}
      to={to}
      selected={isActive(to)}
      sx={{
        justifyContent: collapsed ? "center" : "flex-start",
        px: collapsed ? 1 : 2,
        mx: 1,
        my: 0.5,
        borderRadius: 1.5,
        "&.Mui-selected": {
          bgcolor: "action.selected",
          "&:hover": { bgcolor: "action.selected" },
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: collapsed ? 0 : 1.5,
          justifyContent: "center",
        }}
      >
        {icon}
      </ListItemIcon>
      {!collapsed && <ListItemText primary={label} />}
    </ListItemButton>
  );

  // --- Drawer content ---
  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Spacer so drawer starts below AppBar */}
      <Toolbar />

      {/* Tenant info + collapse toggle */}
      <Box
        sx={{
          px: collapsed ? 1 : 2,
          pb: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 1,
        }}
      >
        {!collapsed && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Tenant
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {user?.tenant_name}
            </Typography>
          </Box>
        )}
        <IconButton
          size="small"
          onClick={toggleCollapsed}
          sx={{ ml: collapsed ? 0 : 1 }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* Navigation */}
      <List sx={{ flexGrow: 1, mt: 0.5 }}>
        <NavItem to="/app/chat" icon={<ChatIcon fontSize="small" />} label="Chat" />
        <NavItem
          to="/app/documents"
          icon={<DescriptionIcon fontSize="small" />}
          label="Documents"
        />
        {user?.role === "admin" && (
          <NavItem
            to="/app/users"
            icon={<GroupIcon fontSize="small" />}
            label="Users"
          />
        )}
      </List>

      {/* User info footer */}
      <Divider />
      <Box sx={{ p: collapsed ? 1 : 2, fontSize: 12 }}>
        {!collapsed ? (
          <>
            <Typography variant="body2" noWrap>
              {user?.email}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              {user?.role === "admin" ? "admin" : "user"}
            </Typography>
          </>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="caption" color="text.secondary">
              {user?.role === "admin" ? "A" : "U"}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  // Width for desktop drawer depending on collapsed state
  const drawerWidth = collapsed ? drawerWidthCollapsed : drawerWidthExpanded;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {/* Mobile menu button */}
          {!isSmUp && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Multi-Tenant RAG Portal
          </Typography>

          {/* Profile / avatar */}
          <IconButton
            onClick={handleProfileClick}
            size="small"
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32 }}>{initials}</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={profileMenuOpen}
            onClose={handleProfileClose}
            onClick={handleProfileClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {/* Later: Profile / Change password etc. */}
            <MenuItem onClick={handleGoProfile}>
              <PersonIcon fontSize="small" style={{ marginRight: 8 }} />
              Profile
            </MenuItem>

            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Side drawer (nav) */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile temporary drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidthExpanded, // mobile always full width
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop permanent drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              overflowX: "hidden",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        {/* Spacer so content starts below AppBar */}
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
