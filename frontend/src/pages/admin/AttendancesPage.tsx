import React from 'react';
import { Layout } from '../../components/common/Layout';
import { AttendanceMonitor } from '../../components/admin/AttendanceMonitor';
import { Typography, Box } from '@mui/material';
import { AccessTime } from '@mui/icons-material';

export const AdminAttendancesPage: React.FC = () => {
  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTime color="primary" />
          Attendance Monitoring
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and review employee attendances
        </Typography>
      </Box>

      <AttendanceMonitor />
    </Layout>
  );
};