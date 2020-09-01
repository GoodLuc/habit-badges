<template>
  <div>
    <div class="container dash">
      <div class="main">
        <div v-if="getDayLoad">
          <h1 v-if="user">Welcome back {{ user }}</h1>
          <!--<p>Today you earned <strong>{{ getDayLoad.points }} improvement points.</strong> 
            &nbsp; <a href="#" @click="router.push('/history')" >See improvement history.</a>
          </p>-->
        </div>
      </div>
  
      
      <h2>Earned Badges for Today:</h2>
      <div class="today">
        
        <div v-if="getDayLoad" class="badges">
          <div class="badge" v-for="badge in getDayLoad.badges" :key="badge.id">
            <figure v-if="badge.figure.type == 'default'">
              <img :src="'/assets/badges/default/'+badge.figure.id+'.svg'" :alt="badge.name">
            </figure>
            <figcaption>{{ badge.name }}</figcaption>
          </div>
          <button class="badge-add" @click="addBadge">
            <figure>
              <img src="/assets/badges/default/add.svg" alt="Add new">
              <figcaption>Add new</figcaption>
            </figure>
          </button>
        </div>
      </div>

      <h2>Last 7 days:</h2>
      <div class="week" v-if="week">
        <div v-for="day in week" :key="day.day">
          <h3>{{ dayName(day) }} {{ day.month + "/" + day.day }}</h3>
          <div :class="[{ isEmpty: !day.badges.length }]" >
            <div class="badges" >
              <div class="badge" v-for="badge in day.badges" :key="badge.id">
                <figure v-if="badge.figure.type == 'default'">
                  <img :src="'/assets/badges/default/'+badge.figure.id+'.svg'" :alt="badge.name">
                </figure>
                <figcaption>{{ badge.name }}</figcaption>
              </div>
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
import { mapState, mapGetters } from "vuex";

export default {
  name: 'Dashboard',
  data() {
    return {
      badgeSelector: false,
      dateToEdit: [],
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
  components: {
    BadgeSelector
  },
  mounted() {
    this.$store.dispatch('setCurrentDate')
    this.$store.dispatch('getMonth')
  }
}
</script>

<style lang="scss">

.dash {
  h2 { margin: 2rem 0 1rem; text-transform: uppercase; font-weight: 200; }
}

.today {
  background: $lightgrad;
  padding: 1rem;
  border-radius: .714rem;
  margin-bottom: 3rem;
}

.badges {
  color: white;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.badge, .badge-add, .edit {
  border-radius: .35rem;
  background: $shine;
  padding: .714rem;
  box-sizing: border-box;
  margin-right: 1rem;
  width: 8rem;
  height: 11.5rem;
  text-align: center;
  color: white;
  box-shadow: $glow;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  figure { 
    border-radius: 50%; 
    background: white; 
    width: 6rem; height: 6rem;
  }
  figcaption {
    padding: .5rem;
  }
}
.badge-add, .edit {
  background: $ellis2;
  cursor: pointer;
  figure { background: none; }
  img { filter: invert(1) }
}
.edit {
  margin-right: 0;
  padding: 1rem;
}

.edit { margin-left: auto; }

.week {
  h3 {
    color: $foreground;
    text-align: center;
    display: flex;
    align-items: center;
    margin: .5rem 0 0;
    background: $lightgrad;
    padding: .8rem 2rem;
    border-radius: .314rem .314rem 0 0;
  }
  > div {
    margin-bottom: 2rem;
    border-radius: .314rem;
    background: $lightbg;
    > div {
      padding: 2rem;
      display: flex;
      align-items: center;
    }
  }
  .isEmpty { 
    .edit { 
      height: 3rem; width: 3rem;
      padding: .1rem;
      figure, img { max-width: 100%; }
      figcaption { display: none; }
    }
  }
  /*div > div {
    background: $lightgrad;
    margin-bottom: 1rem;
    background: $lightgrad;
    padding: .1rem;
    border-radius: .314rem;
  }*/
}

</style>