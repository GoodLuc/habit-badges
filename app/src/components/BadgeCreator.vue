<template>
  <div :class="['overlay', { show: status}]" ref="modal" id="badgesCreator" tabindex="0" @keydown.esc="$emit('close')">
    <div>
      <div class="container">
        <div class="flex">
          <div class="tabs">
            <nav class="flex">
              <button :class="[{ current: slide == 0}]" role="tab" @click="gotoSlide(0)">Habit name</button>
              <button :class="[{ current: slide == 1}]" role="tab" @click="gotoSlide(1)">Icon</button>
              <button :class="[{ current: slide == 2}]" role="tab" @click="gotoSlide(2)">Medal frame</button>
            </nav>
            <div class="slide" v-if="slide == 0">
                <h1>Describe your habit</h1>
                <p v-if="warn" class="warn">Please enter a short description</p>
                <p class="input-button"><input @keyup.enter="selectIcon" v-model="habitName" type="text" placeholder="Ex. Work out"></p>
            </div>
            <div class="slide" v-if="slide == 1">
              <h1>Choose an icon</h1>
              <p class="input-button"><input @keyup.enter="getIcons" v-model="iconTerm" type="text" placeholder="Or enter term to search for another icon..."><button type="button" @click="getIcons">Search</button></p>
              <pulse-loader :loading="loading"></pulse-loader>
              <p v-if="warn2" class="warn">No icons found under the term '{{ habitName }}.' Enter a search term.</p>
              <div v-if="icons.length" class="box icons">
                <figure :class="[{ selected: icon.id == selectedIcon.id }]"
                  v-for="icon in icons" :key="icon.id" @click="setIcon(icon)">
                  <img :src="icon.preview_url" :alt="icon.attribution">
                </figure>
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
          </div>
          <div class="badgeHolder">
            <div>
              <div>
                <div class="badge">
                  <figure>
                    <div class="frame"><img :src="badgeFrame" :alt="habitName"></div>
                    <div class="icon"><img crossOrigin="anonymous" ref="badgeIcon" id="badgeIcon" :src="iconSrc" :alt="habitName"></div>
                  </figure>
                  <figcaption>{{ habitName }}</figcaption>
                </div>
                <pulse-loader :loading="loading"></pulse-loader>
                <p v-if="slide <= 1"><button type="button" @click="nextSlide">Next</button></p>
                <p v-if="slide == 2"><button :disabled="loading" type="button" @click="saveBadge">Save</button></p>
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
      warn: false,
      warn2: false,
      loading: false,
      icons: {},
      selectedIconIndex: '',
      selectedFrameIndex: 1,
      slide: 0,
      selectedIcon: {},
      iconSrc: '/assets/badges/default/default.svg',
      badgeFrame: '/assets/badges/frame/frame1.svg'
    }
  },
  methods: {
    ...mapMutations(['saveBadgeToStore','updateBadgeInStore']),
    getIcons: async function() {
      this.loading = true
      this.icons = {}
      this.warn = false
      this.warn2 = false
      try {
        var icons = await PostService.getIcons(this.iconTerm)
        this.icons = icons.data
        this.loading = false
      } catch {
        this.loading = false
        this.warn2 = true
      }
    },
    selectIcon() {
      this.iconTerm = this.habitName
      this.getIcons()
      this.iconTerm = ''
      this.gotoSlide(1)
    },
    gotoSlide: function(nr) {
      this.slide = nr
    },
    nextSlide: function() {
      this.slide++
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
        console.log(this.$refs.badgeIcon)
        var imgCanvas = document.createElement("canvas"), imgContext = imgCanvas.getContext("2d");
        console.log("width:"+badgeIcon.width)
        console.log("height:"+badgeIcon.height)
        imgCanvas.width = badgeIcon.width; imgCanvas.height = badgeIcon.height;
        imgContext.drawImage(badgeIcon, 0, 0, badgeIcon.width, badgeIcon.height);
        var imgAsDataURL = imgCanvas.toDataURL("image/png");
        if (Object.keys(this.$props.habit).length) {
          console.log("Updating")
          let habit = { _id: this.$props.habit._id, icon: this.selectedIcon.id, name: this.habitName, frame: this.selectedFrameIndex, image: imgAsDataURL }
          this.updateBadgeInStore( habit )
          PostService.updateBadge( user.token, habit );
        } else {
          console.log("Saving as new")
          var uniqueId = Math.floor(Date.now() / 1000);
          let habit = { _id: uniqueId, icon: this.selectedIcon.id, name: this.habitName, frame: this.selectedFrameIndex, image: imgAsDataURL }
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

input { width: 40rem; max-width: 80%; background: $shine2; }

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
  
</style>