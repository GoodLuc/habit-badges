<template>
  <div id="app">
    <div id="nav">
      <div :class="['container flex align-center',{ center: centerLogo }]">
        <figure id="logo"><img src="/assets/badges/default/wings.svg" alt="Habit Badges"></figure> <h1>Hero Badge</h1>
        <a @click="menuActive = true" id="toggl" href="#"><figure><img src="/assets/icons/menu.svg" alt="Menu"></figure></a>
        <div :class="['flex grow',{ overlay: menuActive, show: menuActive }]" id="menu" v-if="user">
          <router-link @click.native="menuActive = false" to="/">Dashboard</router-link> 
          <router-link @click.native="menuActive = false" to="/monthly">Monthly view</router-link> 
          <router-link @click.native="menuActive = false" to="/habits">Habits</router-link>
          <!--router-link to="/trinkets">Trinkets</router-link>
          <router-link to="/castle">Your castle</router-link-->
          <a href="#" @click="logout" class="logout">Logout</a>
          <figure class="close" @click="menuActive = false"><img src="/assets/icons/close.svg" alt="Close"></figure>
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
      menuActive: false
    }
  },
  computed: {
    ...mapState(["user","centerLogo"]),
  },
  methods: {
    logout: function() {
      this.menuActive = false
      localStorage.removeItem("user")
      this.$store.dispatch('unsetUser')
      this.$store.dispatch('setBadges', {})
      this.$store.dispatch('clearData')
      this.$router.push('/login')
    },
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
  min-width: 320px;
}
body { 
  margin: 0; font-family: 'Work Sans', sans-serif; font-feature-settings: "lnum";
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  color: $text; padding-bottom: 2.14rem; background: white;
  min-width: 320px;
  &.overlaid { overflow: hidden; }
}
a { color: $link; }
h1 { 
  font-size: 3.2rem; color: $text; margin-bottom: 2rem; 
  @media (max-width: 640px) { font-size: 2.2rem; }
}
h2 { font-size: 2.2rem; font-weight: lighter }
p { font-size: 1.28rem; }
img { max-width: 100%; }
ul { padding: 0; }

input[type=text], input[type=email], input[type=password], button {
  color: $text; margin-bottom: 1rem; width: 100%; max-width: 35.71rem;
  font-size: 1.2rem; padding: .714rem; border-radius: .314rem; box-sizing: border-box;
}
input[type=text], input[type=email], input[type=password] {
  box-shadow: $inshadow; background: $bg1;
}
button { 
  background: $link; font-weight: 600; color: white; border: 4px solid rgba(222, 222, 222, .7); 
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.5) 0px 8px 16px -8px;
  text-align: center; cursor: pointer; padding: 1rem;
  &:hover { background: $azure; }
}
.warn { color: red; }

.flex { 
  display: flex; 
  &.align-bottom { align-items: flex-end; }
  &.align-center { align-items: center; }
  &.justify-left { justify-content: flex-start; }
  &.justify-center { justify-content: center; }
  &.justify-between { justify-content: space-between; }
  &.column { flex-direction: column; }
  &.wrap { flex-wrap: wrap; }
  &.fw { width: 100%; }
  &.grow { flex-grow: 1; }
}
.grid {
  display: grid; width: 100%; column-gap: 1rem; row-gap: 1rem;
  grid-template-columns: repeat(6, calc(16.66% - .84rem));
  &.three { 
    grid-template-columns: calc(33.33% - .66rem) calc(33.33% - .66rem) calc(33.33% - .66rem); 
  }
  &.isEmpty { grid-template-rows: auto; }
  @media (max-width: 1100px) { /*grid-template-rows: repeat(auto-fill, calc(100vw / 4.9)); */}
  @media (max-width: 900px) { 
    grid-template-columns: repeat(5, calc(20% - .8rem)); 
    /*grid-template-rows: repeat(auto-fill, calc(100vw / 4))  */
  }
  @media (max-width: 770px) {
    grid-template-columns: repeat(4, calc(25% - .75rem)); 
    //grid-template-rows: repeat(auto-fill, calc(100vw / 3.2))  
  }
  @media (max-width: 580px) {
    grid-template-columns: repeat(3, calc(33.33% - .67rem)); 
    //grid-template-rows: repeat(auto-fill, calc(100vw / 2.6))
  }
  @media (max-width: 520px) {
    grid-template-columns: 100%; width: 100%;
    grid-template-rows: auto; /*column-gap: 0;*/
    .badge, .badge-add, .edit {
      flex-direction: row; font-size: 1.8rem; width: 100%; 
      figure { flex-shrink: 0; width: 8rem; margin-right: 1rem; }
      figcaption { width: 100%; }
    }
  }
  @media (max-width: 450px) {
    .badge, .badge-add, .edit {
      figure { width: 5rem; margin-right: .6rem; }
    }
  }
}
.center { text-align: center; }
.mb-1 { margin-bottom: 1rem; }
.padyMed { padding-top: 2rem; padding-bottom: 2rem; }

.container  {
  max-width: 1100px; margin: auto;
  padding-left: 1.42rem; padding-right: 1.42rem;
}
figure { margin: 0; padding: 0 }

#nav {
  background: $bg3;
  h1 { font-size: 1rem; margin: 0 2rem 0 0; color: white; }
  a {
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.48);
    font-weight: bold; margin-right: 0.714rem;
    padding: 1.3rem; text-decoration: none; color: white; 
    &.router-link-exact-active { background: $link; }
  }
  .container {
    .logout { margin-left: auto; }
  }
  #logo, #toggl {
    filter: invert(1); width: 3.57rem; margin-right: 0.714rem; flex-shrink: 0;
  }
  #toggl { display: none; margin-left: auto; width: 2.57rem; padding: 0; }
  .close { display: none; }
}
.container.center { justify-content: center; }

.overlay { 
  position: fixed; top: 0; left: 0; bottom: 0; z-index: 3; width: 100%;
  min-height: 100vh; flex-direction: column; background: $bg2; overflow: hidden;
  &.show { display: flex; }
  > div { overflow-y: auto; height: 100%; }
  .close {
    background: $background; position: fixed; top: 0; right: 0; z-index: 10;
    width: 5.71rem; height: 5.71rem; cursor: pointer; padding: 1rem; box-sizing: border-box;
    img { filter: invert(1); }
  }
}

@media (max-width: 670px) {
  #nav #toggl { display: block; }
  #menu {
    display: none;
    background: $bg3;
    &.show {
      display: flex;
      .close { display: block; height: 3.7rem; width: 3.7rem; }
      a { text-align: center; width: 100%; }
    }
  }
}
</style>
