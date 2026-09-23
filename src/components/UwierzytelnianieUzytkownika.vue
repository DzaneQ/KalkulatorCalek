<template>
    <div>     
        <form @submit.prevent="register" class="login">
          <h2>Rejestracja</h2>
          <div>
            <label for="email">Email:</label>
            <input v-model="email" type="email" id="email" class="form-control" required>
          </div>
          <div>
            <label for="password">Hasło:</label>
            <input v-model="password" type="password" id="password" class="form-control" required>
          </div>
          <button type="submit" class="form-button">Zarejestruj się</button>
        </form>
        <form @submit.prevent="login" class="login">
          <h2>Logowanie</h2>
          <div>
            <label for="loginEmail">Email:</label>
            <input v-model="loginEmail" type="email" id="loginEmail" class="form-control" required>
          </div>
          <div>
            <label for="loginPassword">Hasło:</label>
            <input v-model="loginPassword" type="password" id="loginPassword" class="form-control" required>
          </div>
          <button type="submit" class="form-button">Zaloguj się</button>
        </form>
    </div>
</template>
  
<script setup>
    import { ref, defineEmits } from 'vue';
    import { auth } from '../firebaseInit.js';
    import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
    import { useRouter } from 'vue-router'
    
    const router = useRouter();

    const email = ref('');
    const password = ref('');
    const loginEmail = ref('');
    const loginPassword = ref('');
    const user = ref(null);

    const emits = defineEmits(['loginSuccess']);
    
    const register = async () => {
      try {
        createUserWithEmailAndPassword(auth, email.value, password.value).then((response) => {
          console.log('Rejestracja użytkownika...');
          user.value = response.user;
          emits('loginSuccess', user.value);
          router.push('/')
        })
      } catch (error) {
        console.error('Błąd rejestracji:', error.message);
      }
    };
    
    const login = async () => {
      try {
        signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value).then((response) => {
          user.value = response.user;
          emits('loginSuccess', user.value);
          console.log('Zalogowano użytkownika:', user.value);
          router.push('/index')
        })
      } catch (error) {
        console.error('Błąd logowania:', error.message);
      }
    };
</script>

<style scoped>
.lightMode {
    --form-background: #f9fea2;
    --control-background: #eaeac7;
    --control-text: #0303c6;
    --placeholder-text: #444;
    --button-background: #00ff22;
    --button-text: #222;
}


.darkMode {
    --form-background: #222;
    --control-background: #062235;
    --control-text: #94c2e1;
    --placeholder-text: #ccc;
    --button-background: #0f3d15;
    --button-text: #f9fea2;
}

.login {
    text-align: center;
    background-color: var(--form-background);
    border: 2px solid #ccc;
    padding: 20px;
    display: inline-block;
    margin: 20px;
}

.form-group {
    margin: 10px 0;
}

.form-control {
    background-color: var(--control-background);
    color: var(--control-text);
    width: 100%;
    padding: 8px;
    font-size: 16px;
    text-align: center;
    margin: 0 auto;
}

.form-control::placeholder {
    color: var(--placeholder-text);
}

.number-input {
    width: 50%;
}

.form-button {
    font-size: 16px;
    background-color: var(--button-background);
    color: var(--button-text);
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.result {
    margin-top: 20px;
    font-size: 18px;
}
</style>