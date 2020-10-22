<template>
  <div id="app">
    <div id="nav">
      <div :class="['container',{ center: centerLogo }]">
        <figure id="logo"><img src="/assets/badges/default/wings.svg" alt="Habit Badges"></figure> <h1>Hero Badge</h1>
        <div v-if="user">
          <router-link to="/">Dashboard</router-link> 
          <router-link to="/habits">Habits</router-link>
          <a href="#" @click="logout" class="logout">Logout</a>
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      loggedIn: true,
    }
  },
  computed: {
    ...mapState(["user","centerLogo"]),
  },
  methods: {
    logout: function() {
      localStorage.removeItem("user")
      this.$store.dispatch('setUser', false)
      this.$store.dispatch('setBadges', {})
      this.$store.dispatch('clearData')
      this.$router.push('/login')
    }
  },
  mounted() {
    if (localStorage.getItem("user") !== null) {
      let user = JSON.parse(localStorage.getItem("user"))
      this.$store.dispatch('setUser', user)
      if (user.habits !== undefined) { this.$store.dispatch('setBadges', user.habits) }
    }
    this.$store.dispatch('setCurrentDate')
    this.$store.dispatch('getMonth')
  },
}
</script>

<style lang="scss">
html {
  font-size: 14px;
}
body { 
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: 'Roboto', sans-serif;
  font-family: 'Raleway', sans-serif;
  font-family: 'Work Sans', sans-serif;
  font-feature-settings: "lnum";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text1;
  padding-bottom: 2.14rem;
  background: $bg1;
  &.overlaid {
    overflow: hidden;
  }
}
a { color: $text2; }
h1 { font-size: 3.2rem; color: $text1; margin-bottom: 2rem; }
h2 { font-size: 2.2rem; font-weight: lighter }
p { font-size: 1.28rem; }
img { max-width: 100%; }
ul { padding: 0; }

input, button[type=button] {
  background: $bg2; color: $text1; 
  width: 35.71rem;
  max-width: 100%; margin-bottom: 1rem; 
  font-size: 1.2rem; padding: .714rem; 
  border: 1px solid transparent; border-radius: .314rem; box-sizing: border-box;
  &:hover {
    border: 1px solid $ellis;
  }
}
input[type=text], input[type=password] {
  box-shadow: $inshadow;
  background: $shine4;
}
button[type=button] {
  border: none;
  padding: 1.5rem;
  justify-content: center; font-weight: 600;
  background: $text2; color: white;
  border: 1px solid #c2c2c2;
}
button {
  text-align: center;
  padding: .5rem;
  border-radius: .35rem;
  background: $card;
  color: $text2;
  display: flex;
  align-items: center;
  border: none;
  cursor: pointer;
  &:hover {
    background: $radialb;
    color: white;
  }
}
.warn { color: red; }

.flex { 
  display: flex; 
  &.align-bottom {
    align-items: flex-end;
  }
  &.align-center {
    align-items: center;
  }
  &.justify-left {
    justify-content: flex-start;
  }
}

.container  {
  max-width: 1100px;
  margin: auto;
  padding-left: 1.42rem;
  padding-right: 1.42rem;
}
figure { margin: 0; padding: 0 }

#logo {
  filter: invert(0);
  width: 3.57rem;
  margin-right: 0.714rem;
}
#nav {
  background: $navbg;
  h1 { font-size: 1rem; margin: 0 2rem 0 0; }
  a {
    font-weight: bold;
    margin-right: 0.714rem;
    padding: 1.3rem;
    text-decoration: none;
    &.router-link-exact-active {
      //color: $text3;
      background: $text2;
      color: white;
    }
  }
  .container {
    display: flex;
    align-items: center;
    > div { display: flex; flex-grow: 1; }
    .logout { margin-left: auto; }
  }
}
.container.center { justify-content: center; }

.overlay { 
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 3;
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
  background: $bg2;
  overflow: hidden;
  &.show {
    display: flex;
  }
  > div {
    overflow-y: auto;
    height: 100%;
  }
  .close {
    background: $background;
    position: fixed;
    top: 0;
    right: 0;
    width: 5.71rem;
    height: 5.71rem;
    cursor: pointer;
    padding: 1rem;
    box-sizing: border-box;
    img {
      filter: invert(1);
    }
  }
}

</style>
