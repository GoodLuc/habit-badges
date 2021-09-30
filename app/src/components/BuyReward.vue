<template>
  <div :class="['overlay', { show: status}]" id="badgesSelector">
    <div>
      <div class="container medium mt4">
        <h1>Would you like to unlock this reward?</h1>

				<div class="balance">
					<p class="mr4">Your balance is </p>
					<div class="currency">
						<figure class="coins">
							<span>{{ user.points - user.tab }}</span>
							<img src="@/assets/icons/coin.svg" alt="">
						</figure>
					</div>
				</div>
				
        <div v-if="loading" class="flex align-center column padyMed">
          <h2>Opening...</h2>
          <pulse-loader :loading="loading"></pulse-loader>
        </div>

				<article class="reward tremble mb8" v-if="!loading">
					<div class="flex justify-center align-bottom">
						<figure class="glow mr8" :class="{ 'hide': unlocked }">
							<svg width="284" height="231" viewBox="0 0 284 231" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M265.045 230.139H18.9547C13.7914 230.15 9.50552 226.15 9.16101 220.995L0 83.2422L146.897 68.5516L284 83.2422L274.815 220.995C274.471 226.139 270.2 230.137 265.045 230.139Z" fill="#F29C1F"/>
							<path d="M252.27 117.86L250.654 142H33.3462L31.7298 117.86C31.6345 116.504 32.109 115.167 33.0364 114.175C33.9659 113.18 35.266 112.617 36.6267 112.621H247.373C248.734 112.617 250.034 113.18 250.964 114.175C251.891 115.167 252.365 116.504 252.27 117.86Z" fill="#AF8066"/>
							<path d="M250.654 142L248.695 171.379L247.031 196.206C246.851 198.775 244.71 200.764 242.134 200.758H41.8659C39.2896 200.764 37.1489 198.775 36.9691 196.206L35.305 171.379L33.3463 142L142 132.206L250.654 142Z" fill="#AF8066"/>
							<path d="M250.654 142L248.695 171.379H35.305L33.3463 142H250.654Z" fill="#805333"/>
							<path d="M112.621 78.3453H171.379V122.415C171.379 138.639 158.227 151.794 142 151.794C125.773 151.794 112.621 138.639 112.621 122.415V78.3453Z" fill="#F0C419"/>
							<path d="M151.794 112.621C151.794 118.029 147.408 122.415 142 122.415C136.592 122.415 132.206 118.029 132.206 112.621C132.206 107.213 136.592 102.828 142 102.828C147.408 102.828 151.794 107.213 151.794 112.621Z" fill="#2C2F38"/>
							<path d="M142 137.103C139.296 137.103 137.103 134.911 137.103 132.206V122.415C137.103 119.711 139.296 117.518 142 117.518C144.704 117.518 146.897 119.711 146.897 122.415V132.206C146.897 134.911 144.704 137.103 142 137.103Z" fill="#2C2F38"/>
							<path d="M83.2421 0.000254058C65.8106 0.000254058 59.7373 7.54054 48.9663 19.5877C41.7186 27.6653 45.9307 37.7537 44.0695 48.9666C43.53 52.1495 34.2758 55.43 34.2758 58.7581L24.4821 83.2424H9.91702e-06V53.8634C-0.00865708 39.5759 5.66389 25.8712 15.7674 15.7677C25.871 5.66413 39.5757 -0.00841293 53.861 0.000254058H83.2421Z" fill="#F0C419"/>
							<path d="M284 53.8633V83.2423H259.518L249.724 58.758C249.724 55.4299 245.367 52.1494 244.827 48.9665C242.966 37.7535 242.281 27.6652 235.034 19.5875C224.263 7.54042 218.189 0.000131987 200.758 0.000131987H230.139C244.427 -0.008535 258.129 5.66401 268.233 15.7676C278.336 25.8711 284.009 39.5758 284 53.8633V53.8633Z" fill="#F0C419"/>
							<path d="M259.518 58.758V83.2422H24.4821V58.758C24.4864 55.4775 24.7638 52.2014 25.3141 48.9664L142 34.2759L258.686 48.9664C259.236 52.2014 259.514 55.4775 259.518 58.758Z" fill="#805333"/>
							<path d="M244.583 19.5875L142 24.4822L39.4175 19.5875C50.5546 7.09621 66.5062 -0.0323906 83.2421 0.000110653H200.758C217.494 -0.0323906 233.445 7.09621 244.583 19.5875Z" fill="#805333"/>
							<path d="M258.686 48.9665H25.3141C27.119 38.0287 32.0115 27.8342 39.4175 19.5875H244.583C251.988 27.8342 256.881 38.0287 258.686 48.9665V48.9665Z" fill="#AF8066"/>
							</svg>
						</figure>
						<figure class="mr8" :class="{ 'hide': !unlocked, 'show': unlocked }"><img src="@/assets/icons/treasure.png" alt="Reward"></figure>

						<div class="flex column align-center justify-center">
							<h2 class="flex align-center">
								<div class="icon-content mr1">
									<figure><img src="@/assets/icons/ruby.png" alt="Rubys"></figure>
									<figcaption>{{ reward.value }}</figcaption>
								</div>
								{{ reward.name }}
							</h2>
							<button v-if="!unlocked" @click="unlock" class="button gold flex align-center">
								<span class="mr2">Unlock for </span>
								<div class="icon-content mb1">
									<figure><img src="@/assets/icons/coin.svg" alt="Coins"></figure>
									<figcaption>{{ reward.value * 100 }}</figcaption>
								</div>
							</button>
							<div v-else class="text-center"><h3>You did it!</h3><p>Go for it! Enjoy your reward</p></div>
						</div>
					</div>
				</article>
        
        
      </div>
      <figure class="close" @click="$emit('close')"><img src="/assets/icons/close.svg" alt="Close"></figure>
    </div>
		<canvas ref="myCanvas"></canvas>
  </div>
</template>
<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import confetti from "@/components/canvas-confetti.js";
import PostService from '../PostService'


export default {
  props: ['status', 'reward'],
	setup(props) {
		const store = useStore()
		let unlocked = ref(false)		
		let success = new Audio(require('@/assets/audio/heavencraft.wav'))
		let loading = ref(false)

		const saveReward = async function() {
			var user = JSON.parse(localStorage.getItem("user"))
			console.log("Updating")
			let reward = { _id: props.reward._id, name: props.reward.name, value: props.reward.value, recurring: props.reward.recurring, completed: true }
			await PostService.saveReward({ user: user.token, reward: reward });
			store.commit('updateRewardInStore', reward )
    }

		const unlock = async () => {
			loading.value = true
			await saveReward()
			await PostService.chargeTab({ user: store.state.user._id, charge: store.state.user.tab+(props.reward.value*100) })
			confetti();
			store.commit('updateTab', store.state.user.tab+(props.reward.value*100))
			loading.value = false
			unlocked.value = true
			success.cloneNode(true).play()
		}

		return {
			user: computed(() => store.state.user),
			unlock,
			unlocked,
			loading
		}
	},

  components: { PulseLoader }
}
</script>
<style scoped lang="scss">
@import "~@/scss/animate.css";


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
		svg { max-width: 100%; max-height: 100%; }
	}
	h2 { margin-top: 0; }
	margin: auto;
	border-radius: .314rem;
	width: 50%;
	padding: 2rem;
}

.glow {
  animation: glow 1s infinite alternate;
}

.tremble:hover svg {
  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
	animation-iteration-count: infinite;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}


.show {
	animation: bounceIn 1s;
}
.hide {
	animation: fadeOut 1s;
}



</style>