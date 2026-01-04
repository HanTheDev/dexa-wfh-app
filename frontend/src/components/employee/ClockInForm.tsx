import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Alert,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  CameraAlt,
  CloudUpload,
  Delete,
  AccessTime,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { attendanceService } from '../../services/attendanceService';
import { Attendance } from '../../types';

interface ClockInFormProps {
  onSuccess: (attendance: Attendance) => void;
}

interface ClockInFormData {
  notes: string;
}

export const ClockInForm: React.FC<ClockInFormProps> = ({ onSuccess }) => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClockInFormData>();

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setPhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: ClockInFormData) => {
    if (!photo) {
      toast.error('Please upload a photo');
      return;
    }

    try {
      setIsSubmitting(true);
      const attendance = await attendanceService.clockIn(photo, data.notes);
      toast.success('Clock-in successful!');
      reset();
      handleRemovePhoto();
      onSuccess(attendance);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to clock-in';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTime color="primary" />
          Clock In
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          {/* Photo Upload */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Upload Photo Proof *
            </Typography>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              style={{ display: 'none' }}
              id="photo-upload"
            />

            {!photoPreview ? (
              <label htmlFor="photo-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CameraAlt />}
                  fullWidth
                  sx={{ py: 2 }}
                >
                  Take or Upload Photo
                </Button>
              </label>
            ) : (
              <Box sx={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                <Avatar
                  src={photoPreview}
                  variant="rounded"
                  sx={{
                    width: '100%',
                    height: 300,
                    objectFit: 'cover',
                  }}
                />
                <IconButton
                  onClick={handleRemovePhoto}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'error.light', color: 'white' },
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            )}

            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Max size: 5MB. Formats: JPG, PNG
            </Typography>
          </Box>

          {/* Notes */}
          <TextField
            fullWidth
            label="Notes (Optional)"
            multiline
            rows={3}
            {...register('notes')}
            error={!!errors.notes}
            helperText={errors.notes?.message}
            placeholder="Add any notes about your work today..."
            sx={{ mb: 2 }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting || !photo}
            startIcon={<CloudUpload />}
          >
            {isSubmitting ? 'Clocking In...' : 'Clock In Now'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};