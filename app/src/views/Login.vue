<template>
  <div class="container">
    <div v-if="selector" class="selector">
      <h1>Register or login</h1>
      <button @click="showRegister">Register</button>
      <button @click="showLogin">Login</button>
    </div>
    <div v-if="register" class="register">
      <h2>Register</h2>
      <a href="#" @click="showLogin">Login instead?</a>
      <input type="text" placeholder="Email">
      <input type="text" placeholder="Name">
      <input type="password" placeholder="Password">
      <button type="submit">Register</button>
    </div>
    <div v-if="login" class="login">
      <h2>Login</h2>
      <a href="#" @click="showRegister">Register instead?</a>
      <input type="text" placeholder="Name">
      <input type="password" placeholder="Password">
      <button type="submit">Login</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selector: true,
      register: false,
      login: false
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
    }
  }
}
</script>
<style scoped lang="scss">
h1 { margin-bottom: 2rem; width: 100%; }
.container > div {
  display: flex;
  flex-wrap: wrap;
  button {
    margin-right: 3rem;
    padding: 2rem;
    font-size: 1.4rem;
  }
}
.login, .register {
  flex-direction: column;
}
</style>