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
        <div>
          <div class="badge-add" @click="addBadge">
            <figure>
              <img src="/assets/badges/default/add.svg" alt="Add new">
            </figure>
          </div>
        </div>
      </div>
  
      
      <Badges />

      <h2>Last 7 days</h2>
      <div class="week" v-if="currentMonth">
        <div v-for="day in currentMonth.days" :key="day.day">
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
import Badges from '@/components/Badges.vue'
import BadgeSelector from '@/components/BadgeSelector.vue'
import { mapGetters } from "vuex";

export default {
  name: 'Dashboard',
  data() {
    return {
      badgeSelector: false,
    }
  },
  computed: mapGetters(["currentMonth","today","user"]),
  methods: {
    addBadge: function() { this.badgeSelector = true },
    closeBadgeSelector: function() { this.badgeSelector = false}
  },
  components: {
    Badges,
    BadgeSelector
  }
}
</script>

<style scoped lang="scss">
.badge-add {
  width: 80px;
  text-align: center;
  padding: 5px;
  border-radius: 10px;
  background: #42b983;;
  color: white;
  margin-left: auto;
  margin-bottom: 20px;
  cursor: pointer;
  figure img {
    filter: invert(1)
  }
}
.dash .main {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.week {
  h3 {
    margin-bottom: 0;
    color: white;
  }
  div {
    background: #1f4287;
    padding: 20px 30px;
    margin-bottom: 15px;
    border-radius: 15px;
  }
  ul {
    margin-top: 0px;
    margin-bottom: 30px;
    display: flex;
    list-style: none;
    padding: 0;
    align-items: flex-end;
  }
  li {
    color: white;
    border: 1px solid #dbdbdb;
    border-radius: 20px;
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