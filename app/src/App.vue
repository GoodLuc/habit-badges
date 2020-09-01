<template>
  <div id="app">
    <div v-if="loggedIn">
      <div id="nav">
        <div class="container">
          <figure id="logo"><img src="/assets/badges/default/wings.svg" alt="Habit Badges"></figure> <h1>Hero Badge</h1>
          <router-link to="/">Dashboard</router-link> 
          <router-link to="/today">Today</router-link> 
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
html {
  font-size: 14px;
}
body { 
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $foreground;
  padding-bottom: 2.14rem;
  background: $darkbg;
}
a { color: $highlight; }
h1 { font-size: 3.2rem; margin-bottom: .2rem }
h2 { font-size: 2.2rem; font-weight: lighter }
img { max-width: 100%; }
ul { padding: 0; }
.container  {
  max-width: 1100px;
  margin: auto;
  padding-left: 1.42rem;
  padding-right: 1.42rem;
}
figure { margin: 0; padding: 0 }

#logo {
  filter: invert(1);
  width: 3.57rem;
  margin-right: 0.714rem;
}
#nav {
  background: $navbg;
  h1 { font-size: 1rem; margin: 0 2rem 0 0; }
  a {
    font-weight: bold;
    margin-right: 0.714rem;
    &.router-link-exact-active {
      color: $foreground;
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
  padding-top: 7.14rem;
  flex-direction: column;
  background: $lightbg;
  &.show {
    display: flex;
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

button {
  text-align: center;
  padding: .5rem;
  border-radius: .35rem;
  background: $ellis;
  color: $foreground;
  display: flex;
  align-items: center;
  border: none;
  cursor: pointer;
}
</style>
