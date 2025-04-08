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
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let AgentsService = class AgentsService {
    constructor() {
        this.agents = [];
        if (process.env.NODE_ENV === 'development') {
            this.agents = [
                {
                    id: (0, uuid_1.v4)(),
                    name: 'Default Assistant',
                    description: 'A general-purpose AI assistant that can help with a variety of tasks.',
                    parameters: [],
                },
                {
                    id: (0, uuid_1.v4)(),
                    name: 'Code Helper',
                    description: 'Specialized in helping with programming tasks and code reviews.',
                    parameters: [
                        {
                            name: 'programmingLanguage',
                            type: 'string',
                            label: 'Programming Language',
                            description: 'The programming language to focus on',
                            required: true,
                        },
                        {
                            name: 'includeExamples',
                            type: 'boolean',
                            label: 'Include Examples',
                            description: 'Whether to include code examples in the response',
                            default: true,
                        },
                    ],
                },
            ];
        }
    }
    async findAll() {
        return this.agents;
    }
    async findOne(id) {
        const agent = this.agents.find(a => a.id === id);
        if (!agent) {
            throw new common_1.NotFoundException(`Agent with ID ${id} not found`);
        }
        return agent;
    }
    async create(agent) {
        const newAgent = {
            id: (0, uuid_1.v4)(),
            ...agent,
        };
        this.agents.push(newAgent);
        return newAgent;
    }
    async update(id, agent) {
        const index = this.agents.findIndex(a => a.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Agent with ID ${id} not found`);
        }
        const updated = {
            ...this.agents[index],
            ...agent,
        };
        this.agents[index] = updated;
        return updated;
    }
    async delete(id) {
        const index = this.agents.findIndex(a => a.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Agent with ID ${id} not found`);
        }
        this.agents.splice(index, 1);
    }
    async getParameters(id) {
        const agent = await this.findOne(id);
        return agent.parameters || [];
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AgentsService);
//# sourceMappingURL=agents.service.js.map