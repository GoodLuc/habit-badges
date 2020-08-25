import Vue from 'vue'
import Vuex from 'vuex'
import PostService from '../PostService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: 'Luke',
    day: 0,
    month: 0,
    year: new Date().getFullYear(),
		monthLoad: { days: {} },
    //lastMonth: { days:{} },
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
    getMonthLoad: state => state.monthLoad,
    //lastMonth: state => state.lastMonth,
    badges: state => state.badges,
    getDayLoad: state => { try { return state.monthLoad.days[state.day] } catch { return false } }
	},
  mutations: {
    setYear: (state, year) => {
      state.year = year
    },
    setMonth: (state, month) => {
      state.month = month
    },
    setDay: (state, day) => {
      state.day = day
    },
    /*setLastMonthData: (state, data) => {
      if (Object.keys(data).length) {
        state.lastMonth = data
      }
    },*/
    setMonthLoad: (state, data) => {
      if ((data !== undefined) && Object.keys(data).length) {
        state.monthLoad = data
        if (state.monthLoad.days[state.day] === undefined) {
          Vue.set(state.monthLoad.days, state.day, { points: 0, month: state.month, day: state.day, badges: [] })
        }
      } else {
        if (state.monthLoad.days[state.day] === undefined) {
          Vue.set(state.monthLoad.days, state.day, { points: 0, month: state.month, day: state.day, badges: [] })
        }
      }
    },
    toggleBadge: (state, badgeTo) => {
      if (state.monthLoad.days[state.day].badges.find(badge => badge.name === badgeTo.name)) {
        state.monthLoad.days[state.day].badges = state.monthLoad.days[state.day].badges.filter(
					badge => badge.name !== badgeTo.name
				);
			} else {
        state.monthLoad.days[state.day].badges.push(badgeTo);
      }
    },
	},
  actions: {
    setCurrentDate({ commit }) {
      let yr = new Date().getFullYear(); commit("setYear", yr)
      let mo = new Date(); commit("setMonth", (mo.getMonth()+1))
      let day = new Date(); commit("setDay", day.getDate())
    },
		toggleBadge({ commit }, badgeTo) {
      commit("toggleBadge", badgeTo);
      let monthLoad = {...this.state.monthLoad}
      PostService.updateLog(this.state.user, this.state.year, this.state.month, monthLoad);
    },
    async getMonth({ commit }) {
      let monthLoad = await PostService.getMonth(this.state.user, this.state.year, this.state.month)
      commit("setMonthLoad", monthLoad[0]);
      /*if (this.state.day < 7) {
        let monthLoad = await PostService.getMonth(this.state.user, this.state.year, (this.state.month - 1))
        commit("setLastMonthData", monthLoad[0]);
      }*/
    }
	},
	modules: {},
});
