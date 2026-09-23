<template>
  <div :class="currentMode">
    <span v-if="user">Zalogowany jako: {{ user.email }} <button @click="logout" class="mode-button">Wyloguj</button></span>
  </div>
  <div :class="currentMode">
    <button @click="switchMode" class="mode-button"><slot>Zmień tryb</slot></button>
  </div>
  <div :class="currentMode">
    <div v-if="!user">
      <UwierzytelnianieUzytkownika @loginSuccess="handleLoginSuccess" :class="currentMode"/>
    </div>
    <div v-else>
      <div class="row">
        <KalkulatorCalek
        @saveToHistory="saveToHistory"
        class="col-md-6 mx-auto"
        :class="currentMode"
        msg="Kalkulator Całki">
          <button v-show="history && history.length" @click="toggleHistory" class="form-button">
              {{ sideComponent === null ? "Pokaż tabelę" : "Ukryj tabelę" }}
          </button>
        </KalkulatorCalek>
        <component :is="sideComponent" :history="history" :class="currentMode" @removeEntry="removeEntry" class="col-md-6">
          <template v-slot:historyLabel>
            <p>Zapisane obliczenia: (kliknij, aby usunąć)</p>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<script setup>
  import KalkulatorCalek from './components/KalkulatorCalek.vue';
  import HistoriaRownan from './components/HistoriaRownan.vue';
  import UwierzytelnianieUzytkownika from './components/UwierzytelnianieUzytkownika.vue';
  import { ref, onMounted, computed } from 'vue';
  import { collection, doc, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
  import db from './firebaseInit.js';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { auth } from './firebaseInit.js';

  const store = useStore();
  const router = useRouter();

  const currentMode = ref(localStorage.getItem('htmlMode') || 'darkMode');
  const history = computed(() => store.getters.getHistory);
  const sideComponent = ref(null);
  const user = ref(null);


  onMounted(() => {
    document.documentElement.classList.add(currentMode.value);
    const userSession = localStorage.getItem('userSession');
    if (userSession)
    {
      const loggedUser = JSON.parse(userSession);
      handleLoginSuccess(loggedUser);
    }
    store.dispatch('fetchHistory');
    if (!user.value)
    {
      router.push('/login');
    }
  });

  const switchMode = () => {
    const mode = localStorage.getItem('htmlMode');
    const newMode = mode === 'darkMode' ? 'lightMode' : 'darkMode';
    localStorage.setItem('htmlMode', newMode);
    currentMode.value = newMode;
    document.documentElement.classList.remove(mode);
    document.documentElement.classList.add(newMode);
  };

  const toggleHistory = () => {
    sideComponent.value = sideComponent.value === null ? HistoriaRownan : null;
    console.log("Wartość sideComponent: " + sideComponent.value);
  }

  const saveToHistory = async (equation, start, end, result) => {
    const exist = history.value.find((entry) => {
      return (
        entry.equation === equation.value &&
        entry.start === start.value &&
        entry.end === end.value &&
        entry.result === result.value
      );
    });
    if (exist) return;
    history.value.unshift({
        equation: equation.value,
        start: start.value,
        end: end.value,
        result: result.value,
    });
    try {
      await addDoc(collection(db, 'history'), {
        equation: equation.value,
        start: start.value,
        end: end.value,
        result: result.value,
      });
    }
    catch (e) {
      console.error('Błąd podczas zapisywania obliczeń: ', e);
    }
  }

  const removeEntry = async (index) => {
    const entry = history.value[index];

    try {
      const query = await (await getDocs(collection(db, 'history'))).docs; // double await?
      const equationToDelete = query.find((doc) =>
      {
        const data = doc.data();
        return (
          data.equation === entry.equation &&
          data.start === entry.start &&
          data.end === entry.end &&
          data.result === entry.result
        );
      });
      await deleteDoc(doc(db, 'history', equationToDelete.id));
      history.value.splice(index, 1);
      if (!history.value.length)
      {
        sideComponent.value = null;
      }
    }
    catch (e) {
      console.error('Błąd podczas usuwania obliczeń: ', e);
    }
  }

  const handleLoginSuccess = (loggedUser) => {
    user.value = loggedUser;
    localStorage.setItem('userSession', JSON.stringify(user.value));
  };

  const logout = async () => {
    try {
      await auth.signOut();
      user.value = null;
      localStorage.removeItem('userSession');
      console.log('Wylogowano!');
      router.push('/login');
    } catch (error) {
      console.error('Błąd wylogowania:', error.message);
    }
  };

</script>

<style> 
html {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  background-color: #111;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #52a3f4;
  background-color: #111;
  margin-top: 60px;
}

.mode-button {
  font-size: 12px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.mode-button:hover {
  background-color: #0056b3;
}

.form-button {
        font-size: 16px;
        background-color: var(--button-background);
        color: var(--button-text);
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

.lightMode {
  background-color: #fff;
  color: #132d46;
}


.darkMode {
  background-color: #111;
  color: #52a3f4;
}
</style>

