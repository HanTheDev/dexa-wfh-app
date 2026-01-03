import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
export declare class GatewayController {
    private readonly httpService;
    private readonly configService;
    private readonly authServiceUrl;
    private readonly employeeServiceUrl;
    private readonly attendanceServiceUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    proxyAuth(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    proxyEmployees(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    proxyClockIn(req: Request, res: Response, file: Express.Multer.File): Promise<Response<any, Record<string, any>> | undefined>;
    proxyAttendances(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    private proxyRequest;
    private handleError;
}
