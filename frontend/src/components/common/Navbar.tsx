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
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  AccountCircle,
  ExitToApp,
  Dashboard,
  People,
  AccessTime,
  KeyboardArrowDown,
  WorkOutline,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
  const isActive = (path: string) => location.pathname === path;

  const NavButton = ({ path, icon, label }: { path: string; icon: React.ReactNode; label: string }) => (
    <Button
      color="inherit"
      startIcon={icon}
      onClick={() => navigate(path)}
      sx={{
        px: 2.5,
        py: 1,
        borderRadius: 2,
        fontWeight: 600,
        transition: 'all 0.2s ease-in-out',
        backgroundColor: isActive(path) ? 'rgba(255,255,255,0.15)' : 'transparent',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.2)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      {label}
    </Button>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {/* Logo & Title */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            flexGrow: 1,
            cursor: 'pointer',
          }}
          onClick={() => navigate(isAdmin ? '/admin' : '/employee')}
        >
          <WorkOutline sx={{ fontSize: 32 }} />
          <Box>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
              }}
            >
              Dexa WFH
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.9,
                fontSize: '0.7rem',
                letterSpacing: '0.5px',
              }}
            >
              Attendance System
            </Typography>
          </Box>
        </Box>

        {user && (
          <>
            {/* Navigation Buttons */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, mr: 2 }}>
              {isAdmin ? (
                <>
                  <NavButton path="/admin" icon={<Dashboard />} label="Dashboard" />
                  <NavButton path="/admin/employees" icon={<People />} label="Employees" />
                  <NavButton path="/admin/attendances" icon={<AccessTime />} label="Attendances" />
                </>
              ) : (
                <>
                  <NavButton path="/employee" icon={<Dashboard />} label="Dashboard" />
                  <NavButton path="/employee/attendance" icon={<AccessTime />} label="My Attendance" />
                </>
              )}
            </Box>

            {/* User Menu */}
            <Box>
              <Button
                onClick={handleMenu}
                endIcon={<KeyboardArrowDown />}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    mr: 1.5,
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                  }}
                >
                  {user.fullName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      lineHeight: 1.2,
                    }}
                  >
                    {user.fullName}
                  </Typography>
                  <Chip 
                    label={user.role} 
                    size="small"
                    sx={{ 
                      height: 18,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      mt: 0.5,
                      bgcolor: 'rgba(255,255,255,0.25)',
                      color: 'white',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  />
                </Box>
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 240,
                    borderRadius: 2,
                    overflow: 'visible',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 20,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                {/* User Info */}
                <Box sx={{ px: 2, py: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {user.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                  <Chip 
                    label={user.role} 
                    size="small"
                    color="primary"
                    sx={{ 
                      mt: 1,
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}
                  />
                </Box>
                <Divider />

                {/* Mobile Navigation - hanya tampil di mobile */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                  {isAdmin ? (
                    <>
                      <MenuItem onClick={() => handleNavigate('/admin')}>
                        <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>
                        <ListItemText>Dashboard</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => handleNavigate('/admin/employees')}>
                        <ListItemIcon><People fontSize="small" /></ListItemIcon>
                        <ListItemText>Employees</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => handleNavigate('/admin/attendances')}>
                        <ListItemIcon><AccessTime fontSize="small" /></ListItemIcon>
                        <ListItemText>Attendances</ListItemText>
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem onClick={() => handleNavigate('/employee')}>
                        <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>
                        <ListItemText>Dashboard</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => handleNavigate('/employee/attendance')}>
                        <ListItemIcon><AccessTime fontSize="small" /></ListItemIcon>
                        <ListItemText>My Attendance</ListItemText>
                      </MenuItem>
                    </>
                  )}
                  <Divider />
                </Box>

                {/* Logout */}
                <MenuItem 
                  onClick={handleLogout}
                  sx={{
                    color: 'error.main',
                    fontWeight: 600,
                    py: 1.5,
                  }}
                >
                  <ListItemIcon>
                    <ExitToApp fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};