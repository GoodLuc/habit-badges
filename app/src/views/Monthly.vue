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
      <div class="month flex wrap" v-else>
        <div class="box" v-for="day in monthLoad.days" :key="day.day">
          <h3 class="dayTitle">{{ day.month + "/" + day.day }}</h3>
          <div :class="['grid', { isEmpty: !day.badges.length }]" >
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
  margin-right: 2rem;
  > .box {
    padding: 1.5rem; margin: 0 1rem 1rem 0;
    width: calc(32% - 3rem);
    h3 { text-align: center; width: 100%; margin-bottom: 1rem; }
    .grid {
      display: grid;
      grid-template-columns: calc(33.33% - 1.333rem) calc(33.33% - 1.333rem) calc(33.33% - 1.333rem);
      column-gap: 2rem;
      row-gap: 2rem;
    }
    .badge { width: auto; height: auto; flex-grow: 0; margin: 0; padding: 1rem; }
  }
}
</style>