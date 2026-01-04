import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  ExitToApp,
  AccessTime,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Attendance } from '../../types';
import { attendanceService } from '../../services/attendanceService';

interface TodayStatusCardProps {
  attendance: Attendance | null;
  onClockOut: (attendance: Attendance) => void;
}

export const TodayStatusCard: React.FC<TodayStatusCardProps> = ({
  attendance,
  onClockOut,
}) => {
  const [isClockingOut, setIsClockingOut] = React.useState(false);

  const handleClockOut = async () => {
    if (!attendance) return;

    try {
      setIsClockingOut(true);
      const updated = await attendanceService.clockOut(attendance.id);
      onClockOut(updated);
    } catch (error: any) {
      console.error('Clock out failed:', error);
    } finally {
      setIsClockingOut(false);
    }
  };

  if (!attendance) {
    return (
      <Card sx={{ bgcolor: 'warning.light' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Schedule fontSize="large" />
            <Box>
              <Typography variant="h6">Not Clocked In</Typography>
              <Typography variant="body2">
                You haven't clocked in today yet.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const clockInTime = new Date(attendance.clockIn);
  const clockOutTime = attendance.clockOut ? new Date(attendance.clockOut) : null;
  const hasWorked = attendance.workDuration ? attendance.workDuration > 0 : false;

  return (
    <Card sx={{ bgcolor: attendance.clockOut ? 'success.light' : 'primary.light' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Avatar
              src={attendanceService.getPhotoUrl(attendance.photoUrl)}
              variant="rounded"
              sx={{ width: 80, height: 80 }}
            />
            
            <Box>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {attendance.clockOut ? (
                  <>
                    <CheckCircle color="success" />
                    Work Completed
                  </>
                ) : (
                  <>
                    <AccessTime color="primary" />
                    Currently Working
                  </>
                )}
              </Typography>

              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Clock In:</strong> {format(clockInTime, 'HH:mm')}
                </Typography>
                {clockOutTime && (
                  <Typography variant="body2">
                    <strong>Clock Out:</strong> {format(clockOutTime, 'HH:mm')}
                  </Typography>
                )}
                {hasWorked && attendance.workDuration && (
                  <Typography variant="body2">
                    <strong>Duration:</strong>{' '}
                    {Math.floor(attendance.workDuration / 60)}h {attendance.workDuration % 60}m
                  </Typography>
                )}
              </Box>

              <Box sx={{ mt: 1 }}>
                <Chip
                  label={attendance.status === 'late' ? 'Late' : 'On Time'}
                  color={attendance.status === 'late' ? 'warning' : 'success'}
                  size="small"
                />
              </Box>
            </Box>
          </Box>

          {!attendance.clockOut && (
            <Button
              variant="contained"
              color="error"
              startIcon={<ExitToApp />}
              onClick={handleClockOut}
              disabled={isClockingOut}
            >
              {isClockingOut ? 'Clocking Out...' : 'Clock Out'}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};