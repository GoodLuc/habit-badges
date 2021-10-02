import { createStore } from 'vuex'
import PostService from '../PostService'
import titles from './titles'


export default createStore({
  state: {
    user: false,
    centerLogo: false,
    today: {},
    date: {},
		monthLoad: { days: {}, loading: true },
    lastMonthLoad: { days:{} },
    badges: [],
    titles: titles
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
    badges: state => {
      let badges = Object.values({...state.badges})
      return badges.filter(badge => !badge.deleted)
    },
    userHabits: state => {
      if (state.user != false) {
        let userHabits = []
        for (let habit in state.user.habits) {
          if (!state.user.habits[habit].deleted) {
            userHabits.push(state.user.habits[habit])
          }
        }
        return userHabits;
      } else {
        return false;
      }
    },
		userHabitsByCount: (state, getters) => {
			let userHabits = [...getters.userHabits]
			console.log('user habits are', userHabits)
			userHabits.sort((a, b) => {
				return b.count - a.count
			})
			return userHabits
		}
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
          state.monthLoad.days[state.date.day] = { points: 0, year: state.date.year, month: state.date.month, day: state.date.day, badges: [] }
        }
      } else if (state.lastMonthLoad.month == state.date.month) { 
        if (state.lastMonthLoad.days[state.date.day] === undefined) { 
          state.lastMonthLoad.days[state.date.day] = { points: 0, year: state.date.year, month: state.date.month, day: state.date.day, badges: [] }
        }
      }
    },
    setUser: (state, user) => {
      state.user = user
      localStorage.setItem("user", JSON.stringify({ ...state.user }))
    },
    setUserPoints: (state, points) => {
      console.log('setting points')
      state.user['points'] = parseInt(points)
      localStorage.setItem("user", JSON.stringify({ ...state.user }))
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
          state.monthLoad.days[state.date.day] = { points: 0, year: state.date.year, month: state.date.month, day: state.date.day, badges: [] }
        }
      } else {
        if (state.monthLoad.days[state.date.day] === undefined) {
          state.monthLoad.days[state.date.day] = { points: 0, year: state.date.year, month: state.date.month, day: state.date.day, badges: [] }
          delete state.monthLoad["loading"]
        }
      }
    },
    // Toggle a badge ON/OFF with *filter*, either in current or last month (as defined in *date*.)
    toggleBadge: (state, badgeTo) => { 
      console.log('toggl')
      let monthToEdit
      if (state.today.month == state.date.month) { monthToEdit = 'monthLoad'; } 
      else if (parseInt(state.today.month) === parseInt(state.date.month)+1) { monthToEdit = 'lastMonthLoad'; }
      
      if (state[monthToEdit].days[state.date.day] === undefined) { state[monthToEdit].days[state.date.day] = { points: 0, year: state.date.year, month: state.date.month, day: state.date.day, badges: [] } }
      
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
    setUserLevel: (state) => {
      console.log('setting level')
      if (state.user.points < 100) {
        state.user["level"] = { nr: 1, percent: state.user.points, toNext: (100 - parseInt(state.user.points)), next: 100 }
      } else {
        let calcpoint = 100
        let increment = 80
        let level = 1
        let prevLevelPoints = 100
        while (calcpoint <= state.user.points) {
          increment += 20
          calcpoint = calcpoint + increment
          level++
          if (!(calcpoint > state.user.points)) { prevLevelPoints = calcpoint }
        }
        var nextLevelPoints = calcpoint - prevLevelPoints
        var userBaseLevelPoints = state.user.points - prevLevelPoints
        var percentage = (userBaseLevelPoints / nextLevelPoints) * 100
        state.user["level"] = { nr: level, percent: percentage, toNext: (calcpoint - state.user.points), next: calcpoint }
      }
    },
    saveBadgeToStore: (state, habit) => {
      state.user.habits[habit._id] = habit
      state['badges'] = state.user.habits
      localStorage.setItem("user", JSON.stringify({ ...state.user }))
    },
    saveRewardToStore: (state, reward) => {
      state.user.rewards[reward._id] = reward
      localStorage.setItem("user", JSON.stringify({ ...state.user }))
    },
    updateTab: (state, tab) => {
      state.user.tab = tab
      localStorage.setItem("user", JSON.stringify({ ...state.user }))
    },
    updateBadgeInStore: (state, habit) => {
      state.user.habits[habit._id] = habit
      state['badges'] = state.user.habits
      localStorage.setItem("user", JSON.stringify({ ...state.user }))
    },
    updateRewardInStore: (state, reward) => {
      state.user.rewards[reward._id] = reward
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
      commit("setUserLevel")
    },
    unsetUser({ commit }) {
      commit("setUser", false )
    },
    setBadges({ commit }, badges) {
      commit("setBadges", badges )
    },
    // Logout
    clearData({ commit }) {
      commit("clearData")
    },
    // Save badge action to DB
		async saveCheckIn({ commit }) {
      // Further calculations in mutation.
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
			let user = await PostService.getUserData({ token: this.state.user.token })
      commit("setUserPoints", points)
			commit("setUser", { ...user[0], token: user[0]._id})
      commit("setUserLevel")
      return true
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
