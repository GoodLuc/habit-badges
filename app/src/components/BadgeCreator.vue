<template>
  <div :class="['overlay', { show: status}]" ref="modal" id="badgesCreator" tabindex="0" @keydown.esc="$emit('close')">
    <div>
      <div class="container">
        <div class="flex">
          <div class="tabs">
            <nav class="flex">
              <button :class="[{ current: slide == 0}]" role="tab" @click="gotoSlide(0)">Habit name</button>
              <button :class="[{ current: slide == 1}]" role="tab" @click="gotoSlide(1)">Icon</button>
              <button :class="[{ current: slide == 2}]" role="tab" @click="gotoSlide(2)">Frame</button>
              <button :class="[{ current: slide == 3}]" role="tab" @click="gotoSlide(3)">Material</button>
              <button :class="[{ current: slide == 4}]" role="tab" @click="gotoSlide(4)">Value</button>
            </nav>
            <div class="slide" v-if="slide == 0">
                <h1>Describe your habit</h1>
                <p v-if="warn" class="warn">Please enter the name of your habit</p>
                <p class="input-button"><input @keyup.enter="selectIcon" v-model="habitName" type="text" placeholder="Ex. Work out"></p>
            </div>
            <div class="slide" v-if="slide == 1">
              <h1>Choose an icon</h1>
              <p class="input-button"><input @keyup.enter="getIcons(iconTerm)" v-model="iconTerm" type="text" placeholder="Or enter term to search for another icon..."><button type="button" @click="getIcons(iconTerm)">Search</button></p>
              <pulse-loader :loading="loading"></pulse-loader>
              <div v-if="icons.length" class="box icons">
                <figure :class="[{ selected: icon.id == selectedIcon.id }]"
                  v-for="icon in icons" :key="icon.id" @click="setIcon(icon)">
                  <img :src="icon.preview_url" :alt="icon.attribution">
                </figure>
              </div>
              <div v-else>
                <p v-if="!loading">No icons found under '{{ iconSearchTerm }}.' Please enter another search term. <br>
                Tip: Try a simple noun.</p>
              </div>
            </div>
            <div class="slide" v-if="slide == 2">
              <h1>Choose a badge frame</h1>
              <div class="box frames">
                <figure :class="[{ selected: index == selectedFrameIndex }]" 
                  v-for="index in 20" :key="index" @click="setFrame(index)">
                  <img :src="'/assets/badges/frame/frame'+index+'.svg'">
                </figure>
              </div>
            </div>
            <div class="slide" v-if="slide == 3">
              <h1>Choose a material for your badge</h1>
              <div class="box materials">
                <div class="badge gold" @click="material = 'gold'"><figcaption>Gold</figcaption></div>
                <div class="badge silver" @click="material = 'silver'"><figcaption>Silver</figcaption></div>
                <div class="badge azure" @click="material = 'azure'"><figcaption>Azure</figcaption></div>
              </div>
            </div>
            <div class="slide" v-if="slide == 4">
              <h1>Assign a value</h1>
              <p>Define how valuable completing this habit is.</p>
              <div class="flex align-center justify-left">
                <div class="slidecontainer">
                  <input type="range" min="1" max="12" v-model="coins" class="slider" id="myRange">
                </div>
                <div class="coin"> 
                  <figure><img src="/assets/icons/coin.svg" alt="Coins"></figure>
                  <figcaption>{{ coins }}</figcaption>
                </div>
              </div>
            </div>
          </div>
          <div class="badgeHolder">
            <div>
              <div>
                <div :class="['badge', material]">
                  <figure>
                    <div class="frame"><img :src="badgeFrame" :alt="habitName"></div>
                    <div class="icon"><img crossOrigin="anonymous" ref="badgeIcon" id="badgeIcon" :src="iconSrc" :alt="habitName"></div>
                  </figure>
                  <figcaption>{{ habitName }}</figcaption>
                </div>
                <pulse-loader :loading="loading"></pulse-loader>
                <p v-if="slide <= 2"><button type="button" @click="nextSlide">Next</button></p>
                <p v-if="slide == 3"><button :disabled="loading" type="button" @click="saveBadge">Save</button></p>
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
    habit: {
      type: Object,
      default: function() { return false }
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
        var user = JSON.parse(localStorage.getItem("user"))
        var badgeIcon = this.$refs.badgeIcon;
        var imgCanvas = document.createElement("canvas"), imgContext = imgCanvas.getContext("2d");
        imgCanvas.width = badgeIcon.width; imgCanvas.height = badgeIcon.height;
        imgContext.drawImage(badgeIcon, 0, 0, badgeIcon.width, badgeIcon.height);
        var imgAsDataURL = imgCanvas.toDataURL("image/png");
        if (Object.keys(this.$props.habit).length) {
          console.log("Updating")
          let habit = { _id: this.$props.habit._id, icon: this.selectedIcon.id, name: this.habitName, frame: this.selectedFrameIndex, image: imgAsDataURL, material: this.material }
          await PostService.saveBadge({ user: user.token, habit: habit });
          this.updateBadgeInStore( habit )
        } else {
          console.log("Saving as new")
          var uniqueId = Math.floor(Date.now() / 1000);
          let habit = { _id: uniqueId, icon: this.selectedIcon.id, name: this.habitName, frame: this.selectedFrameIndex, image: imgAsDataURL, material: this.material }
          await PostService.saveBadge({ user: user.token, habit: habit });
          this.saveBadgeToStore(habit)
        }
        this.$emit('close')
      }
    },
  },
  components: {
    PulseLoader
  },
  mounted() {
    this.$refs.modal.focus()
    if (Object.keys(this.$props.habit).length) {
      this.habitName = this.$props.habit.name
      this.selectedFrameIndex = this.$props.habit.frame
      this.iconSrc = this.$props.habit.image
      this.badgeFrame = '/assets/badges/frame/frame'+this.selectedFrameIndex+'.svg'
      this.material = this.$props.habit.material
    }
  }
}
</script>
<style scoped lang="scss">

