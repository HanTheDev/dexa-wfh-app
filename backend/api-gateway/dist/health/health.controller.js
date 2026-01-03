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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let HealthController = class HealthController {
    httpService;
    configService;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
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
    async checkService(url) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${url}/`, {
                timeout: 3000,
                validateStatus: () => true,
            }));
            return response.status < 500 ? 'healthy' : 'unhealthy';
        }
        catch (error) {
            console.error(`Health check failed for ${url}:`, error.message);
            return 'unhealthy';
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "checkHealth", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], HealthController);
//# sourceMappingURL=health.controller.js.map