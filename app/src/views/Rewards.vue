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
										<span>{{ user.points - user.tab }}</span>
									</figure>
								</div>
							</div>

							<div class="reward-list" v-if="user.rewards && Object.keys(user.rewards).length">
								<article class="reward" v-for="reward in pending" :key="reward.id">
									<div class="flex column">
										<div class="flex justify-between fw">
											<figure class="treasure"><img src="@/assets/icons/treasure_closed.png" alt="Reward"></figure>
											<p class="text-center title">{{ reward.name }}</p>
											<div class="badgeEditControls">
												<w-tooltip top color="white" bg-color="grey-dark5">
													<template #activator="{ on }">
														<button v-on="on" class="edit" @click="editReward(reward)" type="button">
															<figure><img src="/assets/badges/default/edit.svg" alt="Edit"></figure>
														</button>
													</template>
													Edit
												</w-tooltip>
												<w-tooltip top color="white" bg-color="grey-dark5">
													<template #activator="{ on }">
														<button v-on="on" class="del" type="button" @click="delDialog = true; delReward = reward">
															<figure><img src="@/assets/icons/archive.svg" alt="Delete"></figure>
														</button>
													</template>
													Archive
												</w-tooltip>
											</div>
										</div>
										<button @click="unlockReward = reward; buyReward = true" class="button gold flex justify-center align-center fw">
											<div class="icon-content mb1 mr2">
												<figure><img src="@/assets/icons/ruby.png" alt="Rubys"></figure>
												<figcaption>{{ reward.value }}</figcaption>
											</div>
											<span>Unlock</span>
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
									<div class="flex column">
										<div class="flex justify-between fw">
											<figure class="treasure"><img src="@/assets/icons/treasure_closed.png" alt="Reward"></figure>
											<p class="text-center title">{{ reward.name }}</p>
											<div class="badgeEditControls">
												<w-tooltip top color="white" bg-color="grey-dark5">
													<template #activator="{ on }">
														<button v-on="on" class="edit" @click="editReward(reward)" type="button">
															<figure><img src="/assets/badges/default/edit.svg" alt="Edit"></figure>
														</button>
													</template>
													Edit
												</w-tooltip>
												<w-tooltip top color="white" bg-color="grey-dark5">
													<template #activator="{ on }">
														<button v-on="on" class="del" type="button" @click="delDialog = true; delReward = reward">
															<figure><img src="@/assets/icons/archive.svg" alt="Delete"></figure>
														</button>
													</template>
													Archive
												</w-tooltip>
											</div>
										</div>
									</div>
								</article>
							</div>
							
						</div>
					</section>
				</div>
				
      </div>

    </div>

		<div v-if="delDialog" class="delDialog overlay">
			<div v-if="!confirmed" class="container">
				<div>
					<h1>Are you sure you wish to archive this reward?</h1>
				</div>
				<pulse-loader :loading="loading"></pulse-loader>
				<div class="controls"><button :disabled="loading" class="del" @click="deleteReward(delReward)" type="button">Archive</button> <button type="button" @click="delDialog = false">Cancel</button></div>
			</div>
			<div else>
				<h1>The selected reward has been archived.</h1>
				<div class="controls">
					<button type="button" @click="delDialog = false; confirmed = false">Ok</button>
				</div>
			</div>
  	</div>
  
		<RewardCreator v-if="rewardCreator" @close="rewardCreator = false; reward = {}" :reward="reward" />
		<BuyReward v-if="buyReward" @close="buyReward = false" :reward="unlockReward" />
  </div>
</template>

<script>
import PostService from '../PostService'
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
					reward => (reward.completed == false || reward.recurring == true) && !reward.deleted 
				)
			}),
			completed: computed(() => {
				return Object.values(store.state.user.rewards).filter(
					reward => (reward.completed == true) && !reward.deleted
				)
			}),
			
		}
	},
  data() {
    return {
      rewardCreator: false,
			reward: {},
			buyReward: false,
      delDialog: false,
			delReward: {},
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
		},
	
  },
  methods: {
    ...mapMutations(['updateRewardInStore']),
		editReward: function(reward) {
      this.reward = reward
      this.rewardCreator = true
    },
		deleteReward: async function() {
      this.loading = true
      this.delReward = { ...this.delReward, deleted: true }
      this.updateRewardInStore( this.delReward )
      await PostService.saveReward({ user: this.user.token, reward: this.delReward });
      this.loading = false
      this.confirmed = true
    },
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
	.treasure { width: 8rem; height: 8rem; padding: .5rem .5rem .5rem 1rem; display: flex; align-items: center; flex-shrink: 0; }
	> div:first-of-type { 
		align-items: center;
		width: 100%;
		p.title { padding: .5rem; font-size: 1.2rem; display: flex; justify-content: center; align-items: center; }
	}
	button {
	}
  .badgeEditControls { 
    display: flex; flex-direction: column; justify-content: center;
    button { display: block; cursor: pointer;
      width: auto; height: 2rem; border-radius: 0 0 .314rem .314rem;
      font-weight: 200; font-size: .9rem; margin: 0 0 1.5rem; border: none; 
      background: none; box-shadow: none; transition: transform .2s ease;
      &.edit { figure { filter: invert(36%) sepia(66%) saturate(7120%) hue-rotate(219deg) brightness(99%) contrast(97%); } }
			&.del { figure { filter: invert(36%) sepia(66%) saturate(7120%) hue-rotate(219deg) brightness(99%) contrast(97%); } }
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