import { Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Controller('health')
export class HealthController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async checkHealth() {
    const authUrl = this.configService.get('AUTH_SERVICE_URL');
    const employeeUrl = this.configService.get('EMPLOYEE_SERVICE_URL');
    const attendanceUrl = this.configService.get('ATTENDANCE_SERVICE_URL');

    const services = {
      gateway: 'healthy',
      auth: await this.checkService(authUrl),
      employee: await this.checkService(employeeUrl),
      attendance: await this.checkService(attendanceUrl),
    };

    const allHealthy = Object.values(services).every((s) => s === 'healthy');

    return {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services,
    };
  }

  private async checkService(url: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${url}/`, {
          timeout: 3000,
          validateStatus: () => true, // Accept any status
        }),
      );
      
      // Service is considered healthy if it responds (even with 404)
      return response.status < 500 ? 'healthy' : 'unhealthy';
    } catch (error) {
      console.error(`Health check failed for ${url}:`, error.message);
      return 'unhealthy';
    }
  }
}