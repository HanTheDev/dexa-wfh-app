import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  LinearProgress,
  Skeleton,
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
  gradient: string;
  percentage?: number;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  gradient,
  percentage,
  isLoading 
}) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3,
        height: '100%',
        borderRadius: 3,
        background: `linear-gradient(135deg, ${gradient})`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          transform: 'translate(30%, -30%)',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 600,
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem',
              }}
            >
              {title}
            </Typography>
            {isLoading ? (
              <Skeleton 
                variant="text" 
                width="60%" 
                height={48}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
              />
            ) : (
              <Typography 
                variant="h3" 
                sx={{ 
                  color: 'white',
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                {value}
              </Typography>
            )}
          </Box>
          <Avatar 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.25)',
              width: 56, 
              height: 56,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            {icon}
          </Avatar>
        </Box>

        {percentage !== undefined && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 600,
                }}
              >
                Completion
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 700,
                }}
              >
                {percentage}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={percentage}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.25)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.9)',
                },
              }}
            />
          </Box>
        )}
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

  const attendancePercentage = stats.activeEmployees > 0 
    ? Math.round((stats.todayAttendances / stats.activeEmployees) * 100)
    : 0;

  const onTimePercentage = stats.todayAttendances > 0
    ? Math.round((stats.onTimeToday / stats.todayAttendances) * 100)
    : 0;

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<People sx={{ fontSize: 28, color: 'white' }} />}
          color="#667eea"
          gradient="#667eea 0%, #764ba2 100%"
          isLoading={isLoading}
        />
      </Grid>
      
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Active Employees"
          value={stats.activeEmployees}
          icon={<TrendingUp sx={{ fontSize: 28, color: 'white' }} />}
          color="#10b981"
          gradient="#10b981 0%, #059669 100%"
          percentage={stats.totalEmployees > 0 
            ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100)
            : 0}
          isLoading={isLoading}
        />
      </Grid>
      
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Today's Attendance"
          value={stats.todayAttendances}
          icon={<AccessTime sx={{ fontSize: 28, color: 'white' }} />}
          color="#3b82f6"
          gradient="#3b82f6 0%, #2563eb 100%"
          percentage={attendancePercentage}
          isLoading={isLoading}
        />
      </Grid>
      
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="On Time Today"
          value={stats.onTimeToday}
          icon={<CheckCircle sx={{ fontSize: 28, color: 'white' }} />}
          color="#f59e0b"
          gradient="#f59e0b 0%, #d97706 100%"
          percentage={onTimePercentage}
          isLoading={isLoading}
        />
      </Grid>
    </Grid>
  );
};