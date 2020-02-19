import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		today: {
			points: 13,
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
		},
	},
	modules: {},
});
