"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcrypt = require('bcryptjs'); // Alternative CommonJS syntax
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var roles, _i, _a, _b, index, role, tenant, passwordHash, users, _c, users_1, userData, user, teams, _d, teams_1, teamData, team, allUsers, allTeams, _e, allUsers_1, user, randomTeams, _f, randomTeams_1, team, notifications, _g, notifications_1, notifData, createdByUser, _h, notification, _j, allUsers_2, user, adminUser, tokens, _k, tokens_1, tokenData;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    console.log("🌱 Starting seed...");
                    roles = ["Super_Admin", "Admin", "Manager", "User"];
                    _i = 0, _a = roles.entries();
                    _l.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    _b = _a[_i], index = _b[0], role = _b[1];
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { id: index + 1 },
                            update: {},
                            create: { id: index + 1, name: role },
                        })];
                case 2:
                    _l.sent();
                    _l.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log("✅ Roles created/ensured");
                    return [4 /*yield*/, prisma.tenant.upsert({
                            where: { slug: "fast-5374" },
                            update: {},
                            create: {
                                name: "FAST UNIVERSITY",
                                slug: "fast-5374",
                            },
                        })];
                case 5:
                    tenant = _l.sent();
                    console.log("✅ Tenant created/ensured:", tenant.name);
                    return [4 /*yield*/, bcrypt.hash("R@jpoot1011", 10)];
                case 6:
                    passwordHash = _l.sent();
                    users = [
                        {
                            email: "admin@gmail.com",
                            name: "Admin",
                            roles: ["Super Admin"],
                        },
                        {
                            email: "manager1@gmail.com",
                            name: "Manager One",
                            roles: ["Manager"],
                        },
                        {
                            email: "manager2@gmail.com",
                            name: "Manager Two",
                            roles: ["Manager"],
                        },
                        {
                            email: "user1@gmail.com",
                            name: "User One",
                            roles: ["User"],
                        },
                        {
                            email: "user2@gmail.com",
                            name: "User Two",
                            roles: ["User"],
                        },
                    ];
                    _c = 0, users_1 = users;
                    _l.label = 7;
                case 7:
                    if (!(_c < users_1.length)) return [3 /*break*/, 10];
                    userData = users_1[_c];
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { uniq_tenant_email: { tenantId: tenant.id, email: userData.email } },
                            update: {},
                            create: {
                                email: userData.email,
                                name: userData.name,
                                passwordHash: passwordHash,
                                tenantId: tenant.id,
                                roles: {
                                    create: userData.roles.map(function (roleName) { return ({
                                        role: { connect: { name: roleName } },
                                    }); }),
                                },
                            },
                        })];
                case 8:
                    user = _l.sent();
                    console.log("\u2705 User created/ensured: ".concat(user.email));
                    _l.label = 9;
                case 9:
                    _c++;
                    return [3 /*break*/, 7];
                case 10:
                    teams = [
                        { name: "Development" },
                        { name: "Marketing" },
                        { name: "Operations" },
                    ];
                    _d = 0, teams_1 = teams;
                    _l.label = 11;
                case 11:
                    if (!(_d < teams_1.length)) return [3 /*break*/, 14];
                    teamData = teams_1[_d];
                    return [4 /*yield*/, prisma.team.upsert({
                            where: { uniq_team_name: { tenantId: tenant.id, name: teamData.name } },
                            update: {},
                            create: {
                                name: teamData.name,
                                tenantId: tenant.id,
                            },
                        })];
                case 12:
                    team = _l.sent();
                    console.log("\u2705 Team created/ensured: ".concat(team.name));
                    _l.label = 13;
                case 13:
                    _d++;
                    return [3 /*break*/, 11];
                case 14: return [4 /*yield*/, prisma.user.findMany({
                        where: { tenantId: tenant.id },
                    })];
                case 15:
                    allUsers = _l.sent();
                    return [4 /*yield*/, prisma.team.findMany({
                            where: { tenantId: tenant.id },
                        })];
                case 16:
                    allTeams = _l.sent();
                    _e = 0, allUsers_1 = allUsers;
                    _l.label = 17;
                case 17:
                    if (!(_e < allUsers_1.length)) return [3 /*break*/, 22];
                    user = allUsers_1[_e];
                    randomTeams = allTeams
                        .sort(function () { return 0.5 - Math.random(); })
                        .slice(0, Math.floor(Math.random() * 2) + 1);
                    _f = 0, randomTeams_1 = randomTeams;
                    _l.label = 18;
                case 18:
                    if (!(_f < randomTeams_1.length)) return [3 /*break*/, 21];
                    team = randomTeams_1[_f];
                    return [4 /*yield*/, prisma.teamMember.upsert({
                            where: { teamId_userId: { teamId: team.id, userId: user.id } },
                            update: {},
                            create: {
                                teamId: team.id,
                                userId: user.id,
                            },
                        })];
                case 19:
                    _l.sent();
                    console.log("\u2705 Added user ".concat(user.email, " to team ").concat(team.name));
                    _l.label = 20;
                case 20:
                    _f++;
                    return [3 /*break*/, 18];
                case 21:
                    _e++;
                    return [3 /*break*/, 17];
                case 22:
                    notifications = [
                        {
                            title: "System Maintenance",
                            body: "There will be a system maintenance this weekend from 2AM to 4AM.",
                            createdBy: "admin@gmail.com",
                        },
                        {
                            title: "Welcome to Our Platform",
                            body: "Welcome to our platform! We're excited to have you here.",
                            createdBy: null, // System notification
                        },
                        {
                            title: "New Feature Released",
                            body: "Check out our new dashboard features released this week!",
                            createdBy: "manager1@gmail.com",
                        },
                    ];
                    _g = 0, notifications_1 = notifications;
                    _l.label = 23;
                case 23:
                    if (!(_g < notifications_1.length)) return [3 /*break*/, 33];
                    notifData = notifications_1[_g];
                    if (!notifData.createdBy) return [3 /*break*/, 25];
                    return [4 /*yield*/, prisma.user.findUnique({
                            where: { uniq_tenant_email: { tenantId: tenant.id, email: notifData.createdBy } },
                        })];
                case 24:
                    _h = _l.sent();
                    return [3 /*break*/, 26];
                case 25:
                    _h = null;
                    _l.label = 26;
                case 26:
                    createdByUser = _h;
                    return [4 /*yield*/, prisma.notification.create({
                            data: {
                                title: notifData.title,
                                body: notifData.body,
                                tenantId: tenant.id,
                                createdBy: createdByUser === null || createdByUser === void 0 ? void 0 : createdByUser.id,
                            },
                        })];
                case 27:
                    notification = _l.sent();
                    console.log("\u2705 Notification created: ".concat(notification.title));
                    _j = 0, allUsers_2 = allUsers;
                    _l.label = 28;
                case 28:
                    if (!(_j < allUsers_2.length)) return [3 /*break*/, 31];
                    user = allUsers_2[_j];
                    return [4 /*yield*/, prisma.notificationDelivery.create({
                            data: {
                                notificationId: notification.id,
                                userId: user.id,
                                isRead: Math.random() > 0.5, // Random read status
                                readAt: Math.random() > 0.5 ? new Date() : null,
                            },
                        })];
                case 29:
                    _l.sent();
                    _l.label = 30;
                case 30:
                    _j++;
                    return [3 /*break*/, 28];
                case 31:
                    console.log("\uD83D\uDCE8 Delivered notification to all users");
                    _l.label = 32;
                case 32:
                    _g++;
                    return [3 /*break*/, 23];
                case 33: return [4 /*yield*/, prisma.user.findUnique({
                        where: { uniq_tenant_email: { tenantId: tenant.id, email: "admin@gmail.com" } },
                    })];
                case 34:
                    adminUser = _l.sent();
                    if (!adminUser) return [3 /*break*/, 38];
                    tokens = [
                        {
                            tokenId: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            device: "Chrome on Windows",
                            ipAddr: "192.168.1.1",
                            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                        },
                        {
                            tokenId: "a3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b856",
                            device: "Safari on iPhone",
                            ipAddr: "10.0.0.1",
                            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                            revokedAt: new Date(), // This one is revoked
                        },
                    ];
                    _k = 0, tokens_1 = tokens;
                    _l.label = 35;
                case 35:
                    if (!(_k < tokens_1.length)) return [3 /*break*/, 38];
                    tokenData = tokens_1[_k];
                    return [4 /*yield*/, prisma.refreshToken.create({
                            data: __assign({ userId: adminUser.id }, tokenData),
                        })];
                case 36:
                    _l.sent();
                    console.log("\uD83D\uDD11 Created refresh token for admin");
                    _l.label = 37;
                case 37:
                    _k++;
                    return [3 /*break*/, 35];
                case 38:
                    console.log("🎉 Seeding finished!");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.error("❌ Seeding error:", e);
                return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(1);
                return [2 /*return*/];
        }
    });
}); });
