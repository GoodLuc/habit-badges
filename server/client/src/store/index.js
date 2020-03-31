import Vue from 'vue'
import Vuex from 'vuex'
import PostService from '../PostService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: 'Luke',
    day: 0,
    month: 0,
		currentMonth: {
      days: {
      },
		},
		badges: [
			{
				id: 1,
				name: "Clean House",
				figure: { type: "default", id: "cleanHouse" },
			},
			{
				id: 2,
				name: "Excercise",
				figure: { type: "default", id: "excercise" },
			},
			{
				id: 3,
				name: "Meditation",
				figure: { type: "default", id: "meditation" },
			},
		],
	},
	getters: {
    user: state => state.user,
		currentMonth: state => state.currentMonth,
    badges: state => state.badges,
    today: state => { try { return state.currentMonth.days[state.day] } catch { return false } }
	},
  mutations: {
    setMonth: (state, month) => {
      state.month = month
    },
    setDay: (state, day) => {
      state.day = day
    },
    setCurrentMonthData: (state, data) => {
      if (data != undefined) {
        state.currentMonth = data
        console.log('setting data')
      
        if (state.currentMonth.days[state.day] == undefined) {
          console.log('today is empty')
          console.log(data)
          //state.currentMonth.days[state.day] = {}
          Vue.set(state.currentMonth.days, state.day, {
            points: 0,
            month: state.month,
            day: state.day,
            badges: []
          })
        }
      }
    },
    toggleBadge: (state, badgeTo) => {
      //let mo = new Date(); state.month = mo.getMonth();
      //let day = new Date(); state.day = day.getDate();
      if (state.currentMonth.days[state.day].badges.find(badge => badge.name === badgeTo.name)) {
        state.currentMonth.days[state.day].badges = state.currentMonth.days[state.day].badges.filter(
					badge => badge.name !== badgeTo.name
				);
			} else {
        state.currentMonth.days[state.day].badges.push(badgeTo);
      }
    },
	},
	actions: {
		toggleBadge({ commit }, badgeTo) {
      commit("toggleBadge", badgeTo);
      let month = {...this.state.currentMonth}
      PostService.updateLog(this.state.user, month, this.state.month);
    },
    async getMonth ({ commit }) {
      let mo = new Date(); commit("setMonth", mo.getMonth())
      let day = new Date(); commit("setDay", day.getDate())
      let month = await PostService.getMonth(this.state.user, this.state.month)
      console.log(month[0])
      commit("setCurrentMonthData", month[0]);
    }
	},
	modules: {},
});
