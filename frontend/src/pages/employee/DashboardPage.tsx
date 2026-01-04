import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/common/Layout';
import { ClockInForm } from '../../components/employee/ClockInForm';
import { TodayStatusCard } from '../../components/employee/TodayStatusCard';
import { Loading } from '../../components/common/Loading';
import {
  Typography,
  Grid,
  Paper,
  Box,
  Alert,
} from '@mui/material';
import { Attendance } from '../../types';
import { attendanceService } from '../../services/attendanceService';
import { useAuth } from '../../hooks/useAuth';

export const EmployeeDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [hasClockedIn, setHasClockedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const fetchTodayStatus = async () => {
    try {
      setIsLoading(true);
      const status = await attendanceService.getTodayStatus();
      setHasClockedIn(status.hasClockedIn);
      setTodayAttendance(status.attendance);
    } catch (error) {
      console.error('Failed to fetch today status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockInSuccess = (attendance: Attendance) => {
    setHasClockedIn(true);
    setTodayAttendance(attendance);
  };

  const handleClockOut = (attendance: Attendance) => {
    setTodayAttendance(attendance);
  };

  if (isLoading) {
    return (
      <Layout>
        <Loading message="Loading dashboard..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.fullName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Today Status */}
        <Grid size={{ xs: 12 }}>
          <TodayStatusCard
            attendance={todayAttendance}
            onClockOut={handleClockOut}
          />
        </Grid>

        {/* Clock In Form */}
        {!hasClockedIn && (
          <Grid size={{ xs: 12, md: 8 }}>
            <ClockInForm onSuccess={handleClockInSuccess} />
          </Grid>
        )}

        {/* Instructions */}
        {!hasClockedIn && (
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, bgcolor: 'info.light' }}>
              <Typography variant="h6" gutterBottom>
                📝 Instructions
              </Typography>
              <Typography variant="body2" paragraph>
                1. Take a clear photo of yourself at your workspace
              </Typography>
              <Typography variant="body2" paragraph>
                2. Add optional notes about your tasks
              </Typography>
              <Typography variant="body2" paragraph>
                3. Click "Clock In Now" to start your workday
              </Typography>
              <Typography variant="body2" paragraph>
                4. Remember to clock out when you finish!
              </Typography>
            </Paper>
          </Grid>
        )}

        {/* Completion Message */}
        {hasClockedIn && todayAttendance?.clockOut && (
          <Grid size={{ xs: 12 }}>
            <Alert severity="success">
              <Typography variant="h6">Great work today! 🎉</Typography>
              <Typography variant="body2">
                You've completed your work for today. See you tomorrow!
              </Typography>
            </Alert>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};