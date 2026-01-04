import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  TextField,
  TablePagination,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  MenuItem,
  Grid,
  Button,
} from "@mui/material";
import { Visibility, FilterList, Clear } from "@mui/icons-material";
import { format, subDays } from "date-fns";
import { Attendance } from "../../types";
import { attendanceService } from "../../services/attendanceService";
import { Loading } from "../common/Loading";
import { toast } from "react-toastify";

export const AttendanceMonitor: React.FC = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Filters - default 7 hari terakhir
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 7), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchAttendances();
  }, [page, rowsPerPage, startDate, endDate, status]);

  const fetchAttendances = async () => {
    try {
      setIsLoading(true);
      const response = await attendanceService.getAll({
        page: page + 1,
        limit: rowsPerPage,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        status: status || undefined,
      });
      setAttendances(response.data);
      setTotal(response.meta.total);
    } catch (error: any) {
      console.error("Failed to fetch attendances:", error);
      toast.error(error.response?.data?.message || "Failed to load attendances");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewPhoto = (photoUrl: string) => {
    setSelectedPhoto(attendanceService.getPhotoUrl(photoUrl));
  };

  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  const handleClearFilters = () => {
    setStartDate(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
    setEndDate(format(new Date(), 'yyyy-MM-dd'));
    setStatus("");
    setPage(0);
  };

  if (isLoading && attendances.length === 0) {
    return <Loading message="Loading attendances..." />;
  }

  return (
    <Box>
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FilterList sx={{ mr: 1 }} />
          <Typography variant="h6">Filters</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(0);
              }}
              inputProps={{
                max: endDate || new Date().toISOString().split("T")[0],
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(0);
              }}
              inputProps={{
                min: startDate || undefined, 
                max: new Date().toISOString().split("T")[0],
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Status"
              select
              size="small"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="present">Present</MenuItem>
              <MenuItem value="late">Late</MenuItem>
              <MenuItem value="absent">Absent</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClearFilters}
              sx={{ height: '40px' }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Department</TableCell>
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
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body2" color="text.secondary" py={4}>
                      No attendance records found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                attendances.map((attendance) => (
                  <TableRow key={attendance.id} hover>
                    <TableCell>
                      {format(new Date(attendance.date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {attendance.employee?.user?.fullName || "-"}
                    </TableCell>
                    <TableCell>
                      {attendance.employee?.employeeCode || "-"}
                    </TableCell>
                    <TableCell>
                      {attendance.employee?.department || "-"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(attendance.clockIn), "HH:mm")}
                    </TableCell>
                    <TableCell>
                      {attendance.clockOut
                        ? format(new Date(attendance.clockOut), "HH:mm")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {attendance.workDuration ? (
                        <>
                          {Math.floor(attendance.workDuration / 60)}h{" "}
                          {attendance.workDuration % 60}m
                        </>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          attendance.status === "late" ? "Late" : "On Time"
                        }
                        color={
                          attendance.status === "late" ? "warning" : "success"
                        }
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Photo Dialog */}
      <Dialog open={!!selectedPhoto} onClose={handleClosePhoto} maxWidth="md">
        <DialogTitle>Attendance Photo</DialogTitle>
        <DialogContent>
          {selectedPhoto && (
            <Box
              component="img"
              src={selectedPhoto}
              alt="Attendance proof"
              onError={(e) => {
                console.error('Image failed to load:', selectedPhoto);
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
              }}
              sx={{
                width: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};