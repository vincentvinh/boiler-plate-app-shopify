"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpHandler = void 0;
const graphql_1 = __importDefault(require("./graphql"));
// Handle all HTTP requests for both client and API
const httpHandler = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    // If the request is not made to one of the two endpoints, handle it like a static request for a client file
    // All API responses are always CORS-enabled with JSON content type
    response.setHeader('Content-Type', 'application/json');
    if (request.headers.origin) {
        response.setHeader('Access-Control-Allow-Credentials', 'true');
        response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    }
    // Pre-flight requests do not need to be processed any further, they only need the CORS headers
    if (request.method === 'OPTIONS') {
        response.writeHead(200);
        return response.end();
    }
    // Load any data sent in the request body
    let chunks = '';
    request.on('data', (chunk) => {
        chunks += chunk;
    });
    request.on('end', () => {
        // If there was a request body, parse the combined raw data chunks
        let body = null;
        try {
            body = chunks.length ? JSON.parse(chunks) : null;
        }
        catch (e) {
            console.log('JSON parse error of request body', chunks);
        }
        // Web client requests
        if (request.url === '/graphql')
            return graphql_1.default(request, response, body);
        response.writeHead(404);
        response.end();
    });
});
exports.httpHandler = httpHandler;
//# sourceMappingURL=root.js.map