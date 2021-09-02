<template>
  <div id="app">
    <div id="nav">
      <div :class="['container flex align-center',{ center: centerLogo }]">
        <figure id="logo"><img src="/assets/badges/default/wings.svg" alt="Habit Badges"></figure> <h1>Hero Badge</h1>
        <a @click="menuActive = true" id="toggl" href="#"><figure><img src="/assets/icons/menu.svg" alt="Menu"></figure></a>
        <div :class="['flex grow',{ overlay: menuActive, show: menuActive }]" id="menu" v-if="user">
          <router-link @click="menuActive = false" to="/">Dashboard</router-link> 
          <router-link @click="menuActive = false" to="/monthly">Monthly view</router-link> 
          <router-link @click="menuActive = false" to="/habits">Habits</router-link>
          <router-link @click="menuActive = false" to="/rewards">Rewards</router-link>
          <router-link @click="menuActive = false" to="/powerups">Power-Ups</router-link>
          <!--router-link to="/trinkets">Trinkets</router-link>
          <router-link to="/castle">Your castle</router-link-->
          <a @click="logout" class="logout">Logout</a>
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
      menuActive: false
    }
  },
  computed: {
    ...mapState(["user","centerLogo"]),
  },
  methods: {
    logout: function() {
      this.menuActive = false
      this.$store.dispatch('unsetUser')
      this.$store.dispatch('setBadges', {})
      this.$store.dispatch('clearData')
      localStorage.clear()
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
@import "~@/scss/_resets-utils.scss";

#nav {
  background: $gold;
  h1 { font-size: 1rem; margin: 0 2rem 0 0; color: white; }
  a {
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.48);
    font-weight: bold; margin-right: 0.714rem;
    padding: 1.3rem; text-decoration: none; color: white; 
    &.router-link-exact-active { background: $azure; }
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
/////////////////////////////////////////////////////////////////////////////////////////////

.coin {
  position: relative; width: 40px; height: 40px;
  figcaption {
    position: absolute; top: 0; left: 0; color: white; font-size: 1.3rem; font-weight: bold;
    width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; text-align: center;
  }
}

.badge, .badge-check, .badge-edit {
  margin: 0; box-sizing: border-box; 
  border-radius: .35rem; padding: 1rem; box-sizing: border-box; 
  min-width: 10rem; height: auto; text-align: center; color: black;
  font-size: 1.1rem; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  display: flex; flex-direction: column; align-items: center; cursor: default;
  &.gold { background: $gold; border: 1px solid #fcc201; }
  &.silver { background: $silver; border: 3px solid #ffeac2; }
  &.azure { background: $azure; color: white; border: 1px solid #185dfa; }

  > figure { 
    border-radius: 50%; box-shadow: $outshadow; background: white; 
    width: 100%; position: relative;
    .frame { position: absolute; z-index: 1; top: 0; left: 0; }
    .icon { z-index: 2; transform: scale(0.3); position: relative; }
    img { display: block; width: 100%; height: auto; }
  }
  figcaption { overflow: hidden; max-width: 100%; padding: 1rem .5rem .714rem; height: 2.4em; }
}

.badge-check, .badge-edit {
  min-height: 15.2rem;
  background: white; color: $link; cursor: pointer; font-weight: 200; display: flex; align-items: center;
  box-shadow: $inglow; border: 1px solid $link;
  figure { background: none; box-shadow: none; filter: invert(36%) sepia(66%) saturate(7120%) hue-rotate(219deg) brightness(99%) contrast(97%); max-width: 60%; margin-top: auto; display: flex; align-items: center; img { max-height: 100%; } }
  figcaption { margin-top: auto; }
  &:hover { background: $link; color: white; figure { filter: invert(1) brightness(100)} }
}
.badge-edit { img { transform: scale(.82); } }

.box {
  background: $shine3; padding: 1.5rem 3rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  .grid { margin-bottom: 2rem; }
  .badge, .badge-check, .edit {
    width: 100%; box-sizing: border-box; 
  }
  @media (max-width: 770px) { padding: 1rem 2rem; }
  @media (max-width: 520px) { padding: .8rem 2rem; }
}

</style>
