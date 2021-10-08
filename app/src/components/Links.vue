<template>
  <div class="links">
		<router-link to="/intro">Intro</router-link> • <router-link to="/about">About</router-link> • <router-link to="/credits">Credits</router-link> • <router-link to="/support">Support this app</router-link> • <a href="mailto:lucas@skytree.live?subject=Habit Hero Badge App">Report bug or request feature</a>
	</div>
</template>

<script>
export default {
  name: 'Links'
}
</script>

<style scoped lang="scss">
.links {
	width: 100%;
	text-align: center;
	padding: 2rem;
	font-size: 1.2rem;
	margin-top: auto;
}
</style>