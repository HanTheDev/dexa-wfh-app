import React from 'react';
import { Box, Container } from '@mui/material';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export const Layout: React.FC<LayoutProps> = ({ children, maxWidth = 'xl' }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
        }}
      >
        <Container
          maxWidth={maxWidth}
          sx={{
            mt: 4,
            mb: 4,
            mx: 'auto', // Ini yang penting untuk center
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};