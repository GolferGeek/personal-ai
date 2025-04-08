import { Request, Response } from "express";
import { McpService } from "./mcp.service";
declare class McpApiRequestDto {
    task_id: string;
    params?: Record<string, any>;
}
declare class McpMessageDto {
    sessionId: string;
    message: any;
}
export declare class McpController {
    private readonly mcpService;
    private readonly logger;
    private readonly connections;
    constructor(mcpService: McpService);
    handleApiRequest(request: McpApiRequestDto): Promise<{
        status: string;
        data: {
            message: string;
            original?: undefined;
            reversed?: undefined;
            result?: undefined;
        };
        error?: undefined;
    } | {
        status: string;
        error: {
            code: string;
            message: string;
        };
        data?: undefined;
    } | {
        status: string;
        data: {
            original: string;
            reversed: string;
            message?: undefined;
            result?: undefined;
        };
        error?: undefined;
    } | {
        status: string;
        data: {
            result: number;
            message?: undefined;
            original?: undefined;
            reversed?: undefined;
        };
        error?: undefined;
    }>;
    handleSseConnection(req: Request, res: Response): Promise<void>;
    handleMessage(messageDto: McpMessageDto): Promise<{
        success: boolean;
    }>;
    private generateSessionId;
}
export {};
