<template>
	<div class="container flex justify-between">
		<main class="dash">
			<h1 v-if="user">Welcome back {{ user.name }}</h1>

			<div v-if="false" class="top-habits">
				<div class="title"><h2>Your top habits</h2><router-link class="see-more" to="/rewards">Manage habits</router-link></div>
				<div v-if="getDayLoad" class="bgcont-wrap mb2">
					<div class="bgcont flex wrap padAllMed">
						<div class="grid">
							<div v-for="badge in userHabitsByCount.slice(0,7)" :key="badge._id">
								<div class="badge" :class="gradeByCount(badge.count)[0]">
									<figure>
										<div class="frame"><img :src="'/assets/badges/frame/frame'+user.habits[badge._id].frame+'.svg'" :alt="user.habits[badge._id].name"></div>
										<div class="icon"><img crossOrigin="anonymous" id="badgeIcon" :src="user.habits[badge._id].image" :alt="user.habits[badge._id].icon"></div>
									</figure>
									<figcaption>{{ user.habits[badge._id].name }}</figcaption>
								</div>
								<div class="badge-grade">
									<h3>{{ gradeByCount(badge.count)[1] }}</h3>
									<p>Done {{ badge.count }} times</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<h2>Check-in your completed badges for today:</h2>
			<div v-if="getDayLoad" class="bgcont-wrap mb2">
				<div class="bgcont flex wrap padAllMed pt2">
					<div class="flex fw align-center justify-between mb-1">
						<h3 class="dayTitle">{{ dayName(date) }} <span>{{ date.month + "/" + date.day }}</span></h3>
						<div class="icon-content">
							<figure><img src="@/assets/icons/coin.svg" alt="Coins"></figure>
							<figcaption>{{ dayPay(getDayLoad.badges) }}</figcaption>
						</div>
					</div>
					<div class="grid">
						<div class="badge" :class="gradeByCount(user.habits[badge].count)[0]" v-for="badge in getDayLoad.badges" :key="badge">
							<figure>
								<div class="frame"><img :src="'/assets/badges/frame/frame'+user.habits[badge].frame+'.svg'" :alt="user.habits[badge].name"></div>
								<div class="icon"><img crossOrigin="anonymous" id="badgeIcon" :src="user.habits[badge].image" :alt="user.habits[badge].icon"></div>
							</figure>
							<figcaption>{{ user.habits[badge].name }}</figcaption>
						</div>
						<button class="badge-check" @click="checkIn">
							<figure>
								<img src="@/assets/icons/check-in.svg" alt="Check in">
							</figure>
							<figcaption>Check in <span v-if="getDayLoad.badges.length">/ edit</span></figcaption>
						</button>
					</div>
				</div>
			</div>
			
			<div v-else><pulse-loader :loading="loading"></pulse-loader></div>
			<h2>Last 7 days:</h2>
			<div v-if="monthLoad.loading"><pulse-loader :loading="loading"></pulse-loader></div>
			<div class="week" v-else>
				<div class="bgcont-wrap mb8" v-for="day in week" :key="day.day">
					<div class="bgcont flex wrap padAllMed pt2">
						<div class="flex fw align-center justify-between mb1">
							<h3 class="dayTitle">{{ dayName(day) }} <span>{{ day.month + "/" + day.day }}</span></h3>
							<div class="icon-content">
								<figure><img src="@/assets/icons/coin.svg" alt="Coins"></figure>
								<figcaption>{{ dayPay(day.badges) }}</figcaption>
							</div>
						</div>
						<div :class="['grid', { isEmpty: !day.badges.length }]" >
							<div class="badge" :class="gradeByCount(user.habits[badge].count)[0]" v-for="badge in day.badges" :key="badge">
								<figure>
									<div class="frame"><img :src="'/assets/badges/frame/frame'+user.habits[badge].frame+'.svg'" :alt="user.habits[badge].name"></div>
									<div class="icon"><img crossOrigin="anonymous" id="badgeIcon" :src="user.habits[badge].image" :alt="user.habits[badge].icon"></div>
								</figure>
								<figcaption>{{ user.habits[badge].name }}</figcaption>
							</div>
							<button class="badge-edit" @click="editDay(day.year, day.month, day.day)">
								<figure>
									<img src="@/assets/icons/check-in.svg" alt="Check-in">
								</figure>
								<figcaption>Edit</figcaption>
							</button>
						</div>
					</div>
				</div>
			</div>
		</main>

		<aside class="bgcont-wrap dash-side">
			<div class="bgcont">
				<div class="flex justify-between">
					<figure class="rankbadge">
						<span>Rank</span>
						<span>{{ user.level.nr }}</span>
					</figure>
					<div class="currency">
						<figure class="coins">
							<img src="@/assets/icons/coin.svg" alt="">
							<span>{{ user.points - user.tab }}</span>
						</figure>
						<!-- <figure class="rubys">
							<img src="@/assets/icons/ruby.png" alt="">
							<span>10</span>
						</figure> -->
					</div>
				</div>
				<div class="level-indicator" v-if="user.level">
					<div class="flex justify-between"><span>Points: {{ user.points }}</span><span>{{ user.level.toNext }} till next</span></div>
					<div class="level"><div :style="'width:'+user.level.percent+'%'"></div></div>
					<p class="entitlement"><strong>{{ titles[user.level.nr] }}</strong></p>
				</div>
				<div class="reward-list mb4">
					<h3>Pending rewards</h3>
					<template v-if="pending.length">
						<article class="reward" v-for="reward in pending" :key="reward.id">
							<figure><img src="@/assets/icons/treasure.png" alt="Reward"></figure>
							<span>{{ reward.name }}</span>
							<figure class="price">
								<figcaption>{{ reward.value }}</figcaption>
							</figure>
						</article>
          	<router-link class="see-more" to="/rewards">See rewards</router-link>
					</template>
					<template v-else>
						<p class="text-normal">You can create <router-link to="/rewards" class="link">rewards</router-link>.</p>
					</template>
				</div>
				<div class="reward-list" v-if="completed.length">
					<h3>Latest achievements</h3>
					<article class="reward" v-for="reward in completed" :key="reward.id">
						<figure><img src="@/assets/icons/treasure.png" alt="Reward"></figure>
						<span>{{ reward.name }}</span>
						<figure class="price">
							<figcaption>{{ reward.value }}</figcaption>
						</figure>
					</article>
				</div>
			</div>
		</aside>
	</div>
  
	<BadgeSelector v-if="badgeSelector" @close="closeBadgeSelector" :day="dateToEdit" />
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import BadgeSelector from '@/components/BadgeSelector.vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { mapState, mapGetters } from "vuex";
import { gradeByCount } from "@/components/useFunctions.js";

