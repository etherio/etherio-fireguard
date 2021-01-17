"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guard = void 0;
var admin = __importStar(require("firebase-admin"));
function guard(roles) {
    return function (req, res, next) {
        var token = req.query['token'] || req.query['access_token'] || req.headers['x-access-token'] || undefined;
        if (token === undefined) {
            token = req.headers['authorization'] || undefined;
            if (token === undefined) {
                return next(new Error('Access token is required'));
            }
            token = token.split(' ').pop();
        }
        admin
            .auth()
            .verifyIdToken(token)
            .then(function (data) {
            if (!('role' in data)) {
                return next(new Error('permission denied'));
            }
            if (!roles.includes(data.role)) {
                return next(new Error('not enough permission'));
            }
            req['auth'] = res['auth'] = data;
            next();
        })
            .catch(function (err) { return next(err); });
    };
}
exports.guard = guard;
