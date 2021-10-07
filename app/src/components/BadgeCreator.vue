<template>
  <div :class="['overlay', { show: status }]" ref="modal" id="badgesCreator" tabindex="0" @keydown.esc="$emit('close')">
    <div>
      <div class="container medium">
        <div class="flex fw">
          <div class="badgeHolder first">
            <div class="mt8">
							<div class="badge grade1">
								<figure>
									<div class="frame"><img :src="badgeFrame" :alt="habitName"></div>
									<div class="icon"><img crossOrigin="anonymous" ref="badgeIcon" id="badgeIcon" :src="iconSrc" :alt="habitName"></div>
								</figure>
								<figcaption>{{ habitName }}</figcaption>
								<div class="icon-content mta"> 
									<figure><img src="@/assets/icons/coin.svg" alt="Coins"></figure>
									<figcaption>{{ coins }}</figcaption>
								</div>
							</div>
							<p v-if="slide == 1 || slide == 2"><button class="button medium pulse" @click="nextSlide">Next</button></p>


            </div>
          </div>

          <div class="tabs">
            <nav class="flex">
              <button :class="[{ current: slide == 0 }]" role="tab" @click="gotoSlide(0)">Habit name</button>
              <button :class="[{ current: slide == 1 }]" role="tab" @click="gotoSlide(1)">Icon</button>
              <button :class="[{ current: slide == 2 }]" role="tab" @click="gotoSlide(2)">Frame</button>
              <button :class="[{ current: slide == 3 }]" role="tab" @click="gotoSlide(3)">Value</button>
            </nav>

            <div class="slide" v-if="slide == 0">
							<h1>Describe your habit</h1>
							<p v-if="warn" class="warn">Please enter the name of your habit</p>
							<p><input @keyup.enter="selectIcon" v-model="habitName" type="text" placeholder="Ex. Work out"></p>
							<p><button class="button medium" @click="nextSlide">Next</button></p>
							
							<div class="ideas flex column align-center">
								<div class="flex column align-center" @click="ideas = !ideas">
									<figure><img src="@/assets/icons/ideas.svg" alt="See ideas"></figure>
									<figcaption>See ideas</figcaption>
								</div>
								<ul v-if="ideas">
									<li>Running</li>
									<li>Skating</li>
									<li>Drawing</li>
									<li>Writing</li>
									<li>Cleaning the house</li>
									<li>Practicing an instrument</li>
									<li>Diet</li>
									<li>Taking pictures</li>
									<li>Working on a new project</li>
									<li>Doing something new</li>
								</ul>
							</div>
            </div>

            <div class="slide" v-if="slide == 1">
              <h1>Choose an icon</h1>
							<p class="text-center">Or type a different term for your icon search. After selecting, click 'Next.'</p>
              <p class="input-button"><input @keyup.enter="getIcons(iconTerm)" v-model="iconTerm" type="text" placeholder="Search term"><button class="button" @click="getIcons(iconTerm)">Search</button></p>
              <div class="text-center">
								<pulse-loader :loading="loading"></pulse-loader>
							</div>
              <div v-if="icons.length" class="box icons grid">
                <figure :class="[{ selected: icon.id == selectedIcon.id }]"
                  v-for="icon in icons" :key="icon.id" @click="setIcon(icon)">
                  <img :src="icon.preview_url" :alt="icon.attribution" crossorigin="anonymous">
                </figure>
              </div>

              <div v-else>
                <p v-if="!loading">No icons found under '{{ iconSearchTerm }}.' Please enter another search term. <br>
                Tip: Try a simple noun like "exercise" or "music".</p>
              </div>

							<p ref="iconNext" class="iconNext"><button class="button medium pulse" @click="nextSlide">Next</button></p>

            </div>

            <div class="slide" v-if="slide == 2">
              <h1>Choose a badge frame</h1>
              <div class="box frames flex wrap">
                <figure :class="[{ selected: index == selectedFrameIndex }]" 
                  v-for="index in 20" :key="index" @click="setFrame(index)">
                  <img :src="'/assets/badges/frame/frame'+index+'.svg'">
                </figure>
              </div>
							<p ref="frameNext" class="frameNext"><button class="button medium pulse" @click="nextSlide">Next</button></p>
            </div>

            <div class="slide" v-if="slide == 3">
              <h1>Assign a value</h1>
              <p>Define how valuable is completing this habit</p>
              <div class="flex column align-center slidecontainer">
								<input type="range" min="1" max="12" v-model="coins" class="slider" id="myRange">
								<div class="icon-content mt4"> 
									<figure><img src="/assets/icons/coin.svg" alt="Coins"></figure>
									<figcaption>{{ coins }}</figcaption>
								</div>
              </div>
							<div v-if="loading" class="flex align-center column padyMed">
								<h2>Saving...</h2>
								<pulse-loader :loading="loading"></pulse-loader>
							</div>
							<p><button :disabled="loading" class="button medium" @click="saveBadge">Save</button></p>
            </div>

						<div class="slide" v-if="slide == 4">
							<h1>Habit Badge Saved!</h1>
							<p>Go to your <router-link to="/" class="link">Dashboard</router-link> to check-in!</p>
						</div>
						
          </div>
        </div>
        
      </div>
      <figure class="close" @click="$emit('close')"><img src="/assets/icons/close.svg" alt="Close"></figure>
    </div>
  </div>
