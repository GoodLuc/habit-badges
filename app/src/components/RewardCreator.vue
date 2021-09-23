<template>
  <div :class="['overlay', { show: status}]" ref="modal" id="badgesCreator" tabindex="0" @keydown.esc="$emit('close')">
    <div>
      <div class="container container-medium">
        <div class="flex fw">
          <div class="tabs">
            <nav class="flex">
              <button :class="[{ current: slide == 0 }]" role="tab" @click="gotoSlide(0)">Reward name</button>
              <button :class="[{ current: slide == 1 }]" role="tab" @click="gotoSlide(1)">Cost</button>
              <button :class="[{ current: slide == 2 }]" role="tab" @click="gotoSlide(2)">Recurrence</button>
            </nav>
            <div class="slide" v-if="slide == 0">
                <h1>Describe your reward</h1>
                <p v-if="warn" class="warn">Please enter the name of your reward</p>
                <p class="input-button"><input @keyup.enter="selectIcon" v-model="rewardName" type="text" placeholder="Ex. Ice cream / New clothes"></p>
            </div>
            <div class="slide" v-if="slide == 1">
              <h1>Assign a cost</h1>
              <p class="mb4">Define how much should this cost you in habit currency</p>

              <div class="flex align-center justify-left">
                <div class="slidecontainer">
                  <input type="range" min="1" max="20" v-model="rubys" class="slider" id="myRange">
                </div>
                <div class="icon-content"> 
                  <figure><img src="@/assets/icons/ruby.png" alt="Rubys"></figure>
                  <figcaption>{{ rubys }}</figcaption>
                </div>
              </div>

							<div class="flex align-center">
								<div class="icon-content"> 
                  <figure><img src="@/assets/icons/ruby.png" alt="Rubys"></figure>
                  <figcaption>1</figcaption>
                </div>
								<span class="title3">&nbsp; = &nbsp;</span>
								<div class="icon-content"> 
                  <figure><img src="@/assets/icons/coin.svg" alt="Coins"></figure>
                  <figcaption>100</figcaption>
                </div>
							</div>

            </div>
            <div class="slide" v-if="slide == 2">
              <h1>Recurrence</h1>
              <p class="mb4">Is this a one time reward only or can it be recurring?</p>
              <div class="flex align-center">
								<span>One time</span>
								<w-switch class="ma2" :value="true" color="pink"></w-switch>
								<span>Recurring</span>
							</div>
            </div>
          </div>
          <div class="badgeHolder">
            <div>
              <div>
                <div>
                  <figure>
                    <div class="frame"><img src="@/assets/icons/treasure.png" alt="Reward"></div>
                  </figure>
                  <figcaption>{{ rewardName }}</figcaption>
                </div>
                <pulse-loader :loading="loading"></pulse-loader>
                <p v-if="slide <= 3"><button class="button" @click="nextSlide">Next</button></p>
                <p v-if="slide == 4"><button :disabled="loading" type="button" @click="saveReward">Save</button></p>
              </div>
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
    reward: {
      type: Object
    }
  },
  data() {
    return {
      nextButton: 'Next',
      rewardEdit: false,
      rewardName: '',
      warn: false,
      warn2: false,
      loading: false,
      slide: 0,
      rubys: 5,
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
      this.iconTerm = this.habitName
      this.getIcons(this.iconTerm)
      this.iconTerm = ''
      this.gotoSlide(1)
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
        if (Object.keys(this.$props.reward).length) {
          // If this is the edition of a previously existing habit, update instead of saving as new.
          console.log("Updating")
          let habit = { _id: this.$props.reward._id, icon: this.selectedIcon.id, name: this.habitName, frame: this.selectedFrameIndex, image: imgAsDataURL, material: this.material, value: this.coins }
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
    if (Object.keys(this.$props.reward).length) {
      this.habitName = this.$props.reward.name
      this.selectedFrameIndex = this.$props.reward.frame
      this.iconSrc = this.$props.reward.image
      this.badgeFrame = '/assets/badges/frame/frame'+this.selectedFrameIndex+'.svg'
      this.material = this.$props.reward.material
      this.coins = this.$props.reward.value
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
    h1 { margin: 0; }
  }
}

.badgeHolder > div {
  margin-left: auto; padding-top: 5rem; position: relative;
  width: 12rem; height: 16rem; display: block;
  > div {
    position: fixed; width: 12rem;
    button { width: 100%; }
  }
}

.badge {
  cursor: pointer; margin-right: 0; width: auto; height: auto;
}

.materials {
  padding-top: 3rem;
  .badge { 
    margin-right: 20px; min-width: 5rem; min-height: 5rem;  
  }
}

input { width: 40rem; max-width: 80%; background: $shine3; }

.input-button { 
  display: flex; 
  input[type=text] { border-radius: .314rem; }
  button { width: auto; }
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

.slidecontainer { width: calc(100% - 10rem); max-width: 35rem; margin-right: 1rem; input { max-width: 100%; } }
.slider { -webkit-appearance: none; appearance: none; width: 100%;
  height: 25px; background: #d3d3d3; outline: none; opacity: 0.7;
  -webkit-transition: .2s; transition: opacity .2s; margin: 0;
}
.slider:hover { opacity: 1; }
.slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none;
  width: 25px; height: 25px; background: #4CAF50; cursor: pointer;
}
.slider::-moz-range-thumb { width: 25px; height: 25px; background: #4CAF50; cursor: pointer; }

</style>