export default {
  name: 'Dashboard',
	setup() {
		const store = useStore()

		return {
			pending: computed(() => {
				return Object.values(store.state.user.rewards).filter(
					reward => (reward.completed == false || reward.recurring == true) && !reward.deleted
				)
			}),
			completed: computed(() => {
				return Object.values(store.state.user.rewards).filter(
					reward => (reward.completed == true) && !reward.deleted
				)
			}),
			gradeByCount
		}
	},
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
    ...mapGetters(["getDayLoad","userHabitsByCount","gradeByCount"]),
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
    checkIn: function() { this.badgeSelector = true },
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
		document.body.classList.remove('overlaid')
  }
}
</script>

<style lang="scss" scoped>

.week {
	.isEmpty { 
		.edit {  height: 3rem; width: 3rem; padding: .1rem;
      figure, img { max-width: 100%; }
      figcaption { display: none; }
    }
  }
}

.dash {
	width: calc(80% - 3rem);
	h1 { 
		font-size: 3.429rem;
		font-weight: 300; margin-top: 4rem;
	}
	h2 { margin: 4rem 0 1rem; font-size: 1.714rem; font-weight: 400; }

	.top-habits {
		.title {
			display: flex; justify-content: space-between; align-items: flex-end;
			margin-bottom: 1rem;
			h2 { font-size: 1.2rem; margin: 0; }
		}
		.badge-grade {
			text-align: center;
			h3 { font-size: 1.214rem; font-weight: 400; margin: 1rem 0 .3rem; }
			p { font-size: 0.948rem; margin: 0; }
		}
	}
}

.dash-side {
	margin: 3rem 0 auto;
	width: 20%;
	.bgcont > div {
		padding: 1.5rem;
	}

	.rankbadge {
		background: url('~@/assets/icons/shield.png') center/contain no-repeat;
		font-weight: 600; color: white; 
		height: 5rem; width: 3.8rem; 
		font-size: 1.3rem;
		display: flex; flex-direction: column; justify-content: center; align-items: center;
	}

	.level-indicator {
		background: white;
		border-radius: 6px;
		.level {
			margin: 1rem 0;
			width: 100%; height: 1.2rem; 
			border-radius: .5rem;
			background: $background; 
			box-shadow: $inshadow; 
			display: flex; align-items: center;
			div { 
				background: $foreground; height: .8rem; border-radius: .5rem;
				box-shadow: -1px -1px 2px 0px rgba(255, 255, 255,.9), 2px 2px 3px 3px rgba(0, 255, 255,.4);
			}
		}
		.entitlement {
			text-align: center;	color: #0065A5;
			margin: 0;
		}
	}

	.see-more { float: right; }
}

.see-more { 	
	color: #0065A5;
	margin: .5rem 0 0;
	text-decoration: none;
}

</style>