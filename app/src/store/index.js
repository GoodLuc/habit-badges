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
    getDayLoad: state => {
      // Return DayLoad according to loaded date, either from current month or last month (if aplicable to last 7 days)
      if (state.today.month == state.date.month) {
        if (state.monthLoad.days[state.date.day] !== undefined) { return state.monthLoad.days[state.date.day] }
      } else if (parseInt(state.today.month) === parseInt(state.date.month)+1) {
        if (state.lastMonthLoad.days[state.date.day] !== undefined) { return state.lastMonthLoad.days[state.date.day] }
      }
      // Default empty DayLoad 
      return { points: 0, year: state.date.year, month: state.date.month, day: state.date.day, badges: [] }
    },
	},
  mutations: {
    // For login screen
    centerLogo: (state, value) => {
      state.centerLogo = value
    },
    // Load a date (present or past) and set defaults if no load is found.
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
    setUserPoints: (state, points) => {
      state.user.points = points
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
    // Set month / day load or defaults if none found.
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
    // Toggle a badge ON/OFF with *filter*, either in current or last month (as defined in *date*.)
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
      // Calculate points for that day according to each badge's value, and save them 
      // (saving to actual DB is done in Action with the same name.)
      let points = 0
      state[monthToEdit].days[state.date.day].badges.forEach(id => {
        points += parseInt(state.user.habits[id].value)
      });
      state[monthToEdit].days[state.date.day].points = points
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
    // Logout
    clearData: (state) => {
      state.monthLoad = { days: {}, loading: true }
      state.lastMonthLoad = { days:{} }
    }
	},
  actions: {
    // For login screen
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
    // Logout
    clearData({ commit }) {
      commit("clearData")
    },
    // Save badge action to DB
		async toggleBadge({ commit }, badgeTo) {
      // Further calculations in mutation.
      commit("toggleBadge", badgeTo);
      let monthToEdit;
      // Set Month Load accordingly
      if (this.state.date.month === this.state.today.month) {
        monthToEdit = {...this.state.monthLoad}
      } else if (parseInt(this.state.today.month) === parseInt(this.state.date.month)+1) {
        monthToEdit = {...this.state.lastMonthLoad}
      }
      // Write to DB
      await PostService.updateLog({ user: this.state.user.token, date: { year: this.state.date.year, month: this.state.date.month }, monthLoad: monthToEdit});
      let points = await PostService.getUserPoints(this.state.user.token)
      commit("setUserPoints", points)
    },
    // Get Month Load according to Date
    async getMonth({ commit }) {
      let monthLoad = await PostService.getMonth({ user: this.state.user.token, date: { year: this.state.date.year, month: this.state.date.month}})
      commit("setMonthLoad", monthLoad[0]);
      // If date is earlier than the 7th, also get last month's load to display in "Last week."
      if (this.state.date.day < 7) {
        let lastMonthLoad = await PostService.getMonth({ user: this.state.user.token, date: { year: this.state.date.year, month: (parseInt(this.state.date.month) - 1)}})
        // if nothing is found set defaults.
        if (lastMonthLoad[0] === undefined) {
          commit("setLastMonthLoad", { days:{}, year: this.state.date.year, month: (parseInt(this.state.date.month) - 1) });
        } else {
          commit("setLastMonthLoad", lastMonthLoad[0]);
        }
      }
    },
	},
});
