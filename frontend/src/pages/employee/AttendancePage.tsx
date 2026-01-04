import React from 'react';
import { Layout } from '../../components/common/Layout';
import { AttendanceHistory } from '../../components/employee/AttendanceHistory';
import { Typography, Box } from '@mui/material';
import { AccessTime } from '@mui/icons-material';

export const EmployeeAttendancePage: React.FC = () => {
  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTime color="primary" />
          My Attendance History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View your complete attendance records
        </Typography>
      </Box>

      <AttendanceHistory />
    </Layout>
  );
};