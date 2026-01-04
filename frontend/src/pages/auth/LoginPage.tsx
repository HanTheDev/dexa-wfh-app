import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Alert,
  Fade,
  Zoom,
  Card,
  CardContent,
  Divider,
  Stack,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Login as LoginIcon,
  WorkOutline,
  Email,
  Lock,
  PersonOutline,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { LoginRequest } from '../../types';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'admin' ? '/admin' : '/employee';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginRequest) => {
    try {
      setError(null);
      await login(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'float 20s linear infinite',
        },
        '@keyframes float': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Zoom in timeout={500}>
          <Paper 
            elevation={24}
            sx={{ 
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            {/* Header with Icon */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  mb: 2,
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                }}
              >
                <WorkOutline sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Sign in to Dexa WFH Attendance System
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Fade in>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    fontWeight: 500,
                  }}
                  onClose={() => setError(null)}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                margin="normal"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="email"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={<LoginIcon />}
                sx={{ 
                  py: 1.75,
                  fontSize: '1rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3d8a 100%)',
                    boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
                  },
                  '&:disabled': {
                    background: 'rgba(0,0,0,0.12)',
                  },
                }}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>

            {/* Demo Credentials */}
            <Divider sx={{ my: 4 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Demo Accounts
              </Typography>
            </Divider>

            <Stack spacing={2}>
              <Card 
                variant="outlined" 
                sx={{ 
                  borderRadius: 2,
                  borderColor: 'primary.light',
                  borderWidth: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PersonOutline sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        Admin Account
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Full system access
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ pl: 1.5, borderLeft: 3, borderColor: 'primary.light', ml: 2.25 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                      📧 admin@dexa.com
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                      🔑 admin123
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card 
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  borderColor: 'secondary.light',
                  borderWidth: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    boxShadow: '0 4px 12px rgba(118, 75, 162, 0.15)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PersonOutline sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                        Employee Account
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Attendance tracking
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ pl: 1.5, borderLeft: 3, borderColor: 'secondary.light', ml: 2.25 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                      📧 john.doe@dexa.com
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                      🔑 employee123
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Stack>

            {/* Footer */}
            <Typography 
              variant="caption" 
              color="text.secondary" 
              align="center" 
              display="block" 
              sx={{ mt: 4, fontWeight: 500 }}
            >
              © 2024 Dexa WFH Attendance System
            </Typography>
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
};