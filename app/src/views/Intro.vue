<template>
  <div class="container">
		<article class="intro">
			<h1 class="text-center">Press Start for the adventure of life</h1>
			<h2 class="text-center">Gamify your habits</h2>
			<section class="flex">
				<figure>
					<img src="@/assets/img/step1.png" alt="">	
				</figure>
				<div>
					<h2>1. Create badges for habits you want to complete</h2>
					<p>Choose and icon, a frame and asign a value. <br>
					Each time you complete a habit you will earn coins.</p>
				</div>
			</section>
			<section class="flex">
				<figure>
					<img src="@/assets/img/step2.png" alt="">	
				</figure>
				<div>
					<h2>2. Check-in every day and track your progress</h2>
					<p>Start leveling up in life by completing habits and
					seeing how far you’ve come.</p>
				</div>
			</section>
			<section class="flex">
				<figure>
					<img src="@/assets/img/step3.png" alt="">	
				</figure>
				<div>
					<h2>3. Optionally, create rewards to motivate yourself</h2>
					<p>Decide how you will reward yourself for being consistent. 
						How much should it cost you to unlock each reward?</p>
				</div>
			</section>
			<p class="text-center">
				<button v-if="!user" type="button" class="button medium" @click="$router.push('/login?register')">Start</button>
				<button v-else type="button" class="button medium" @click="$router.push('/')">Start</button>
			</p>
		</article>
    
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
    }
  },
  methods: {
  },
	computed: {
    ...mapState(["user","centerLogo"]),
  },
  mounted() { this.$store.dispatch("centerLogo", true) },
  beforeUnmount() { this.$store.dispatch("centerLogo", false) }
}
</script>

<style scoped lang="scss">
h1, p { margin-bottom: 2rem; width: 100%; }
.selector, .created {
	margin-top: 4rem;
  button { margin: 1rem; max-width: 25rem; }
	p { text-align: center; }
}
small { color: orange; }

button[disabled=disabled] { background: $ellis; }


.intro {
	> h1 { font-size: 3.429rem; font-weight: 400; margin-top: 6rem; }
	> h2 { font-size: 2.571rem; font-weight: 400; }
	section {
		max-width: 950px;
		margin: auto;
		margin-bottom: 2rem;
		padding: 1.5rem;
		figure {
			border-radius: 1rem; overflow: hidden;
			width: auto; flex-shrink: 0; margin-right: 2rem;
		}
		> div {
			h2 { margin: 0 0 .7rem 0; font-weight: 600; font-size: 1.714rem; } 
			p { font-size: 1.714rem; font-weight: 300; line-height: 2.5rem; max-width: 60rem; margin: 0; }
			display: flex; flex-direction: column; justify-content: center;
			padding: 1rem;
		}
	}
	@media (max-width: 700px) {
		> h1 { font-size: 2.5rem; } 
		> h2 { font-size: 2rem; }
		section {
			flex-direction: column; align-items: center;
			text-align: center;
			> div h2 { font-size: 1.5rem; }
			> div p { font-size: 1.2rem; }
		}
	}
}

</style>