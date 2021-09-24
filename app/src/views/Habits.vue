<template>
  <div>
    <div class="container dash">
      <div class="main">
        <div class="flex justify-between">
					<div>
						<h1>This are your habits {{ user.name }}</h1>
						<p>Create your custom badges to track your daily progress</p>
					</div>
					<button class="button button-add" @click="badgeCreator = true">
						<figure>
							<img src="/assets/badges/default/add.svg" alt="Add new">
						</figure>
						<figcaption>Create new</figcaption>
					</button>
				</div>
				<div class="flex wrap justify-between mt4" v-if="user">
					<div class="habit-row box flex" v-for="habit in userHabits" :key="habit._id">
						<div class="habit">
							<div  class="badge" :class="gradeByCount(habit.count)[0]">
								<figure>
									<div class="frame"><img :src="'/assets/badges/frame/frame'+habit.frame+'.svg'" :alt="habit.name"></div>
									<div class="icon"><img crossOrigin="anonymous" id="badgeIcon" :src="habit.image" :alt="habit.icon"></div>
								</figure>
							</div>
							<div class="badge-grade mt2 text-center">
								<h3>{{ gradeByCount(habit.count)[1] }}</h3>
								<p>Done {{ habit.count }} times</p>
							</div>
						</div>
						<div class="timeline">
							<div class="flex justify-between align-bottom">
								<h2>{{ habit.name }}</h2>
								<div class="badgeEditControls">
									<w-tooltip top color="white" bg-color="grey-dark5">
										<template #activator="{ on }">
											<button v-on="on" class="edit" @click="editHabit(habit)" type="button">
												<figure><img src="/assets/badges/default/edit.svg" alt="Edit"></figure>
											</button>
										</template>
										Edit
									</w-tooltip>
									<w-tooltip top color="white" bg-color="grey-dark5">
										<template #activator="{ on }">
											<button v-on="on" class="del" type="button" @click="delDialog = true; delHabit = habit">
												<figure><img src="@/assets/icons/archive.svg" alt="Delete"></figure>
											</button>
										</template>
										Archive
									</w-tooltip>
								</div>
							</div>

							<div class="tablechart">
								<div v-for="index in 30" :key="index">
									<template v-if="todayNr+index < daysInMonth">
										<span v-if="lastMonthLoad.days[todayNr+index+1]?.badges.includes(habit._id)" class="filled" :class="gradeByCount(habit.count)[0]">{{monthName(monthLoad.month - 1)}} {{todayNr+index+1}}</span>
										<span v-else class="empty">{{monthName(monthLoad.month - 1)}} {{todayNr+index+1}}</span>
									</template>
									<template v-else>
										<span v-if="monthLoad.days[todayNr+index-daysInMonth+1]?.badges.includes(habit._id)" class="filled" :class="gradeByCount(habit.count)[0]">{{monthName(monthLoad.month)}} {{todayNr+index-daysInMonth+1}}</span>
										<span v-else class="empty">{{monthName(monthLoad.month)}} {{todayNr+index-daysInMonth+1}}</span>
									</template>
								</div>
							</div>
						</div>
					</div>
				</div>
      </div>

    </div>

  <div v-if="delDialog" class="delDialog overlay">
    <div v-if="!confirmed" class="container">
      <div>
        <h1>Are you sure you wish to delete this badge?</h1>
        <p>Any previous entries in the daily calendar will still be visible.</p>
      </div>
      <pulse-loader :loading="loading"></pulse-loader>
      <div class="controls"><button :disabled="loading" class="del" @click="deleteHabit(delHabit)" type="button">Delete</button> <button type="button" @click="delDialog = false">Cancel</button></div>
    </div>
    <div else>
      <h1>The selected badge has been deleted.</h1>
      <div class="controls">
        <button type="button" @click="delDialog = false; confirmed = false">Ok</button>
      </div>
    </div>
  </div>
  
  <BadgeCreator v-if="badgeCreator" @close="badgeCreator = false; habit = {}" :habit="habit" />
  </div>
