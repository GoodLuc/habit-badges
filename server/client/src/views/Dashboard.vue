<template>
  <div>
    <div class="container dash">
      <div class="main">
        <div>
          <h1>Welcome back {{ user.name }}</h1>
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
  
      <hr>
      
      <Badges />

      <hr>
      <h2>Last 7 days</h2>
      <!--<div class="week">
        <div v-for="day in week" :key="day">
          <h3>{{ day.name + " " + day.number }}</h3>
          <ul>
            <li v-for="badge in day.badges" :key="badge.id">
              <figure class="badge" v-if="badge.figure.type == 'default'">
                <img :src="'/assets/badges/default/'+badge.figure.id+'.svg'" :alt="badge.name">
                <figcaption>{{ badge.name }}</figcaption>
              </figure>
            </li>
          </ul>
        </div>
      </div>-->

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
      user: { name: 'Lucas' },
    }
  },
  computed: mapGetters(["today"]),
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

</style>