import Vue from 'vue'
import Vuex from 'vuex'
import PostService from '../PostService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: false,
    centerLogo: false,
    today: {},
    date: {},
		monthLoad: { days: {}, loading: true },
    lastMonthLoad: { days:{} },
		badges: [],
	},
	getters: {
    getMonthLoad: state => state.monthLoad,
    getLastMonthLoad: state => state.lastMonthLoad,
    badges: state => state.badges,
    getDayLoad: state => {
      if (state.today.month == state.date.month) {
        if (state.monthLoad.days[state.date.day] !== undefined) { return state.monthLoad.days[state.date.day] }
      } else if (parseInt(state.today.month) === parseInt(state.date.month)+1) {
        if (state.lastMonthLoad.days[state.date.day] !== undefined) { return state.lastMonthLoad.days[state.date.day] }
      } else {
        console.log('none found')
      }
      return { points: 0, year: state.date.year, month: state.date.month, day: state.date.day, badges: [] }
    },
	},
  mutations: {
    centerLogo: (state, value) => {
      state.centerLogo = value
    },
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
    setUser: (state, user) => {
      state.user = user
    },
    setBadges: (state, badges) => {
      state.badges = badges
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
          Vue.delete(state.monthLoad, "loading")
        }
      }
    },
    toggleBadge: (state, badgeTo) => { let monthToEdit
      if (state.today.month == state.date.month) { monthToEdit = 'monthLoad'; } 
      else if (parseInt(state.today.month) === parseInt(state.date.month)+1) { monthToEdit = 'lastMonthLoad'; }
      
      if (state[monthToEdit].days[state.date.day] === undefined) { Vue.set(state[monthToEdit].days, state.date.day, { points: 0, year: state.date.year, month: state.date.month, day: state.date.day, badges: [] }) }
      
      if (state[monthToEdit].days[state.date.day].badges.find(badge => badge === badgeTo)) {
        state[monthToEdit].days[state.date.day].badges = state[monthToEdit].days[state.date.day].badges.filter(
					badge => badge !== badgeTo
				);
			} else {
        state[monthToEdit].days[state.date.day].badges.push(badgeTo);
      }
    },
    saveBadgeToStore: (state, habit) => {
      state.user.habits[habit._id] = habit
      state.badges[habit._id] = habit
      localStorage.setItem("user", JSON.stringify({ ...state.user }))
    },
    updateBadgeInStore: (state, habit) => {
      state.user.habits[habit._id] = habit
      state.badges = state.user.habits
      localStorage.setItem("user", JSON.stringify({ ...state.user }))
    },
    clearData: (state) => {
      state.monthLoad = { days: {}, loading: true }
      state.lastMonthLoad = { days:{} }
    }
	},
  actions: {
    centerLogo({commit}, value) {
      commit("centerLogo", value)
    },
    setCurrentDate({ commit }) {
      commit("setCurrentDate")
    },
    setDate({ commit }, date) {
      commit("setDate", date )
    },
    setUser({ commit }, user) {
      commit("setUser", user )
    },
    setBadges({ commit }, badges) {
      commit("setBadges", badges )
    },
    clearData({ commit }) {
      commit("clearData")
    },
		toggleBadge({ commit }, badgeTo) {
      commit("toggleBadge", badgeTo);
      let monthToEdit;
      if (this.state.date.month === this.state.today.month) {
        monthToEdit = {...this.state.monthLoad}
      } else if (parseInt(this.state.today.month) === parseInt(this.state.date.month)+1) {
        monthToEdit = {...this.state.lastMonthLoad}
      }
      PostService.updateLog(this.state.user.token, this.state.date.year, this.state.date.month, monthToEdit);
    },
    async getMonth({ commit }) {
      let monthLoad = await PostService.getMonth(this.state.user.token, this.state.date.year, this.state.date.month)
      commit("setMonthLoad", monthLoad[0]);
      if (this.state.date.day < 7) {
        let lastMonthLoad = await PostService.getMonth(this.state.user.token, this.state.date.year, (parseInt(this.state.date.month) - 1))
        if (lastMonthLoad[0] === undefined) {
          commit("setLastMonthLoad", { days:{}, year: this.state.date.year, month: (parseInt(this.state.date.month) - 1) });
        } else {
          commit("setLastMonthLoad", lastMonthLoad[0]);
        }
      }
    },
	},
	modules: {},
});
