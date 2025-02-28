const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Types = Schema.Types;

const schema = new Schema({
    username: { type: Types.String, required: true },
    guildId: { type: Types.ObjectId, default: null },
    email: { type: Types.String, required: true },
    emailEnabled: { type: Types.Boolean, default: true },
    emailOtherEnabled: { type: Types.Boolean, default: true },
    password: { type: Types.String, required: false, default: null },
    resetPasswordToken: { type: Types.String, required: false, default: null },
    credits: { type: Types.Number, default: 0 },
    premiumEndDate: { type: Types.Date, default: null },
    banned: { type: Types.Boolean, default: false },
    lastSeen: { type: Types.Date, required: false, default: null },
    lastSeenIP: { type: Types.String, required: false, default: null },
    isEstablishedPlayer: { type: Types.Boolean, required: true, default: false },
    hasSentReviewReminder: { type: Types.Boolean, required: true, default: false },
    roles: {
        administrator: { type: Types.Boolean, default: false },
        contributor: { type: Types.Boolean, default: false },
        developer: { type: Types.Boolean, default: false },
        communityManager: { type: Types.Boolean, default: false },
        gameMaster: { type: Types.Boolean, default: false }
    },
    achievements: {
        victories: { type: Types.Number, default: 0 },
        rank: { type: Types.Number, default: 0 },
        eloRating: { type: Types.Number, default: null },
        renown: { type: Types.Number, default: 0 },
        joined: { type: Types.Number, default: 0 },
        completed: { type: Types.Number, default: 0 },
        quit: { type: Types.Number, default: 0 },
        defeated: { type: Types.Number, default: 0 },
        afk: { type: Types.Number, default: 0 },
        combat: {
            kills: {
                ships: { type: Types.Number, default: 0 },
                carriers: { type: Types.Number, default: 0 },
                specialists: { type: Types.Number, default: 0 },
            },
            losses: {
                ships: { type: Types.Number, default: 0 },
                carriers: { type: Types.Number, default: 0 },
                specialists: { type: Types.Number, default: 0 },
            },
            stars: {
                captured: { type: Types.Number, default: 0 },
                lost: { type: Types.Number, default: 0 },
            },
            homeStars: {
                captured: { type: Types.Number, default: 0 },
                lost: { type: Types.Number, default: 0 },
            }
        },
        infrastructure: {
            economy: { type: Types.Number, default: 0 },
            industry: { type: Types.Number, default: 0 },
            science: { type: Types.Number, default: 0 },
            warpGates: { type: Types.Number, default: 0 },
            warpGatesDestroyed: { type: Types.Number, default: 0 },
            carriers: { type: Types.Number, default: 0 },
            specialistsHired: { type: Types.Number, default: 0 },
        },
        research: {
            scanning: { type: Types.Number, default: 0 },
            hyperspace: { type: Types.Number, default: 0 },
            terraforming: { type: Types.Number, default: 0 },
            experimentation: { type: Types.Number, default: 0 },
            weapons: { type: Types.Number, default: 0 },
            banking: { type: Types.Number, default: 0 },
            manufacturing: { type: Types.Number, default: 0 },
            specialists: { type: Types.Number, default: 0 }
        },
        trade: {
            creditsSent: { type: Types.Number, default: 0 },
            creditsReceived: { type: Types.Number, default: 0 },
            creditsSpecialistsSent: { type: Types.Number, default: 0 },
            creditsSpecialistsReceived: { type: Types.Number, default: 0 },
            technologySent: { type: Types.Number, default: 0 },
            technologyReceived: { type: Types.Number, default: 0 },
            giftsSent: { type: Types.Number, default: 0 },
            giftsReceived: { type: Types.Number, default: 0 },
            renownSent: { type: Types.Number, default: 0 },
        },
        badges: {
            ally: { type: Types.Number, default: 0 },
            enemy: { type: Types.Number, default: 0 },
            diplomat: { type: Types.Number, default: 0 },
            strategist: { type: Types.Number, default: 0 },
            roleplay: { type: Types.Number, default: 0 },
            dauntless: { type: Types.Number, default: 0 },
            sleepless: { type: Types.Number, default: 0 },
            victor32: { type: Types.Number, default: 0 }
        }
    },
    gameSettings: {
        interface: {
            audio: { type: Types.String, required: false, enum: ['enabled', 'disabled'], default: 'enabled' },
            galaxyScreenUpgrades: { type: Types.String, required: false, enum: ['enabled', 'disabled'], default: 'disabled' },
            uiStyle: { type: Types.String, required: false, enum: ['standard', 'compact'], default: 'standard' },
            suggestMentions: { type: Types.String, required: false, enum: ['enabled', 'disabled'], default: 'enabled' }
        },
        guild: {
            displayGuildTag: { type: Types.String, required: false, enum: ['visible', 'hidden'], default: 'visible' },
        },
        map: {
            naturalResources: { type: Types.String, required: false, enum: ['planets', 'single-ring'], default: 'single-ring' },
            carrierLoopStyle: { type: Types.String, required: false, enum: ['solid', 'dashed'], default: 'dashed' },
            carrierPathWidth: { type: Types.Number, required: false, default: 1, min: 1, max: 8 },
            carrierPathDashLength: { type: Types.Number, required: false, default: 6, min: 4, max: 16 },
            territoryStyle: { type: Types.String, required: false, enum: ['disabled', 'marching-square', 'voronoi'], default: 'marching-square' },
            marchingSquareGridSize: { type: Types.Number, required: false, default: 6, min: 2, max: 32 },
            marchingSquareTerritorySize:{ type: Types.Number, required: false, default: 5, min: 2, max: 32 },
            marchingSquareBorderWidth: { type: Types.Number, required: false, default: 2, min: 0, max: 8 },
            voronoiCellBorderWidth: { type: Types.Number, required: false, default: 2, min: 0, max: 5 },
            voronoiTerritoryBorderWidth: { type: Types.Number, required: false, default: 4, min: 0, max: 8 },
            objectsScaling: { type: Types.String, required: false, enum: ['default', 'clamped'], default: 'default' },
            objectsMinimumScale: { type: Types.Number, required: false, default: 8, min: 0, max: 32 },
            objectsMaximumScale: { type: Types.Number, required: false, default: 16, min: 12, max: 128 },
            objectsDepth: { type: Types.String, required: false, enum: ['enabled', 'disabled'], default: 'disabled' },
            antiAliasing: { type: Types.String, required: false, enum: ['enabled', 'disabled'], default: 'enabled' },
            background:{
              nebulaFrequency: { type: Types.Number, required: false, default: 12, min: 0, max: 16 },
              nebulaDensity: { type: Types.Number, required: false, default: 3, min: 0, max: 8 },
              nebulaOpacity: { type: Types.Number, required: false, default: 1.0, min: 0.0, max: 1.0 },
              moveNebulas: { type: Types.String, required: false, enum: ['enabled', 'disabled'], default: 'enabled' },
              nebulaMovementSpeed: { type: Types.Number, required: false, default: 1.0, min: 0.0, max: 2.0 },
              starsOpacity: { type: Types.Number, required: false, default: 1.0, min: 0.0, max: 1.0 },
              blendMode: { type: Types.String, required: false, enum: ['ADD', 'NORMAL'], default: 'NORMAL' },
              nebulaColour1: { type: Types.String, required: false, default: '#FF0000' },
              nebulaColour2: { type: Types.String, required: false, default: '#00FF00' },
              nebulaColour3: { type: Types.String, required: false, default: '#0000FF' }
            },
            zoomLevels: {
              territories: { type: Types.Number, required: false, default: 100 },
              playerNames: { type: Types.Number, required: false, default: 100 },
              carrierShips: { type: Types.Number, required: false, default: 140 },
              star: {
                shipCount: { type: Types.Number, required: false, default: 120 },
                name: { type: Types.Number, required: false, default: 160 },
                naturalResources: { type: Types.Number, required: false, default: 160 },
                infrastructure: { type: Types.Number, required: false, default: 200 }
              },
              background: {
                nebulas: { type: Types.Number, required: false, default: 100 },
                stars: { type: Types.Number, required: false, default: 100 }
              }
            }
        },
        carrier: {
            defaultAction: { type: Types.String, required: false, enum: ['nothing', 'collectAll', 'dropAll', 'collect', 'drop', 'collectAllBut', 'dropAllBut', 'garrison', 'collectPercentage', 'dropPercentage'], default: 'collectAll' },
            defaultAmount: { type: Types.Number, required: false, default: 0 },
            confirmBuildCarrier: { type: Types.String, required: false, enum: ['enabled', 'disabled'], default: 'enabled' },
        },
        star: {
            confirmBuildEconomy: { type: Types.String, required: false, enum: ['enabled', 'disabled'], default: 'disabled' },
            confirmBuildIndustry: { type: Types.String, required: false, enum: ['enabled', 'disabled'], default: 'disabled' },
            confirmBuildScience: { type: Types.String, required: false, enum: ['enabled', 'disabled'], default: 'disabled' },
        }
    },
    avatars: [{ type: Types.Number, required: false }],
    oauth: {
        discord: {
            userId: { type: Types.String, required: false },
            token: {
                access_token: { type: Types.String, required: false },
                token_type: { type: Types.String, required: false },
                expires_in: { type: Types.String, required: false },
                refresh_token: { type: Types.String, required: false },
                scope: { type: Types.String, required: false }
            }
        }
    },
    subscriptions: {
        discord: {
            gameStarted: { type: Types.Boolean, required: false, default: true },
            gameEnded: { type: Types.Boolean, required: false, default: true },
            playerGalacticCycleComplete: { type: Types.Boolean, required: false, default: true },
            playerResearchComplete: { type: Types.Boolean, required: false, default: true },
            playerTechnologyReceived: { type: Types.Boolean, required: false, default: true },
            playerCreditsReceived: { type: Types.Boolean, required: false, default: true },
            playerCreditsSpecialistsReceived: { type: Types.Boolean, required: false, default: true },
            playerRenownReceived: { type: Types.Boolean, required: false, default: true },
            conversationMessageSent: { type: Types.Boolean, required: false, default: true }
        }
    }
});

export default schema;
