<template>
  <div>
    <div class="container dash">
      <div class="main">
        <h1>This are your habits {{ user.name }}</h1>
        <div class="box">
          <div class="badges" v-if="user">
            <div class="badge" v-for="habit in user.habits" :key="habit._id">
              <figure>
                <div class="frame"><img :src="'/assets/badges/frame/frame'+habit.frame+'.svg'" :alt="habit.name"></div>
                <div class="icon"><img crossOrigin="anonymous" id="badgeIcon" :src="habit.image" :alt="habit.icon"></div>
              </figure>
              <figcaption>{{ habit.name }}</figcaption>
            </div>
            <button class="badge-add" @click="badgeCreator = true">
              <figure>
                <img src="/assets/badges/default/add.svg" alt="Add new">
                <figcaption>Create new</figcaption>
              </figure>
            </button>
          </div>
        </div>
      </div>

    </div>
  
  <BadgeCreator v-if="badgeCreator" @close="badgeCreator = false" />
  </div>
</template>

<script>
import BadgeCreator from '@/components/BadgeCreator.vue'
import { mapState } from "vuex";

export default {
  name: 'Habits',
  data() {
    return {
      badgeCreator: false,
    }
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {
    badgeCreator: function() {
      const bod = document.body
      if (this.badgeCreator) {
        bod.classList.add('overlaid')
      } else {
        bod.classList.remove('overlaid')
      }
    }
  },
  methods: {
  },
  components: {
    BadgeCreator,
  },
}
</script>

<style lang="scss">

</style>