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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../index"));
test('Middleware attached with "use" must be an object or array[object]', function () {
    var handler = (0, index_1.default)(function () { });
    try {
        handler.use({});
    }
    catch (err) {
        expect(err.message).toBe('Middleware must be an object containing at least one key among "before", "after", "onError"');
    }
    try {
        handler.use({ foo: "bar" });
    }
    catch (err) {
        expect(err.message).toBe('Middleware must be an object containing at least one key among "before", "after", "onError"');
    }
    try {
        handler.use(["before"]);
    }
    catch (err) {
        expect(err.message).toBe('Middleware must be an object containing at least one key among "before", "after", "onError"');
    }
});
test('"use" can add single before middleware', function () {
    var handler = (0, index_1.default)(function () { });
    var before = function () { };
    var middleware = function () { return ({ before: before }); };
    handler.use(middleware());
    expect(handler.__middlewares.before[0]).toEqual(before);
});
test('"use" can add single after middleware', function () {
    var handler = (0, index_1.default)(function () { });
    var after = function () { };
    var middleware = function () { return ({ after: after }); };
    handler.use(middleware());
    expect(handler.__middlewares.after[0]).toEqual(after);
});
test('"use" can add single onError middleware', function () {
    var handler = (0, index_1.default)(function () { });
    var onError = function () { };
    var middleware = function () { return ({ onError: onError }); };
    handler.use(middleware());
    expect(handler.__middlewares.onError[0]).toEqual(onError);
});
test('"use" can add single object with all types of middlewares', function () {
    var handler = (0, index_1.default)(function () { });
    var before = function () { };
    var after = function () { };
    var onError = function () { };
    var middleware = function () { return ({ before: before, after: after, onError: onError }); };
    handler.use(middleware());
    expect(handler.__middlewares.before[0]).toEqual(before);
    expect(handler.__middlewares.after[0]).toEqual(after);
    expect(handler.__middlewares.onError[0]).toEqual(onError);
});
test('"use" can add multiple before middleware', function () {
    var handler = (0, index_1.default)(function () { });
    var before = function () { };
    var middleware = function () { return ({ before: before }); };
    handler.use([middleware(), middleware()]);
    expect(handler.__middlewares.before[0]).toEqual(before);
    expect(handler.__middlewares.before[1]).toEqual(before);
});
test('"use" can add multiple after middleware', function () {
    var handler = (0, index_1.default)(function () { });
    var after = function () { };
    var middleware = function () { return ({ after: after }); };
    handler.use([middleware(), middleware()]);
    expect(handler.__middlewares.after[0]).toEqual(after);
    expect(handler.__middlewares.after[1]).toEqual(after);
});
test('"use" can add multiple onError middleware', function () {
    var handler = (0, index_1.default)(function () { });
    var onError = function () { };
    var middleware = function () { return ({ onError: onError }); };
    handler.use([middleware(), middleware()]);
    expect(handler.__middlewares.onError[0]).toEqual(onError);
    expect(handler.__middlewares.onError[1]).toEqual(onError);
});
test('"use" can add multiple object with all types of middlewares', function () {
    var handler = (0, index_1.default)(function () { });
    var before = function () { };
    var after = function () { };
    var onError = function () { };
    var middleware = function () { return ({ before: before, after: after, onError: onError }); };
    handler.use([middleware(), middleware()]);
    expect(handler.__middlewares.before[0]).toEqual(before);
    expect(handler.__middlewares.after[0]).toEqual(after);
    expect(handler.__middlewares.onError[0]).toEqual(onError);
    expect(handler.__middlewares.before[1]).toEqual(before);
    expect(handler.__middlewares.after[1]).toEqual(after);
    expect(handler.__middlewares.onError[1]).toEqual(onError);
});
test('"before" should add a before middleware', function () {
    var handler = (0, index_1.default)(function () { });
    var before = function () { };
    handler.before(before);
    expect(handler.__middlewares.before[0]).toEqual(before);
});
test('"after" should add a before middleware', function () {
    var handler = (0, index_1.default)(function () { });
    var after = function () { };
    handler.after(after);
    expect(handler.__middlewares.after[0]).toEqual(after);
});
test('"onError" should add a before middleware', function () {
    var handler = (0, index_1.default)(function () { });
    var onError = function () { };
    handler.onError(onError);
    expect(handler.__middlewares.onError[0]).toEqual(onError);
});
test("It should execute before and after middlewares in the right order", function () { return __awaiter(void 0, void 0, void 0, function () {
    var handler, executedBefore, executedAfter, m1, m2, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                handler = (0, index_1.default)(function () {
                    return { foo: "bar" };
                });
                executedBefore = [];
                executedAfter = [];
                m1 = function () { return ({
                    before: function () {
                        executedBefore.push("m1");
                    },
                    after: function () {
                        executedAfter.push("m1");
                    },
                }); };
                m2 = function () { return ({
                    before: function () {
                        executedBefore.push("m2");
                    },
                    after: function () {
                        executedAfter.push("m2");
                    },
                }); };
                handler.use(m1()).use(m2());
                return [4 /*yield*/, handler(null, null, null, null)];
            case 1:
                response = _a.sent();
                expect(executedBefore).toStrictEqual(["m1", "m2"]);
                expect(executedAfter).toStrictEqual(["m2", "m1"]);
                expect(response).toStrictEqual({ foo: "bar" });
                return [2 /*return*/];
        }
    });
}); });
test('"before" middlewares should be able to change response', function () { return __awaiter(void 0, void 0, void 0, function () {
    var handler, m, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                handler = (0, index_1.default)(function () {
                    return { foo: "bar" };
                });
                m = function (request) {
                    request.response = { bar: "foo" };
                };
                handler.before(m);
                return [4 /*yield*/, handler(null, null, null, null)];
            case 1:
                res = _a.sent();
                expect(res).toStrictEqual({ bar: "foo" });
                return [2 /*return*/];
        }
    });
}); });
