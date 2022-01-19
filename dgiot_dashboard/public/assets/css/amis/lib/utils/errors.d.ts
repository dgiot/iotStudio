import { Payload } from '../types';
export declare class ServerError extends Error {
    type: string;
    response: Payload;
    constructor(msg: string, response: Payload);
}
