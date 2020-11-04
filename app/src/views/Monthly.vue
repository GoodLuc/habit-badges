<template>
  <div>
    <div class="container dash">
      <div class="main center">
        <div v-if="user.level">
          <p>Your are on level {{ user.level.nr }}. Points: {{ user.points }}. Collect {{ user.level.toNext }} more coins to level up!</p>
          <div class="level"><div :style="'width:'+user.level.percent+'%'"></div></div>
          <p class="entitlement">Level {{ user.level.nr }}: <strong>{{ titles[user.level.nr] }}</strong></p>
        </div>
      </div>

      <h2>Monthly view:</h2>
      <div v-if="monthLoad.loading"><pulse-loader :loading="loading"></pulse-loader></div>
      <div class="month flex wrap justify-between" v-else>
        <div class="box flex wrap" v-for="day in monthLoad.days" :key="day.day">
          <div class="flex fw align-center justify-between mb-1">
            <h3 class="dayTitle">{{ day.month + "/" + day.day }}</h3>
          </div>
          <div :class="['flex fw wrap justify-between', { isEmpty: !day.badges.length }]" >
            <div :class="['badge', user.habits[badge].material]" v-for="badge in day.badges" :key="badge">
              <figure>
                <div class="frame"><img :src="'/assets/badges/frame/frame'+user.habits[badge].frame+'.svg'" :alt="user.habits[badge].name"></div>
                <div class="icon"><img crossOrigin="anonymous" id="badgeIcon" :src="user.habits[badge].image" :alt="user.habits[badge].icon"></div>
              </figure>
            </div>
          </div>
        </div>
      </div>

    </div>
  
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { mapState } from "vuex";

export default {
  name: 'Monthly',
  data() {
    return {
      loading: true
    }
  },
  computed: {
    ...mapState(["user","date","monthLoad","lastMonthLoad","titles"]),
  },
  methods: {
    
  },
  components: { PulseLoader },
  mounted() {
    this.$store.dispatch('setCurrentDate')
    this.$store.dispatch('getMonth')
  }
}
</script>

<style scoped lang="scss">
.month { 
  > .box {
    padding: 1.5rem;
    width: calc(32% - 3rem);
    .badge { width: calc(32% - .5rem); height: auto; margin: 0 0 1rem; padding: 1rem; }
    .badge:last-of-type { margin-right: auto; margin-left: 1.1rem; }
  }
}
</style>