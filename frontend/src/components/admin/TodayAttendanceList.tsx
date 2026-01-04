import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import { format } from 'date-fns';
import { Attendance } from '../../types';
import { attendanceService } from '../../services/attendanceService';
import { Loading } from '../common/Loading';

export const TodayAttendanceList: React.FC = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTodayAttendances();
  }, []);

  const fetchTodayAttendances = async () => {
    try {
      setIsLoading(true);
      const data = await attendanceService.getTodayAttendances();
      setAttendances(data);
    } catch (error) {
      console.error('Failed to fetch today attendances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading message="Loading today's attendances..." />;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AccessTime sx={{ mr: 1 }} color="primary" />
        <Typography variant="h6">Today's Attendances</Typography>
      </Box>

      {attendances.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center" py={4}>
          No attendances recorded today
        </Typography>
      ) : (
        <List>
          {attendances.map((attendance, index) => (
            <React.Fragment key={attendance.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    src={attendanceService.getPhotoUrl(attendance.photoUrl)}
                    alt={attendance.employee?.user?.fullName}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2">
                        {attendance.employee?.user?.fullName || 'Unknown'}
                      </Typography>
                      <Chip
                        label={attendance.status === 'late' ? 'Late' : 'On Time'}
                        color={attendance.status === 'late' ? 'warning' : 'success'}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {attendance.employee?.employeeCode} • {attendance.employee?.department}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Clock In: {format(new Date(attendance.clockIn), 'HH:mm')}
                        {attendance.clockOut && (
                          <> • Clock Out: {format(new Date(attendance.clockOut), 'HH:mm')}</>
                        )}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < attendances.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};