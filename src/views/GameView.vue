<script setup>
import { onMounted, watch } from 'vue'
import { useGameStore } from '../stores/game'
import { useRouter } from 'vue-router'

const gameStore = useGameStore()
const router = useRouter()

onMounted(async () => {
    if (!gameStore.playerName) {
        router.push('/')
        return
    }
    if (gameStore.questions.length === 0) {
        await gameStore.fetchQuestions()
    }
})

watch(() => gameStore.isGameOver, (newVal) => {
    if (newVal) {
        router.push('/result')
    }
})
</script>

<template>
  <div class="game-view">
    <div v-if="gameStore.loading" class="loading">Loading...</div>
    <div v-else-if="gameStore.currentQuestion" class="question-container">
      <div class="stats">
        <span>Level: {{ gameStore.currentQuestionIndex + 1 }} / {{ gameStore.questions.length }}</span>
      </div>
      
      <h2 class="question-text">{{ gameStore.currentQuestion.text }}</h2>
      
      <div class="options-grid">
        <button 
            v-for="option in gameStore.currentQuestion.options" 
            :key="option.key"
            class="option-btn"
            @click="gameStore.answerQuestion(option.key)"
        >
          <span class="key-hint">{{ option.key }}.</span> {{ option.text }}
        </button>
      </div>
    </div>
    <div v-else>
       <!-- Fallback -->
    </div>
  </div>
</template>

<style scoped>
.game-view {
  width: 100%;
  max-width: 800px;
  padding: 2rem;
  text-align: center;
}

.loading {
    font-size: 2rem;
    color: var(--color-accent);
}

.stats {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 2rem;
    font-size: 1.2rem;
}

.question-text {
    font-size: 1.5rem;
    margin-bottom: 3rem;
    line-height: 1.5;
}

.options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

.option-btn {
    font-family: inherit;
    padding: 1.5rem;
    font-size: 1rem;
    border: 4px solid #000;
    background: white;
    box-shadow: 4px 4px 0px #000;
    cursor: pointer;
    transition: all 0.1s;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 10px;
}

.key-hint {
    color: var(--color-primary);
    font-weight: bold;
}

.option-btn:hover {
    background: var(--color-secondary);
    color: white;
}
.option-btn:hover .key-hint {
    color: white;
}

.option-btn:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #000;
}
@media (max-width: 600px) {
  .game-view {
    padding: 1rem;
  }
  .options-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