.slide {
  background: white;
  width: 100%;
  padding: 2rem;
  border-radius: 0 .314rem .314rem .314rem;
  h1 { padding-bottom: 1.5rem; }
}

.container {
  >.flex {
    width: 100%; 
    .tabs { 
      width: 100%;
      flex-grow: 1;
      margin-right: 2rem;
      margin-top: 1rem;
      nav { 
        button {
          font-size: 1.6rem;
          border-radius: .314rem .314rem 0 0;
          padding: 1rem;
          margin-right: .5rem;
          color: inherit;
          font-weight: 200;
          &.current {
            background: white;
            &:hover {
              color: black;
            }
          }
          &:hover {
            color: white;
          }
        }
      }
      .slide {
        box-sizing: border-box;
        h1 { margin: 0; }
      }
    }
    .badgeHolder > div {
      margin-left: auto;
      padding-top: 5rem;
      position: relative;
      width: 12rem;
      height: 16rem;
      display: block;
      > div {
        position: fixed;
        width: 12rem;
        button { width: 100%; }
      }
    }
  }

}

.badge {
  cursor: pointer;
  margin-right: 0;
  width: auto;
  height: auto;
}

.materials {
  .badge { 
    margin-right: 20px; 
    min-width: 5rem; min-height: 5rem;  
  }
}

input { width: 40rem; max-width: 80%; background: $shine3; }

.input-button { 
  display: flex; 
  input[type=text] {
    border-radius: .314rem 0 0 .314rem;
  }
  button {
    width: auto;
  }
}

.icons, .frames {
  background: white;
  border-radius: .314rem;
  margin-top: 2rem;
  figure {
    padding: 1.2rem;
    box-sizing: border-box;
    border-radius: .314rem;
    margin-right: 1rem;
    width: 8rem;
    &:hover, &.selected {
      background: $radialb;
      cursor: pointer;
      img { filter: invert(1)}
    }
  }
  img { filter: invert(0)}
}

.slidecontainer {
  width: auto; /* Width of the outside container */
}

/* The slider itself */
.slider {
  -webkit-appearance: none;  /* Override default CSS styles */
  appearance: none;
  width: 100%; /* Full-width */
  height: 25px; /* Specified height */
  background: #d3d3d3; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: .2s; /* 0.2 seconds transition on hover */
  transition: opacity .2s; margin: 0;
}

/* Mouse-over effects */
.slider:hover {
  opacity: 1; /* Fully shown on mouse-over */
}

/* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #4CAF50; /* Green background */
  cursor: pointer; /* Cursor on hover */
}

.slider::-moz-range-thumb {
  width: 25px; /* Set a specific slider handle width */
  height: 25px; /* Slider handle height */
  background: #4CAF50; /* Green background */
  cursor: pointer; /* Cursor on hover */
}
  
</style>