<template>
  <div>
    <div class="container dash">
      <div class="main">
        <h1>This are your habits {{ user.name }}</h1>
        <p>Create your custom badges to track your daily progress</p>
        <div class="box">
          <div class="flex wrap" v-if="user">
            <div class="habit-row flex" v-for="habit in userHabits" :key="habit._id">
							<div class="habit">
								<div :class="['badge', habit.material]">
									<figure>
										<div class="frame"><img :src="'/assets/badges/frame/frame'+habit.frame+'.svg'" :alt="habit.name"></div>
										<div class="icon"><img crossOrigin="anonymous" id="badgeIcon" :src="habit.image" :alt="habit.icon"></div>
									</figure>
									<figcaption>{{ habit.name }}</figcaption>
								</div>
								<div class="badgeEditControls">
									<button class="edit" @click="editHabit(habit)" type="button">
										<figure><img src="/assets/badges/default/edit.svg" alt="Edit"></figure>
									</button>
									<button class="del" type="button" @click="delDialog = true; delHabit = habit">
										<figure><img src="/assets/badges/default/del.svg" alt="Delete"></figure>
									</button>
								</div>
							</div>
							<div class="timeline">
								<h3>Timeline</h3>
								<div class="tablechart">
									<div v-for="index in 30" :key="index">
										<template v-if="todayNr+index < daysInMonth+1">
											<span v-if="lastMonthLoad.days[todayNr+index] && monthLoad.days[todayNr+index].badges.includes(habit._id)" :class="[habit.material]">{{monthName(monthLoad.month - 1)}} {{todayNr+index}}</span>
											<span v-else>{{monthName(monthLoad.month - 1)}} {{todayNr+index}}</span>
										</template>
										<template v-else>
											<span v-if="monthLoad.days[todayNr+index-daysInMonth] && monthLoad.days[todayNr+index-daysInMonth].badges.includes(habit._id)" :class="[habit.material]">{{monthName(monthLoad.month)}} {{todayNr+index-daysInMonth}}</span>
											<span v-else>{{monthName(monthLoad.month)}} {{todayNr+index-daysInMonth}}</span>
										</template>
									</div>
								</div>
							</div>
						</div>
            <button class="badge-add" @click="badgeCreator = true">
              <figure>
                <img src="/assets/badges/default/add.svg" alt="Add new">
              </figure>
              <figcaption>Create new</figcaption>
            </button>
          </div>
        </div>
      </div>

    </div>

  <div v-if="delDialog" class="delDialog overlay">
    <div v-if="!confirmed" class="container">
      <div>
        <h1>Are you sure you wish to delete this badge?</h1>
        <p>Any previous entries in the daily calendar will still be visible.</p>
      </div>
      <pulse-loader :loading="loading"></pulse-loader>
      <div class="controls"><button :disabled="loading" class="del" @click="deleteHabit(delHabit)" type="button">Delete</button> <button type="button" @click="delDialog = false">Cancel</button></div>
    </div>
    <div else>
      <h1>The selected badge has been deleted.</h1>
      <div class="controls">
        <button type="button" @click="delDialog = false; confirmed = false">Ok</button>
      </div>
    </div>
  </div>
  
  <BadgeCreator v-if="badgeCreator" @close="badgeCreator = false; habit = {}" :habit="habit" />
  </div>
</template>

<script>
import PostService from '../PostService'
import BadgeCreator from '@/components/BadgeCreator.vue'
import { mapState, mapGetters, mapMutations } from "vuex";
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  name: 'Habits',
  data() {
    return {
      badgeCreator: false,
      delDialog: false,
      delHabit: null,
      habit: {},
      loading: false,
      confirmed: false,
			todayNr: new Date().getDate(),
    }
  },
  computed: {
    ...mapState(["user","monthLoad","lastMonthLoad"]),
    ...mapGetters(["userHabits"]),
		daysInMonth: function() {
			return new Date(new Date().getMonth(), new Date().getYear(), 0).getDate();
		}
  },
  watch: {
    // Add overlay class to body if Badge Creator component is open
    badgeCreator: function() {
      const bod = document.body
      if (this.badgeCreator) {
        bod.classList.add('overlaid')
      } else {
        bod.classList.remove('overlaid')
      }
    }
  },
  methods: {
    ...mapMutations(['updateBadgeInStore']),
    editHabit: function(habit) {
      this.habit = habit
      this.badgeCreator = true
    },
    // Set habit to hidden in DB with the *deleted* attribute
    deleteHabit: async function() {
      this.loading = true
      this.delHabit = { ...this.delHabit, deleted: true }
      this.updateBadgeInStore( this.delHabit )
      await PostService.saveBadge({ user: this.user.token, habit: this.delHabit });
      this.loading = false
      this.confirmed = true
    },
		monthName: function(month) {
			let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			return months[month-1]
		}
  },
  components: { BadgeCreator, PulseLoader },
  mounted() {
    document.body.classList.remove('overlaid')
    window.scrollTo(0, 0)
  }
}
</script>

<style scoped lang="scss">

.habit-row { 
	width: 100%; 
	margin-bottom: 2rem; 
	background: white;
}
.box {
  padding-top: 3rem;
  .badge-add { img { transform: scale(1.5); } }
}
.habit {
	width: 10rem;
  background: cornsilk;
	margin-right: 1rem;
  .badgeEditControls { 
    display: flex; justify-content: space-between; 
    width: 100%;
    button { display: block;
      width: auto; height: 4rem; border-radius: 0 0 .314rem .314rem;
      font-weight: 200; font-size: .9rem; margin: 0; border: none; 
      background: none; box-shadow: none; transition: transform .2s ease;
      &.edit { figure { filter: invert(36%) sepia(66%) saturate(7120%) hue-rotate(219deg) brightness(99%) contrast(97%); } }
      &.del { figure { filter: invert(19%) sepia(96%) saturate(3956%) hue-rotate(355deg) brightness(105%) contrast(94%); } }
      figure img { height: 2rem; }
      &:hover { transform: scale(1.2); }
    }
  }
}

//.badge-add { height: calc(100% - 4.8rem); }

.tablechart {
	display: flex; flex-wrap: wrap;
	div {
		width: 5rem; height: 4rem; overflow: hidden;
		border: 1px solid lightgoldenrodyellow; 
		span {
			padding: .5rem;
			width: 100%;
			height: 100%;
			display: block;
			&.gold { background: $gold; border: 1px solid #fcc201; }
			&.silver { background: $silver; border: 3px solid #ffeac2; }
			&.azure { background: $azure; color: white; border: 1px solid #185dfa; }
		}
	}
}

.delDialog { 
  text-align: center; 
  .controls {
    display: flex; justify-content: center;
    button { margin-right: 20px; width: auto; }
    button.del { background: #F72616; }
  }
}

</style>