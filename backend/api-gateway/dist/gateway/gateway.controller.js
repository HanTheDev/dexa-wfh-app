"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const platform_express_1 = require("@nestjs/platform-express");
let GatewayController = class GatewayController {
    httpService;
    configService;
    authServiceUrl;
    employeeServiceUrl;
    attendanceServiceUrl;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        const authUrl = this.configService.get('AUTH_SERVICE_URL');
        const employeeUrl = this.configService.get('EMPLOYEE_SERVICE_URL');
        const attendanceUrl = this.configService.get('ATTENDANCE_SERVICE_URL');
        if (!authUrl || !employeeUrl || !attendanceUrl) {
            throw new Error('Missing required environment variables for service URLs');
        }
        this.authServiceUrl = authUrl;
        this.employeeServiceUrl = employeeUrl;
        this.attendanceServiceUrl = attendanceUrl;
    }
    async proxyAuth(req, res) {
        const path = req.url.replace('/api/auth', '/auth');
        return this.proxyRequest(req, res, this.authServiceUrl, path);
    }
    async proxyEmployees(req, res) {
        const path = req.url.replace(/^\/api\/employees/, '/employees');
        const finalPath = path.startsWith('/employees') ? path : `/employees${path}`;
        return this.proxyRequest(req, res, this.employeeServiceUrl, finalPath);
    }
    async proxyClockIn(req, res, file) {
        try {
            const FormData = require('form-data');
            const formData = new FormData();
            if (file) {
                formData.append('photo', file.buffer, {
                    filename: file.originalname,
                    contentType: file.mimetype,
                });
            }
            if (req.body.notes) {
                formData.append('notes', req.body.notes);
            }
            const targetUrl = `${this.attendanceServiceUrl}/attendances/clock-in`;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(targetUrl, formData, {
                headers: {
                    ...formData.getHeaders(),
                    authorization: req.headers.authorization,
                },
            }));
            return res.status(response.status).json(response.data);
        }
        catch (error) {
            this.handleError(error, res);
        }
    }
    async proxyAttendances(req, res) {
        const path = req.url.replace(/^\/api\/attendances/, '/attendances');
        const finalPath = path.startsWith('/attendances') ? path : `/attendances${path}`;
        return this.proxyRequest(req, res, this.attendanceServiceUrl, finalPath);
    }
    async proxyRequest(req, res, serviceUrl, customPath) {
        try {
            const path = customPath || req.url;
            const targetUrl = `${serviceUrl}${path}`;
            console.log(`[Gateway] ${req.method} ${req.url} -> ${targetUrl}`);
            const headers = {
                'content-type': req.headers['content-type'] || 'application/json',
            };
            if (req.headers.authorization) {
                headers.authorization = req.headers.authorization;
            }
            let response;
            switch (req.method) {
                case 'GET':
                    response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(targetUrl, { headers }));
                    break;
                case 'POST':
                    response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(targetUrl, req.body, { headers }));
                    break;
                case 'PUT':
                    response = await (0, rxjs_1.firstValueFrom)(this.httpService.put(targetUrl, req.body, { headers }));
                    break;
                case 'PATCH':
                    response = await (0, rxjs_1.firstValueFrom)(this.httpService.patch(targetUrl, req.body, { headers }));
                    break;
                case 'DELETE':
                    response = await (0, rxjs_1.firstValueFrom)(this.httpService.delete(targetUrl, { headers }));
                    break;
                default:
                    throw new common_1.HttpException(`Method ${req.method} not supported`, common_1.HttpStatus.METHOD_NOT_ALLOWED);
            }
            console.log(`[Gateway] Response: ${response.status}`);
            return res.status(response.status).json(response.data);
        }
        catch (error) {
            console.error(`[Gateway] Error:`, error.message);
            this.handleError(error, res);
        }
    }
    handleError(error, res) {
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errors = null;
        if (error.response) {
            status = error.response.status;
            message = error.response.data?.message || error.message;
            errors = error.response.data?.errors || null;
        }
        else if (error.code === 'ECONNREFUSED') {
            status = common_1.HttpStatus.SERVICE_UNAVAILABLE;
            message = 'Service unavailable';
        }
        return res.status(status).json({
            statusCode: status,
            message,
            errors,
            timestamp: new Date().toISOString(),
        });
    }
};
exports.GatewayController = GatewayController;
__decorate([
    (0, common_1.All)('auth/*path'),
    (0, common_1.All)('auth*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyAuth", null);
__decorate([
    (0, common_1.All)(['employees', 'employees/*']),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyEmployees", null);
__decorate([
    (0, common_1.All)('attendances/clock-in'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyClockIn", null);
__decorate([
    (0, common_1.All)(['attendances', 'attendances/*']),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "proxyAttendances", null);
exports.GatewayController = GatewayController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], GatewayController);
//# sourceMappingURL=gateway.controller.js.map