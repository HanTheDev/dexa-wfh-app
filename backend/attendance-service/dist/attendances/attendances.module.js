"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendancesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const attendances_service_1 = require("./attendances.service");
const attendances_controller_1 = require("./attendances.controller");
const attendance_entity_1 = require("./entities/attendance.entity");
const employee_entity_1 = require("../employees/entities/employee.entity");
const jwt_strategy_1 = require("../auth/strategies/jwt.strategy");
const roles_guard_1 = require("../auth/guards/roles.guard");
const user_entity_1 = require("../users/entities/user.entity");
let AttendancesModule = class AttendancesModule {
};
exports.AttendancesModule = AttendancesModule;
exports.AttendancesModule = AttendancesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([attendance_entity_1.Attendance, employee_entity_1.Employee, user_entity_1.User]),
            passport_1.PassportModule,
            platform_express_1.MulterModule.register({
                dest: './uploads/attendances',
            }),
        ],
        controllers: [attendances_controller_1.AttendancesController],
        providers: [attendances_service_1.AttendancesService, jwt_strategy_1.JwtStrategy, roles_guard_1.RolesGuard],
        exports: [attendances_service_1.AttendancesService],
    })
], AttendancesModule);
//# sourceMappingURL=attendances.module.js.map