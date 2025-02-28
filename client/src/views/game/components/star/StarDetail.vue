<template>
<div class="menu-page container" v-if="star">
    <menu-title :title="star.name + (star.homeStar ? ' - Capital': '')" @onCloseRequested="onCloseRequested">
      <ignore-bulk-upgrade v-if="star.ignoreBulkUpgrade && isOwnedByUserPlayer" :starId="star._id" class="me-1"/>
      <modalButton modalName="abandonStarModal" v-if="!$isHistoricalMode() && isOwnedByUserPlayer && !userPlayer.defeated && isGameInProgress()" classText="btn btn-sm btn-outline-danger">
        <i class="fas fa-star"></i> <i class="fas fa-trash ms-1"></i>
      </modalButton>
      <button @click="viewOnMap(star)" class="btn btn-sm btn-outline-info ms-1"><i class="fas fa-eye"></i></button>
    </menu-title>
    
    <div class="row bg-dark">
      <div class="col text-center pt-2">
        <p class="mb-2" v-if="userPlayer && star.ownedByPlayerId == userPlayer._id">A star under your command.</p>
        <p class="mb-2" v-if="star.ownedByPlayerId != null && (!userPlayer || star.ownedByPlayerId != userPlayer._id)">This star is controlled by <a href="javascript:;" @click="onOpenPlayerDetailRequested">{{starOwningPlayer.alias}}</a>.</p>
        <p class="mb-2" v-if="star.ownedByPlayerId == null">This star has not been claimed by any faction. Send a carrier here to claim it for yourself.</p>
        <p class="mb-2 text-danger" v-if="isDeadStar">This is a dead star, infrastructure cannot be built here.</p>
        <p class="mb-2 text-danger" v-if="star.targeted">This star has been targeted for destruction.</p>
        <p class="mb-2 text-danger" v-if="star.isKingOfTheHillStar">Capture and hold this star to win.</p>

        <div v-if="(!isCompactUIStyle || !star.ownedByPlayerId) && star.isNebula">
          <hr/>
          <p class="mb-0">This star is hidden inside a <span class="text-warning">Nebula <i class="fas fa-eye-slash"></i></span>.</p>
          <p class="mb-2 text-info"><small><i>Ships inside a Nebula are hidden from all other players.</i></small></p>
        </div>

        <div v-if="(!isCompactUIStyle || !star.ownedByPlayerId) && star.isAsteroidField">
          <hr/>
          <p class="mb-0" v-if="star.isAsteroidField">This star is surrounded by an <span class="text-warning">Asteroid Field <i class="fas fa-meteor"></i></span>.</p>
          <p class="mb-2 text-info" v-if="star.isAsteroidField"><small><i>Asteroid Fields have +1 Defender Bonus (net +2 Weapons) in combat.</i></small></p>
        </div>

        <div v-if="(!isCompactUIStyle || !star.ownedByPlayerId) && star.isBinaryStar">
          <hr/>
          <p class="mb-0" v-if="star.isBinaryStar">This is a <span class="text-warning">Binary Star <i class="fas fa-star"></i></span> system.</p>
          <p class="mb-2 text-info" v-if="star.isBinaryStar"><small><i>Binary Stars start with additional natural resources.</i></small></p>
        </div>
        
        <div v-if="(!isCompactUIStyle || !star.ownedByPlayerId) && star.wormHoleToStarId">
          <hr/>
          <p class="mb-0" v-if="wormHolePairStar">This star is a <span class="text-warning">Worm Hole <i class="far fa-sun"></i></span> to <a href="javascript:;" @click="viewOnMap(wormHolePairStar)"><i class="fas fa-eye me-1"></i>{{wormHolePairStar.name}}</a>.</p>
          <p class="mb-0" v-if="!wormHolePairStar">This star is a <span class="text-warning">Worm Hole <i class="far fa-sun"></i></span> to an unknown star.</p>
          <p class="mb-2 text-info"><small><i>Travel between Worm Holes takes 1 tick.</i></small></p>
        </div>
        <div v-if="(!isCompactUIStyle || !star.ownedByPlayerId) && star.warpGate">
        <hr/>
          <p class="mb-0">This star has a <span class="text-warning">Warp Gate <i class="fas fa-dungeon"></i></span>.</p>
          <p class="mb-2 text-info"><small><i>Carriers travel {{ warpSpeedMultiplier }}x faster between active warp gates.</i></small></p>
        </div>
        <div v-if="(!isCompactUIStyle || !star.ownedByPlayerId) && star.isBlackHole">
          <hr/>
          <p class="mb-0" v-if="star.isBlackHole">This star is a <span class="text-warning">Black Hole <i class="far fa-circle"></i></span>.</p>
          <p class="mb-2 text-info" v-if="star.isBlackHole"><small><i>Black Holes have +3 Scanning Range but have reduced natural resources.</i></small></p>
        </div>
      </div>
    </div>
    <div v-if="isCompactUIStyle && star.infrastructure">
      <div class="row mt-2" v-if="!isDeadStar">
        <div class="col">
            <star-resources :resources="star.naturalResources" :compareResources="star.terraformedResources" :iconAlignLeft="true" />
        </div>
        <div class="col-auto">
          <span v-if="star.isNebula" title="Star is obscured inside a nebula - All ship counts are hidden from other players">
            <i class="fas fa-eye-slash ms-1"></i>
          </span>
          <span v-if="star.isAsteroidField" title="Star is surrounded by an asteroid field - +1 defender bonus (net +2 weapons) in combat">
            <i class="fas fa-meteor ms-1"></i>
          </span>
          <span v-if="star.isBinaryStar" title="Binary Star - The system has additional natural resources">
            <i class="fas fa-star ms-1"></i>
          </span>
          <span v-if="star.wormHoleToStarId" title="The star has a worm hole - Connected to another worm hole somewhere in the galaxy">
            <i class="far fa-sun ms-1"></i>
          </span>
          <span v-if="star.isBlackHole" title="Black Hole - The star has +3 scanning range but reduced natural resources">
            <i class="far fa-circle ms-1"></i>
          </span>
          <span :title="star.warpGate ? 'Warp Gate - Carriers travel faster between active warp gates':'No Warp Gate'" :class="{'no-warp-gate':!star.warpGate}">
            <i class="fas fa-dungeon ms-2"></i>
          </span>
        </div>
      </div>
      
      <div class="row mt-2 pb-2">
        <div class="col">
          <span v-if="star.infrastructure && !isDeadStar" title="Economic infrastructure">
              <i class="fas fa-money-bill-wave text-success"></i> {{star.infrastructure.economy}}
          </span>
          <span v-if="star.infrastructure && !isDeadStar" title="Industrial infrastructure" class="ms-2">
              <i class="fas fa-tools text-warning"></i> {{star.infrastructure.industry}}
          </span>
          <span v-if="star.infrastructure && !isDeadStar" title="Scientific infrastructure" class="ms-2">
              <i class="fas fa-flask text-info"></i> {{star.infrastructure.science}}
          </span>
        </div>
        <div class="col-auto">
          <span title="Total known garrison" v-if="star.ownedByPlayerId && star.infrastructure">
            {{star.ships == null ? '???' : star.ships}} <i class="fas fa-rocket ms-1"></i>
          </span>
        </div>
      </div>

      <div class="row pb-2" v-if="canShowSpecialist || (star.ownedByPlayerId && star.manufacturing != null)">
        <div class="col">
          <span v-if="canShowSpecialist && isOwnedByUserPlayer && canHireSpecialist">
            <specialist-icon :type="'star'" :defaultIcon="'user-astronaut'" :specialist="star.specialist"></specialist-icon>
            <a href="javascript:;" @click="onViewHireStarSpecialistRequested">
              <span class="ms-1" v-if="star.specialistId" :title="star.specialist.description">{{star.specialist.name}}</span>
              <span v-if="!star.specialistId">No Specialist</span>
            </a>
          </span>
          <span v-if="canShowSpecialist && (!isOwnedByUserPlayer || !canHireSpecialist)">
            <specialist-icon :type="'star'" :defaultIcon="'user-astronaut'" :specialist="star.specialist"></specialist-icon>
            <span v-if="star.specialist">
              {{star.specialist.name}}
            </span>
            <span v-if="!star.specialist">No Specialist</span>
          </span>
        </div>
        <div class="col-auto">
          <span v-if="star.ownedByPlayerId && star.manufacturing != null && !isDeadStar" title="Ship production per tick">
            {{star.manufacturing}} <i class="fas fa-wrench ms-1"></i>
          </span>
        </div>
      </div>

      <div class="row pb-2" v-if="star.specialist">
        <div class="col">
          <p class="mb-0"><small>{{star.specialist.description}}</small></p>
        </div>
      </div>

      <div class="mb-0" v-if="!isDeadStar">
        <infrastructureUpgradeCompact 
          v-if="isOwnedByUserPlayer && !userPlayer.defeated && star.upgradeCosts != null"
          :star="star"
          :availableCredits="userPlayer.credits"
          :economy="star.upgradeCosts.economy"
          :industry="star.upgradeCosts.industry"
          :science="star.upgradeCosts.science"
          v-on:onEditWaypointsRequested="onEditWaypointsRequested"
          v-on:onBuildCarrierRequested="onBuildCarrierRequested"/>
      </div>
    </div>

    <div v-if="isStandardUIStyle">
      <div v-if="star.ownedByPlayerId && star.infrastructure" class="row mb-0 pt-3 pb-3 bg-primary">
          <div class="col">
              Ships
          </div>
          <div class="col text-end">
            <span>{{star.ships == null ? '???' : star.ships}}</span>
            <i class="fas fa-rocket ms-2"></i>
          </div>
      </div>

      <div v-if="star.infrastructure && !isDeadStar" class="row pt-1 pb-1 bg-dark">
          <div class="col">
              Natural Resources
          </div>
          <div class="col text-end">
              <star-resources :resources="star.naturalResources" :iconAlignLeft="false" />
          </div>
      </div>

      <div v-if="star.ownedByPlayerId && star.infrastructure && !isDeadStar" class="row pt-1 pb-1 bg-dark">
          <div class="col">
              Terraformed Resources
          </div>
          <div class="col text-end">
              <star-resources :resources="star.terraformedResources" :iconAlignLeft="false" />
          </div>
      </div>

      <div v-if="star.ownedByPlayerId && star.manufacturing != null" class="row pt-1 pb-1 bg-dark">
          <div class="col">
              Ship Production
          </div>
          <div class="col text-end" title="Ship production per tick">
            <span>{{star.manufacturing}}</span>
            <i class="fas fa-wrench ms-2"></i>
          </div>
      </div>
    </div>

    <div v-if="getCarriersInOrbit().length">
      <div class="row pt-2">
        <div class="col">
          <h4>Carriers</h4>
        </div>
        <div class="col-auto">
          <button title="Transfer all ships to the star" v-if="isOwnedByUserPlayer" type="button" class="btn btn-sm btn-outline-primary" @click="transferAllToStar()">
            <i class="fas fa-chevron-up"></i>
            Garrison All
          </button>
        </div>
      </div>

      <div v-for="carrier in getCarriersInOrbit()" :key="carrier._id" class="row mb-1 pt-1 pb-0 bg-dark">
        <div class="col-auto pe-0">
          <specialist-icon :type="'carrier'" :defaultIcon="'rocket'" :specialist="carrier.specialist"/>
        </div>
        <div class="col ps-1">
          <a href="javascript:;" @click="onOpenCarrierDetailRequested(carrier)">{{carrier.name}}</a>
        </div>
        <div class="col-auto pe-0">
          <i class="fas fa-map-marker-alt"></i>
          <i class="fas fa-sync ms-1" v-if="carrier.waypointsLooped"></i> {{carrier.waypoints.length}}
        </div>
        <div class="col-3 text-end">
          <i class="fas fa-rocket"></i> {{carrier.ships == null ? '???' : carrier.ships}}
        </div>
        <div class="col-auto ps-0">
          <a href="javascript:;" v-if="!$isHistoricalMode() && isOwnedByUserPlayer && !isGameFinished" title="Transfer ships between the star and carrier" @click="onShipTransferRequested(carrier)"><i class="fas fa-exchange-alt"></i></a>
        </div>
      </div>
    </div>

    <div v-if="isStandardUIStyle && !isDeadStar">
      <div v-if="star.infrastructure" class="mb-2">
        <h4 class="pt-2">Infrastructure</h4>

        <infrastructure :starId="star._id"/>

        <infrastructureUpgrade v-if="isOwnedByUserPlayer && !userPlayer.defeated && star.upgradeCosts != null"
          :star="star"
          :availableCredits="userPlayer.credits"
          :economy="star.upgradeCosts.economy"
          :industry="star.upgradeCosts.industry"
          :science="star.upgradeCosts.science"/>
      </div>

      <!-- TODO: Turn these into components -->
      <div v-if="isOwnedByUserPlayer && !userPlayer.defeated && star.upgradeCosts != null">
        <div class="row bg-dark pt-2 pb-0 mb-1">
          <div class="col-8">
            <p class="mt-1 mb-2">Build a <strong>Carrier</strong> to transport ships through hyperspace.</p>
          </div>
          <div class="col-4">
            <div class="d-grid gap-2">
              <button :disabled="$isHistoricalMode() || userPlayer.credits < star.upgradeCosts.carriers || star.ships < 1 || isGameFinished" 
                class="btn btn-info mb-2" 
                @click="onBuildCarrierRequested">
                <i class="fas fa-rocket"></i>
                Build for ${{star.upgradeCosts.carriers}}
              </button>
            </div>
          </div>
        </div>

        <div class="row bg-dark pt-2 pb-0 mb-1" v-if="(canBuildWarpGates && !star.warpGate) || (canDestroyWarpGates && star.warpGate)">
          <div class="col-8">
            <p class="mt-1 mb-2">Build a <strong>Warp Gate</strong> to accelerate carrier movement.</p>
          </div>
          <div class="col-4">
            <div class="d-grid gap-2">
              <modalButton v-if="canBuildWarpGates && !star.warpGate" 
                :disabled="$isHistoricalMode() || userPlayer.credits < star.upgradeCosts.warpGate || isGameFinished" 
                modalName="buildWarpGateModal" 
                classText="btn btn-success mb-2">
                <i class="fas fa-dungeon"></i>
                Build for ${{star.upgradeCosts.warpGate}}
              </modalButton>
            </div>
            <div class="d-grid gap-2">
              <modalButton v-if="canDestroyWarpGates && star.warpGate" 
                :disabled="$isHistoricalMode() || isGameFinished" 
                modalName="destroyWarpGateModal"
                classText="btn btn-outline-danger mb-2">
                <i class="fas fa-trash"></i>
                Destroy Gate
              </modalButton>
            </div>
          </div>
        </div>

        <div class="row bg-dark pt-2 pb-0 mb-1" v-if="isGameInProgress()">
          <div class="col-8">
            <p class="mb-2">Abandon this star for another player to claim.</p>
          </div>
          <div class="col-4">
            <div class="d-grid gap-2">
              <modalButton modalName="abandonStarModal" classText="btn btn-outline-danger mb-2" :disabled="$isHistoricalMode()">
                <i class="fas fa-trash"></i>
                Abandon Star
              </modalButton>
            </div>
          </div>
        </div>
      </div>

      <h4 class="pt-2" v-if="canShowSpecialist">Specialist</h4>

      <star-specialist v-if="canShowSpecialist" :starId="star._id" @onViewHireStarSpecialistRequested="onViewHireStarSpecialistRequested"/>
    </div>

    <!-- Modals -->

    <dialogModal v-if="isOwnedByUserPlayer && star.upgradeCosts != null" modalName="buildWarpGateModal" titleText="Build Warp Gate" cancelText="No" confirmText="Yes" @onConfirm="confirmBuildWarpGate">
      <p>Are you sure you want build a Warp Gate at <b>{{star.name}}</b>?</p>
      <p>The upgrade will cost ${{star.upgradeCosts.warpGate}}.</p>
    </dialogModal>

    <dialogModal modalName="destroyWarpGateModal" titleText="Destroy Warp Gate" cancelText="No" confirmText="Yes" @onConfirm="confirmDestroyWarpGate">
      <p>Are you sure you want destroy Warp Gate at <b>{{star.name}}</b>?</p>
    </dialogModal>

    <dialogModal modalName="abandonStarModal" titleText="Abandon Star" cancelText="No" confirmText="Yes" @onConfirm="confirmAbandonStar">
      <p>Are you sure you want to abandon <b>{{star.name}}</b>?</p>
      <p>Its Economy, Industry and Science will remain, but all ships and carriers at this star will be destroyed.</p>
    </dialogModal>
