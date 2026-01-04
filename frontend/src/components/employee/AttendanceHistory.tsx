import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Box,
  Typography,
  TablePagination,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { format } from 'date-fns';
import { Attendance } from '../../types';
import { attendanceService } from '../../services/attendanceService';
import { Loading } from '../common/Loading';

export const AttendanceHistory: React.FC = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    fetchAttendances();
  }, [page, rowsPerPage]);

  const fetchAttendances = async () => {
    try {
      setIsLoading(true);
      const response = await attendanceService.getMyAttendances({
        page: page + 1,
        limit: rowsPerPage,
      });
      setAttendances(response.data);
      setTotal(response.meta.total);
    } catch (error) {
      console.error('Failed to fetch attendances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewPhoto = (photoUrl: string) => {
    setSelectedPhoto(attendanceService.getPhotoUrl(photoUrl));
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  if (isLoading && attendances.length === 0) {
    return <Loading message="Loading attendance history..." />;
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Clock In</TableCell>
              <TableCell>Clock Out</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Photo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary" py={4}>
                    No attendance records found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              attendances.map((attendance) => (
                <TableRow key={attendance.id} hover>
                  <TableCell>
                    {format(new Date(attendance.date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(attendance.clockIn), 'HH:mm')}
                  </TableCell>
                  <TableCell>
                    {attendance.clockOut
                      ? format(new Date(attendance.clockOut), 'HH:mm')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {attendance.workDuration ? (
                      <>
                        {Math.floor(attendance.workDuration / 60)}h{' '}
                        {attendance.workDuration % 60}m
                      </>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={attendance.status === 'late' ? 'Late' : 'On Time'}
                      color={attendance.status === 'late' ? 'warning' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleViewPhoto(attendance.photoUrl)}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Photo Dialog */}
      <Dialog open={!!selectedPhoto} onClose={handleClosePhoto} maxWidth="md">
        <DialogTitle>Attendance Photo</DialogTitle>
        <DialogContent>
          {selectedPhoto && (
            <Box
              component="img"
              src={selectedPhoto}
              alt="Attendance proof"
              sx={{
                width: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};