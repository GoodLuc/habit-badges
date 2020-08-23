import Vue from 'vue'
import Vuex from 'vuex'
import PostService from '../PostService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: 'Luke',
    day: 0,
    month: 0,
		currentMonth: { days: {} },
    lastMonth: { days:{} },
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
			{
				id: 4,
				name: "Music making",
				figure: { type: "default", id: "musicMaking" },
			},
		],
	},
	getters: {
    user: state => state.user,
    currentMonth: state => state.currentMonth,
    lastMonth: state => state.lastMonth,
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
    setLastMonthData: (state, data) => {
      if (Object.keys(data).length) {
        state.lastMonth = data
      }
    },
    setCurrentMonthData: (state, data) => {
      if ((data !== undefined) && Object.keys(data).length) {
        state.currentMonth = data
        if (state.currentMonth.days[state.day] === undefined) {
          Vue.set(state.currentMonth.days, state.day, { points: 0, month: state.month, day: state.day, badges: [] })
        }
      } else {
        if (state.currentMonth.days[state.day] === undefined) {
          Vue.set(state.currentMonth.days, state.day, { points: 0, month: state.month, day: state.day, badges: [] })
        }
      }
    },
    toggleBadge: (state, badgeTo) => {
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
    setCurrentDate({ commit }) {
      let mo = new Date(); commit("setMonth", (mo.getMonth()+1))
      let day = new Date(); commit("setDay", day.getDate())
    },
		toggleBadge({ commit }, badgeTo) {
      commit("toggleBadge", badgeTo);
      let month = {...this.state.currentMonth}
      PostService.updateLog(this.state.user, month, this.state.month);
    },
    async getMonth({ commit }) {
      let monthData = await PostService.getMonth(this.state.user, this.state.month)
      commit("setCurrentMonthData", monthData[0]);
      if (this.state.day < 7) {
        let monthData = await PostService.getMonth(this.state.user, (this.state.month - 1))
        commit("setLastMonthData", monthData[0]);
      }
    }
	},
	modules: {},
});
