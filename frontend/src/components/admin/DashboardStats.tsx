import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import {
  People,
  AccessTime,
  CheckCircle,
  TrendingUp,
} from '@mui/icons-material';
import { employeeService } from '../../services/employeeService';
import { attendanceService } from '../../services/attendanceService';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </Paper>
  );
};

export const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    todayAttendances: 0,
    activeEmployees: 0,
    onTimeToday: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);

      // Fetch employees
      const employeesResponse = await employeeService.getAll({ limit: 1000 });
      const totalEmployees = employeesResponse.meta.total;
      const activeEmployees = employeesResponse.data.filter(
        (emp) => emp.status === 'active'
      ).length;

      // Fetch today's attendances
      const todayAttendances = await attendanceService.getTodayAttendances();
      const onTimeToday = todayAttendances.filter(
        (att) => att.status === 'present'
      ).length;

      setStats({
        totalEmployees,
        todayAttendances: todayAttendances.length,
        activeEmployees,
        onTimeToday,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs:12, sm:6, md:3 }} >
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<People />}
          color="#667eea"
        />
      </Grid>
      <Grid size={{ xs:12, sm:6, md:3 }} >
        <StatCard
          title="Active Employees"
          value={stats.activeEmployees}
          icon={<TrendingUp />}
          color="#764ba2"
        />
      </Grid>
      <Grid size={{ xs:12, sm:6, md:3 }} >
        <StatCard
          title="Today's Attendance"
          value={stats.todayAttendances}
          icon={<AccessTime />}
          color="#f093fb"
        />
      </Grid>
      <Grid size={{ xs:12, sm:6, md:3 }} >
        <StatCard
          title="On Time Today"
          value={stats.onTimeToday}
          icon={<CheckCircle />}
          color="#4facfe"
        />
      </Grid>
    </Grid>
  );
};