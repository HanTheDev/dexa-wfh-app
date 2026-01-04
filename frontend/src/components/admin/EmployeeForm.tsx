import React from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid, // Grid utama
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Employee, CreateEmployeeRequest } from "../../types";
import { employeeService } from "../../services/employeeService";
import { toast } from "react-toastify";

const createSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
  fullName: yup.string().required("Full name is required"),
  employeeCode: yup.string().required("Employee code is required"),
  position: yup.string().required("Position is required"),
  department: yup.string().required("Department is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string(),
  joinDate: yup.string().required("Join date is required"),
  status: yup.string().oneOf(["active", "inactive", "resigned"]),
});

const updateSchema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  position: yup.string().required("Position is required"),
  department: yup.string().required("Department is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string(),
  joinDate: yup.string().required("Join date is required"),
  status: yup.string().oneOf(["active", "inactive", "resigned"]),
});

interface EmployeeFormProps {
  employee: Employee | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  onSuccess,
  onCancel,
}) => {
  const isEdit = !!employee;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateEmployeeRequest>({
    resolver: yupResolver(isEdit ? updateSchema : createSchema) as any,
    defaultValues: isEdit
      ? {
          fullName: employee.user?.fullName,
          position: employee.position,
          department: employee.department,
          phone: employee.phone,
          address: employee.address,
          joinDate: employee.joinDate,
          status: employee.status,
        }
      : undefined,
  });

  const onSubmit = async (data: CreateEmployeeRequest) => {
    try {
      if (isEdit) {
        await employeeService.update(employee.id, data);
        toast.success("Employee updated successfully");
      } else {
        await employeeService.create(data);
        toast.success("Employee created successfully");
      }
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.message || "Operation failed";
      toast.error(message);
    }
  };

  return (
    <>
      <DialogTitle>{isEdit ? "Edit Employee" : "Add New Employee"}</DialogTitle>
      <DialogContent>
        {/* PERBAIKAN: Gunakan Grid dengan prop container */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {!isEdit && (
            <>
              {/* PERBAIKAN: Grid item menggunakan prop item={true} */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Employee Code"
                  {...register("employeeCode")}
                  error={!!errors.employeeCode}
                  helperText={errors.employeeCode?.message}
                />
              </Grid>
            </>
          )}
          <Grid size={{ xs: 12, sm:isEdit ? 12 : 6 }}>
            <TextField
              fullWidth
              label="Full Name"
              {...register("fullName")}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Position"
              {...register("position")}
              error={!!errors.position}
              helperText={errors.position?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Department"
              {...register("department")}
              error={!!errors.department}
              helperText={errors.department?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Phone"
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Join Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register("joinDate")}
              error={!!errors.joinDate}
              helperText={errors.joinDate?.message}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={2}
              {...register("address")}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Status"
              select
              defaultValue="active"
              {...register("status")}
              error={!!errors.status}
              helperText={errors.status?.message}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="resigned">Resigned</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </>
  );
};