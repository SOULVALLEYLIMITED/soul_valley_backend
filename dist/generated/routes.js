"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = RegisterRoutes;
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const UserController_1 = require("./../controller/UserController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const ContactController_1 = require("./../controller/ContactController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const CommunityController_1 = require("./../controller/CommunityController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const AIController_1 = require("./../controller/AIController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const AdminController_1 = require("./../controller/AdminController");
const auth_1 = require("./../authentication/auth");
const multer = require('multer');
const expressAuthenticationRecasted = auth_1.expressAuthentication;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "LoginResponse": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "token": { "dataType": "string" },
            "error": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginRequest": {
        "dataType": "refObject",
        "properties": {
            "password": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ContactResponse": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "name": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "subject": { "dataType": "string", "required": true },
            "message": { "dataType": "string", "required": true },
            "status": { "dataType": "string", "required": true },
            "source": { "dataType": "string", "required": true },
            "discoveryDetails": { "dataType": "any" },
            "createdAt": { "dataType": "string", "required": true },
            "updatedAt": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateContactResponse": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "data": { "ref": "ContactResponse" },
            "error": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateContactRequest": {
        "dataType": "refObject",
        "properties": {
            "name": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "subject": { "dataType": "string", "required": true },
            "message": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ContactsListResponse": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "data": { "dataType": "array", "array": { "dataType": "refObject", "ref": "ContactResponse" } },
            "error": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SimpleResponse": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "error": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateContactStatusRequest": {
        "dataType": "refObject",
        "properties": {
            "status": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["new"] }, { "dataType": "enum", "enums": ["read"] }, { "dataType": "enum", "enums": ["replied"] }], "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CommunityUpdateResponse": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "title": { "dataType": "string", "required": true },
            "body": { "dataType": "string", "required": true },
            "imageUrl": { "dataType": "union", "subSchemas": [{ "dataType": "string" }, { "dataType": "enum", "enums": [null] }] },
            "createdAt": { "dataType": "string", "required": true },
            "updatedAt": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CommunityUpdatesListResponse": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "data": { "dataType": "array", "array": { "dataType": "refObject", "ref": "CommunityUpdateResponse" } },
            "error": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateCommunityUpdateRequest": {
        "dataType": "refObject",
        "properties": {
            "title": { "dataType": "string", "required": true },
            "body": { "dataType": "string", "required": true },
            "imageUrl": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateCommunityUpdateRequest": {
        "dataType": "refObject",
        "properties": {
            "title": { "dataType": "string" },
            "body": { "dataType": "string" },
            "imageUrl": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UploadImageResponse": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "url": { "dataType": "string" },
            "error": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ChatResponse": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "message": { "dataType": "string", "required": true },
            "data": { "dataType": "nestedObjectLiteral", "nestedProperties": { "usage": { "dataType": "nestedObjectLiteral", "nestedProperties": { "totalTokens": { "dataType": "double", "required": true }, "completionTokens": { "dataType": "double", "required": true }, "promptTokens": { "dataType": "double", "required": true } } }, "model": { "dataType": "string", "required": true }, "response": { "dataType": "string", "required": true } } },
            "error": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ChatMessage": {
        "dataType": "refObject",
        "properties": {
            "role": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["user"] }, { "dataType": "enum", "enums": ["assistant"] }, { "dataType": "enum", "enums": ["system"] }], "required": true },
            "content": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ChatRequest": {
        "dataType": "refObject",
        "properties": {
            "messages": { "dataType": "array", "array": { "dataType": "refObject", "ref": "ChatMessage" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DiscoveryExtractionData": {
        "dataType": "refObject",
        "properties": {
            "organization": { "dataType": "string", "required": true },
            "contact_name": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "problem": { "dataType": "string", "required": true },
            "idea": { "dataType": "string", "required": true },
            "current_process": { "dataType": "string", "required": true },
            "target_users": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "desired_outcome": { "dataType": "string", "required": true },
            "requirements": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "existing_systems": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "constraints": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "timeline": { "dataType": "string", "required": true },
            "budget": { "dataType": "string", "required": true },
            "open_questions": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "additional_context": { "dataType": "string", "required": true },
            "ready_for_submission": { "dataType": "boolean", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DiscoveryExtractionResponse": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "data": { "ref": "DiscoveryExtractionData" },
            "error": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ExtractRequest": {
        "dataType": "refObject",
        "properties": {
            "messages": { "dataType": "array", "array": { "dataType": "refObject", "ref": "ChatMessage" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StreamRequest": {
        "dataType": "refObject",
        "properties": {
            "messages": { "dataType": "array", "array": { "dataType": "refObject", "ref": "ChatMessage" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SubmitDiscoveryResponse": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "message": { "dataType": "string", "required": true },
            "error": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SubmitDiscoveryRequest": {
        "dataType": "refObject",
        "properties": {
            "organization": { "dataType": "string" },
            "contact_name": { "dataType": "string", "required": true },
            "email": { "dataType": "string", "required": true },
            "problem": { "dataType": "string" },
            "idea": { "dataType": "string" },
            "current_process": { "dataType": "string" },
            "target_users": { "dataType": "array", "array": { "dataType": "string" } },
            "desired_outcome": { "dataType": "string" },
            "requirements": { "dataType": "array", "array": { "dataType": "string" } },
            "existing_systems": { "dataType": "array", "array": { "dataType": "string" } },
            "constraints": { "dataType": "array", "array": { "dataType": "string" } },
            "timeline": { "dataType": "string" },
            "budget": { "dataType": "string" },
            "open_questions": { "dataType": "array", "array": { "dataType": "string" } },
            "additional_context": { "dataType": "string" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ModelsResponse": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "data": { "dataType": "nestedObjectLiteral", "nestedProperties": { "models": { "dataType": "array", "array": { "dataType": "nestedObjectLiteral", "nestedProperties": { "description": { "dataType": "string", "required": true }, "name": { "dataType": "string", "required": true }, "id": { "dataType": "string", "required": true } } }, "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HealthResponse": {
        "dataType": "refObject",
        "properties": {
            "success": { "dataType": "boolean", "required": true },
            "status": { "dataType": "string", "required": true },
            "message": { "dataType": "string", "required": true },
            "timestamp": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new runtime_1.ExpressTemplateService(models, { "noImplicitAdditionalProperties": "throw-on-extras", "bodyCoercion": true });
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app, opts) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    const upload = opts?.multer || multer({ "limits": { "fileSize": 8388608 } });
    const argsUserController_GetStatus = {};
    app.get('/auth', ...((0, runtime_1.fetchMiddlewares)(UserController_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(UserController_1.UserController.prototype.GetStatus)), async function UserController_GetStatus(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_GetStatus, request, response });
            const controller = new UserController_1.UserController();
            await templateService.apiHandler({
                methodName: 'GetStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsUserController_login = {
        body: { "in": "body", "name": "body", "required": true, "ref": "LoginRequest" },
    };
    app.post('/auth/login', ...((0, runtime_1.fetchMiddlewares)(UserController_1.UserController)), ...((0, runtime_1.fetchMiddlewares)(UserController_1.UserController.prototype.login)), async function UserController_login(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_login, request, response });
            const controller = new UserController_1.UserController();
            await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsContactController_create = {
        request: { "in": "body", "name": "request", "required": true, "ref": "CreateContactRequest" },
    };
    app.post('/api/contacts', ...((0, runtime_1.fetchMiddlewares)(ContactController_1.ContactController)), ...((0, runtime_1.fetchMiddlewares)(ContactController_1.ContactController.prototype.create)), async function ContactController_create(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsContactController_create, request, response });
            const controller = new ContactController_1.ContactController();
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsContactController_login = {
        request: { "in": "body", "name": "request", "required": true, "ref": "LoginRequest" },
    };
    app.post('/api/contacts/login', ...((0, runtime_1.fetchMiddlewares)(ContactController_1.ContactController)), ...((0, runtime_1.fetchMiddlewares)(ContactController_1.ContactController.prototype.login)), async function ContactController_login(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsContactController_login, request, response });
            const controller = new ContactController_1.ContactController();
            await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsContactController_list = {
        authorization: { "in": "header", "name": "Authorization", "dataType": "string" },
    };
    app.get('/api/contacts', ...((0, runtime_1.fetchMiddlewares)(ContactController_1.ContactController)), ...((0, runtime_1.fetchMiddlewares)(ContactController_1.ContactController.prototype.list)), async function ContactController_list(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsContactController_list, request, response });
            const controller = new ContactController_1.ContactController();
            await templateService.apiHandler({
                methodName: 'list',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsContactController_updateStatus = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        request: { "in": "body", "name": "request", "required": true, "ref": "UpdateContactStatusRequest" },
        authorization: { "in": "header", "name": "Authorization", "dataType": "string" },
    };
    app.put('/api/contacts/:id/status', ...((0, runtime_1.fetchMiddlewares)(ContactController_1.ContactController)), ...((0, runtime_1.fetchMiddlewares)(ContactController_1.ContactController.prototype.updateStatus)), async function ContactController_updateStatus(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsContactController_updateStatus, request, response });
            const controller = new ContactController_1.ContactController();
            await templateService.apiHandler({
                methodName: 'updateStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsContactController_remove = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        authorization: { "in": "header", "name": "Authorization", "dataType": "string" },
    };
    app.delete('/api/contacts/:id', ...((0, runtime_1.fetchMiddlewares)(ContactController_1.ContactController)), ...((0, runtime_1.fetchMiddlewares)(ContactController_1.ContactController.prototype.remove)), async function ContactController_remove(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsContactController_remove, request, response });
            const controller = new ContactController_1.ContactController();
            await templateService.apiHandler({
                methodName: 'remove',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCommunityController_list = {};
    app.get('/api/community/updates', ...((0, runtime_1.fetchMiddlewares)(CommunityController_1.CommunityController)), ...((0, runtime_1.fetchMiddlewares)(CommunityController_1.CommunityController.prototype.list)), async function CommunityController_list(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsCommunityController_list, request, response });
            const controller = new CommunityController_1.CommunityController();
            await templateService.apiHandler({
                methodName: 'list',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCommunityController_create = {
        body: { "in": "body", "name": "body", "required": true, "ref": "CreateCommunityUpdateRequest" },
        authorization: { "in": "header", "name": "Authorization", "dataType": "string" },
    };
    app.post('/api/community/updates', ...((0, runtime_1.fetchMiddlewares)(CommunityController_1.CommunityController)), ...((0, runtime_1.fetchMiddlewares)(CommunityController_1.CommunityController.prototype.create)), async function CommunityController_create(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsCommunityController_create, request, response });
            const controller = new CommunityController_1.CommunityController();
            await templateService.apiHandler({
                methodName: 'create',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCommunityController_edit = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        body: { "in": "body", "name": "body", "required": true, "ref": "UpdateCommunityUpdateRequest" },
        authorization: { "in": "header", "name": "Authorization", "dataType": "string" },
    };
    app.patch('/api/community/updates/:id', ...((0, runtime_1.fetchMiddlewares)(CommunityController_1.CommunityController)), ...((0, runtime_1.fetchMiddlewares)(CommunityController_1.CommunityController.prototype.edit)), async function CommunityController_edit(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsCommunityController_edit, request, response });
            const controller = new CommunityController_1.CommunityController();
            await templateService.apiHandler({
                methodName: 'edit',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCommunityController_remove = {
        id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
        authorization: { "in": "header", "name": "Authorization", "dataType": "string" },
    };
    app.delete('/api/community/updates/:id', ...((0, runtime_1.fetchMiddlewares)(CommunityController_1.CommunityController)), ...((0, runtime_1.fetchMiddlewares)(CommunityController_1.CommunityController.prototype.remove)), async function CommunityController_remove(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsCommunityController_remove, request, response });
            const controller = new CommunityController_1.CommunityController();
            await templateService.apiHandler({
                methodName: 'remove',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCommunityController_uploadImage = {
        image: { "in": "formData", "name": "image", "required": true, "dataType": "file" },
        authorization: { "in": "header", "name": "Authorization", "dataType": "string" },
    };
    app.post('/api/community/upload-image', upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]), ...((0, runtime_1.fetchMiddlewares)(CommunityController_1.CommunityController)), ...((0, runtime_1.fetchMiddlewares)(CommunityController_1.CommunityController.prototype.uploadImage)), async function CommunityController_uploadImage(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsCommunityController_uploadImage, request, response });
            const controller = new CommunityController_1.CommunityController();
            await templateService.apiHandler({
                methodName: 'uploadImage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAIController_chat = {
        request: { "in": "body", "name": "request", "required": true, "ref": "ChatRequest" },
    };
    app.post('/api/ai/chat', ...((0, runtime_1.fetchMiddlewares)(AIController_1.AIController)), ...((0, runtime_1.fetchMiddlewares)(AIController_1.AIController.prototype.chat)), async function AIController_chat(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAIController_chat, request, response });
            const controller = new AIController_1.AIController();
            await templateService.apiHandler({
                methodName: 'chat',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAIController_extract = {
        request: { "in": "body", "name": "request", "required": true, "ref": "ExtractRequest" },
    };
    app.post('/api/ai/extract', ...((0, runtime_1.fetchMiddlewares)(AIController_1.AIController)), ...((0, runtime_1.fetchMiddlewares)(AIController_1.AIController.prototype.extract)), async function AIController_extract(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAIController_extract, request, response });
            const controller = new AIController_1.AIController();
            await templateService.apiHandler({
                methodName: 'extract',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAIController_chatStream = {
        request: { "in": "body", "name": "request", "required": true, "ref": "StreamRequest" },
        req: { "in": "request", "name": "req", "required": true, "dataType": "object" },
        res: { "in": "res", "name": "500", "required": true, "dataType": "any" },
    };
    app.post('/api/ai/chat/stream', ...((0, runtime_1.fetchMiddlewares)(AIController_1.AIController)), ...((0, runtime_1.fetchMiddlewares)(AIController_1.AIController.prototype.chatStream)), async function AIController_chatStream(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAIController_chatStream, request, response });
            const controller = new AIController_1.AIController();
            await templateService.apiHandler({
                methodName: 'chatStream',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAIController_submitDiscovery = {
        request: { "in": "body", "name": "request", "required": true, "ref": "SubmitDiscoveryRequest" },
    };
    app.post('/api/ai/submit', ...((0, runtime_1.fetchMiddlewares)(AIController_1.AIController)), ...((0, runtime_1.fetchMiddlewares)(AIController_1.AIController.prototype.submitDiscovery)), async function AIController_submitDiscovery(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAIController_submitDiscovery, request, response });
            const controller = new AIController_1.AIController();
            await templateService.apiHandler({
                methodName: 'submitDiscovery',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAIController_getModels = {};
    app.get('/api/ai/models', ...((0, runtime_1.fetchMiddlewares)(AIController_1.AIController)), ...((0, runtime_1.fetchMiddlewares)(AIController_1.AIController.prototype.getModels)), async function AIController_getModels(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAIController_getModels, request, response });
            const controller = new AIController_1.AIController();
            await templateService.apiHandler({
                methodName: 'getModels',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAIController_health = {};
    app.get('/api/ai/health', ...((0, runtime_1.fetchMiddlewares)(AIController_1.AIController)), ...((0, runtime_1.fetchMiddlewares)(AIController_1.AIController.prototype.health)), async function AIController_health(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAIController_health, request, response });
            const controller = new AIController_1.AIController();
            await templateService.apiHandler({
                methodName: 'health',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAIController_ping = {};
    app.get('/api/ai/ping', ...((0, runtime_1.fetchMiddlewares)(AIController_1.AIController)), ...((0, runtime_1.fetchMiddlewares)(AIController_1.AIController.prototype.ping)), async function AIController_ping(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAIController_ping, request, response });
            const controller = new AIController_1.AIController();
            await templateService.apiHandler({
                methodName: 'ping',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_test = {};
    app.get('/api/admin/test', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.test)), async function AdminController_test(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_test, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'test',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getPing = {};
    app.get('/api/admin/status', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getPing)), async function AdminController_getPing(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getPing, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getPing',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getStats = {};
    app.get('/api/admin/stats', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getStats)), async function AdminController_getStats(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getStats, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getStats',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getContacts = {};
    app.get('/api/admin/contacts', ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController)), ...((0, runtime_1.fetchMiddlewares)(AdminController_1.AdminController.prototype.getContacts)), async function AdminController_getContacts(request, response, next) {
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAdminController_getContacts, request, response });
            const controller = new AdminController_1.AdminController();
            await templateService.apiHandler({
                methodName: 'getContacts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
            });
        }
        catch (err) {
            return next(err);
        }
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
