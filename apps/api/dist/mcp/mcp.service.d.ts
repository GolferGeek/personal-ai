import { OnModuleInit } from "@nestjs/common";
export declare class McpService implements OnModuleInit {
    private readonly logger;
    private mcpServer;
    constructor();
    onModuleInit(): Promise<void>;
    private initializeMcpServer;
    private registerToolHandlers;
    getServerInstance(): any;
    processTask(taskId: string, params?: Record<string, any>): Promise<{
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
}
