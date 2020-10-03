<template>
  <div :class="['overlay', { show: status}]" id="badgesSelector">
    <div v-if="getDayLoad" class="container">
      <h1>What have you done to improve yourself today?</h1>
      <div class="badges">
        <div class="badge" v-for="badge in badges" :key="badge.id" 
            :class="['badge', { toAdd: !getDayLoad.badges.find((tbadge) => badge.name === tbadge.name )}]" >
          <figure @click="toggleBadge(badge)"
            v-if="badge.figure.type == 'default'">
            <img :src="'/assets/badges/default/'+badge.figure.id+'.svg'" :alt="badge.name">
          </figure>
          <figcaption>{{ badge.name }}</figcaption>
        </div>
      </div>
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

.badge {
  cursor: pointer;
}
.toAdd {
  background: white;
  color: black;
}
  
</style>