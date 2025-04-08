"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrchestrationModule = void 0;
const common_1 = require("@nestjs/common");
const orchestration_controller_1 = require("./orchestration.controller");
const orchestration_service_1 = require("./orchestration.service");
const conversations_module_1 = require("../conversations/conversations.module");
const agents_module_1 = require("../agents/agents.module");
const mcp_module_1 = require("../mcp/mcp.module");
let OrchestrationModule = class OrchestrationModule {
};
exports.OrchestrationModule = OrchestrationModule;
exports.OrchestrationModule = OrchestrationModule = __decorate([
    (0, common_1.Module)({
        imports: [conversations_module_1.ConversationsModule, agents_module_1.AgentsModule, mcp_module_1.McpModule],
        controllers: [orchestration_controller_1.OrchestrationController],
        providers: [orchestration_service_1.OrchestrationService],
        exports: [orchestration_service_1.OrchestrationService],
    })
], OrchestrationModule);
//# sourceMappingURL=orchestration.module.js.map