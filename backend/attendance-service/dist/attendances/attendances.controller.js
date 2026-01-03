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
exports.AttendancesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const attendances_service_1 = require("./attendances.service");
const clock_in_dto_1 = require("./dto/clock-in.dto");
const clock_out_dto_1 = require("./dto/clock-out.dto");
const query_attendance_dto_1 = require("./dto/query-attendance.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const multer_config_1 = require("../config/multer.config");
let AttendancesController = class AttendancesController {
    attendancesService;
    constructor(attendancesService) {
        this.attendancesService = attendancesService;
    }
    clockIn(req, clockInDto, file) {
        if (!file) {
            throw new common_1.BadRequestException('Photo is required');
        }
        const photoPath = `/uploads/attendances/${file.filename}`;
        return this.attendancesService.clockIn(req.user.id, clockInDto, photoPath);
    }
    clockOut(id, req, clockOutDto) {
        return this.attendancesService.clockOut(id, req.user.id, clockOutDto);
    }
    findAll(query) {
        return this.attendancesService.findAll(query);
    }
    findMyAttendances(req, query) {
        return this.attendancesService.findMyAttendances(req.user.id, query);
    }
    getTodayAttendances() {
        return this.attendancesService.getTodayAttendances();
    }
    checkTodayStatus(req) {
        return this.attendancesService.checkTodayStatus(req.user.id);
    }
    findByEmployee(employeeId, query) {
        return this.attendancesService.findByEmployee(employeeId, query);
    }
    findOne(id) {
        return this.attendancesService.findOne(id);
    }
};
exports.AttendancesController = AttendancesController;
__decorate([
    (0, common_1.Post)('clock-in'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', multer_config_1.multerConfig)),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, clock_in_dto_1.ClockInDto, Object]),
    __metadata("design:returntype", void 0)
], AttendancesController.prototype, "clockIn", null);
__decorate([
    (0, common_1.Put)(':id/clock-out'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, clock_out_dto_1.ClockOutDto]),
    __metadata("design:returntype", void 0)
], AttendancesController.prototype, "clockOut", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_attendance_dto_1.QueryAttendanceDto]),
    __metadata("design:returntype", void 0)
], AttendancesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-attendances'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_attendance_dto_1.QueryAttendanceDto]),
    __metadata("design:returntype", void 0)
], AttendancesController.prototype, "findMyAttendances", null);
__decorate([
    (0, common_1.Get)('today'),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AttendancesController.prototype, "getTodayAttendances", null);
__decorate([
    (0, common_1.Get)('today-status'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AttendancesController.prototype, "checkTodayStatus", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, query_attendance_dto_1.QueryAttendanceDto]),
    __metadata("design:returntype", void 0)
], AttendancesController.prototype, "findByEmployee", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AttendancesController.prototype, "findOne", null);
exports.AttendancesController = AttendancesController = __decorate([
    (0, common_1.Controller)('attendances'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [attendances_service_1.AttendancesService])
], AttendancesController);
//# sourceMappingURL=attendances.controller.js.map