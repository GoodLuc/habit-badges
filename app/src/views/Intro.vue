<template>
  <div class="container">
		<article class="intro">
			<h1 class="center">Press Start for the adventure of life!</h1>
			<h2 class="center">Start gamifiyng your habits</h2>
			<section class="flex">
				<figure>
					<img src="@/assets/img/step1.png" alt="">	
				</figure>
				<div>
					<h2>1. Create badges</h2>
					<p>for the habits you want to complete on a regular basis. You can customize the icon, the frame and the material color. You will also assign it a value from 1 to 10 coins.</p>
				</div>
			</section>
			<section class="flex">
				<figure>
					<img src="@/assets/img/step2.png" alt="">	
				</figure>
				<div>
					<h2>2. Check-in daily</h2>
					<p>to start tracking your progress, earning coins and leveling up yourself and your badges. See how far you've come.</p>
				</div>
			</section>
			<section class="flex">
				<figure>
					<img src="@/assets/img/step3.png" alt="">	
				</figure>
				<div>
					<h2>3. Set your own rewards</h2>
					<p>Decide how you will reward yourself and how much it will cost you in self-improvement currency. Coins will also be needed to create new badges, and can also get you multipliers and bonuses.</p>
				</div>
			</section>
		</article>
    <div class="selector">
      <h2 class="center">Register or login to start logging your habits</h2>
      <div class="flex wrap justify-center">
				<button type="button" class="button" @click="$router.push('/login?register')">Register</button>
				<button type="button" class="button" @click="$router.push('/login')">Login</button>
			</div>
      <p><small>v0.5b</small></p>
    </div>
    
  </div>
</template>

<script>

export default {
  data() {
    return {
    }
  },
  methods: {
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

.intro section {
	margin-bottom: 2rem;
	background: #FFF8ED;
	padding: 1.5rem;
	figure {
		border-radius: 1rem; overflow: hidden;
		width: 20rem; flex-shrink: 0; margin-right: 2rem;
	}
	> div {
		h2 { margin: 0; font-weight: 600; } p { margin-bottom: 0; line-height: 1.9rem; }
		display: flex; flex-direction: column; justify-content: center;
		padding: 1rem;
	}
	&:nth-of-type(2) { flex-direction: row-reverse; figure { margin: 0 0 0 2rem; } }
}

</style>