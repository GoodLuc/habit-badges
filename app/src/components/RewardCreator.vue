<template>
  <div :class="['overlay', { show: status}]" ref="modal" id="badgesCreator" tabindex="0" @keydown.esc="$emit('close')">
    <div>
      <div class="container medium">

        <div class="flex fw">

          <div class="rewardHolder">
						<div class="mt8 grade1">
							<figure><div class="frame"><img src="@/assets/icons/treasure.png" alt="Reward"></div></figure>
							<p class="text-center">{{ rewardName }}</p>
							<div class="icon-content mt4"> 
								<figure><img src="@/assets/icons/ruby.png" alt="Rubys"></figure>
								<figcaption>{{ rubys }}</figcaption>
							</div>
						</div>
          </div>

          <div class="tabs">
            <nav class="flex">
              <button :class="[{ current: slide == 0 }]" role="tab" @click="gotoSlide(0)">Reward name</button>
              <button :class="[{ current: slide == 1 }]" role="tab" @click="gotoSlide(1)">Cost</button>
              <button :class="[{ current: slide == 2 }]" role="tab" @click="gotoSlide(2)">Recurrence</button>
            </nav>

            <div class="slide" v-if="slide == 0">
                <h1>Describe your reward</h1>
                <p v-if="warn" class="warn">Please enter the name of your reward</p>
                <p><input class="mxa" @keyup.enter="selectIcon" v-model="rewardName" type="text" placeholder="Ex. Ice cream / New clothes"></p>
								<p><button class="button medium" @click="nextSlide">Next</button></p>
            </div>

            <div class="slide" v-if="slide == 1">
              <h1>Assign a cost</h1>
              <p class="mb4">Define how much should this cost you in habit currency</p>
							<div class="flex column align-center slidecontainer">
								<input type="range" min="1" max="20" v-model="rubys" class="slider" id="myRange">
								<div class="icon-content mt4"> 
									<figure><img src="@/assets/icons/ruby.png" alt="Rubys"></figure>
                  <figcaption>{{ rubys }}</figcaption>
								</div>
              </div>

							<div class="flex align-center justify-center my8">
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

							<p><button class="button medium" @click="nextSlide">Next</button></p>
            </div>

            <div class="slide" v-if="slide == 2">
              <h1>Recurrence</h1>
              <p class="mb4">Is this a one time reward only or can it be recurring?</p>
              <div class="flex align-center justify-center">
								<span>One time</span>
								<w-switch class="ma2" :value="true" color="pink"></w-switch>
								<span>Recurring</span>
							</div>

							<p><button :disabled="loading" class="button medium" @click="saveReward">Save</button></p>
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
@import "~@/scss/_badge-maker.scss";

</style>