</template>

<script>

import PostService from '../PostService'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { mapMutations } from "vuex";

export default {
  name: 'BadgeCreator',
  props: {
    status: {
      type: Boolean,
      default: false
    },
    habit: {
      type: Object
    }
  },
  data() {
    return {
      nextButton: 'Next',
      habitEdit: false,
      habitName: '',
      iconTerm: '',
      iconSearchTerm: '',
      warn: false,
      warn2: false,
      loading: false,
      icons: {},
      selectedIconIndex: '',
      selectedFrameIndex: 1,
      slide: 0,
      selectedIcon: {},
      iconSrc: '/assets/badges/default/default.svg',
      badgeFrame: '/assets/badges/frame/frame1.svg',
      coins: 5,
			count: 0,
			ideas: false
    }
  },
  methods: {
    ...mapMutations(['saveBadgeToStore','updateBadgeInStore']),
    // Search for icons using The Noun Project API
    getIcons: async function(term) {
      this.loading = true
      this.icons = {}
      this.warn = false
      this.warn2 = false
      try {
        var icons = await PostService.getIcons(term)
        this.icons = icons.data
        this.loading = false
        this.iconSearchTerm = term
      } catch {
        this.loading = false
        this.warn2 = true
      }
    },
    selectIcon() {
			if (this.habitName == '') {
				this.warn = true
			} else {
				this.iconTerm = this.habitName
				this.getIcons(this.iconTerm)
				//this.iconTerm = ''
				this.gotoSlide(1)
			}
    },
    gotoSlide: function(nr) {
      this.slide = nr
    },
    nextSlide: function() {
      if (this.slide == 0) { 
      	this.warn = false
        this.selectIcon() 
      } else {
        this.slide++
      	this.warn = false
      }
    },
    setIcon: function(icon) {
      this.selectedIcon = icon
      this.iconSrc = icon.preview_url
			this.$refs.iconNext.scrollIntoView({behavior: "smooth"});
    },
    setFrame: function(index) {
      this.badgeFrame = '/assets/badges/frame/frame'+index+'.svg'
      this.selectedFrameIndex = index
			this.$refs.frameNext.scrollIntoView({behavior: "smooth"});
    },
    saveBadge: async function() {
      this.loading = true
      if (this.habitName == '') {
        this.slide = 0
        this.warn = true
      } else {
        // This saves the selected icon PNG image as a base64 string to embed in the DB
        var user = JSON.parse(localStorage.getItem("user"))
        var badgeIcon = this.$refs.badgeIcon;
        var imgCanvas = document.createElement("canvas"), imgContext = imgCanvas.getContext("2d");
        imgCanvas.width = badgeIcon.width; imgCanvas.height = badgeIcon.height;
        imgContext.drawImage(badgeIcon, 0, 0, badgeIcon.width, badgeIcon.height);
        var imgAsDataURL = imgCanvas.toDataURL("image/png");
        if (Object.keys(this.$props.habit).length) {
          // If this is the edition of a previously existing habit, update instead of saving as new.
          console.log("Updating")
          let habit = { _id: this.$props.habit._id, icon: this.selectedIcon.id, name: this.habitName, frame: this.selectedFrameIndex, image: imgAsDataURL, value: this.coins, count: this.count }
          await PostService.saveBadge({ user: user.token, habit: habit });
          this.updateBadgeInStore( habit )
        } else {
          console.log("Saving as new")
          var uniqueId = Math.floor(Date.now() / 1000);
          let habit = { _id: uniqueId, icon: this.selectedIcon.id, name: this.habitName, frame: this.selectedFrameIndex, image: imgAsDataURL, value: this.coins, count: this.count }
          await PostService.saveBadge({ user: user.token, habit: habit });
          this.saveBadgeToStore(habit)
        }
        //this.$emit('close')
				this.slide = 4
      }
    },
  },
  components: { PulseLoader },
  mounted() {
    this.$refs.modal.focus()
    // Check if this is an edition of an existing habit as set by the props.
    if (Object.keys(this.$props.habit).length) {
      this.habitName = this.$props.habit.name
      this.selectedFrameIndex = this.$props.habit.frame
      this.iconSrc = this.$props.habit.image
      this.badgeFrame = '/assets/badges/frame/frame'+this.selectedFrameIndex+'.svg'
      this.coins = this.$props.habit.value
			this.count = this.$props.habit.count
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/scss/_badge-maker.scss";
@import "~@/scss/animate.css";

.iconNext, .frameNext { display: none; }

.pulse {
	animation: pulse 2s infinite;
}


</style>