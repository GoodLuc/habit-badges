<template>
  <div>
    <div class="container dash">
      <div class="main center">
        <div v-if="getDayLoad">
          <h1 v-if="user">Welcome back {{ user.name }}</h1>
          <div v-if="user.level">
            <p>Your are on level {{ user.level.nr }}. Points: {{ user.points }}. Collect {{ user.level.toNext }} more coins to level up!</p>
            <div class="level"><div :style="'width:'+user.level.percent+'%'"></div></div>
            <p class="entitlement">Level {{ user.level.nr }}: <strong>{{ titles[user.level.nr] }}</strong></p>
          </div>
        </div>
      </div>

      <h2>Earned Badges for Today:</h2>
      <div v-if="getDayLoad" class="box flex wrap">
        <div class="flex fw align-center justify-between mb-1">
          <h3 class="dayTitle">{{ dayName(date) }} {{ date.month + "/" + date.day }}</h3>
          <div class="coin"> 
            <figure><img src="/assets/icons/coin.svg" alt="Coins"></figure>
            <figcaption>{{ dayPay(getDayLoad.badges) }}</figcaption>
          </div>
        </div>

        <div class="grid">
          <div :class="['badge', user.habits[badge].material]" v-for="badge in getDayLoad.badges" :key="badge">
            <figure>
              <div class="frame"><img :src="'/assets/badges/frame/frame'+user.habits[badge].frame+'.svg'" :alt="user.habits[badge].name"></div>
              <div class="icon"><img crossOrigin="anonymous" id="badgeIcon" :src="user.habits[badge].image" :alt="user.habits[badge].icon"></div>
            </figure>
            <figcaption>{{ user.habits[badge].name }}</figcaption>
          </div>
          <button class="badge-add" @click="addBadge">
            <figure>
              <img src="/assets/badges/default/check.svg" alt="Check in">
            </figure>
            <figcaption>Check in <span v-if="getDayLoad.badges.length">/ edit</span></figcaption>
          </button>
        </div>
      </div>
      <div v-else><pulse-loader :loading="loading"></pulse-loader></div>

      <h2>Last 7 days:</h2>
      <div v-if="monthLoad.loading"><pulse-loader :loading="loading"></pulse-loader></div>
      <div class="week" v-else>
        <div class="box flex wrap" v-for="day in week" :key="day.day">
          <div class="flex fw align-center justify-between mb-1">
            <h3 class="dayTitle">{{ dayName(day) }} {{ day.month + "/" + day.day }}</h3>
            <div class="coin"> 
              <figure><img src="/assets/icons/coin.svg" alt="Coins"></figure>
              <figcaption>{{ dayPay(day.badges) }}</figcaption>
            </div>
          </div>
          <div :class="['grid', { isEmpty: !day.badges.length }]" >
            <div :class="['badge', user.habits[badge].material]" v-for="badge in day.badges" :key="badge">
              <figure>
                <div class="frame"><img :src="'/assets/badges/frame/frame'+user.habits[badge].frame+'.svg'" :alt="user.habits[badge].name"></div>
                <div class="icon"><img crossOrigin="anonymous" id="badgeIcon" :src="user.habits[badge].image" :alt="user.habits[badge].icon"></div>
              </figure>
              <figcaption>{{ user.habits[badge].name }}</figcaption>
            </div>
            <button class="badge-edit" @click="editDay(day.year, day.month, day.day)">
              <figure>
                <img src="/assets/badges/default/edit.svg" alt="Edit">
              </figure>
              <figcaption>Edit</figcaption>
            </button>
          </div>
        </div>
      </div>

    </div>
  
    <BadgeSelector v-if="badgeSelector" @close="closeBadgeSelector" :day="dateToEdit" />
  </div>
</template>

<script>
import BadgeSelector from '@/components/BadgeSelector.vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { mapState, mapGetters } from "vuex";