</div>
</template>

<script>
import starService from '../../../../services/api/star'
import AudioService from '../../../../game/audio'
import GameHelper from '../../../../services/gameHelper'
import MenuTitle from '../MenuTitle'
import Infrastructure from '../shared/Infrastructure'
import InfrastructureUpgrade from './InfrastructureUpgrade'
import InfrastructureUpgradeCompact from './InfrastructureUpgradeCompact'
import ModalButton from '../../../components/modal/ModalButton'
import DialogModal from '../../../components/modal/DialogModal'
import StarSpecialistVue from './StarSpecialist'
import SpecialistIconVue from '../specialist/SpecialistIcon'
import GameContainer from '../../../../game/container'
import gameHelper from '../../../../services/gameHelper'
import IgnoreBulkUpgradeVue from './IgnoreBulkUpgrade'
import StarResourcesVue from './StarResources'

export default {
  components: {
    'menu-title': MenuTitle,
    'infrastructure': Infrastructure,
    'infrastructureUpgrade': InfrastructureUpgrade,
    'infrastructureUpgradeCompact': InfrastructureUpgradeCompact,
    'modalButton': ModalButton,
    'dialogModal': DialogModal,
    'star-specialist': StarSpecialistVue,
    'specialist-icon': SpecialistIconVue,
    'ignore-bulk-upgrade': IgnoreBulkUpgradeVue,
    'star-resources': StarResourcesVue
  },
  props: {
    starId: String
  },
  data () {
    return {
      audio: null,
      userPlayer: null,
      currentPlayerId: null,
      canBuildWarpGates: false,
      canDestroyWarpGates: false,
      isSpecialistsEnabled: false,
      isStandardUIStyle: false,
      isCompactUIStyle: false,
      warpSpeedMultiplier: '',
    }
  },
  mounted () {
    this.isStandardUIStyle = this.$store.state.settings.interface.uiStyle === 'standard'
    this.isCompactUIStyle = this.$store.state.settings.interface.uiStyle === 'compact'

    this.userPlayer = GameHelper.getUserPlayer(this.$store.state.game)

    this.canBuildWarpGates = this.$store.state.game.settings.specialGalaxy.warpgateCost !== 'none'
    this.canDestroyWarpGates = this.$store.state.game.state.startDate != null
    this.warpSpeedMultiplier = this.$store.state.game.constants.distances.warpSpeedMultiplier

    // Can display specialist section if sepcialists are enabled and the star is owned by a player.
    // Otherwise if the star is unowned then display only if the star is within scanning range and it has a specialist on it.
    this.isSpecialistsEnabled = this.$store.state.game.settings.specialGalaxy.specialistCost !== 'none'
  },
  methods: {
    onCloseRequested (e) {
      this.$emit('onCloseRequested', e)
    },
    onViewCompareIntelRequested (e) {
      this.$emit('onViewCompareIntelRequested', e)
    },
    onViewHireStarSpecialistRequested (e) {
      this.$emit('onViewHireStarSpecialistRequested', this.starId)
    },
    onShipTransferRequested (e) {
      if (e.orbiting) {
        this.$emit('onShipTransferRequested', e._id)
      }
    },
    getCarriersInOrbit () {
      return GameHelper.getCarriersOrbitingStar(this.$store.state.game, this.star)
    },
    isGameInProgress () {
      return GameHelper.isGameInProgress(this.$store.state.game)
    },
    onOpenPlayerDetailRequested (e) {
      this.$emit('onOpenPlayerDetailRequested', this.star.ownedByPlayerId)
    },
    onOpenCarrierDetailRequested (carrier) {
      this.$emit('onOpenCarrierDetailRequested', carrier._id)
    },
    onEditWaypointsRequested (carrierId) {
      this.$emit('onEditWaypointsRequested', carrierId)
    },
    onBuildCarrierRequested () {
      this.$emit('onBuildCarrierRequested', this.star._id)
    },
    viewOnMap (e) {
      GameContainer.map.panToStar(e)
    },
    async confirmAbandonStar (e) {
      try {
        let response = await starService.abandonStar(this.$store.state.game._id, this.star._id)

        if (response.status === 200) {
          this.$toasted.show(`${this.star.name} has been abandoned.`)

          this.$store.commit('gameStarAbandoned', {
            starId: this.star._id
          })

          AudioService.leave()
        }
      } catch (err) {
        console.error(err)
      }
    },
    async confirmBuildWarpGate (e) {
      try {
        let response = await starService.buildWarpGate(this.$store.state.game._id, this.star._id)

        if (response.status === 200) {
          this.$toasted.show(`Warp Gate built at ${this.star.name}.`)

          this.$store.commit('gameStarWarpGateBuilt', response.data)
          
          AudioService.join()
        }
      } catch (err) {
        console.error(err)
      }
    },
    async confirmDestroyWarpGate (e) {
      try {
        let response = await starService.destroyWarpGate(this.$store.state.game._id, this.star._id)

        if (response.status === 200) {
          this.$toasted.show(`Warp Gate destroyed at ${this.star.name}.`)

          this.$store.commit('gameStarWarpGateDestroyed', {
            starId: this.star._id
          })
          
          AudioService.leave()
        }
      } catch (err) {
        console.error(err)
      }
    },
    async transferAllToStar() {
      try {
        let response = await starService.transferAllToStar(this.$store.state.game._id, this.star._id)
        
        if (response.status === 200) {
          let carriers = response.data.carriers

          carriers.forEach(responseCarrier => {
            let mapObjectCarrier = gameHelper.getCarrierById(this.$store.state.game, responseCarrier._id) 
            mapObjectCarrier.ships = responseCarrier.ships
          })

          this.star.ships = response.data.star.ships

          this.$toasted.show(`All ships transfered to ${this.star.name}.`)
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
  computed: {
    star: function () {
      return GameHelper.getStarById(this.$store.state.game, this.starId)
    },
    starOwningPlayer: function () {
      return GameHelper.getStarOwningPlayer(this.$store.state.game, this.star)
    },
    canShowSpecialist: function () {
      return this.isSpecialistsEnabled && (this.star.specialistId || this.isOwnedByUserPlayer) && !this.isDeadStar
    },
    canHireSpecialist: function () {
      return this.canShowSpecialist 
        && !GameHelper.isGameFinished(this.$store.state.game) 
        && !this.isDeadStar
        && (!this.star.specialistId || !this.star.specialist.oneShot)
    },
    isOwnedByUserPlayer: function() {
      let owner = GameHelper.getStarOwningPlayer(this.$store.state.game, this.star)

      return owner && this.userPlayer && owner._id === this.userPlayer._id
    },
    isGameFinished: function () {
      return GameHelper.isGameFinished(this.$store.state.game)
    },
    isDeadStar: function () {
      return GameHelper.isDeadStar(this.star)
    },
    wormHolePairStar: function () {
      if (!this.star.wormHoleToStarId) {
        return null
      }

      return GameHelper.getStarById(this.$store.state.game, this.star.wormHoleToStarId)
    }
  }
}
</script>

<style scoped>
.no-warp-gate {
  opacity: 0.1;
}
</style>
