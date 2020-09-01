import Vue from 'vue'
import Vuex from 'vuex'
import PostService from '../PostService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: 'Luke',
    today: {},
    date: {},
		monthLoad: { days: {} },
    lastMonthLoad: { days:{} },
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
    getLastMonthLoad: state => state.lastMonthLoad,
    badges: state => state.badges,
    getDayLoad: state => {
      if (state.today.month == state.date.month) {
        try { return state.monthLoad.days[state.date.day] } catch { return false }
      } else if (parseInt(state.today.month) === parseInt(state.date.month)+1) {
        try { return state.lastMonthLoad.days[state.date.day] } catch { return false }
      } 
    } 
	},
  mutations: {
    setDate: (state, date) => {
      state.date = { year: date.year, month: date.month, day: date.day }
      if (state.monthLoad.month == state.date.month) { 
        if (state.monthLoad.days[state.date.day] === undefined) {
          Vue.set(state.monthLoad.days, state.date.day, { points: 0, year: state.date.year, month: state.date.month, day: state.date.day, badges: [] })
        }
      } else if (state.lastMonthLoad.month == state.date.month) { 
        if (state.lastMonthLoad.days[state.date.day] === undefined) { 
          Vue.set(state.lastMonthLoad.days, state.date.day, { points: 0, year: state.date.year, month: state.date.month, day: state.date.day, badges: [] }) 
        }
      }
    },
    setCurrentDate( state ) {
      let year = new Date().getFullYear()
      let month = new Date(); month = month.getMonth()+1
      let day = new Date(); day = day.getDate()
      state.date = {year: year, month: month, day: day}
      state.today = {year: year, month: month, day: day}
    },
    setLastMonthLoad: (state, data) => {
      if (Object.keys(data).length) {
        state.lastMonthLoad = data
      }
    },
    setMonthLoad: (state, data) => {
      if ((data !== undefined) && Object.keys(data).length) {
        state.monthLoad = data
        if (state.monthLoad.days[state.date.day] === undefined) {
          Vue.set(state.monthLoad.days, state.date.day, { points: 0, year: state.date.year, month: state.date.month, day: state.date.day, badges: [] })
        }
      } else {
        if (state.monthLoad.days[state.date.day] === undefined) {
          Vue.set(state.monthLoad.days, state.date.day, { points: 0, year: state.date.year, month: state.date.month, day: state.date.day, badges: [] })
        }
      }
    },
    toggleBadge: (state, badgeTo) => { let monthToEdit
      if (state.today.month == state.date.month) { monthToEdit = 'monthLoad'; } 
      else if (parseInt(state.today.month) === parseInt(state.date.month)+1) { monthToEdit = 'lastMonthLoad'; }
      if (state[monthToEdit].days[state.date.day].badges.find(badge => badge.name === badgeTo.name)) {
        state[monthToEdit].days[state.date.day].badges = state[monthToEdit].days[state.date.day].badges.filter(
					badge => badge.name !== badgeTo.name
				);
			} else {
        state[monthToEdit].days[state.date.day].badges.push(badgeTo);
      }
    },
	},
  actions: {
    setCurrentDate({ commit }) {
      commit("setCurrentDate")
    },
    setDate({ commit }, date) {
      commit("setDate", date )
    },
		toggleBadge({ commit }, badgeTo) {
      commit("toggleBadge", badgeTo);
      let monthLoad = {...this.state.monthLoad}
      PostService.updateLog(this.state.user, this.state.date.year, this.state.date.month, monthLoad);
    },
    async getMonth({ commit }) {
      let monthLoad = await PostService.getMonth(this.state.user, this.state.date.year, this.state.date.month)
      commit("setMonthLoad", monthLoad[0]);
      if (this.state.date.day < 7) {
        let lastMonthLoad = await PostService.getMonth(this.state.user, this.state.date.year, (this.state.date.month - 1))
        commit("setLastMonthLoad", lastMonthLoad[0]);
      }
    }
	},
	modules: {},
});
