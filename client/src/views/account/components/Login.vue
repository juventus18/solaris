<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-2" v-if="!isLoading">
        <input type="text" required="required" class="form-control" placeholder="Email" v-model="email" :disabled="isLoading"/>
    </div>

    <div class="mb-2" v-if="!isLoading">
        <input type="password" required="required" class="form-control" placeholder="Password" v-model="password"  :disabled="isLoading"/>
    </div>

    <loading-spinner :loading="isLoading"/>

    <form-error-list v-bind:errors="errors"/>

    <div class="mb-2">
      <div class="row">
        <div class="col-6">
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-success" :disabled="isLoading">
              Login
              <i class="fas fa-sign-in-alt"></i>
            </button>
          </div>
        </div>
        <div class="col-6">
          <div class="d-grid gap-2">
            <router-link to="/account/create" tag="button" class="btn btn-primary" :disabled="isLoading">
              Register
              <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-2">
      Forgot <router-link to="/account/forgot-password">Password</router-link>/<router-link to="/account/forgot-username">Username</router-link>?
    </div>
  </form>
</template>

<script>
import LoadingSpinnerVue from '../../components/LoadingSpinner'
import router from '../../../router'
import FormErrorList from '../../components/FormErrorList'
import authService from '../../../services/api/auth'

export default {
  components: {
    'loading-spinner': LoadingSpinnerVue,
    'form-error-list': FormErrorList
  },
  data () {
    return {
      isLoading: false,
      errors: [],
      email: null,
      password: null
    }
  },
  methods: {
    async handleSubmit (e) {
      this.errors = []

      if (!this.email) {
        this.errors.push('Email required.')
      }

      if (!this.password) {
        this.errors.push('Password required.')
      }

      e && e.preventDefault()

      if (this.errors.length) return

      try {
        this.isLoading = true

        // Call the login API endpoint
        let response = await authService.login(this.email, this.password)

        if (response.status === 200) {
          this.$store.commit('setUserId', response.data._id)
          this.$store.commit('setUsername', response.data.username)
          this.$store.commit('setRoles', response.data.roles)
          this.$store.commit('setUserCredits', response.data.credits)

          router.push({ name: 'main-menu' })
        }
      } catch (err) {
        this.errors = err.response.data.errors || []
      }

      this.isLoading = false
    }
  }
}
</script>

<style scoped>
</style>
