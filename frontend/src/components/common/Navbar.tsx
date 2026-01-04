import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
} from '@mui/material';
import {
  AccountCircle,
  ExitToApp,
  Dashboard,
  People,
  AccessTime,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dexa WFH Attendance
        </Typography>

        {user && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Navigation Buttons */}
              {isAdmin ? (
                <>
                  <Button
                    color="inherit"
                    startIcon={<Dashboard />}
                    onClick={() => navigate('/admin')}
                  >
                    Dashboard
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={<People />}
                    onClick={() => navigate('/admin/employees')}
                  >
                    Employees
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={<AccessTime />}
                    onClick={() => navigate('/admin/attendances')}
                  >
                    Attendances
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    startIcon={<Dashboard />}
                    onClick={() => navigate('/employee')}
                  >
                    Dashboard
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={<AccessTime />}
                    onClick={() => navigate('/employee/attendance')}
                  >
                    My Attendance
                  </Button>
                </>
              )}

              {/* User Menu */}
              <Box>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {user.fullName.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem disabled>
                    <Box>
                      <Typography variant="subtitle2">{user.fullName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ExitToApp fontSize="small" sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};