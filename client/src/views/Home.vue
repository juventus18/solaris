<template>
<div class="full-container">
  <view-container :hideTopBar="true">
    <view-title title="Welcome to Solaris" :hideHomeButton="true" :showSocialLinks="true" />

    <div class="row">
      <div class="col-sm-12 col-md-6 pb-3">
        <p>Discover a space strategy game filled with <span class="text-warning">conquest</span>, <span class="text-warning">betrayal</span> and <span class="text-warning">subterfuge</span>.</p>
        <p>Build alliances, make enemies and fight your way to victory to <span class="text-danger">galactic domination.</span></p>
        <p>Will <strong>you</strong> conquer the galaxy?</p>
        <a :href="documentationUrl" target="_blank">Learn more...</a>
      </div>
      <div class="col-sm-12 col-md-6">
        <h4>Login</h4>

        <loading-spinner :loading="isAutoLoggingIn"/>

        <account-login v-if="!isAutoLoggingIn"></account-login>
      </div>
    </div>

    <div class="row bg-dark">
      <div class="col text-center">
        <p class="mb-2 mt-2">Play <span class="text-warning">Solaris</span> on <a href="https://solaris.games" target="_blank" title="Web"><i class="fab fa-chrome me-1"></i>Web</a>, <a href="https://store.steampowered.com/app/1623930/Solaris/" target="_blank" title="Steam"><i class="fab fa-steam me-1"></i>Steam</a> and <a href="https://play.google.com/store/apps/details?id=com.voxel.solaris_android" target="_blank" title="Android"><i class="fab fa-google-play me-1"></i>Android</a>.</p>
      </div>
    </div>

    <!-- <div class="row">
      <div class="col-12 col-lg-6">
        <recent-donations :maxLength="null" />
      </div>
      <div class="d-none d-lg-block col-6">
        <iframe src="https://discord.com/widget?id=686524791943069734&theme=dark" style="width:100%;height:100%" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
      </div>
    </div> -->
  </view-container>
  
  <parallax />
</div>
</template>

<script>
import ViewContainer from './components/ViewContainer'
import ViewTitle from './components/ViewTitle'
import AccountLoginVue from './account/components/Login'
import ApiAuthService from '../services/api/auth'
import router from '../router'
import LoadingSpinnerVue from './components/LoadingSpinner.vue'
import RecentDonationsVue from './game/components/donate/RecentDonations.vue'
import ParallaxVue from './components/Parallax'

export default {
  components: {
    'view-container': ViewContainer,
    'view-title': ViewTitle,
    'account-login': AccountLoginVue,
    'loading-spinner': LoadingSpinnerVue,
    'recent-donations': RecentDonationsVue,
    'parallax': ParallaxVue
  },
  data () {
    return {
      isAutoLoggingIn: false
    }
  },
  async mounted () {
    this.isAutoLoggingIn = true
    
    try {
      let response = await ApiAuthService.verify()

      if (response.status === 200) {
        if (response.data._id) {
          this.$store.commit('setUserId', response.data._id)
          this.$store.commit('setUsername', response.data.username)
          this.$store.commit('setRoles', response.data.roles)
          this.$store.commit('setUserCredits', response.data.credits)

          router.push({ name: 'main-menu' })
        }
      }
    } catch (err) {
      console.error(err)
    }

    this.isAutoLoggingIn = false
  },
  computed: {
    documentationUrl () {
      return process.env.VUE_APP_DOCUMENTATION_URL
    }
  }
}
</script>

<style scoped>
.full-container {
  background-color: black !important;
}
</style>
