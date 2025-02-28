const bcrypt = require('bcrypt');

import GameModel from '../db/models/Game';
import UserModel from '../db/models/User';
import HistoryModel from '../db/models/History';
import EventModel from '../db/models/Event';
import GuildModel from '../db/models/Guild';
import PaymentModel from '../db/models/Payment';
import ReportModel from '../db/models/Report';

import AdminService from './admin';
import PasswordService from './password';
import AuthService from './auth';
import BroadcastService from './broadcast';
import CarrierService from './carrier';
import CombatService from './combat';
import DistanceService from './distance';
import EmailService from './email';
import EventService from './event';
import LeaderboardService from './leaderboard';
import GameService from './game';
import GameJoinService from './gameJoin';
import GameCreateValidationService from './gameCreateValidation';
import GameCreateService from './gameCreate';
import GameGalaxyService from './gameGalaxy';
import GameListService from './gameList';
import GameTickService from './gameTick';
import GameTypeService from './gameType';
import GameStateService from './gameState';
import BattleRoyaleService from './battleRoyale';
import MapService from './map';
import PlayerService from './player';
import PlayerReadyService from './playerReady';
import RandomService from './random';
import ResearchService from './research';
import StarService from './star';
import StarDistanceService from './starDistance';
import NameService from './name';
import StarUpgradeService from './starUpgrade';
import TechnologyService from './technology';
import TradeService from './trade';
import WaypointService from './waypoint';
import ShipTransferService from './shipTransfer';
import UserService from './user';
import HistoryService from './history';
import LedgerService from './ledger';
import SpecialistService from './specialist';
import SpecialistBanService from './specialistBan';
import SpecialistHireService from './specialistHire';
import AchievementService from './achievement';
import ConversationService from './conversation';
import ReputationService from './reputation';
import AIService from './ai';
import GuildService from './guild';
import GuildUserService from './guildUser';
import StarMovementService from './starMovement';
import CacheService from './cache';
import RecaptchaService from './recaptcha';
import RatingService from './rating';
import DonateService from './donate';
import DiplomacyService from './diplomacy';
import AvatarService from './avatar';
import PaypalService from './paypal';
import BadgeService from './badge';
import ReportService from './report';
import ResourceService from './resource';
import CircularMapService from './maps/circular';
import CircularBalancedMapService from './maps/circularBalanced';
import SpiralMapService from './maps/spiral';
import DoughnutMapService from './maps/doughnut';
import IrregularMapService from './maps/irregular';
import CustomMapService from './maps/custom';
import DiplomacyUpkeepService from './diplomacyUpkeep';
import PlayerCreditsService from './playerCredits';
import PlayerStatisticsService from './playerStatistics';
import CarrierMovementService from './carrierMovement';
import CarrierGiftService from './carrierGift';
import PlayerCycleRewardsService from './playerCycleRewards';
import StarContestedService from './starContested';
import GameFluxService from './gameFlux';
import NotificationService from './notification';
import DiscordService from './discord';

import { DependencyContainer } from './types/DependencyContainer';

import Repository from './repository';
import { Game } from './types/Game';
import { User } from './types/User';
import { GameHistory } from './types/GameHistory';
import { GameEvent } from './types/GameEvent';
import { Guild } from './types/Guild';
import { Payment } from './types/Payment';
import { Report } from './types/Report';

const gameNames = require('../config/game/gameNames');
const starNames = require('../config/game/starNames');

const gameRepository = new Repository<Game>(GameModel);
const userRepository = new Repository<User>(UserModel);
const historyRepository = new Repository<GameHistory>(HistoryModel);
const eventRepository = new Repository<GameEvent>(EventModel);
const guildRepository = new Repository<Guild>(GuildModel);
const paymentRepository = new Repository<Payment>(PaymentModel);
const reportRepository = new Repository<Report>(ReportModel);