export default {
  name: 'Dashboard',
  data() {
    return {
      badgeSelector: false,
      dateToEdit: [],
      levelup: new Audio(require('../assets/audio/levelup.wav')),
      loading: true
    }
  },
  computed: {
    ...mapState(["user","date","monthLoad","lastMonthLoad","titles"]),
    ...mapGetters(["getDayLoad"]),
    // Set week logs, either from this month or previous one.
    week: function () {
      var week = {};
      for (var i=1; i<8; i++) {
          var d = new Date();
          d.setDate(d.getDate() - i);
          if ((d.getMonth()+1) == this.date.month) {
            if (this.monthLoad.days[d.getDate()] !== undefined){ week[i] = this.monthLoad.days[d.getDate()] }
            else { week[i] = { year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate(), badges: {} } }
          } else if ((d.getMonth()+1) == (this.date.month - 1)) {
            if (this.lastMonthLoad.days[d.getDate()] !== undefined){ week[i] = this.lastMonthLoad.days[d.getDate()] }
            else { week[i] = { year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate(), badges: {} } }
          }
      }
      return week;
    },
  },
  methods: {
    addBadge: function() { this.badgeSelector = true },
    // Set the date to edit with the Badge Selector component
    editDay: function(year, month, day) { 
      this.$store.dispatch('setDate', {year: year, month: month, day: day})
      this.badgeSelector = true 
    },
    closeBadgeSelector: function() { 
      this.badgeSelector = false
      this.$store.dispatch('setCurrentDate')
      this.levelup.play()
    },
    dayName: function(day) {
      var date = new Date(day.month+'/'+day.day+'/'+day.year);
      return date.toLocaleDateString("en-EN", { weekday: 'long' });
    },
    // Daily points / coins
    dayPay: function(dayBadges) {
      if (dayBadges.length) {
        let pay = 0
        dayBadges.forEach(badge => {
          /*console.log(badge)
          console.log(this.user.habits[badge].value)
          console.log(this.user.habits[badge].name)*/
          pay += parseInt(this.user.habits[badge].value)
        });
        return pay
      } else {
        return '0'
      }
    }
  },
  watch: {
    badgeSelector: function() {
      const bod = document.body
      if (this.badgeSelector) {
        bod.classList.add('overlaid')
      } else {
        bod.classList.remove('overlaid')
      }
    }
  },
  components: {
    BadgeSelector,
    PulseLoader
  },
  mounted() {
    this.$store.dispatch('setCurrentDate')
    this.$store.dispatch('getMonth')
    if (this.$store.state.user === false) {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">

.dash { h2 { margin: 2rem 0 1rem; font-weight: 200; } }

.level {
  width: 100%; background: $background; height: 1.2rem; border-radius: .5rem;
  box-shadow: $inshadow; display: flex; align-items: center;
  div { 
    background: $foreground; height: .8rem; border-radius: .5rem;
    box-shadow: -1px -1px 2px 0px rgba(255, 255, 255,.9), 2px 2px 3px 3px rgba(0, 255, 255,.4);
  }
}
.entitlement {
  strong { text-shadow: $textshadow; }
}

.box {
  background: $shine3; padding: 1.5rem 3rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  .grid { margin-bottom: 2rem; }
  .badge, .badge-add, .edit {
    width: 100%; box-sizing: border-box; 
  }
  @media (max-width: 770px) { padding: 1rem 2rem; }
  @media (max-width: 520px) { padding: .8rem 2rem; }
}

h3.dayTitle { margin: 0; font-size: 1.5rem; text-shadow: $textshadow; }

.coin {
  position: relative; width: 40px; height: 40px;
  figcaption {
    position: absolute; top: 0; left: 0; color: white; font-size: 1.3rem; font-weight: bold;
    width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; text-align: center;
  }
}

.badge, .badge-add, .badge-edit {
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

.badge-add, .badge-edit {
  min-height: 15.2rem;
  background: white; color: $link; cursor: pointer; font-weight: 200; display: flex; align-items: center;
  box-shadow: $inshadow;
  figure { background: none; box-shadow: none; filter: invert(36%) sepia(66%) saturate(7120%) hue-rotate(219deg) brightness(99%) contrast(97%); max-width: 60%; margin-top: auto; display: flex; align-items: center; img { max-height: 100%; } }
  figcaption { margin-top: auto; }
  &:hover { background: $link; color: white; figure { filter: invert(1) brightness(100)} }
}
.badge-edit { img { transform: scale(.82); } }

.week {
  .isEmpty { 
    .edit {  height: 3rem; width: 3rem; padding: .1rem;
      figure, img { max-width: 100%; }
      figcaption { display: none; }
    }
  }
}


</style>