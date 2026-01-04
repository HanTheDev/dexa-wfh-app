import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  TextField,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Search,
} from '@mui/icons-material';
import { Employee } from '../../types';
import { employeeService } from '../../services/employeeService';
import { Loading } from '../common/Loading';
import { toast } from 'react-toastify';
import { EmployeeForm } from './EmployeeForm';

export const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, [page, rowsPerPage, search]);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await employeeService.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search: search || undefined,
      });
      setEmployees(response.data);
      setTotal(response.meta.total);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      toast.error('Failed to load employees');
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleOpenForm = (employee?: Employee) => {
    setSelectedEmployee(employee || null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedEmployee(null);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
    fetchEmployees();
  };

  const handleOpenDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedEmployee(null);
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;

    try {
      await employeeService.delete(selectedEmployee.id);
      toast.success('Employee deleted successfully');
      handleCloseDelete();
      fetchEmployees();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete employee');
    }
  };

  if (isLoading && employees.length === 0) {
    return <Loading message="Loading employees..." />;
  }

  return (
    <Box>
      {/* Toolbar */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          placeholder="Search employees..."
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenForm()}
        >
          Add Employee
        </Button>
      </Box>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" py={4}>
                      No employees found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow key={employee.id} hover>
                    <TableCell>{employee.employeeCode}</TableCell>
                    <TableCell>{employee.user?.fullName || '-'}</TableCell>
                    <TableCell>{employee.user?.email || '-'}</TableCell>
                    <TableCell>{employee.position || '-'}</TableCell>
                    <TableCell>{employee.department || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={employee.status}
                        color={employee.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenForm(employee)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpenDelete(employee)}
                      >
                        <Delete />
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
      </Paper>

      {/* Employee Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <EmployeeForm
          employee={selectedEmployee}
          onSuccess={handleFormSuccess}
          onCancel={handleCloseForm}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete employee{' '}
            <strong>{selectedEmployee?.user?.fullName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};