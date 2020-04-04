<template>
  <div id="app">
    <div v-if="loggedIn">
      <div id="nav">
        <div class="container">
          <figure id="logo"><img src="/assets/badges/default/wings.svg" alt="Habit Badges"></figure>
          <router-link to="/">Dashboard</router-link> |
          <router-link to="/today">Today</router-link> | 
          <router-link to="/habits">Habits</router-link>
        </div>
      </div>
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loggedIn: true
    }
  },
}
</script>

<style lang="scss">
body { 
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000;
  font-size: 14px;
  padding-bottom: 30px;
}
a { color: #42b983; }
h1 { font-size: 3.2em; margin-bottom: .2em }
h2 { font-size: 2.2em; font-weight: lighter }
img { max-width: 100%; }
ul { padding: 0; }
.container  {
  max-width: 1100px;
  margin: auto;
  padding-left: 20px;
  padding-right: 20px;
}
figure { margin: 0; padding: 0 }

#logo {
  filter: invert(1);
  width: 50px;
  margin-right: 10px;
}
#nav {
  background: black;
  a {
    font-weight: bold;
    margin-right: 10px;
    &.router-link-exact-active {
      color: #fff;
    }
  }
  .container {
    display: flex;
    align-items: center;
  }
}

.overlay { 
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100vw;
  min-height: 100vh;
  padding-top: 100px;
  flex-direction: column;
  background: #f2f2f2;
  &.show {
    display: flex;
  }
  .close {
    background: black;
    position: fixed;
    top: 0;
    right: 0;
    width: 80px;
    height: 80px;
    cursor: pointer;
    padding: 15px;
    box-sizing: border-box;
    img {
      filter: invert(1);
    }
  }
}
</style>
