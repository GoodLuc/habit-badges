<template>
  <div>
    <div class="container dash">
      <div class="main">
        <div v-if="getDayLoad">
          <h1 v-if="user">Welcome back {{ user.name }}</h1>
        </div>
      </div>

      <h2>Earned Badges for Today:</h2>
      <div class="box">
        <h3 class="dayTitle">{{ dayName(date) }} {{ date.month + "/" + date.day }}</h3>
        <div v-if="getDayLoad" class="badges">
          <div class="badge" v-for="badge in getDayLoad.badges" :key="badge.id">
            <figure v-if="badge.figure.type == 'default'">
              <img :src="'/assets/badges/default/'+badge.figure.id+'.svg'" :alt="badge.name">
            </figure>
            <figcaption>{{ badge.name }}</figcaption>
          </div>
          <button class="badge-add" @click="addBadge">
            <figure>
              <img src="/assets/badges/default/check.svg" alt="Check in">
              <figcaption>Check in <span v-if="getDayLoad.badges.length">/ edit</span></figcaption>
            </figure>
          </button>
        </div>
        <div v-else><pulse-loader :loading="loading"></pulse-loader></div>
      </div>

      <h2>Last 7 days:</h2>
      <div v-if="getMonthLoad.loading"><pulse-loader :loading="loading"></pulse-loader></div>
      <div class="week" v-else>
        <div class="box" v-for="day in week" :key="day.day">
          <h3 class="dayTitle">{{ dayName(day) }} {{ day.month + "/" + day.day }}</h3>
          <div :class="['badges', { isEmpty: !day.badges.length }]" >
            <div class="badge" v-for="badge in day.badges" :key="badge.id">
              <figure v-if="badge.figure.type == 'default'">
                <img :src="'/assets/badges/default/'+badge.figure.id+'.svg'" :alt="badge.name">
              </figure>
              <figcaption>{{ badge.name }}</figcaption>
            </div>
            <button class="edit" @click="editDay(day.year, day.month, day.day)">
              <figure>
                <img src="/assets/badges/default/edit.svg" alt="Edit">
                <figcaption>Edit</figcaption>
              </figure>
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
      loading: true
    }
  },
  computed: {
    ...mapState(["user","date"]),
    ...mapGetters(["getDayLoad", "getMonthLoad","getLastMonthLoad"]),
    week: function () {
      var week = {};
      for (var i=1; i<8; i++) {
          var d = new Date();
          d.setDate(d.getDate() - i);
          if ((d.getMonth()+1) == this.date.month) {
            if (this.getMonthLoad.days[d.getDate()] !== undefined){ week[i] = this.getMonthLoad.days[d.getDate()] }
            else { week[i] = { year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate(), badges: {} } }
          } else if ((d.getMonth()+1) == (this.date.month - 1)) {
            if (this.getLastMonthLoad.days[d.getDate()] !== undefined){ week[i] = this.getLastMonthLoad.days[d.getDate()] }
            else { week[i] = { year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate(), badges: {} } }
          }
      }
      return week;
    }
  },
  methods: {
    addBadge: function() { this.badgeSelector = true },
    editDay: function(year, month, day) { 
      this.$store.dispatch('setDate', {year: year, month: month, day: day})
      this.badgeSelector = true 
    },
    closeBadgeSelector: function() { 
      this.badgeSelector = false
      this.$store.dispatch('setCurrentDate')
    },
    dayName: function(day) {
      var date = new Date(day.month+'/'+day.day+'/'+day.year);
      return date.toLocaleDateString("en-EN", { weekday: 'long' });
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
  }
}
</script>

<style lang="scss">

.dash {
  h2 { margin: 2rem 0 1rem; font-weight: 200; }
}

.box {
  background: rgb(192, 180, 147);
  background: $bg2;
  background: $shine3;
  //background: url('/assets/img/woodbg3.png');
  padding: 2rem;
  //border-radius: .714rem;
  margin-bottom: 3rem;
  display: flex;
  flex-wrap: wrap;
  box-shadow: $inshadow;
}

h3.dayTitle {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  text-shadow: $textshadow;
}

.badges {
  color: white;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.badge, .badge-add, .edit {
  border-radius: .35rem;
  background: $shine2;
  padding: 1rem;
  box-sizing: border-box;
  margin-right: 1rem;
  width: 10rem;
  height: 13.5rem;
  margin-bottom: 20px;
  text-align: center;
  color: black;
  text-shadow: $textshadow;
  box-shadow: $outshadow;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: default;
  figure { 
    border-radius: 50%; 
    background: white; 
    width: 100%;
    position: relative;
    .frame {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
    }
    .icon {
      z-index: 2;
      transform: scale(0.3);
      position: relative;
    }
    img { display: block; }
  }
  figcaption { overflow: hidden; max-width: 100%; padding: .714rem .5rem; }
}
.badge-add, .edit {
  background: $card;
  color: black;
  cursor: pointer;
  text-shadow: none;
  figure { background: none; }
  &:hover {
    background: $radialb;
    color: white;
    img { filter: invert(1) }
  }
}
.edit {
  margin-right: 0;
  padding: 1rem;
}

.edit { margin-left: auto; }

.week {
  .badge { 
    background: $shine2; 
    color: black; 
  }
  /*> div {
    margin-bottom: 2rem;
    border-radius: .314rem;
    background: $bg2;
    box-shadow: $inshadow;
    > div {
      padding: .714rem;
      display: flex;
      align-items: center;
    }
  }*/
  .isEmpty { 
    .edit { 
      height: 3rem; width: 3rem;
      padding: .1rem;
      figure, img { max-width: 100%; }
      figcaption { display: none; }
    }
  }
  
}

</style>