<template>
  <div :class="['overlay', { show: status}]" id="badgesSelector">
    <div v-if="getDayLoad" class="container">
      <h1>What have you done to improve yourself today?</h1>
      <ul>
        <li v-for="badge in badges" :key="badge.id">
          <figure @click="toggleBadge(badge)"
            :class="['badge', { added: getDayLoad.badges.find((tbadge) => badge.name === tbadge.name )}]" 
            v-if="badge.figure.type == 'default'">
            <img :src="'/assets/badges/default/'+badge.figure.id+'.svg'" :alt="badge.name">
            <figcaption>{{ badge.name }}</figcaption>
          </figure>
        </li>
      </ul>
    </div>
    <figure class="close" @click="$emit('close')"><img src="/assets/icons/close.svg" alt="Close"></figure>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: ['status'],
  computed: mapGetters(["badges","getDayLoad"]),
  methods: {
    ...mapActions(['toggleBadge'])
  }
}
</script>
<style scoped lang="scss">

h1 { 
  color: #42b983;
  margin-bottom: 20px;
}
#badgesSelector ul {
  display: flex;
  .added {
    background: #42b983;
    color: white;
    img {
      filter: invert(1)
    }
   }
  li {
    color: black;
    display: flex;
    margin-right: 10px;
    text-align: center;
    figure { width: 100px; cursor: pointer; padding: 10px; border-radius: 10px; }
  }
}
</style>