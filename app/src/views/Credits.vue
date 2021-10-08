<template>
  <div class="container">
		<article class="page credits">
			<h1 class="text-center">Credits</h1>
			<section class="flex align-center">
				<figure class="mb4">
					<img src="@/assets/img/lucas.jpg" alt="Lucas Randazzo">
				</figure>
				<div>
					<h2>Idea, concept, UI Design and full-stack development</h2>
					<p>Lucas Randazzo</p>
					<p class="small">See my professional portfolio at <a target="_blank" href="https://skytree.live">Skytree.live</a> <br>
					Contact me at <a target="_blank" href="mailto:lucas@skytree.live">lucas@skytree.live</a></p>
				</div>
			</section>
			<section>
				<div>
					<h2 class="text-center">Searchable icons library provided by <a target="_blank" href="https://thenounproject.com/">The Noun Project</a>'s API</h2>
					<p class="text-center">Author attribution is displayed as tooltips when browsing them while you create a badge.</p>
				</div>
			</section>
			<section class="icons">
				<h2 class="mb8 text-center">Other icons:</h2>
				<div class="flex align-center">
					<figure><img src="@/assets/icons/treasure.png" alt=""></figure>
					<figcaption>
						'Treasure' Icons made by <a target="_blank" href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a target="_blank" href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
					</figcaption>
				</div>
				<div class="flex align-center">
					<figure><img src="@/assets/icons/ruby.png" alt=""></figure>
					<figcaption>
						'Ruby' Icon made by <a target="_blank" href="https://www.freepik.com" title="Freepik">Freepik</a> from <a target="_blank" href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
					</figcaption>
				</div>
				<div class="flex align-center">
					<figure><img src="@/assets/icons/sample_meditation.png" alt="meditation by Nithinan Tatah from the Noun Project"></figure>
					<figcaption>
						meditation by Nithinan Tatah from the Noun Project
					</figcaption>
				</div>
				<div class="flex align-center">
					<figure><img src="@/assets/icons/sample_muscle.png" alt="Muscle by Adrien Coquet from the Noun Project"></figure>
					<figcaption>
						Muscle by Adrien Coquet from the Noun Project
					</figcaption>
				</div>
				<div class="flex align-center">
					<figure><img src="@/assets/icons/sample_writing.png" alt=""></figure>
					<figcaption>
						Writing by Ninejipjip from the Noun Project
					</figcaption>
				</div>
				<div class="flex align-center">
					<figure><img src="@/assets/icons/archive.svg" alt="Archive by Heztasia from the Noun Project"></figure>
					<figcaption>
						Archive by Heztasia from the Noun Project
					</figcaption>
				</div>
				<div class="flex align-center">
					<figure><img src="@/assets/icons/edit.svg" alt=""></figure>
					<figcaption>
						Edit by Travis Avery from the Noun Project
					</figcaption>
				</div>
				<div class="flex align-center">
					<figure><img src="@/assets/icons/ideas.svg" alt=""></figure>
					<figcaption>
						Idea by Ilham Fitrotul Hayat from the Noun Project
					</figcaption>
				</div>
				<div class="flex align-center">
					<figure><img src="@/assets/icons/menu.svg" alt=""></figure>
					<figcaption>
						Menu by M Yudi Maulana from the Noun Project
					</figcaption>
				</div>
				<div class="flex align-center">
					<figure><img src="@/assets/icons/sample_check.png" alt=""></figure>
					<figcaption>
						Check by Icon Lauk from the Noun Project
					</figcaption>
				</div>
				<div class="flex align-center">
					<figure><img src="@/assets/icons/sample_wings.png" alt=""></figure>
					<figcaption>
						Wings by Afebaulia from the Noun Project
					</figcaption>
				</div>
				<div class="flex align-center">
					<figure><img src="@/assets/icons/sample_badge.png" alt=""></figure>
					<figcaption>
						Badge by dewadesign from the Noun Project
					</figcaption>
				</div>
				<div class="flex align-center">
					<figure><img src="@/assets/icons/sample_shield.png" alt=""></figure>
					<figcaption>
						Add shield by arjuazka from the Noun Project
					</figcaption>
				</div>
			</section>
		</article>
    
  </div>
</template>

<script>
export default {
  name: 'Credits',
  mounted() {
    window.scrollTo(0, 0)
  }
}
</script>

<style scoped lang="scss">
@import "~@/scss/_page.scss";

.page.credits {
	section.icons {
		width: 100%;
		max-width: 35rem;
		h2 { margin-bottom: 3rem; }
		figure { width: 5rem; flex-grow: 0; }
		> div { margin-bottom: 1.5rem; }
	}
}

</style>