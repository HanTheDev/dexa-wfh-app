import React from 'react';
import { Layout } from '../../components/common/Layout';
import { EmployeeList } from '../../components/admin/EmployeeList';
import { Typography, Box } from '@mui/material';
import { People } from '@mui/icons-material';

export const AdminEmployeesPage: React.FC = () => {
  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <People color="primary" />
          Employee Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage employee information and accounts
        </Typography>
      </Box>

      <EmployeeList />
    </Layout>
  );
};