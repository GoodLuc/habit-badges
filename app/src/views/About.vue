<template>
  <div class="container">
		<article class="page">
			<h1 class="text-center">About Habit Badge</h1>
			<h2 class="text-center">A journey of self improvement</h2>
			<section class="">
				<figure class="mb4 fw">
					<img src="@/assets/img/calendar.jpg" alt="">	
				</figure>
				<div>
					<h2>It started as a personal tracking system</h2>
					<p>Implementing new habits can be challenging, but having a tracking system makes you accountable to yourself. It's motivating to see your days filled with useful and life building activities, and whenever you slack-out for a while, you'll notice.</p>
					<p>I detailed this system on a post in my blog <a target="_blank" href="https://www.semillasdevida.com.ar/articulos/como-cambiar-tu-vida-mediante-la-implementacion-de-nuevos-habitos/">Semillas de Vida</a> (in spanish only, sorry.) </p>
				</div>
			</section>
			<section class="flex">
				<figure>
					<img src="@/assets/img/habitrpg.png" alt="">	
				</figure>
				<div>
					<h2>Inspired by HabitRPG, boy scouts and the concept of 'gamification'</h2>
					<p>There's an app called HabitRPG which lets turn your daily todo's into actions to level up your character and complete quests. I found this concept amazingly interesting, although it didn't match my system and I wanted something simpler, so I thought to make my own. Applying game mechanics to productivity and self-improvement is a golden concept. Boy scouts traditionally also make use of the concept of earned badges for proving your skills and knowledge.</p>
				</div>
			</section>
			<section class="flex">
				<figure>
					<img src="@/assets/img/badge.jpg" alt="">	
				</figure>
				<div>
					<h2>The meaning of a badge</h2>
					<p>A badge is a symbol of authority, something hard and solid earned through experience and responsibility. In Habit Badge you will start each badge at a 'morning grade' and will eventually level it up as you complete it more and more, being a testament to your identity and will, and motivating you to push forward.</p>
				</div>
			</section>
		</article>
    
  </div>
</template>

<script>
export default {
  name: 'About',
  mounted() {
    window.scrollTo(0, 0)
  }
}
</script>

<style scoped lang="scss">
@import "~@/scss/_page.scss";

</style>