export default (config, io): DependencyContainer => {

    // Poor man's dependency injection.

    const passwordService = new PasswordService(bcrypt);

    const authService = new AuthService(userRepository, passwordService);
    const discordService = new DiscordService(config, userRepository);
    const userService = new UserService(UserModel, userRepository, passwordService);
    const adminService = new AdminService(userRepository, gameRepository);
    const recaptchaService = new RecaptchaService(config);

    const guildService = new GuildService(GuildModel, guildRepository, userRepository, userService);
    const guildUserService = new GuildUserService(userRepository, guildService);

    const broadcastService = new BroadcastService(io);
    const distanceService = new DistanceService();
    const randomService = new RandomService();
    const cacheService = new CacheService(config);
    const paypalService = new PaypalService(PaymentModel, config, paymentRepository, userService, cacheService);
    const gameTypeService = new GameTypeService();
    const specialistService = new SpecialistService(gameTypeService);
    const gameStateService = new GameStateService();
    const gameFluxService = new GameFluxService();
    const playerCreditsService = new PlayerCreditsService(gameRepository);
    const avatarService = new AvatarService(userRepository, userService);
    const achievementService = new AchievementService(userRepository, guildService);
    const ratingService = new RatingService(userRepository, gameRepository, userService);
    const nameService = new NameService(gameNames, starNames, randomService);
    const starDistanceService = new StarDistanceService(distanceService);
    const technologyService = new TechnologyService(specialistService);
    const starService = new StarService(gameRepository, randomService, nameService, distanceService, starDistanceService, technologyService, specialistService, userService, gameTypeService, gameStateService);
    const carrierService = new CarrierService(gameRepository, distanceService, starService, technologyService, specialistService);
    const playerStatisticsService = new PlayerStatisticsService(starService, carrierService, technologyService, specialistService);
    const playerCycleRewardsService = new PlayerCycleRewardsService(starService, technologyService, playerStatisticsService, specialistService);
    const diplomacyUpkeepService = new DiplomacyUpkeepService(playerCreditsService, playerCycleRewardsService);
    const diplomacyService = new DiplomacyService(gameRepository, eventRepository, diplomacyUpkeepService);
    const starContestedService = new StarContestedService(diplomacyService);
    const carrierGiftService = new CarrierGiftService(gameRepository, diplomacyService);
    const carrierMovementService = new CarrierMovementService(gameRepository, distanceService, starService, specialistService, diplomacyService, carrierGiftService);
    const resourceService = new ResourceService(randomService, distanceService, starDistanceService, gameTypeService);
    const circularMapService = new CircularMapService(randomService, starService, starDistanceService, distanceService, resourceService, gameTypeService);
    const circularBalancedMapService = new CircularBalancedMapService(randomService, starService, starDistanceService, distanceService, resourceService, gameTypeService);
    const spiralMapService = new SpiralMapService(randomService, starService, starDistanceService, distanceService, resourceService, gameTypeService);
    const doughnutMapService = new DoughnutMapService(randomService, starService, starDistanceService, distanceService, resourceService, gameTypeService);
    const irregularMapService = new IrregularMapService(randomService, starService, starDistanceService, distanceService, resourceService, gameTypeService);
    const customMapService = new CustomMapService();
    const mapService = new MapService(randomService, starService, starDistanceService, nameService, circularMapService, spiralMapService, doughnutMapService, circularBalancedMapService, irregularMapService, gameTypeService, customMapService);
    const playerReadyService = new PlayerReadyService(gameRepository, gameTypeService);
    const playerService = new PlayerService(gameRepository, randomService, mapService, starService, carrierService, starDistanceService, technologyService, specialistService, gameTypeService, playerReadyService);
    const badgeService = new BadgeService(userRepository, userService, playerService);
    const reportService = new ReportService(ReportModel, reportRepository, playerService);
    const ledgerService = new LedgerService(gameRepository, playerService, playerCreditsService);
    const reputationService = new ReputationService(gameRepository, playerStatisticsService, diplomacyService);
    const tradeService = new TradeService(gameRepository, eventRepository, userService, playerService, diplomacyService, ledgerService, achievementService, reputationService, gameTypeService, randomService, playerCreditsService);
    const conversationService = new ConversationService(gameRepository, tradeService, diplomacyService);
    const gameService = new GameService(gameRepository, userService, starService, carrierService, playerService, passwordService, achievementService, avatarService, gameTypeService, gameStateService, conversationService, playerReadyService);
    const gameJoinService = new GameJoinService(userService, starService, playerService, passwordService, achievementService, avatarService, gameTypeService, gameStateService, conversationService, randomService);
    const leaderboardService = new LeaderboardService(userRepository, userService, playerService, guildUserService, ratingService, gameService, gameTypeService, gameStateService, badgeService, playerStatisticsService);
    const researchService = new ResearchService(gameRepository, technologyService, randomService, playerStatisticsService, starService, userService, gameTypeService);
    const combatService = new CombatService(technologyService, specialistService, playerService, starService, reputationService, diplomacyService, gameTypeService);
    const waypointService = new WaypointService(gameRepository, carrierService, starService, distanceService, starDistanceService, technologyService, gameService, playerService, carrierMovementService);
    const specialistBanService = new SpecialistBanService(specialistService);
    const specialistHireService = new SpecialistHireService(gameRepository, specialistService, achievementService, waypointService, playerCreditsService, starService, gameTypeService, specialistBanService);
    const starUpgradeService = new StarUpgradeService(gameRepository, starService, carrierService, achievementService, researchService, technologyService, playerCreditsService, gameTypeService);
    const shipTransferService = new ShipTransferService(gameRepository, carrierService, starService);
    const aiService = new AIService(starUpgradeService, carrierService, starService, distanceService, waypointService, combatService, shipTransferService, technologyService, playerService, reputationService, diplomacyService, playerStatisticsService);
    const historyService = new HistoryService(historyRepository, playerService, gameService, playerStatisticsService);
    const battleRoyaleService = new BattleRoyaleService(starService, carrierService, mapService, starDistanceService, waypointService, carrierMovementService);
    const starMovementService = new StarMovementService(mapService, starDistanceService, specialistService, waypointService);
    const gameGalaxyService = new GameGalaxyService(cacheService, broadcastService, gameService, mapService, playerService, starService, distanceService, starDistanceService, starUpgradeService, carrierService, waypointService, researchService, specialistService, technologyService, reputationService, guildUserService, historyService, battleRoyaleService, starMovementService, gameTypeService, gameStateService, diplomacyService, avatarService, playerStatisticsService, gameFluxService);
    const gameTickService = new GameTickService(distanceService, starService, carrierService, researchService, playerService, historyService, waypointService, combatService, leaderboardService, userService, gameService, technologyService, specialistService, starUpgradeService, reputationService, aiService, battleRoyaleService, starMovementService, diplomacyService, gameTypeService, gameStateService, playerCycleRewardsService, diplomacyUpkeepService, carrierMovementService, carrierGiftService, starContestedService, playerReadyService);
    const emailService = new EmailService(config, gameService, userService, leaderboardService, playerService, gameTypeService, gameStateService, gameTickService);
    const donateService = new DonateService(config, cacheService);
    const eventService = new EventService(EventModel, eventRepository, broadcastService, gameService, gameTickService, researchService, starService, starUpgradeService, tradeService,
        ledgerService, conversationService, combatService, specialistService, badgeService, carrierGiftService, diplomacyService);

    const gameListService = new GameListService(gameRepository, gameService, conversationService, eventService, gameTypeService);
    const gameCreateValidationService = new GameCreateValidationService(playerService, starService, carrierService, specialistService, gameTypeService);
    const gameCreateService = new GameCreateService(GameModel, gameJoinService, gameListService, nameService, mapService, playerService, passwordService, conversationService, historyService, achievementService, userService, gameCreateValidationService, gameFluxService, specialistBanService, gameTypeService);

    const notificationService = new NotificationService(config, userRepository, gameRepository, discordService, conversationService, gameService, gameTickService, researchService, tradeService);

    console.log('Dependency Container Initialized');
    
    return {
        config,
        adminService,
        passwordService,
        authService,
        discordService,
        broadcastService,
        carrierService,
        combatService,
        distanceService,
        emailService,
        eventService,
        leaderboardService,
        gameService,
        gameJoinService,
        gameCreateValidationService,
        gameCreateService,
        gameGalaxyService,
        gameListService,
        gameTickService,
        gameTypeService,
        gameStateService,
        guildService,
        guildUserService,
        mapService,
        playerService,
        playerReadyService,
        randomService,
        researchService,
        starService,
        starDistanceService,
        nameService,
        starUpgradeService,
        technologyService,
        tradeService,
        userService,
        waypointService,
        shipTransferService,
        historyService,
        ledgerService,
        specialistService,
        specialistBanService,
        specialistHireService,
        achievementService,
        conversationService,
        reputationService,
        aiService,
        battleRoyaleService,
        starMovementService,
        cacheService,
        recaptchaService,
        ratingService,
        donateService,
        diplomacyService,
        avatarService,
        paypalService,
        badgeService,
        reportService,
        playerStatisticsService,
        playerCreditsService,
        diplomacyUpkeepService,
        carrierGiftService,
        carrierMovementService,
        playerCycleRewardsService,
        starContestedService,
        gameFluxService,
        notificationService,
    };
};
