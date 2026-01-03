import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class HealthController {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    checkHealth(): Promise<{
        status: string;
        timestamp: string;
        services: {
            gateway: string;
            auth: string;
            employee: string;
            attendance: string;
        };
    }>;
    private checkService;
}
