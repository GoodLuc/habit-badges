<template>
  <div>
    <div class="container dash">
      <div class="main">
        <h1>This are your habits</h1>
        <div class="box">
          <div class="badges">
            <button class="badge-add" @click="createBadge">
              <figure>
                <img src="/assets/badges/default/add.svg" alt="Add new">
                <figcaption>Create new</figcaption>
              </figure>
            </button>
          </div>
        </div>
      </div>

    </div>
  
  <BadgeCreator v-if="badgeCreator" @close="closeBadgeCreator" />
  </div>
</template>

<script>
import BadgeCreator from '@/components/BadgeCreator.vue'

export default {
  name: 'Habits',
  data() {
    return {
      badgeCreator: false
    }
  },
  computed: {

  },
  methods: {
    createBadge: function() { this.badgeCreator = true },
    closeBadgeCreator: function() { 
      this.badgeCreator = false
    },
  },
  components: {
    BadgeCreator
  },
  mounted() {
    
  }
}
</script>

<style lang="scss">

</style>