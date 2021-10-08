<template>
  <div class="container">
		<article class="page">
			<h1 class="text-center">Press Start for the adventure of life</h1>
			<h2 class="text-center">Gamify your habits</h2>
			<section class="flex align-center">
				<figure>
					<img src="@/assets/img/step1.png" alt="">	
				</figure>
				<div>
					<h2>1. Create badges for habits you want to complete</h2>
					<p>Choose and icon, a frame and asign a value. <br>
					Each time you complete a habit you will earn coins.</p>
				</div>
			</section>
			<section class="flex align-center">
				<figure>
					<img src="@/assets/img/step2.png" alt="">	
				</figure>
				<div>
					<h2>2. Check-in every day and track your progress</h2>
					<p>Start leveling up in life by completing habits and
					seeing how far you’ve come.</p>
				</div>
			</section>
			<section class="flex align-center">
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
	computed: {
    ...mapState(["user","centerLogo"]),
  },
  mounted() { this.$store.dispatch("centerLogo", true); window.scrollTo(0, 0); },
  beforeUnmount() { this.$store.dispatch("centerLogo", false) }
}
</script>

<style scoped lang="scss">
@import "~@/scss/_page.scss";

</style>