<template>
  <div>
    <div class="container dash">

      <h2>Monthly view</h2>
      <div v-if="monthLoad.loading"><pulse-loader :loading="loading"></pulse-loader></div>
      <div class="month grid" v-else>

				<div v-for="index in 30" :key="index">
					<template v-if="todayNr+index < daysInMonth(lastMonthLoad.month, lastMonthLoad.year)">
						<h3>{{monthName(lastMonthLoad.month)}} {{todayNr+index+1}}</h3>
						<div class="box day">

							<div :class="['grid three']" v-if="lastMonthLoad.days[todayNr+index+1]">
								<template v-for="badge in lastMonthLoad.days[todayNr+index+1].badges" :key="badge">
									<w-tooltip top color="white" bg-color="grey-dark5">
										<template #activator="{ on }">
											<div class="badge" :class="gradeByCount(user.habits[badge].count)[0]">
												<figure v-on="on">
													<div class="frame"><img :src="'/assets/badges/frame/frame'+user.habits[badge].frame+'.svg'" :alt="user.habits[badge].name"></div>
													<div class="icon"><img crossOrigin="anonymous" id="badgeIcon" :src="user.habits[badge].image" :alt="user.habits[badge].icon"></div>
												</figure>
											</div>
										</template>
										{{ user.habits[badge].name }}
									</w-tooltip>
								</template>
							</div>
						</div>
					</template>

					<template v-else>
						<h3>{{monthName(monthLoad.month)}} {{todayNr+index-daysInMonth(lastMonthLoad.month, lastMonthLoad.year)+1}}</h3>
						<div class="box day">

							<div :class="['grid three']" v-if="monthLoad.days[todayNr+index+1]">
								<template v-for="badge in monthLoad.days[todayNr+index+1].badges" :key="badge">
									<w-tooltip top color="white" bg-color="grey-dark5">
										<template #activator="{ on }">
											<div class="badge" :class="gradeByCount(user.habits[badge].count)[0]">
												<figure v-on="on">
													<div class="frame"><img :src="'/assets/badges/frame/frame'+user.habits[badge].frame+'.svg'" :alt="user.habits[badge].name"></div>
													<div class="icon"><img crossOrigin="anonymous" id="badgeIcon" :src="user.habits[badge].image" :alt="user.habits[badge].icon"></div>
												</figure>
											</div>
										</template>
										{{ user.habits[badge].name }}
									</w-tooltip>
								</template>
							</div>
						</div>
					</template>
				</div>

        
      </div>

    </div>
  
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { mapState } from "vuex";
import { gradeByCount } from "@/components/useFunctions.js";

export default {
  name: 'Monthly',
	setup() {
		return {
			gradeByCount
		}
	},
  data() {
    return {
			todayNr: new Date().getDate(),
      loading: true
    }
  },
  computed: {
    ...mapState(["user","date","monthLoad","lastMonthLoad","titles"]),
  },
  methods: {
    dayName: function(day) {
      var date = new Date(day.month+'/'+day.day+'/'+day.year);
      return date.toLocaleDateString("en-EN", { weekday: 'long' });
    },
		monthName: function(month) {
			let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			return months[month-1]
		},
		daysInMonth: function(month, year) {
			return new Date(year, month, 0).getDate();
		}
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
  &.grid {
    grid-template-columns: repeat( 5, 1fr );
    .box.day .grid .badge { min-width: auto; max-width: 100%; padding: .2rem; }
  }
  .day {
		h3.dayTitle { margin-top: 0; }
    .grid {
      grid-template-columns: repeat( 3, 1fr );
      gap: 10px;
    }
  }
  @media (max-width: 1050px) { &.grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 750px) { &.grid { grid-template-columns: 1fr; } }
  @media (max-width: 450px) { .day .grid { grid-template-columns: repeat(3, 1fr); } }
  
  .box {
    padding: 1rem; margin: 0;
    h3 { text-align: center; width: 100%; margin-bottom: 1rem; }
		.grid { margin-bottom: 0; }
    .badge { width: auto; height: auto; flex-grow: 0; margin: 0; padding: .2rem; }
  }
  .grid .badge figure, .grid .badge-add figure, .grid .edit figure { width: 100%; }
}
</style>