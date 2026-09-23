import { ref } from 'vue'
import { createStore } from 'vuex'
import { getDocs, collection } from 'firebase/firestore';
import { db } from './firebaseInit';


const store = createStore({
  state: () => ({ 
      history: ref([]),
  }),

  getters: {
    getHistory: (state) => state.history.value,
  },

  mutations: {
    setHistory: (state, history) => {
      state.history.value = history;
    },
  },

  actions: {
      fetchHistory: async ({ commit }) => { 
        try {
          const querySnapshot = await getDocs(collection(db, 'history'));
          const history = querySnapshot.docs.map((doc) => doc.data());
          commit('setHistory', history);
          console.log('Pobrano historię');
        } 
        catch (error) {
          console.error('Błąd podczas pobierania historii: ', error);
        }
      },
    }
})

export default store;