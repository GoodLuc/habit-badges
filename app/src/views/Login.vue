<template>
  <div class="container">
    <div v-if="register" class="register flex wrap justify-center">
      <h2>Register</h2>
      <p>
        <a href="#" @click="showLogin">Login instead?</a>
      </p>
      <input type="text" v-model="email" placeholder="Email">
      <input type="text" v-model="name" placeholder="Name" id="Name">
      <input @keyup.enter="makeUser" type="password" v-model="password" placeholder="Password">
      <p v-if="warn" class="warn">{{ warn_message }}</p>
      <p v-if="warn2" class="warn">That email is already registered. <a href="#" @click="showLogin">Login instead?</a></p>
      <pulse-loader :loading="loading"></pulse-loader>
      <button class="button" :disabled="loading" type="button" @click="makeUser">Register</button>
    </div>
    <div v-if="login" class="login flex wrap justify-center">
      <h2>Login</h2>
      <p>
        <a href="#" @click="showRegister">Register instead?</a>
      </p>
      <input type="text" v-model="email" placeholder="Email">
      <input @keyup.enter="validateUser" type="password" v-model="password" placeholder="Password">
      <pulse-loader :loading="loading"></pulse-loader>
      <p v-if="warn" class="warn">{{ warn_message }}</p>
      <button class="button" :disabled="loading" type="button" @click="validateUser">Login</button>
    </div>
    <div v-if="created" class="created">
      <h1>Welcome {{ name }}!</h1>
      <h2>Your user has been created.</h2>
      <button class="button" type="button" @click="$router.push('/')">Go to Dashboard</button>
    </div>
  </div>
</template>

<script>
import PostService from '../PostService'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  data() {
    return {
      loading: false,
      warn: false,
      warn2: false,
      warn_message: '',
      register: false,
      login: true,
      created: false,
      email: '',
      name: '',
      password: ''
    }
  },
  methods: {
    showRegister: function() {
      this.register = true;
      this.login = false;
    },
    showLogin: function() {
      this.login = true;
      this.register = false;
    },
    makeUser: async function() {
      if (this.email && this.name && this.password) {
        this.loading = true
        this.warn = false; this.warn2 = false
        // Check if user exists
        let checkuser = await PostService.checkUser(this.email)
        if (checkuser === 202) {
          this.loading = false
          this.warn = false
          this.warn2 = true 
          return false
        } else if (checkuser === 204) {
          // If user doesn't exist, create it
          let newUser = await PostService.makeUser({email: this.email, name: this.name, password: this.password})
          if (newUser) {
            // Once user is created, load it's info (including the new ID)
            let user = await PostService.validateUser({email: this.email, password: this.password})
            console.log('User created')
            localStorage.setItem("user", JSON.stringify({ ...user[0], token: user[0]._id}))
            this.$store.dispatch('setUser', { ...user[0], token: user[0]._id})
            this.register = false; this.created = true
            this.loading = false
            this.warn = false;  this.warn2 = false;
            return true
          } else {
            console.log('user not created')
            return false
          }
        } 
      } else {
        this.warn = true
        this.warn_message = 'Please complete all fields.'
      }
    },
    validateUser: async function() {
      if (this.email && this.password) {
        this.loading = true
        this.warn = false
        let user = await PostService.validateUser({email: this.email, password: this.password})
        if (user.length) {
          localStorage.setItem("user", JSON.stringify({ ...user[0], token: user[0]._id}))
          this.$store.dispatch('setUser', { ...user[0], token: user[0]._id})
          if (user[0].habits !== undefined) { this.$store.dispatch('setBadges', user[0].habits) }
          this.$router.push('/')
        } else {
          this.warn = true; this.loading = false
          this.warn_message = 'Email and password are not valid.'
        }
      } else {
        this.warn = true
        this.warn_message = 'Please complete all fields.'
      }
    }
  },
  components: { PulseLoader },
  mounted() { 
		this.$store.dispatch("centerLogo", true); 
		if (this.$route.query.register !== undefined) {
			this.register = true
			this.login = false
		}
	},
  beforeUnmount() { this.$store.dispatch("centerLogo", false) }
}
</script>

<style scoped lang="scss">
h1, p { margin-bottom: 2rem; width: 100%; }
.created {
	margin-top: 4rem;
  button { margin: 1rem; max-width: 25rem; }
	p { text-align: center; }
}
.login, .register, .created { 
  flex-direction: column; align-items: center; text-align: center;
  width: 100%; max-width: 35rem; margin: auto;
  button { max-width: 100%; width: 100%; }
}
small { color: orange; }

button[disabled=disabled] { background: $ellis; }


</style>