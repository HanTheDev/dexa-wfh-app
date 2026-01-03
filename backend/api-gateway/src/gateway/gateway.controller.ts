import {
  Controller,
  All,
  Req,
  Res,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class GatewayController {
  private readonly authServiceUrl: string;
  private readonly employeeServiceUrl: string;
  private readonly attendanceServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Validasi
    const authUrl = this.configService.get('AUTH_SERVICE_URL');
    const employeeUrl = this.configService.get('EMPLOYEE_SERVICE_URL');
    const attendanceUrl = this.configService.get('ATTENDANCE_SERVICE_URL');

    if (!authUrl || !employeeUrl || !attendanceUrl) {
      throw new Error(
        'Missing required environment variables for service URLs',
      );
    }

    this.authServiceUrl = authUrl;
    this.employeeServiceUrl = employeeUrl;
    this.attendanceServiceUrl = attendanceUrl;
  }

  // Auth routes
  @All('auth/*path')
  @All('auth*')
  async proxyAuth(@Req() req: Request, @Res() res: Response) {
    const path = req.url.replace('/api/auth', '/auth');
    return this.proxyRequest(req, res, this.authServiceUrl, path);
  }

  // Employee routes
  @All('employees/*path')
  @All('employees*')
  async proxyEmployees(@Req() req: Request, @Res() res: Response) {
    const path = req.url.replace('/api/employees', '/employees');
    return this.proxyRequest(req, res, this.employeeServiceUrl, path);
  }

  // Attendance clock-in (special handling for file upload)
  @All('attendances/clock-in')
  @UseInterceptors(FileInterceptor('photo'))
  async proxyClockIn(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const FormData = require('form-data');
      const formData = new FormData();

      // Add file if exists
      if (file) {
        formData.append('photo', file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });
      }

      // Add other fields from body
      if (req.body.notes) {
        formData.append('notes', req.body.notes);
      }

      const targetUrl = `${this.attendanceServiceUrl}/attendances/clock-in`;

      const response = await firstValueFrom(
        this.httpService.post(targetUrl, formData, {
          headers: {
            ...formData.getHeaders(),
            authorization: req.headers.authorization,
          },
        }),
      );

      return res.status(response.status).json(response.data);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  // Attendance routes
  @All('attendances/*path')
  @All('attendances*')
  async proxyAttendances(@Req() req: Request, @Res() res: Response) {
    const path = req.url.replace('/api/attendances', '/attendances');
    return this.proxyRequest(req, res, this.attendanceServiceUrl, path);
  }

  private async proxyRequest(
    req: Request,
    res: Response,
    serviceUrl: string,
    customPath?: string,
  ) {
    try {
      // Use custom path or extract from URL
      const path = customPath || req.url;
      const targetUrl = `${serviceUrl}${path}`;

      console.log(`[Gateway] ${req.method} ${req.url} -> ${targetUrl}`);

      // Prepare headers
      const headers: any = {
        'content-type': req.headers['content-type'] || 'application/json',
      };

      // Forward authorization header
      if (req.headers.authorization) {
        headers.authorization = req.headers.authorization;
      }

      // Make request based on method
      let response;
      switch (req.method) {
        case 'GET':
          response = await firstValueFrom(
            this.httpService.get(targetUrl, { headers }),
          );
          break;
        case 'POST':
          response = await firstValueFrom(
            this.httpService.post(targetUrl, req.body, { headers }),
          );
          break;
        case 'PUT':
          response = await firstValueFrom(
            this.httpService.put(targetUrl, req.body, { headers }),
          );
          break;
        case 'PATCH':
          response = await firstValueFrom(
            this.httpService.patch(targetUrl, req.body, { headers }),
          );
          break;
        case 'DELETE':
          response = await firstValueFrom(
            this.httpService.delete(targetUrl, { headers }),
          );
          break;
        default:
          throw new HttpException(
            `Method ${req.method} not supported`,
            HttpStatus.METHOD_NOT_ALLOWED,
          );
      }

      console.log(`[Gateway] Response: ${response.status}`);
      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error(`[Gateway] Error:`, error.message);
      this.handleError(error, res);
    }
  }

  private handleError(error: any, res: Response) {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors = null;

    if (error.response) {
      status = error.response.status;
      message = error.response.data?.message || error.message;
      errors = error.response.data?.errors || null;
    } else if (error.code === 'ECONNREFUSED') {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Service unavailable';
    }

    return res.status(status).json({
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}