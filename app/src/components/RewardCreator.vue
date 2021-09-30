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
                <p v-if="warn" class="warn">Please describe what would be your reward</p>
                <p><input class="mxa" @keyup.enter="nextSlide" v-model="rewardName" type="text" placeholder="Ex. Ice cream / New clothes"></p>
								<p><button class="button medium" @click="nextSlide">Next</button></p>
								<article>
									<h3>See reward ideas:</h3>
									<ul>
										<li>Go on a trip</li>
										<li></li>
									</ul>
								</article>
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
								<w-switch class="ma2" v-model="recurring" color="pink"></w-switch>
								<span>Recurring</span>
							</div>

							<div v-if="loading" class="flex align-center column padyMed">
								<h2>Saving...</h2>
								<pulse-loader :loading="loading"></pulse-loader>
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
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import PostService from '../PostService'
import { mapMutations } from "vuex";

export default {
  name: 'RewardCreator',
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
      rubys: 4,
			recurring: false,
			completed: false
    }
  },
  methods: {
    ...mapMutations(['saveRewardToStore','updateRewardInStore']),
    gotoSlide: function(nr) {
      this.slide = nr
    },
    nextSlide: function() {
      if (this.slide == 0) { 
        if (this.rewardName == '') {
					this.warn = true
				} else {
					this.slide++
					this.warn = false
				}
      } else {
        this.slide++
      }
    },
    saveReward: async function() {
      this.loading = true
      if (this.rewardName == '') {
        this.slide = 0
        this.warn = true
      } else {
        var user = JSON.parse(localStorage.getItem("user"))
        if (this.$props.reward && Object.keys(this.$props.reward).length) {
          // If this is the edition of a previously existing reward, update instead of saving as new.
          console.log("Updating")
          let reward = { _id: this.$props.reward._id, name: this.rewardName, value: this.rubys, recurring: this.recurring, completed: this.completed }
          await PostService.saveReward({ user: user.token, reward: reward });
          this.updateRewardInStore( reward )
        } else {
          console.log("Saving as new")
          var uniqueId = Math.floor(Date.now() / 1000);
          let reward = { _id: uniqueId, name: this.rewardName, value: this.rubys, recurring: this.recurring, completed: false }
          await PostService.saveReward({ user: user.token, reward: reward });
          this.saveRewardToStore(reward)
        }
				this.loading = false
        this.$emit('close')
      }
    },
  },
  mounted() {
    this.$refs.modal.focus()
    // Check if this is an edition of an existing habit as set by the props.
    if (this.$props.reward && Object.keys(this.$props.reward).length) {
      this.rewardName = this.$props.reward.name
      this.rubys = this.$props.reward.value
			this.recurring = this.$props.reward.recurring
			this.completed = this.$props.reward.completed
    }
  },
	components: { PulseLoader }
}  
</script>

<style scoped lang="scss">
@import "~@/scss/_badge-maker.scss";

</style>