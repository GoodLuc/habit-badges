import Vue from 'vue'
import Vuex from 'vuex'
import PostService from '../PostService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: 'Luke',
		today: {
      points: 13,
      month: () => { let mo = new Date(); return mo.getMonth(); },
      day: () => { let day = new Date(); return day.getDate();},
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
		toggleBadge: (state, badgeTo) => {
			if (state.today.badges.find(badge => badge.name === badgeTo.name)) {
				state.today.badges = state.today.badges.filter(
					badge => badge.name !== badgeTo.name
				);
			} else {
				state.today.badges.push(badgeTo);
			}
		},
	},
	actions: {
		toggleBadge({ commit }, badgeTo) {
      commit("toggleBadge", badgeTo);
      let today = Object.assign({}, this.state.today);
      let username = this.user
      PostService.updateLog(username, today);
		},
	},
	modules: {},
});
