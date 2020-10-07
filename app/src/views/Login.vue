<template>
  <div class="container">
    <div v-if="selector" class="selector">
      <h1>Register or login</h1>
      <button type="button" @click="showRegister">Register</button>
      <button type="button" @click="showLogin">Login</button>
    </div>
    <div v-if="register" class="register">
      <h2>Register</h2>
      <p>
        <a href="#" @click="showLogin">Login instead?</a>
      </p>
      <input type="text" v-model="email" placeholder="Email">
      <input type="text" v-model="name" placeholder="Name">
      <input type="password" v-model="password" placeholder="Password">
      <p v-if="warn" class="warn">{{ warn_message }}</p>
      <p v-if="warn2" class="warn">That email is already registered. <a href="#" @click="showLogin">Login instead?</a></p>
      <button :disabled="loading" type="button" @click="makeUser">Register</button>
    </div>
    <div v-if="login" class="login">
      <h2>Login</h2>
      <p>
        <a href="#" @click="showRegister">Register instead?</a>
      </p>
      <input type="text" v-model="email" placeholder="Email">
      <input type="password" v-model="password" placeholder="Password">
      <p v-if="warn" class="warn">{{ warn_message }}</p>
      <button :disabled="loading == 1" type="button" @click="validateUser">Login</button>
    </div>
    <div v-if="created" class="created">
      <h1>Welcome {{ name }}!</h1>
      <h2>Your user has been created.</h2>
      <button @click="$router.push('/')">Go to Dashboard</button>
    </div>
  </div>
</template>

<script>
import PostService from '../PostService'

export default {
  data() {
    return {
      loading: false,
      warn: false,
      warn2: false,
      warn_message: '',
      selector: true,
      register: false,
      login: false,
      created: false,
      email: '',
      name: '',
      password: ''
    }
  },
  methods: {
    showRegister: function() {
      this.selector = false;
      this.register = true;
      this.login = false;
    },
    showLogin: function() {
      this.selector = false;
      this.login = true;
      this.register = false;
    },
    makeUser: async function() {
      if (this.email && this.name && this.password) {
        this.loading = true
        this.warn = false
        let checkuser = await PostService.checkUser(this.email)
        if (checkuser === 'Accepted') {
          this.loading = false
          this.warn = false
          this.warn2 = true 
          return false
        } else if (checkuser === '') {
          let newUser = await PostService.makeUser({email: this.email, name: this.name, password: this.password})
          if (newUser) {
            let user = await PostService.getUser(this.email)
            console.log('User created')
            localStorage.setItem("user", JSON.stringify({ ...user[0], token: user[0]._id}))
            this.$store.dispatch('setUser', { ...user[0], token: user[0]._id})
            this.register = false; this.created = true
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
        this.warn = false
        let user = await PostService.validateUser({email: this.email, password: this.password})
        if (user[0]._id) {
          console.log('User logged')
          localStorage.setItem("user", JSON.stringify({ ...user[0], token: user[0]._id}))
          this.$store.dispatch('setUser', { ...user[0], token: user[0]._id})
          this.$router.push('/')
        } else {
          this.warn = true
          this.warn_message = 'Email and password are not valid.'
        }
      } else {
        this.warn = true
        this.warn_message = 'Please complete all fields.'
      }
    }
  }
}
</script>

<style scoped lang="scss">
h1 { margin-bottom: 2rem; width: 100%; }
.container > div {
  display: flex;
  flex-wrap: wrap;
}
.selector, .created {
  button {
    margin-right: 3rem;
    padding: 2rem;
    font-size: 1.4rem;
    max-width: 35.71rem;
    justify-content: center;
  }
}
.login, .register, .created {
  flex-direction: column;
}
.warn { color: red; }
button[disabled=disabled] {
  background: $ellis;
}

</style>