<template>
    <div class="history">
        <div class="integral-form">
            <slot name="historyLabel"></slot>
            <p v-for="(entry, index) in props.history" :key="index" class="integral-history" @click="removeEntry(index)">  
                <span class="integral-symbol-history">∫ 
                        <sup class="upper-limit-history">{{ entry.end }}</sup>
                        <sub class="lower-limit-history">{{ entry.start }}</sub>
                    </span>
                    {{ entry.equation }} dx = {{ entry.result }}                           
            </p>
        </div>
    </div> 
</template>

<script setup>
    import { defineProps, defineEmits } from 'vue';

    const props = defineProps(['history']);
    const emits = defineEmits(['removeEntry']);

    const removeEntry = (index) =>
    {
        if (!window.confirm("Czy na pewno chcesz usunąć to równanie z historii?")) return;
        emits('removeEntry', index)
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

    .calculator {
        text-align: center;
        padding: 20px;
    }

    .history {
        text-align: center;
        padding: 20px;
    }

    .integral-pattern {
        font-size: 36px;
        font-family: 'Kaushan Script', cursive;
    }

    .integral-history {
        font-size: 16px;
        font-family: 'Kaushan Script', cursive;
        cursor: pointer;
    }

    .integral-symbol {
        font-size: 64px;
        font-family: 'Kaushan Script';
        position: relative;
        left: 20px;
    }

    .integral-symbol-history {
        font-size: 24px;
        font-family: 'Kaushan Script';
        position: relative;
        left: 20px;
    }

    .upper-limit {
        font-size: 24px;
        font-family: 'Kaushan Script', cursive;
        position: relative;
        top: -40px;
        left: -10px;
    }

    .upper-limit-history {
        font-size: 10px;
        font-family: 'Kaushan Script', cursive;
        position: relative;
        top: -25px;
        left: -12px;
    }

    .lower-limit {
        font-size: 24px;
        font-family: 'Kaushan Script', cursive;
        position: relative;
        left: -25px;
    }

    .lower-limit-history {
        font-size: 10px;
        font-family: 'Kaushan Script', cursive;
        position: relative;
        left: -20px;
        top: 12px;
    }

    .integral-form {
        background-color: var(--form-background);
        border: 2px solid #ccc;
        padding: 20px;
        display: inline-block;
        margin: 0 auto;
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