import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export const useGameStore = defineStore('game', () => {
  const router = useRouter()

  const playerName = ref('')
  const score = ref(null) // Score is null until calculated by server
  const currentQuestionIndex = ref(0)
  const questions = ref([])
  const userAnswers = ref([]) // Array of { id: questionId, selection: 'A' }
  const reviewData = ref([])
  const loading = ref(false)

  const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
  const isGameOver = computed(() => questions.value.length > 0 && currentQuestionIndex.value >= questions.value.length)

  function setPlayerName(name) {
    playerName.value = name
  }

  async function fetchQuestions() {
    loading.value = true
    questions.value = []
    userAnswers.value = []
    score.value = null

    try {
      // Correct URL param usage
      const url = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL
      const response = await axios.get(url, {
        params: {
          action: 'getQuestions',
          count: 6 // Updated count
        }
      })

      if (response.data && response.data.questions) {
        questions.value = response.data.questions.map(q => ({
          id: q.id,
          text: q.question,
          // Convert options object {A:..., B:...} to array for easy iteration
          options: Object.keys(q.options).map(key => ({
            key: key,
            text: q.options[key]
          }))
        }))
      } else {
        console.error('Invalid data format', response.data)
      }
    } catch (e) {
      console.error('Failed to fetch questions', e)
      // Fallback mock
      questions.value = [
        {
          id: '1',
          text: "Mock Q: What is 2 + 2?",
          options: [
            { key: 'A', text: '3' },
            { key: 'B', text: '4' },
            { key: 'C', text: '5' },
            { key: 'D', text: '6' }
          ]
        }
      ]
    } finally {
      loading.value = false
    }
  }

  function answerQuestion(key) {
    if (!currentQuestion.value) return

    // Record answer
    userAnswers.value.push({
      id: currentQuestion.value.id,
      selection: key
    })

    // Move to next
    currentQuestionIndex.value++
  }

  async function submitGame() {
    loading.value = true
    try {
      const url = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL
      // payload: { userId, answers: [{id, selection}], passed: ? }
      // We can decide 'passed' based on score returned, but code.gs uses it for 'First Clear'.
      // Let's assume we send passed: true if they finish? or we don't send it yet.
      // The code.gs says: `const passed = payload.passed === true;`
      // Let's send it as true for now.

      const payload = {
        action: 'submitScore',
        userId: playerName.value,
        answers: userAnswers.value,
        passed: true
      }

      // DO POST
      // Google Apps Script requires text/plain or specific config to handle CORS correctly sometimes,
      // but axios usually handles JSON. However, standard GAS doPost often needs stringified body if not using specific libraries.
      // Let's try standard JSON post.
      const response = await axios.post(url, JSON.stringify(payload), {
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // CORS hack for GAS
        }
      })

      if (response.data && response.data.success) {
        score.value = response.data.score
        reviewData.value = response.data.review || []
      } else {
        console.error('Submit failed', response.data)
        score.value = 0 // Error case
      }
    } catch (e) {
      console.error('Submission error', e)
      score.value = -1 // Error flag
    } finally {
      loading.value = false
    }
  }

  function resetGame() {
    score.value = null
    currentQuestionIndex.value = 0
    questions.value = []
    userAnswers.value = []
    reviewData.value = []
  }

  return {
    playerName,
    score,
    currentQuestionIndex,
    questions,
    userAnswers,
    reviewData,
    loading,
    currentQuestion,
    isGameOver,
    setPlayerName,
    fetchQuestions,
    answerQuestion,
    submitGame,
    resetGame
  }
})
