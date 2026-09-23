<template>
    <div class="calculator">
        <div class="integral-form">
            <div class="integral-pattern">
                <p>
                    <span class="integral-symbol">∫
                        <sup class="upper-limit">b</sup>
                        <sub class="lower-limit">a</sub>
                    </span>s
                    f(x) dx
                </p>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="start">Dolna granica całkowania:</label>
                        <input v-model="start" id="start" class="form-control number-input" placeholder="Wpisz a">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="end">Górna granica całkowania:</label>
                        <input v-model="end" id="end" class="form-control number-input" placeholder="Wpisz b">
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label for="equation">Równanie podcałkowe:</label>
                <input v-model="equation" id="equation" class="form-control" placeholder="Wpisz f(x)">
            </div>

            <div class="result">
                <p><span ref="resultLabel">Wynik:</span> {{ result }}</p>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <slot></slot>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <button v-show="!isNaN(result)" @click="saveToHistory" class="form-button">Zapisz wynik</button>
                    </div>
                </div>
            </div>
        </div>
    </div> 
</template>
  

<script setup>
import { ref, onMounted, computed, watch, onUpdated, defineEmits } from 'vue';


    const equation = ref('');
    const start = ref('');
    const end = ref('');
    const result = ref('(wpisz funkcję)');
    const resultLabel = ref(null);

    const emits = defineEmits(['toggleHistory', 'saveToHistory']);


    onMounted(() =>
    {
        const savedData = localStorage.getItem('integralInputData');
        if (savedData)
        {
            const parsedData = JSON.parse(savedData);
            start.value = parsedData.start;
            end.value = parsedData.end;
            equation.value = parsedData.equation;
        }
    });

    onUpdated(() =>
    {
        if (!isNaN(result.value)) {
            resultLabel.value.style.display = 'inline';
        } else {
            resultLabel.value.style.display = 'none';
        }
    });

    const isDataValid = computed(() =>
    {
        const allowedChars = /^[0-9x+\-*/.]*$/;
        return allowedChars.test(equation.value) && !isNaN(start.value) && !isNaN(end.value);
    });

    const calculate = () => 
    {
        if (!isDataValid.value)
        {
            result.value = '(wpisz funkcję)';
        }
        else
        {
            try
            {
                const f = x => eval(equation.value.replace(/x/g, x));
                const a = parseFloat(start.value);
                const b = parseFloat(end.value);
                const h = (b - a) / 10000;
                let integral = 0;

                for (let i = 0; i < 10000; i++) {
                    const x0 = a + i * h;
                    const x1 = a + (i + 1) * h;
                    integral += (f(x0) + f(x1)) / 2 * h;
                }
                result.value = parseFloat(integral.toFixed(6));
                saveData();
            }
            catch (error)
            {
                result.value = '(popraw funkcję)';
            }
        }
    };

    const saveData = () =>
    {
        const dataToSave = {
        start: start.value,
        end: end.value,
        equation: equation.value,
        };
        localStorage.setItem('integralInputData', JSON.stringify(dataToSave));
    };

    const saveToHistory = () =>
    {
        emits('saveToHistory', equation, start, end, result);
    };

    //const toggleHistory = () =>
    //{
    //    emits('toggleHistory');
    //};

    watch ([equation, start, end], () =>
    {
        calculate();
    });
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

    .integral-pattern {
        font-size: 36px;
        font-family: 'Kaushan Script', cursive;
    }

    .integral-symbol {
        font-size: 64px;
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

    .lower-limit {
        font-size: 24px;
        font-family: 'Kaushan Script', cursive;
        position: relative;
        left: -25px;
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