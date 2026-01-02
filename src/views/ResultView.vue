<script setup>
import { onMounted } from 'vue'
import { useGameStore } from '../stores/game'
import { useRouter } from 'vue-router'

const gameStore = useGameStore()
const router = useRouter()

onMounted(async () => {
    if (!gameStore.playerName) {
        router.push('/')
        return
    }
    // Automatically submit score when entering this view
    if (gameStore.score === null) {
        await gameStore.submitGame()
    }
})

const restart = () => {
    gameStore.resetGame()
    router.push('/')
}
</script>

<template>
  <div class="result-view">
    <h1>Game Over</h1>
    
    <div v-if="gameStore.loading" class="loading">
        Calculating Score...
    </div>
    
    <div v-else class="score-card">
        <p>Player: {{ gameStore.playerName }}</p>
        <p class="final-score">Final Score: {{ gameStore.score }}</p>
        <div v-if="gameStore.score === -1" class="error">
            Error submitting score.
        </div>
    </div>

    <div v-if="gameStore.reviewData.length > 0" class="review-section">
      <h2>Review</h2>
      <div v-for="item in gameStore.reviewData" :key="item.id" class="review-item">
        <p class="review-question">{{ item.question }}</p>
        <div class="review-answers">
          <p :class="{'correct': item.isCorrect, 'incorrect': !item.isCorrect}">
            Your Answer: {{ item.yourSelection }} ({{ item.yourAnswerText }})
          </p>
          <p v-if="!item.isCorrect" class="correct-highlight">
            Correct Answer: {{ item.correctSelection }} ({{ item.correctAnswerText }})
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-view {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
}

h1 {
    font-size: 3rem;
    color: var(--color-primary);
    text-shadow: 4px 4px 0px #000;
}

.loading {
    font-size: 1.5rem;
    color: white;
    animation: blink 1s infinite;
}

@keyframes blink {
    50% { opacity: 0.5; }
}

.score-card {
    border: 4px solid #000;
    padding: 2rem;
    background: white;
    box-shadow: 8px 8px 0px rgba(0,0,0,0.2);
    min-width: 300px;
}

.final-score {
    font-size: 2rem;
    color: var(--color-accent);
    margin-top: 1rem;
}

.error {
    color: red;
    margin-top: 1rem;
}

.review-section {
  width: 100%;
  max-width: 600px;
  margin-top: 2rem;
  border: 4px solid #000;
  padding: 1rem;
  background: white;
  text-align: left;
  color: #000;
}

.review-item {
  border-bottom: 2px dashed #ccc;
  padding: 1rem 0;
}

.review-item:last-child {
  border-bottom: none;
}

.review-question {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.correct {
  color: green;
}

.incorrect {
  color: red;
}

.correct-highlight {
  color: green;
  font-weight: bold;
  margin-top: 0.25rem;
}

.btn-restart {
    font-family: inherit;
    font-size: 1.5rem;
    padding: 1rem 2rem;
    border: 4px solid #000;
    background-color: var(--color-primary);
    color: white;
    cursor: pointer;
    box-shadow: 4px 4px 0px #000;
}

.btn-restart:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #000;
}
.btn-restart:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
