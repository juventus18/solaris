<template>
<div v-if="player">
  <div class="row" :style="{'background-image': 'linear-gradient(to left, ' + colour + ', #375a7f 100%)'}">
      <div class="col">
          <h4 class="pt-2">
            <player-icon :playerId="player._id" class="me-1"/>
            {{player.alias}}
          </h4>
      </div>
      <div class="col-auto">
        <h4 class="pt-2">
          <player-diplomatic-status-icon v-if="isFormalAlliancesEnabled" :toPlayerId="player._id" class="ms-2"/>
          <i v-if="player.hasFilledAfkSlot && !player.afk" class="fas fa-user-friends ms-2" title="This player has filled an AFK slot and will be awarded 1.5x additional rank (minimum 1) when the game ends"></i>
          <i class="fas fa-robot ms-2" v-if="player.defeated || !player.isRealUser" title="This player is AI Controlled"></i>
          <span v-if="player.defeated" :title="getPlayerStatus(player)">
            <i v-if="!player.afk" class="fas fa-skull-crossbones ms-2" title="This player has been defeated"></i>
            <i v-if="player.afk" class="fas fa-user-clock ms-2" title="This player is AFK"></i>
          </span>
          <span class="ms-2" v-if="player.hasDuplicateIP" title="Warning: This player shares the same IP address as another player in this game.">
            <i class="fas fa-exclamation-triangle"></i>
          </span>
        </h4>
      </div>
  </div>
  <player-open-slot-status :player="player"/>
  <player-online-status :player="player"/>
  <player-missed-turns :player="player"/>
</div>
</template>

<script>
import GameHelper from '../../../../services/gameHelper'
import DiplomacyHelper from '../../../../services/diplomacyHelper'
import PlayerIconVue from '../player/PlayerIcon'
import PlayerOpenSlotStatusVue from './PlayerOpenSlotStatus'
import PlayerOnlineStatusVue from './PlayerOnlineStatus'
import PlayerMissedTurnsVue from './PlayerMissedTurns'
import PlayerDiplomaticStatusIcon from './PlayerDiplomaticStatusIcon'

export default {
  components: {
    'player-icon': PlayerIconVue,
    'player-open-slot-status': PlayerOpenSlotStatusVue,
    'player-online-status': PlayerOnlineStatusVue,
    'player-missed-turns': PlayerMissedTurnsVue,
    'player-diplomatic-status-icon': PlayerDiplomaticStatusIcon
  },
  props: {
    player: Object
  },
  data () {
    return {
      colour: ''
    }
  },
  mounted () {
    this.colour = this.getFriendlyColour(this.player.colour.value)
  },
  methods: {
    getFriendlyColour (colour) {
      return GameHelper.getFriendlyColour(colour)
    },  
    getPlayerStatus () {
      return GameHelper.getPlayerStatus(this.player)
    }
  },
  computed: {
    isFormalAlliancesEnabled () {
      return DiplomacyHelper.isFormalAlliancesEnabled(this.$store.state.game)
    }
  }
}
</script>

<style scoped>

</style>
