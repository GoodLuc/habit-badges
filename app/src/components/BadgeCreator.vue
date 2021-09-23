<template>
  <div :class="['overlay', { show: status }]" ref="modal" id="badgesCreator" tabindex="0" @keydown.esc="$emit('close')">
    <div>
      <div class="container container-medium">
        <div class="flex fw">
          <div class="badgeHolder">
            <div>
              <div>
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
              </div>
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
							<p><button class="button button-medium" @click="nextSlide">Next</button></p>
            </div>

            <div class="slide" v-if="slide == 1">
              <h1>Choose an icon</h1>
              <p class="input-button"><input @keyup.enter="getIcons(iconTerm)" v-model="iconTerm" type="text" placeholder="Or enter term to search for another icon..."><button class="button" @click="getIcons(iconTerm)">Search</button></p>
              <pulse-loader :loading="loading"></pulse-loader>
              <div v-if="icons.length" class="box icons flex wrap">
                <figure :class="[{ selected: icon.id == selectedIcon.id }]"
                  v-for="icon in icons" :key="icon.id" @click="setIcon(icon)">
                  <img :src="icon.preview_url" :alt="icon.attribution" crossorigin="anonymous">
                </figure>
              </div>

							<p v-if="slide <= 3"><button class="button" @click="nextSlide">Next</button></p>
              <div v-else>
                <p v-if="!loading">No icons found under '{{ iconSearchTerm }}.' Please enter another search term. <br>
                Tip: Try a simple noun like "exercise" or "music".</p>
              </div>
            </div>
            <div class="slide" v-if="slide == 2">
              <h1>Choose a badge frame</h1>
              <div class="box frames flex wrap">
                <figure :class="[{ selected: index == selectedFrameIndex }]" 
                  v-for="index in 20" :key="index" @click="setFrame(index)">
                  <img :src="'/assets/badges/frame/frame'+index+'.svg'">
                </figure>
              </div>
              <p v-if="slide <= 3"><button class="button" @click="nextSlide">Next</button></p>
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
							<p><button :disabled="loading" class="button" @click="saveBadge">Save</button></p>
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
      material: 'silver',
      coins: 5,
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
				this.iconTerm = ''
				this.gotoSlide(1)
			}
    },
    gotoSlide: function(nr) {
      this.slide = nr
    },
    nextSlide: function() {
      if (this.slide == 0) { 
        this.selectIcon() 
      } else {
        this.slide++
      }
      this.warn = false
    },
    setIcon: function(icon) {
      this.selectedIcon = icon
      this.iconSrc = icon.preview_url
    },
    setFrame: function(index) {
      this.badgeFrame = '/assets/badges/frame/frame'+index+'.svg'
      this.selectedFrameIndex = index
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
          let habit = { _id: this.$props.habit._id, icon: this.selectedIcon.id, name: this.habitName, frame: this.selectedFrameIndex, image: imgAsDataURL, material: this.material, value: this.coins }
          await PostService.saveBadge({ user: user.token, habit: habit });
          this.updateBadgeInStore( habit )
        } else {
          console.log("Saving as new")
          var uniqueId = Math.floor(Date.now() / 1000);
          let habit = { _id: uniqueId, icon: this.selectedIcon.id, name: this.habitName, frame: this.selectedFrameIndex, image: imgAsDataURL, material: this.material, value: this.coins }
          await PostService.saveBadge({ user: user.token, habit: habit });
          this.saveBadgeToStore(habit)
        }
        this.$emit('close')
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
      this.material = this.$props.habit.material
      this.coins = this.$props.habit.value
    }
  }
}
</script>
<style scoped lang="scss">

.slide {
  background: white; width: 100%; padding: 2rem; border-radius: 0 .314rem .314rem .314rem;
  h1 { padding-bottom: 1.5rem; }
}

.tabs { 
  width: 100%; flex-grow: 1; margin-right: 2rem; margin-top: 1rem;
  nav { 
    button {
      border: none; 
      background: linear-gradient(180deg, rgba(255,255,255,1) 62%, rgba(217,217,217,.5) 100%);
      font-size: 1.6rem; border-radius: .314rem .314rem 0 0;
      padding: 1rem; margin-right: .5rem; color: inherit; font-weight: 200; margin: 0 .5rem 0 0; box-shadow: none;
      &:last-of-type { margin: 0 }
      &.current { background: white; }
      &:hover { background: $azure; color: white; }
    }
  }
  .slide {
    box-sizing: border-box;
		input { text-align: center; }
    h1 { margin: 0; text-align: center; font-weight: 300; }
		p { margin-left: auto; margin-right: auto; text-align: center; }
  }
}

.badgeHolder > div {
  margin-right: 2rem; padding-top: 1rem; position: relative;
  width: 12rem; height: 17rem; display: block;
  > div {
    position: fixed; width: 12rem;
    button { width: 100%; margin-top: 2rem; }
  }
}


input { width: 40rem; max-width: 80%; background: $shine3; }

.input-button { 
  display: flex; 
  input[type=text] { border-radius: .314rem; }
  button { width: auto; height: 3.2rem; margin-left: 1rem; padding: 1rem; }
}

.icons, .frames, .materials {
  border-radius: .314rem; margin-top: 2rem;
  figure {
    padding: 1.2rem; box-sizing: border-box; border-radius: .314rem;
    margin-right: 1rem; width: 8rem;
    &:hover, &.selected {
      background: $azure; cursor: pointer;
      img { filter: invert(1) }
    }
  }
  img { filter: invert(0)}
}

.slider { -webkit-appearance: none; appearance: none; width: 100%;
  height: 25px; background: #d3d3d3; outline: none; opacity: 0.7;
  -webkit-transition: .2s; transition: opacity .2s; margin: 0;
	width: calc(100% - 10rem); max-width: 35rem; margin: auto; 
}
.slider:hover { opacity: 1; }
.slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none;
  width: 25px; height: 25px; background: #4CAF50; cursor: pointer;
}
.slider::-moz-range-thumb { width: 25px; height: 25px; background: #4CAF50; cursor: pointer; }

</style>