import Vue from 'vue'
import Vuex from 'vuex'
import PostService from '../PostService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: 'Luke',
		today: {
      points: 13,
      month: '',
      day: '',
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
				//{ id: 3, name: 'Meditation', figure: { type: 'default', id: 'meditation' } }
			],
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
		today: state => state.today,
		badges: state => state.badges,
	},
  mutations: {
    setMonth: (state, month) => {
      state.today.month = month
    },
    setDay: (state, day) => {
      state.today.day = day
    },
    toggleBadge: (state, badgeTo) => {
      let mo = new Date(); state.today.month = mo.getMonth();
      let day = new Date(); state.today.day = day.getDate();
			if (state.today.badges.find(badge => badge.name === badgeTo.name)) {
				state.today.badges = state.today.badges.filter(
					badge => badge.name !== badgeTo.name
				);
			} else {
				state.today.badges.push(badgeTo);
			}
    },
    setToday: (state, today) => {
      state.today = today
    }
	},
	actions: {
		toggleBadge({ commit }, badgeTo) {
      commit("toggleBadge", badgeTo);
      let today = {...this.state.today}
      PostService.updateLog(this.state.user, today);
    },
    async setToday ({ commit }) {
      let mo = new Date(); commit("setMonth", mo.getMonth())
      let day = new Date(); commit("setDay", day.getDate())
      let today = await PostService.getToday(this.state.user, this.state.today.month, this.state.today.day)
      console.log(today[0])
      commit("setToday", today[0]);
    }
	},
	modules: {},
});
