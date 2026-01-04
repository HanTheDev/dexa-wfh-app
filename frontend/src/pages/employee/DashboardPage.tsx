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
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Fade,
  Grow,
} from '@mui/material';
import {
  WbSunny,
  CheckCircle,
  CameraAlt,
  Schedule,
  EventNote,
  TipsAndUpdates,
} from '@mui/icons-material';
import { Attendance } from '../../types';
import { attendanceService } from '../../services/attendanceService';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';

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

  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 ? 'Good Morning' : 
                   currentTime.getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <Layout>
      {/* Header dengan Greeting */}
      <Fade in timeout={500}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <WbSunny sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2,
                }}
              >
                {greeting}, {user?.fullName?.split(' ')[0]}! 👋
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                {format(new Date(), 'EEEE, MMMM dd, yyyy')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {/* Today Status Card */}
        <Grid size={{ xs: 12 }}>
          <Grow in timeout={700}>
            <Box>
              <TodayStatusCard
                attendance={todayAttendance}
                onClockOut={handleClockOut}
              />
            </Box>
          </Grow>
        </Grid>

        {/* Main Content Area */}
        {!hasClockedIn ? (
          <>
            {/* Clock In Form */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Grow in timeout={900}>
                <Box>
                  <ClockInForm onSuccess={handleClockInSuccess} />
                </Box>
              </Grow>
            </Grid>

            {/* Instructions Card */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Grow in timeout={1100}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    border: '2px solid',
                    borderColor: 'primary.light',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <TipsAndUpdates sx={{ color: 'primary.main', fontSize: 28 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Quick Guide
                      </Typography>
                    </Box>

                    <List sx={{ p: 0 }}>
                      {[
                        { icon: <CameraAlt />, text: 'Take a clear photo of yourself at your workspace', color: '#667eea' },
                        { icon: <EventNote />, text: 'Add optional notes about your tasks for today', color: '#764ba2' },
                        { icon: <CheckCircle />, text: 'Click "Clock In Now" to start your workday', color: '#10b981' },
                        { icon: <Schedule />, text: 'Remember to clock out when you finish!', color: '#f59e0b' },
                      ].map((item, index) => (
                        <ListItem 
                          key={index}
                          sx={{ 
                            px: 0,
                            py: 1.5,
                            '&:not(:last-child)': {
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                bgcolor: `${item.color}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: item.color,
                              }}
                            >
                              {item.icon}
                            </Box>
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.text}
                            primaryTypographyProps={{
                              variant: 'body2',
                              sx: { fontWeight: 500, lineHeight: 1.5 },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Alert 
                      severity="info" 
                      sx={{ 
                        mt: 3,
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                          fontSize: 24,
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Best Practice: Clock in before 9:00 AM to be marked as "On Time"
                      </Typography>
                    </Alert>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          </>
        ) : (
          <>
            {/* Already Clocked In - Show Stats */}
            {todayAttendance?.clockOut ? (
              <Grid size={{ xs: 12 }}>
                <Fade in timeout={1000}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #10b98120 0%, #05966920 100%)',
                      border: '2px solid',
                      borderColor: 'success.light',
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Great Work Today! 🎉
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        You've successfully completed your work for today. Have a great rest of your day!
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Chip 
                          label={`Work Duration: ${Math.floor((todayAttendance.workDuration || 0) / 60)}h ${(todayAttendance.workDuration || 0) % 60}m`}
                          color="success"
                          sx={{ fontWeight: 700, fontSize: '0.9rem', px: 2, py: 2.5 }}
                        />
                        <Chip 
                          label={`Status: ${todayAttendance.status === 'late' ? 'Late' : 'On Time'}`}
                          color={todayAttendance.status === 'late' ? 'warning' : 'success'}
                          sx={{ fontWeight: 700, fontSize: '0.9rem', px: 2, py: 2.5 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ) : (
              <Grid size={{ xs: 12 }}>
                <Fade in timeout={1000}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #3b82f620 0%, #2563eb20 100%)',
                      border: '2px solid',
                      borderColor: 'info.light',
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Schedule sx={{ fontSize: 64, color: 'info.main', mb: 2 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        You're All Set! ⏰
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        You've clocked in for today. Don't forget to clock out when you finish your work.
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        Current Status: <Chip 
                          label="Working" 
                          color="info" 
                          sx={{ fontWeight: 700, fontSize: '0.9rem' }}
                        />
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Layout>
  );
};