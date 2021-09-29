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
				
				<div class="flex justify-between mt8">
					<section class="bgcont-wrap">
						<div class="bgcont">
							<div class="flex justify-between">
								<h2>Pending / Recurring</h2>
								<div class="currency">
									<figure class="coins">
										<img src="@/assets/icons/coin.svg" alt="">
										<span>{{ user.points }}</span>
									</figure>
								</div>
							</div>

							<div class="reward-list" v-if="user.rewards && Object.keys(user.rewards).length">
								
								<article class="reward" v-for="reward in pending" :key="reward.id">
									<div class="flex justify-between">
										<figure><img src="@/assets/icons/treasure_closed.png" alt="Reward"></figure>
										<p class="text-center">{{ reward.name }}</p>
										<button @click="unlockReward = reward; buyReward = true" class="button gold flex column align-center">
											<div class="icon-content mb1">
												<figure><img src="@/assets/icons/ruby.png" alt="Rubys"></figure>
												<figcaption>{{ reward.value }}</figcaption>
											</div>
											Unlock
										</button>
									</div>
								</article>
							</div>
						</div>
					</section>

					<section class="bgcont-wrap">
						<div class="bgcont">
							<h2>Earned</h2>

							<div class="reward-list" v-if="user.rewards && Object.keys(user.rewards).length">
								
								<article class="reward" v-for="reward in completed" :key="reward.id">
									<div class="flex justify-between">
										<figure><img src="@/assets/icons/treasure_closed.png" alt="Reward"></figure>
										<p class="text-center">{{ reward.name }}</p>
										<button @click="unlockReward = reward; buyReward = true" class="button gold flex column align-center">
											<div class="icon-content mb1">
												<figure><img src="@/assets/icons/ruby.png" alt="Rubys"></figure>
												<figcaption>{{ reward.value }}</figcaption>
											</div>
											Unlock
										</button>
									</div>
								</article>
							</div>
						</div>
					</section>
				</div>
				
      </div>

    </div>
  
  <RewardCreator v-if="rewardCreator" @close="rewardCreator = false; reward = {}" :reward="reward" />
	<BuyReward v-if="buyReward" @close="buyReward = false" :reward="unlockReward" />
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import RewardCreator from '@/components/RewardCreator.vue'
import BuyReward from '@/components/BuyReward.vue'
import { mapState, mapMutations } from "vuex";

export default {
  name: 'Rewards',
	setup() {
		const store = useStore()

		return {
			pending: computed(() => {
				return Object.values(store.state.user.rewards).filter(
					reward => (reward.completed == false || reward.recurring == true)
				)
			}),
			completed: computed(() => {
				return Object.values(store.state.user.rewards).filter(
					reward => (reward.completed == true)
				)
			}),
			
		}
	},
  data() {
    return {
      rewardCreator: false,
			buyReward: false,
      delDialog: false,
      unlockReward: {},
      loading: false,
      confirmed: false,
    }
  },
  computed: {
    ...mapState(["user"]),
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
    },
		buyReward: function() {
			const bod = document.body
      if (this.buyReward) {
        bod.classList.add('overlaid')
      } else {
        bod.classList.remove('overlaid')
      }
		}
  },
  methods: {
    ...mapMutations(['updateBadgeInStore']),
    
  },
  components: { RewardCreator, BuyReward },
  mounted() {
    document.body.classList.remove('overlaid')
    window.scrollTo(0, 0)
  }
}
</script>

<style scoped lang="scss">

h1 { font-weight: 300; }

section {
	width: calc(50% - 1rem);
	h2 { margin: 0 0 1rem; }
	> div { padding: 2rem; }
}

.reward {
	width: calc(50% - 1rem);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	margin-right: 2rem;
	padding: 0rem;
	border-radius: .314rem;
	background: white;
	> div:first-of-type { 
		align-items: center;
		width: 100%;
		> figure { width: 6rem; height: 6rem; padding: .5rem .5rem .5rem 1rem; display: flex; align-items: center; flex-shrink: 0; }
		> p { padding: .5rem; font-size: 1rem; }
	}
	button {
		padding-top: .5rem;
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