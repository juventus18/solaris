import { Game } from "./types/Game";

export default class GameTypeService {

    isNewPlayerGame(game: Game) {
        return ['new_player_rt', 'new_player_tb'].includes(game.settings.general.type);
    }

    isTutorialGame(game: Game) {
        return game.settings.general.type === 'tutorial';
    }

    isOfficialGame(game: Game) {
        return game.settings.general.createdByUserId == null;
    }

    isCustomGame(game: Game) {
        return game.settings.general.type === 'custom';
    }

    isFeaturedGame(game: Game) {
        return game.settings.general.featured;
    }

    isSpecialGameMode(game: Game) {
        return [
            'special_dark',
            'special_ultraDark',
            'special_orbital',
            'special_battleRoyale',
            'special_homeStar',
            'special_anonymous',
            'special_kingOfTheHill',
            'special_tinyGalaxy'
        ].includes(game.settings.general.type);
    }

    is32PlayerGame(game: Game) {
        return game.settings.general.playerLimit === 32;
    }

    isConquestMode(game: Game) {
        return game.settings.general.mode === 'conquest';
    }

    isKingOfTheHillMode(game: Game) {
        return game.settings.general.mode === 'kingOfTheHill';
    }

    isAnonymousGame(game: Game) {
        return game.settings.general.anonymity === 'extra';
    }

    isForEstablishedPlayersOnly(game: Game) {
        return game.settings.general.playerType === 'establishedPlayers'
    }

    isOrbitalMode(game: Game) {
        return game.settings.orbitalMechanics.enabled === 'enabled';
    }

    isBattleRoyaleMode(game: Game) {
        return game.settings.general.mode === 'battleRoyale';
    }

    isDarkModeExtra(game: Game) {
        return game.settings.specialGalaxy.darkGalaxy === 'extra';
    }

    isDarkMode(game: Game) {
        return game.settings.specialGalaxy.darkGalaxy === 'standard'
            || game.settings.specialGalaxy.darkGalaxy === 'extra';
    }

    isDarkStart(game: Game) {
        return game.settings.specialGalaxy.darkGalaxy === 'start';
    }

    isTurnBasedGame(game: Game) {
        return game.settings.gameTime.gameType === 'turnBased';
    }

    isRealTimeGame(game: Game) {
        return game.settings.gameTime.gameType === 'realTime';
    }

    isSplitResources(game: Game) {
        return game.settings.specialGalaxy.splitResources === 'enabled';
    }

    is1v1Game(game: Game) {
        return ['1v1_rt', '1v1_tb'].includes(game.settings.general.type);
    }

    isFluxGame(game: Game) {
        return game.settings.general.fluxEnabled === 'enabled'
    }

    isRankedGame(game: Game) {
        // Official games are either not user created or featured (featured games can be user created)
        return !this.isTutorialGame(game) &&
                !this.isNewPlayerGame(game) &&
                (!this.isCustomGame(game) || this.isFeaturedGame(game));
    }

}
