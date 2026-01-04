import React from 'react';
import { Layout } from '../../components/common/Layout';
import { DashboardStats } from '../../components/admin/DashboardStats';
import { TodayAttendanceList } from '../../components/admin/TodayAttendanceList';
import { Typography, Box, Grid } from '@mui/material';
import { Dashboard } from '@mui/icons-material';

export const AdminDashboardPage: React.FC = () => {
  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Dashboard color="primary" />
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of attendance system
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs:12 }}>
          <DashboardStats />
        </Grid>
        <Grid size={{ xs:12, lg:8 }}>
          <TodayAttendanceList />
        </Grid>
      </Grid>
    </Layout>
  );
};