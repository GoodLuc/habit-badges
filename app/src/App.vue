<template>
  <div id="app">
    <w-app>
      <div id="nav">
        <div :class="['container flex align-center', { center: centerLogo }]">
          <figure id="logo"><img src="@/assets/icons/wings.png" alt="Habit Hero Badge" /></figure>
          <h1>Habit Hero Badge</h1>
          <a v-if="user" @click="menuActive = true" id="toggl" href="#"
            ><figure><img src="@/assets/icons/menu.svg" alt="Menu" /></figure
          ></a>
          <div :class="['flex grow', { overlay: menuActive, show: menuActive }]" id="menu" v-if="user">
            <router-link @click="menuActive = false" to="/">Dashboard</router-link>
            <router-link @click="menuActive = false" to="/monthly">Monthly view</router-link>
            <router-link @click="menuActive = false" to="/habits">Habits</router-link>
            <router-link @click="menuActive = false" to="/rewards">Rewards</router-link>
            <!-- <router-link @click="menuActive = false" to="/powerups">Power-Ups</router-link> -->
            <!--router-link to="/trinkets">Trinkets</router-link>
						<router-link to="/castle">Your castle</router-link-->
            <a @click="logout" class="logout">Logout</a>
            <figure class="close" @click="menuActive = false"><img src="/assets/icons/close.svg" alt="Close" /></figure>
          </div>
        </div>
      </div>
      <router-view />
      <Links />
    </w-app>
  </div>
</template>

<script>
import Links from "@/components/Links.vue";

import { mapState } from "vuex";
export default {
  data() {
    return {
      menuActive: false,
    };
  },
  components: { Links },
  computed: {
    ...mapState(["user", "centerLogo"]),
  },
  methods: {
    logout: function () {
      this.menuActive = false;
      this.$store.dispatch("unsetUser");
      this.$store.dispatch("setBadges", {});
      this.$store.dispatch("clearData");
      localStorage.clear();
      this.$router.push("/login");
    },
  },
  mounted() {
    if (localStorage.getItem("user") !== null) {
      let user = JSON.parse(localStorage.getItem("user"));
      this.$store.dispatch("setUser", user);
      if (user.habits !== undefined) {
        this.$store.dispatch("setBadges", user.habits);
      }
    }
    this.$store.dispatch("setCurrentDate");
    this.$store.dispatch("getMonth");
  },
};
</script>

<style lang="scss">
@import "~@/scss/_resets-utils.scss";
@import "~@/scss/_badges.scss";
@import "~@/scss/_variables.scss";
@import "~@/scss/_fonts.scss";

html {
  scroll-behavior: smooth;
}
#nav {
  padding: 0.3rem;
  background: $gold;
  h1 {
    font-size: 1rem;
    margin: 0 2rem 0 0;
    color: white;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.48);
  }
  a {
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.48);
    font-weight: bold;
    margin-right: 0.714rem;
    padding: 1.3rem;
    text-decoration: none;
    color: white;
    border-radius: 0.314rem;
    &.router-link-exact-active {
      background: $azure;
      box-shadow: inset 0px 0px 6px 0px #545454;
    }
  }
  .container {
    .logout {
      margin-left: auto;
    }
  }
  #logo,
  #toggl {
    /* filter: invert(1); width: 3.57rem; */
    margin-right: 0.714rem;
    flex-shrink: 0;
  }
  #logo {
    width: 4rem;
  }
  #toggl {
    display: none;
    margin-left: auto;
    width: 2.57rem;
    padding: 0;
    filter: invert(100%) sepia(14%) saturate(7494%) hue-rotate(298deg) brightness(113%) contrast(112%);
  }
  .close {
    display: none;
  }
}
.container.center {
  justify-content: center;
}

.button-add {
  height: 5rem;
  width: 14rem;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  figure {
    background: none;
    box-shadow: none;
    filter: invert(98%) sepia(0%) saturate(7493%) hue-rotate(213deg) brightness(103%) contrast(104%);
    width: 2rem;
    margin-left: -0.4rem;
    display: flex;
    align-items: center;
    img {
      max-height: 100%;
    }
  }
  figcaption {
    margin: 0.3rem 0 0 0.8rem;
    padding: 0;
  }
  @media (max-width: 500px) {
    width: auto;
    figure {
      margin: auto;
    }
  }
}

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
    z-index: 10;
    width: 5.71rem;
    height: 5.71rem;
    cursor: pointer;
    padding: 1rem;
    box-sizing: border-box;
    img {
      filter: invert(1);
    }
    @media (max-width: 1000px) {
      width: 3.5rem;
      height: 3.5rem;
    }
  }
}

@media (max-width: 740px) {
  #nav #toggl {
    display: block;
  }
  #menu {
    display: none;
    background: $bg3;
    &.show {
      display: flex;
      .close {
        display: block;
        height: 3.7rem;
        width: 3.7rem;
      }
      a {
        text-align: center;
        width: 100%;
      }
    }
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////

.icon-content {
  position: relative;
  width: 40px;
  height: 40px;
  figcaption {
    position: absolute;
    top: 0;
    left: 0;
    color: white;
    font-size: 1.3rem;
    font-weight: bold;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}

h3.dayTitle {
  font-size: 1.5rem;
  text-shadow: $textshadow;
  span {
    font-weight: 300;
  }
}

.box {
  background: $shine3;
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  .grid {
    margin-bottom: 2rem;
  }
  .badge,
  .badge-check,
  .edit {
    width: 100%;
    box-sizing: border-box;
  }
  @media (max-width: 770px) {
    padding: 1rem;
  }
  @media (max-width: 520px) {
    padding: 0.8rem;
  }
}

.currency {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  .coins,
  .rubys {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    margin-bottom: 0.2rem;
    img {
      width: 2rem;
      height: 2rem;
      margin-left: 0.2rem;
    }
  }
}

.dash {
  h1 {
    font-size: 3.429rem;
    font-weight: 300;
    margin-top: 4rem;
  }
  h2 {
    margin: 4rem 0 1rem;
    font-size: 1.714rem;
    font-weight: 400;
  }
  @media (max-width: 700px) {
    h1 {
      font-size: 2.5rem;
    }
    h2 {
      font-size: 1.5rem;
    }
  }
}

.reward-list {
  article {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    border-radius: 6px;
    box-shadow: 0px 4px 3px 0px #cfcfcf8a;
    figure {
      width: 3rem;
      flex-shrink: 0;
      min-height: 3rem;
    }
  }
}
.price {
  background: url("~@/assets/icons/ruby.png") center/contain no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 600;
  font-size: 1.3rem;
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
}
</style>
