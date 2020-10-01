<template>
  <div :class="['overlay', { show: status}]" id="badgesCreator">
    <div class="container">
      <div v-if="slide[0]">
        <h1>Describe your habit</h1>
        <p><input type="text" placeholder="Ex. Work out"></p>
        <p><button>Next</button></p>
      </div>
      <div v-if="slide[1]">
        <h1>Choose an icon</h1>
        <p><input v-model="iconTerm" type="text"></p>
        <p><button @click="getIcons">Search</button></p>
        <div class="icons">
          <figure v-for="icon in icons" :key="icon.id">
            <img :src="icon.preview_url" :alt="icon.attribution">
          </figure>
        </div>
      </div>
      <div v-if="slide[2]">
        <h1>Choose a badge border</h1>
        <p><input type="text"></p>
        <p><button>Ok</button></p>
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
      iconTerm: '',
      icons: {},
      slide: { 0: false, 1: true, 2:false }
    }
  },
  methods: {
    getIcons: async function() {
      let icons = await PostService.getIcons(this.iconTerm)
      this.icons = icons.data
    },
  }
}
</script>
<style scoped lang="scss">

h1 { 
  color: $foreground;
  margin-bottom: 2rem;
}
.badge {
  cursor: pointer;
}
.toAdd {
  background: white;
  color: black;
}

.icons {
  img { filter: invert(1)}
}
  
</style>