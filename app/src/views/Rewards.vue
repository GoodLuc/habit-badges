<template>
  <div>
    <div class="container dash">
      <div class="main">
        <div class="flex justify-between">
					<div>
						<h1>This are your rewards {{ user.name }}</h1>
						<p>Create new ones or see your previously earned rewards</p>
					</div>
					<button class="button button-add" @click="rewardCreator = true">
						<figure>
							<img src="/assets/badges/default/add.svg" alt="Add new">
						</figure>
						<figcaption>Create new</figcaption>
					</button>
				</div>
				
				<div class="flex justify-between">
					<section>
						<h2>Pending</h2>

						<div v-if="user.rewards && Object.keys(user.rewards).length">
							<article class="reward grade1" v-for="reward in user.rewards" :key="reward.id">
								<figure><div class="frame"><img src="@/assets/icons/treasure.png" alt="Reward"></div></figure>
								<p class="text-center">{{ reward.name }}</p>
								<button class="button gold flex column align-center">
									<div class="icon-content mb1"> 
										<figure><img src="@/assets/icons/ruby.png" alt="Rubys"></figure>
										<figcaption>{{ reward.value }}</figcaption> 
									</div>
									Unlock
								</button>
							</article>
						</div>
					</section>

					<section>
						<h2>Earned</h2>

					</section>
				</div>
				
      </div>

    </div>
  
  <RewardCreator v-if="rewardCreator" @close="rewardCreator = false; reward = {}" :reward="reward" />
  </div>
</template>

<script>
import PostService from '../PostService'
import RewardCreator from '@/components/RewardCreator.vue'
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  name: 'Rewards',
  data() {
    return {
      rewardCreator: false,
      delDialog: false,
      delHabit: null,
      reward: {},
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
  components: { RewardCreator },
  mounted() {
    document.body.classList.remove('overlaid')
    window.scrollTo(0, 0)
  }
}
</script>

<style scoped lang="scss">

h1 { font-weight: 300; }

.reward {
	width: 14rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-right: 2rem;
	padding: 1rem;
	button {
		padding-top: .5rem;
		width: 100%;
	}
  .badgeEditControls { 
    display: flex; justify-content: space-between; 
    width: 100%;
    button { display: block;
      width: auto; height: 4rem; border-radius: 0 0 .314rem .314rem;
      font-weight: 200; font-size: .9rem; margin: 0; border: none; 
      background: none; box-shadow: none; transition: transform .2s ease;
      &.edit { figure { filter: invert(36%) sepia(66%) saturate(7120%) hue-rotate(219deg) brightness(99%) contrast(97%); } }
      &.del { figure { filter: invert(51%) sepia(99%) saturate(405%) hue-rotate(354deg) brightness(90%) contrast(89%); } }
      figure img { height: 2rem; }
      &:hover { transform: scale(1.2); }
    }
  }
}

.delDialog { 
  text-align: center; 
  .controls {
    display: flex; justify-content: center;
    button { margin-right: 20px; width: auto; }
    button.del { background: #ce821f; }
  }
}

</style>