<template>
  <div>
    <div class="container dash">
      <div class="main">
        <div class="flex justify-between">
					<div>
						<h1>This are your pending rewards {{ user.name }}</h1>
						<p>Create new ones or see your previously earned rewards</p>
					</div>
					<button class="button button-add" @click="rewardCreator = true">
						<figure>
							<img src="/assets/badges/default/add.svg" alt="Add new">
						</figure>
						<figcaption>Create new</figcaption>
					</button>
				</div>
				<div v-if="user.rewards && Object.keys(user.rewards).length">
					<article v-for="reward in user.rewards" :key="reward.id">
						<h2>{{ reward.title }}</h2>
					</article>
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

.habit-row { 
	width: 100%; 
	margin-bottom: 2rem; 
	background: white;
}
.box {
  padding-top: 3rem;
  .badge-add { img { transform: scale(1.5); } }
}
.habit {
	width: 10rem;
  background: cornsilk;
	margin-right: 2rem;
  .badgeEditControls { 
    display: flex; justify-content: space-between; 
    width: 100%;
    button { display: block;
      width: auto; height: 4rem; border-radius: 0 0 .314rem .314rem;
      font-weight: 200; font-size: .9rem; margin: 0; border: none; 
      background: none; box-shadow: none; transition: transform .2s ease;
      &.edit { figure { filter: invert(36%) sepia(66%) saturate(7120%) hue-rotate(219deg) brightness(99%) contrast(97%); } }
      &.del { figure { filter: invert(19%) sepia(96%) saturate(3956%) hue-rotate(355deg) brightness(105%) contrast(94%); } }
      figure img { height: 2rem; }
      &:hover { transform: scale(1.2); }
    }
  }
}


.tablechart {
	display: flex; flex-wrap: wrap; margin-top: 1.7rem;
	div {
		margin: 0 .3rem .3rem 0;
		span {
			border-radius: .5rem;
			padding: .5rem;
			width: 4rem; height: 3rem;
			display: flex;
			justify-content: center;
			align-items: center;
			&.gold { background: $gold;}
			&.silver { background: $silver;}
			&.azure { background: $azure; color: white;}
			&.empty {
				box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
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