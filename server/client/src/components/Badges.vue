<template>
  <div>
    <h2>Earned Badges for Today:</h2>
    <div v-if="today" class="badges">
      <div v-for="badge in today.badges" :key="badge.id">
        <figure class="badge" v-if="badge.figure.type == 'default'">
          <img :src="'/assets/badges/default/'+badge.figure.id+'.svg'" :alt="badge.name">
          <figcaption>{{ badge.name }}</figcaption>
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'Badges',
  data() {
    return {
    }
  },
  computed: mapGetters(["currentMonth","today"]),
  props: {
    msg: String
  },
  mounted() {
    console.log('mounted')
    //mapActions(["setToday"])
    this.$store.dispatch('getMonth')
  }
}
</script>

<style scoped lang="scss">
.badges {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  //justify-content: center;

  div {
    border: 1px solid #dbdbdb;
    border-radius: 20px;
    padding: 10px;
    box-sizing: border-box;
    margin-right: 10px;
    margin-top: 10px;
    width: calc(25% - 10px);
    text-align: center;
    &:nth-of-type(4n) {
      margin-right: 0
    }
  }
}
</style>