</template>

<script>
import PostService from '../PostService'
import BadgeCreator from '@/components/BadgeCreator.vue'
import { mapState, mapGetters, mapMutations } from "vuex";
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { gradeByCount } from "@/components/useFunctions.js";

export default {
  name: 'Habits',
	setup() {
		return {
			gradeByCount
		}
	},
  data() {
    return {
      badgeCreator: false,
      delDialog: false,
      delHabit: null,
      habit: {},
      loading: false,
      confirmed: false,
			todayNr: new Date().getDate(),
    }
  },
  computed: {
    ...mapState(["user","monthLoad","lastMonthLoad"]),
    ...mapGetters(["userHabits"]),
		daysInMonth: function() {
			return new Date(new Date().getMonth(), new Date().getYear(), 0).getDate();
		}
  },
  watch: {
    // Add overlay class to body if Badge Creator component is open
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
    ...mapMutations(['updateBadgeInStore']),
    editHabit: function(habit) {
      this.habit = habit
      this.badgeCreator = true
    },
    // Set habit to hidden in DB with the *deleted* attribute
    deleteHabit: async function() {
      this.loading = true
      this.delHabit = { ...this.delHabit, deleted: true }
      this.updateBadgeInStore( this.delHabit )
      await PostService.saveBadge({ user: this.user.token, habit: this.delHabit });
      this.loading = false
      this.confirmed = true
    },
		monthName: function(month) {
			let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			return months[month-1]
		}
  },
  components: { BadgeCreator, PulseLoader },
  mounted() {
    document.body.classList.remove('overlaid')
    window.scrollTo(0, 0)
  }
}
</script>

<style scoped lang="scss">

h1 { font-weight: 300; }

.habit-row { 
	width: 100%; 
	margin-bottom: 2rem; 
	max-width: calc(50% - 1rem);
	h2 { margin: 0; }
	h3 { margin: 0 0 .5rem; }
	p { margin: 0; font-size: 1rem; }
}
.box {
	padding: 2rem;
  .badge-add { img { transform: scale(1.5); } }
}
.habit {
	width: 10rem;
	margin-right: 2rem;
	.badge {
		padding-bottom: 1.4rem;
	}
}
.badgeEditControls { 
	display: flex; justify-content: flex-end; 
	margin-top: 1rem; margin-left: auto;
	button { display: block; cursor: pointer; margin-left: 1rem;
		width: auto; border-radius: 0 0 .314rem .314rem;
		font-weight: 200; font-size: .9rem; border: none; 
		padding: 0;
		background: none; box-shadow: none; transition: transform .2s ease;
		&.edit { figure { filter: invert(36%) sepia(66%) saturate(7120%) hue-rotate(219deg) brightness(99%) contrast(97%); } }
		&.del { figure { filter: invert(36%) sepia(66%) saturate(7120%) hue-rotate(219deg) brightness(99%) contrast(97%); } }
		figure img { height: 2rem; }
		&:hover { transform: scale(1.2); }
	}
}

.timeline { width: 100%; }
.tablechart {
	margin-top: 1.7rem; width: 100%; display: grid;
	grid-template-columns: repeat( auto-fill, minmax(5rem, 1fr) ); gap: 1.2rem; row-gap: .7rem;
	div {
		span {
			border-radius: .5rem;
			padding: .5rem;
			display: flex; width: 100%; height: 3rem;
			text-align: center;
			justify-content: center;
			align-items: center;
			&.empty {
				box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset; border: 1px solid #c2c2c2;
			}
			&.filled {
				box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
			}
		}
	}
}

.delDialog { 
  text-align: center; 
  .controls {
    display: flex; justify-content: center;
    button { margin-right: 20px; width: auto; }
    button.del { background: #F72616; }
  }
}

</style>