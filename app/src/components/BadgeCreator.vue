<template>
  <div :class="['overlay', { show: status}]" id="badgesCreator">
    <div class="container">
      <div v-if="slide == 0">
        <h1>Describe your habit</h1>
        <p><input v-model="habitName" type="text" placeholder="Ex. Work out"></p>
        <p><button type="button" @click="selectIcon">Next</button></p>
      </div>
      <div v-if="slide == 1">
        <h1>Choose an icon</h1>
        <p class="input-button"><input v-model="iconTerm" type="text" placeholder="Or enter term to search for another icon..."><button type="button" @click="getIcons">Search</button></p>
        <div v-if="icons.length" class="box icons">
          <figure v-for="icon in icons" :key="icon.id">
            <img :src="icon.preview_url" :alt="icon.attribution">
          </figure>
        </div>
      </div>
      <div v-if="slide == 2">
        <h1>Choose a badge border</h1>
        <p><input type="text"></p>
        <p><button type="button">Ok</button></p>
      </div>
      
    </div>
    <figure class="close" @click="$emit('close')"><img src="/assets/icons/close.svg" alt="Close"></figure>
  </div>
</template>
<script>
import PostService from '../PostService'


export default {
  name: 'BadgeCreator',
  props: ['status'],
  data() {
    return {
      habitName: '',
      iconTerm: '',
      icons: {},
      slide: 0
    }
  },
  methods: {
    getIcons: async function() {
      let icons = await PostService.getIcons(this.iconTerm)
      this.icons = icons.data
    },
    selectIcon() {
      this.iconTerm = this.habitName
      this.getIcons()
      this.iconTerm = ''
      this.nextSlide()
    },
    nextSlide: function() {
      this.slide++
    }
  }
}
</script>
<style scoped lang="scss">

.badge {
  cursor: pointer;
}
.toAdd {
  background: white;
  color: black;
}

input { width: 40rem; max-width: 80%; }
.input-button { display: flex; }

.icons {
  figure {
    padding: 1.2rem;
    box-sizing: border-box;
    margin-right: 1rem;
    width: 8rem;
    &:hover {
      background: $radialb;
      img { filter: invert(0)}
    }
  }
  img { filter: invert(1)}
}
  
</style>