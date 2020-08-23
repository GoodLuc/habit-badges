<template>
  <div>
    <div class="container dash">
      <div class="main">
        <div v-if="today">
          <h1 v-if="user">Welcome back {{ user }}</h1>
          <p>Today you earned <strong>{{ today.points }} improvement points.</strong> 
            &nbsp; <a href="#" @click="router.push('/history')" >See improvement history.</a>
          </p>
        </div>
      </div>
  
      
      <div class="today">
        <h2>Earned Badges for Today:</h2>
        
        <div v-if="today" class="badges">
          <div class="badge" v-for="badge in today.badges" :key="badge.id">
            <figure v-if="badge.figure.type == 'default'">
              <img :src="'/assets/badges/default/'+badge.figure.id+'.svg'" :alt="badge.name">
              <figcaption>{{ badge.name }}</figcaption>
              <!--<span><strong></strong></span>-->
            </figure>
          </div>
          <div class="badge-add" @click="addBadge">
            <figure>
              <img src="/assets/badges/default/add.svg" alt="Add new">
              <figcaption>Add new</figcaption>
            </figure>
          </div>
        </div>
      </div>

      <h2>Last 7 days</h2>
      <div class="week" v-if="week">
        <div v-for="day in week" :key="day.day">
          <h3>{{ day.day + "/" + day.month }}</h3>
          <ul>
            <li v-for="badge in day.badges" :key="badge.id">
              <figure class="badge" v-if="badge.figure.type == 'default'">
                <img :src="'/assets/badges/default/'+badge.figure.id+'.svg'" :alt="badge.name">
                <figcaption>{{ badge.name }}</figcaption>
              </figure>
            </li>
          </ul>
        </div>
      </div>

    </div>
  
    <BadgeSelector v-if="badgeSelector" @close="badgeSelector = false" />
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
    }
  },
  computed: {
    ...mapGetters(["lastMonth", "currentMonth", "today", "user"]),
    ...mapState(["day", "month"]),
    week: function () {
      var week = {};
      for (var i=1; i<8; i++) {
          var d = new Date();
          d.setDate(d.getDate() - i);
          if ((d.getMonth()+1) == this.month) {
            if (this.currentMonth.days[d.getDate()] !== undefined){ week[i] = this.currentMonth.days[d.getDate()] }
            //else { week[i] = { day: d.getDate(), month: d.getMonth()+1, badges: {} } }
          } else if ((d.getMonth()+1) == (this.month - 1)) {
            if (this.lastMonth.days[d.getDate()] !== undefined){ week[i] = this.lastMonth.days[d.getDate()] }
            //else { week[i] = { day: d.getDate(), month: d.getMonth()+1, badges: {} } }
          }
      }
      return week;
    }
  },
  methods: {
    addBadge: function() { this.badgeSelector = true },
    closeBadgeSelector: function() { this.badgeSelector = false}
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

<style scoped lang="scss">
.today {
  background: #0b1111;
  padding: 30px;
  border-radius: 10px;

  h2 {
    font-size: 21px; margin: 0 0 10px;
  }
}

.dash .main {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  //justify-content: center;

  .badge {
    border-radius: 15px;
    background: #3c6164;
    padding: 10px;
    box-sizing: border-box;
    margin-right: 10px;
    width: calc(20% - 10px);
    text-align: center;
    color: white;
    span {
      display: block;
      width: 100%;
      height: 10px;
      background: gray;
      margin-top: 10px;
      strong {
        display: block;
        width: 55%;
        height: 10px;
        background: #3cbdd5;
      }
    }
    &:nth-of-type(4n) {
      margin-right: 0
    }
    img {
      filter: invert(1)
    }
  }

  .badge-add {
    width: 80px;
    text-align: center;
    padding: 5px;
    border-radius: 10px;
    background: #EFC30B;;
    color: white;
    display: flex;
    align-items: center;
    cursor: pointer;
    figure img {
      filter: invert(1)
    }
  }
}

.week {
  background: #0b1111;
  padding: 30px;
  border-radius: 15px;
  h3 {
    margin: 0 20px 0 0;
    color: white;
    text-align: center;
    display: flex;
    align-items: center;
    width: 30px;
  }
  div {
    margin-bottom: 15px;
    display: flex;
    background: #2620a2;
    padding: 0 30px;
    border-radius: 15px;
  }
  ul {
    margin-top: 0px;
    display: flex;
    list-style: none;
    padding: 0;
    align-items: flex-end;
  }
  li {
    color: white;
    padding: 10px;
    box-sizing: border-box;
    margin-right: 10px;
    margin-top: 10px;
    width: calc(10% - 10px);
    text-align: center;
    &:nth-of-type(5n) {
      margin-right: 0
    }
    img {
      filter: invert(1)
    }
  
  }
}

</style>