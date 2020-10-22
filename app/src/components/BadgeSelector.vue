<template>
  <div :class="['overlay', { show: status}]" id="badgesSelector">
    <div>
      <div v-if="getDayLoad" class="container">
        <h1>What have you done to improve yourself today?</h1>
        <div class="badges">
          <div v-for="badge in badges" :key="badge._id" @click="toggleBadge(badge._id)">
            <div v-if="!badge.deleted" :class="['badge', user.habits[badge._id].material, { toAdd: !getDayLoad.badges.find((tbadge) => tbadge === badge._id )}]" >
              <figure>
                <div class="frame"><img :src="'/assets/badges/frame/frame'+user.habits[badge._id].frame+'.svg'" :alt="user.habits[badge._id].name"></div>
                <div class="icon"><img crossOrigin="anonymous" id="badgeIcon" :src="user.habits[badge._id].image" :alt="user.habits[badge._id].icon"></div>
              </figure>
              <figcaption>{{ user.habits[badge._id].name }}</figcaption>
            </div>
          </div>
        </div>
      </div>
      <figure class="close" @click="$emit('close')"><img src="/assets/icons/close.svg" alt="Close"></figure>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  props: ['status'],
  computed: {
    ...mapState(["user"]),
    ...mapGetters(["badges","getDayLoad"]),
  },
  methods: {
    ...mapActions(['toggleBadge'])
  }
}
</script>
<style scoped lang="scss">

.badge {
  cursor: pointer;
  text-shadow: none !important;
  &:hover {
    color: white;
    text-shadow: none;
    &.gold { background: $gold !important; }
    &.silver { background: $silver !important; }
    &.azure { background: $azure !important; color: white !important; text-shadow: $darktextshadow; }
  }
}
.toAdd {
  background: white !important;
  color: black !important;
}
  
</style>