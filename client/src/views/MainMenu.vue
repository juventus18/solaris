<template>
  <view-container>
    <view-title title="Main Menu" :hideHomeButton="true" :showSocialLinks="true"/>

    <div class="row pb-0 achievements">
      <div class="col-sm-12 col-md-6 col-lg-5">
        <p class="mb-1">A space strategy game filled with conquest, betrayal and subterfuge.</p>
        <p class="mb-2 mt-2"><small>Play <span class="text-warning">Solaris</span> on <a href="https://solaris.games" target="_blank" title="Web"><i class="fab fa-chrome me-1"></i>Web</a>, <a href="https://store.steampowered.com/app/1623930/Solaris/" target="_blank" title="Steam"><i class="fab fa-steam me-1"></i>Steam</a> and <a href="https://play.google.com/store/apps/details?id=com.voxel.solaris_android" target="_blank" title="Android"><i class="fab fa-google-play me-1"></i>Android</a>.</small></p>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-7">
        <!-- player quick stats -->
        <achievements v-if="achievements" v-bind:victories="achievements.victories" v-bind:rank="achievements.rank" v-bind:renown="achievements.renown"/>
        <loading-spinner :loading="!achievements"></loading-spinner>
      </div>
    </div>

    <div class="row pb-0 pt-3">
      <div class="col-sm-12 col-md-6 col-lg-6">
        <div class="card bg-dark text-white p-1" @click="routeToPath('/game/active-games')">
          <img class="card-img" :src="require('../assets/screenshots/home-1.png')" alt="View my games">
          <div class="card-img-overlay">
            <h5 class="card-title">
              <i class="fas fa-user"></i> 
              <span class="ms-2">My Games</span>
            </h5>
          </div>
          <div class="card-arrow">
            <div class="card-arrow-top-left"></div>
            <div class="card-arrow-top-right"></div>
            <div class="card-arrow-bottom-left"></div>
            <div class="card-arrow-bottom-right"></div>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-6" @click="routeToPath('/game/list')">
        <div class="card bg-dark text-white p-1">
          <img class="card-img" :src="require('../assets/screenshots/home-2.png')" alt="Join a game">
          <div class="card-img-overlay">
            <h5 class="card-title">
              <i class="fas fa-gamepad"></i>
              <span class="ms-2">Join Game</span>
            </h5>
          </div>
          <div class="card-arrow">
            <div class="card-arrow-top-left"></div>
            <div class="card-arrow-top-right"></div>
            <div class="card-arrow-bottom-left"></div>
            <div class="card-arrow-bottom-right"></div>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-4 col-lg-4">
        <div class="card bg-dark text-white p-1" @click="routeToPath('/leaderboard')">
          <img class="card-img" :src="require('../assets/screenshots/home-3.png')" alt="Leaderboard">
          <div class="card-img-overlay">
            <h5 class="card-title">
              <i class="fas fa-list-ol"></i>
              <span class="ms-2">Leaderboard</span>
            </h5>
          </div>
          <div class="card-arrow">
            <div class="card-arrow-top-left"></div>
            <div class="card-arrow-top-right"></div>
            <div class="card-arrow-bottom-left"></div>
            <div class="card-arrow-bottom-right"></div>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-4 col-lg-4">
        <div class="card bg-dark text-white p-1" @click="routeToPath('/guild')">
          <img class="card-img" :src="require('../assets/screenshots/home-4.png')" alt="Guilds">
          <div class="card-img-overlay">
            <h5 class="card-title">
              <i class="fas fa-shield-alt"></i>
              <span class="ms-2">{{user && user.guildId ? 'My Guild' : 'Guilds'}}</span>
            </h5>
          </div>
          <div class="card-arrow">
            <div class="card-arrow-top-left"></div>
            <div class="card-arrow-top-right"></div>
            <div class="card-arrow-bottom-left"></div>
            <div class="card-arrow-bottom-right"></div>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-4 col-lg-4">
        <div class="card bg-dark text-white p-1" @click="routeToPath('/avatars')">
          <img class="card-img" :src="require('../assets/screenshots/home-5.png')" alt="Shop">
          <div class="card-img-overlay">
            <h5 class="card-title card-title-success">
              <i class="fas fa-shopping-basket"></i>
              <span class="ms-2">Avatar Shop</span>
            </h5>
          </div>
          <div class="card-arrow">
            <div class="card-arrow-top-left"></div>
            <div class="card-arrow-top-right"></div>
            <div class="card-arrow-bottom-left"></div>
            <div class="card-arrow-bottom-right"></div>
          </div>
        </div>
      </div>
    </div>

    <hr/>
    
    <tutorial-game />

    <hr/>

    <!-- <div class="row">
      <div class="col-12 col-lg-6">
        <recent-donations :maxLength="null" />
      </div>
      <div class="d-none d-lg-block col-6">
        <iframe src="https://discord.com/widget?id=686524791943069734&theme=dark" style="width:100%;height:100%" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
      </div>
    </div> -->
  </view-container>
</template>

<script>
import LoadingSpinnerVue from './components/LoadingSpinner'
import router from '../router'
import authService from '../services/api/auth'
import userService from '../services/api/user'
import ViewContainer from './components/ViewContainer'
import ViewTitle from './components/ViewTitle'
import Achievements from './game/components/player/Achievements'
import RecentDonations from './game/components/donate/RecentDonations.vue'
import TutorialGame from './game/components/menu/TutorialGame'

export default {
  components: {
    'loading-spinner': LoadingSpinnerVue,
    'view-container': ViewContainer,
    'view-title': ViewTitle,
    'achievements': Achievements,
    'recent-donations': RecentDonations,
    'tutorial-game': TutorialGame
  },
  data () {
    return {
      user: null,
      achievements: null,
      isLoggingOut: false
    }
  },
  mounted () {
    this.loadAchievements()
  },
  methods: {
    async logout () {
      this.isLoggingOut = true

      await authService.logout()

      this.$store.commit('clearUserId')
      this.$store.commit('clearUsername')
      this.$store.commit('clearRoles')
      this.$store.commit('clearUserCredits')

      this.isLoggingOut = false

      router.push({ name: 'home' })
    },
    async loadAchievements () {
      try {
        let response = await userService.getMyUserInfo()

        this.user = response.data
        this.achievements = response.data.achievements

        this.$store.commit('setUserCredits', response.data.credits)
      } catch (err) {
        console.error(err)
      }
    },
    routeToPath(path) {
      router.push(path)
    }
  },
  computed: {
    documentationUrl () {
      return process.env.VUE_APP_DOCUMENTATION_URL
    }
  }
}
</script>

<style scoped>
.card {
  max-height: 150px;
  margin-bottom: 1rem;
  cursor: pointer;
}

.card-img {
  object-fit: cover;
  max-height: 150px;
  min-height: 100%; 
  width: auto;
}

.card-img-overlay {
  padding: 0.5rem;
}

.card-title {
  background-color: #375a7f;
  padding: 0.25rem;
  display: inline-block;
}

.card-title-success {
  background-color: #00bc8c;
}
</style>
