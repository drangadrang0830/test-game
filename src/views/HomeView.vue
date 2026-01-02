<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'

const router = useRouter()
const gameStore = useGameStore()
const playerName = ref('')

const avatarUrl = computed(() => {
  const seed = playerName.value.trim() || 'default'
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`
})

const startGame = () => {
  if (playerName.value.trim()) {
    gameStore.setPlayerName(playerName.value)
    router.push('/game')
  }
}
</script>

<template>
  <div class="home-view">
    <h1 class="title">Pixel Quiz</h1>
    <div class="avatar-preview">
      <img :src="avatarUrl" alt="Avatar" width="100" height="100" />
    </div>
    <div class="input-group">
      <label for="player-name">Enter Name:</label>
      <input 
        id="player-name" 
        v-model="playerName" 
        type="text" 
        placeholder="Player 1"
        @keyup.enter="startGame"
      />
    </div>
    <button class="btn-start" @click="startGame" :disabled="!playerName.trim()">
      START GAME
    </button>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.title {
  font-size: 3rem;
  text-shadow: 4px 4px 0px #000;
  color: var(--color-primary);
  margin-bottom: 2rem;
}

.avatar-preview img {
  border: 4px solid #000;
  background: white;
  margin-bottom: 2rem;
  max-width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
}

input {
  font-family: inherit;
  padding: 1rem;
  font-size: 1.2rem;
  border: 4px solid #000;
  background: #fff;
  outline: none;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box; 
}

.btn-start {
  font-family: inherit;
  font-size: 1.5rem;
  padding: 1rem 2rem;
  border: 4px solid #000;
  background-color: var(--color-accent);
  color: white;
  cursor: pointer;
  box-shadow: 4px 4px 0px #000;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-start:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #000;
}

.btn-start:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .title {
    font-size: 1.8rem;
  }
}
</style>
