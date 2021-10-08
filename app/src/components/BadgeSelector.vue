<template>
  <div :class="['overlay', { show: status}]" id="badgesSelector">
    <div>
      <div v-if="getDayLoad" class="container medium mt4">
        <h1>What have you done to improve yourself <span v-if="getDayLoad.day == today.day">today</span><span v-else>on {{ dayName({day: getDayLoad.day, month: getDayLoad.month, year: getDayLoad.year}) }}</span>?</h1>
        <div v-if="loading" class="flex align-center justify-center fw column padyMed loader">
          <div class="text-center pulse">
						<h2>Saving...</h2>
						<pulse-loader :loading="loading"></pulse-loader>
					</div>
        </div>
        <div v-if="userHabits.length" class="grid">
          <div v-for="badge in userHabits" :key="badge._id" @click="toggleBadge(badge._id); coincount.cloneNode(true).play()">
            <div v-if="!badge.deleted" :class="['badge', gradeByCount(user.habits[badge._id].count)[0], { toAdd: !getDayLoad.badges.find((tbadge) => tbadge === badge._id )}]" >
              <figure>
                <div class="frame"><img :src="'/assets/badges/frame/frame'+user.habits[badge._id].frame+'.svg'" :alt="user.habits[badge._id].name"></div>
                <div class="icon"><img crossOrigin="anonymous" id="badgeIcon" :src="user.habits[badge._id].image" :alt="user.habits[badge._id].icon"></div>
              </figure>
              <figcaption>{{ user.habits[badge._id].name }}</figcaption>
            </div>
          </div>
        </div>
        <div v-else><p class="text-center">You have no created habits! Create a new Habit Badge from the <router-link to="/habits"><strong>Habits</strong></router-link> tab.</p></div>
      </div>
      <figure class="close" @click="saveAndClose"><img src="/assets/icons/close.svg" alt="Close"></figure>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { gradeByCount } from "@/components/useFunctions.js";

export default {
  props: ['status'],
	setup() {
		return {
			gradeByCount
		}
	},
  data() {
    return {
      loading: false,
      coincount: new Audio(require('../assets/audio/coincount.mp3')),
    }
  },
  computed: {
    ...mapState(["user","today"]),
    ...mapGetters(["getDayLoad","badges","userHabits"]),
  },
  methods: {
    ...mapMutations(['toggleBadge']),
    ...mapActions(['saveCheckIn']),
    dayName: function(day) {
      var date = new Date(day.month+'/'+day.day+'/'+day.year);
      return date.toLocaleDateString("en-EN", { weekday: 'long' });
    },
    saveAndClose: async function() {
      this.loading = true
      if (await this.saveCheckIn()) {
        this.loading = false
        this.$emit('close')
      }
    }
  },
  components: { PulseLoader }
}
</script>
<style scoped lang="scss">

h1 { font-weight: 300; text-align: center; padding: 0 4.5rem; }

.badge { cursor: pointer; }
.badge, .badge-add, .edit {
  width: 100%; height: 100%;
}
.toAdd { background: white !important; color: black !important; }
.grid { margin-bottom: 3rem; }

.loader {
	position: fixed;
	height: 100vh; width: 100vw;
	z-index: 22; top: 0; left: 0;
	h2 { margin-top: 0; }
	> div { 
		background: #E8E5E5; padding: 1rem 2.5rem; 
		border-radius: .314rem; box-shadow: 0px 0px 15px 0px #FFFFFF;
		border: 1px solid white;
	}
}

.pulse {
	animation: pulse 1s infinite;
}

</style>