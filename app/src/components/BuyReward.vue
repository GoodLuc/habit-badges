<template>
  <div :class="['overlay', { show: status}]" id="badgesSelector">
    <div>
      <div class="container medium mt4">
        <h1>Would you like to unlock this reward?</h1>

				<div class="balance">
					<p class="mr4">Your balance is </p>
					<div class="currency">
						<figure class="coins">
							<span>{{ user.points }}</span>
							<img src="@/assets/icons/coin.svg" alt="">
						</figure>
					</div>
				</div>
				
        <div v-if="loading" class="flex align-center column padyMed">
          <h2>Opening...</h2>
          <pulse-loader :loading="loading"></pulse-loader>
        </div>

				<article class="reward mb8" v-for="reward in user.rewards" :key="reward.id">
					<div class="flex justify-center align-bottom">
						<figure class="mr8"><img src="@/assets/icons/treasure_closed.png" alt="Reward"></figure>
						<figure class="mr8"><img src="@/assets/icons/treasure.png" alt="Reward"></figure>

						<div class="flex column align-center justify-center mb4">
							<h2 class="flex align-center">
								<div class="icon-content mr1">
									<figure><img src="@/assets/icons/ruby.png" alt="Rubys"></figure>
									<figcaption>{{ reward.value }}</figcaption>
								</div>
								{{ reward.name }}
							</h2>
							<button @click="unlockReward = reward; buyReward = true" class="button gold flex align-center">
								<span class="mr2">Unlock for </span>
								<div class="icon-content mb1">
									<figure><img src="@/assets/icons/coin.svg" alt="Coins"></figure>
									<figcaption>{{ reward.value * 100 }}</figcaption>
								</div>
							</button>
						</div>
					</div>
				</article>
        
        
      </div>
      <figure class="close" @click="$emit('close')"><img src="/assets/icons/close.svg" alt="Close"></figure>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  props: ['status', 'reward'],
	setup() {
		return {
		}
	},
  data() {
    return {
      loading: false,
      coincount: new Audio(require('../assets/audio/coincount.mp3')),
    }
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
  },
  components: { PulseLoader }
}
</script>
<style scoped lang="scss">

h1 { font-weight: 300; text-align: center; }

button {
	span { margin: .5rem auto; }
	&:active {
		position: relative;
		top: 2px;
	}
}

.balance {
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 2rem;
	background: white;
	border-radius: .314rem;
	padding: .5rem;
	width: 50%;
	box-shadow: 0px 4px 3px 0px #CFCFCF8A;
	margin: auto auto 2rem;
}

.currency {
	font-weight: 400;
	font-size: 1.2rem;
	span { margin-left: .5rem; color: green; }
}

.reward {
	> div > figure {
		width: 14rem;
		height: 11rem;
	}
	margin: auto;
	background: white;
	border-radius: .314rem;
	width: 50%;
	padding: 0rem .5rem 2rem;
	box-shadow: 0px 4px 3px 0px #CFCFCF8A;
}

</style>