import { CarrierWaypointActionType } from "./CarrierWaypoint";
import { DBObjectId } from "./DBObjectId";

export type SettingEnabledDisabled = 'enabled'|'disabled';
export type SettingUIType = 'standard'|'compact';
export type SettingVisibility = 'visible'|'hidden';
export type SettingNaturalResources = 'planets'|'single-ring';
export type SettingCarrierLoopType = 'solid'|'dashed';
export type SettingTerritoryStyle = 'disabled'|'marching-square'|'voronoi';
export type SettingObjectScaling = 'default'|'clamped';
export type SettingBlendMode = 'ADD'|'NORMAL';

export interface UserRoles {
    administrator: boolean;
    contributor: boolean;
    developer: boolean;
    communityManager: boolean;
    gameMaster: boolean;
};

export interface UserOAuth {
    discord?: {
        userId?: string;
        token?: {
            access_token: string;
            token_type: string;
            expires_in: string;
            refresh_token: string;
            scope: string;
        }
    }
};

export interface UserSubscriptions {
    discord?: {
        gameStarted: boolean;
        gameEnded: boolean;
        playerGalacticCycleComplete: boolean;
        playerResearchComplete: boolean;
        playerTechnologyReceived: boolean;
        playerCreditsReceived: boolean;
        playerCreditsSpecialistsReceived: boolean;
        playerRenownReceived: boolean;
        conversationMessageSent: boolean;
    }
}

export interface User {
    _id: DBObjectId;
    username: string;
    guildId: DBObjectId | null;
    email: string;
    emailEnabled: boolean;
    emailOtherEnabled: boolean;
    password: string | null;
    resetPasswordToken: string | null;
    credits: number;
    premiumEndDate: Date;
    banned: boolean;
    lastSeen: Date | null;
    lastSeenIP: string | null;
    isEstablishedPlayer: boolean;
    hasSentReviewReminder: boolean;
    roles: UserRoles,
    achievements: {
        victories: number;
        rank: number;
        eloRating: number | null;
        renown: number;
        joined: number;
        completed: number;
        quit: number;
        defeated: number;
        afk: number;
        combat: {
            kills: {
                ships: number;
                carriers: number;
                specialists: number;
            },
            losses: {
                ships: number;
                carriers: number;
                specialists: number;
            },
            stars: {
                captured: number;
                lost: number;
            },
            homeStars: {
                captured: number;
                lost: number;
            }
        },
        infrastructure: {
            economy: number;
            industry: number;
            science: number;
            warpGates: number;
            warpGatesDestroyed: number;
            carriers: number;
            specialistsHired: number;
        },
        research: {
            scanning: number;
            hyperspace: number;
            terraforming: number;
            experimentation: number;
            weapons: number;
            banking: number;
            manufacturing: number;
            specialists: number;
        },
        trade: {
            creditsSent: number;
            creditsReceived: number;
            creditsSpecialistsSent: number;
            creditsSpecialistsReceived: number;
            technologySent: number;
            technologyReceived: number;
            giftsSent: number;
            giftsReceived: number;
            renownSent: number;
        },
        badges: {
            ally: number;
            enemy: number;
            diplomat: number;
            strategist: number;
            roleplay: number;
            dauntless: number;
            sleepless: number;
        }
    },
    gameSettings: {
        interface: {
            audio: SettingEnabledDisabled;
            galaxyScreenUpgrades: SettingEnabledDisabled;
            uiStyle: SettingUIType;
            suggestMentions: SettingEnabledDisabled;
        },
        guild: {
            displayGuildTag: SettingVisibility;
        },
        map: {
            naturalResources: SettingNaturalResources;
            carrierLoopStyle: SettingCarrierLoopType;
            carrierPathWidth: number;
            carrierPathDashLength: number;
            territoryStyle: SettingTerritoryStyle;
            marchingSquareGridSize: number;
            marchingSquareTerritorySize: number;
            marchingSquareBorderWidth: number;
            voronoiCellBorderWidth: number;
            voronoiTerritoryBorderWidth: number;
            objectsScaling: SettingObjectScaling;
            objectsMinimumScale: number;
            objectsMaximumScale: number;
            antiAliasing: SettingEnabledDisabled;
            background:{
              nebulaFrequency: number;
              nebulaDensity: number;
              nebulaOpacity: number;
              moveNebulas: SettingEnabledDisabled;
              nebulaMovementSpeed: number;
              starsOpacity: number;
              blendMode: SettingBlendMode;
              nebulaColour1: string;
              nebulaColour2: string;
              nebulaColour3: string;
            },
            zoomLevels: {
              territories: number;
              playerNames: number;
              carrierShips: number;
              star: {
                shipCount: number;
                name: number;
                naturalResources: number;
                infrastructure: number;
              },
              background: {
                nebulas: number;
                stars: number;
              }
            }
        },
        carrier: {
            defaultAction: CarrierWaypointActionType;
            defaultAmount: number;
            confirmBuildCarrier: SettingEnabledDisabled;
        },
        star: {
            confirmBuildEconomy: SettingEnabledDisabled;
            confirmBuildIndustry: SettingEnabledDisabled;
            confirmBuildScience: SettingEnabledDisabled;
        }
    },
    avatars: number[];
    oauth: UserOAuth;
    subscriptions: UserSubscriptions;
};