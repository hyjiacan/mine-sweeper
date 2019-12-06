<template>
  <div id="app">
    <main-page/>
  </div>
</template>

<script>
import MainPage from './views/Main.vue'

export default {
  name: 'app',
  components: {
    MainPage
  }
}
</script>

<style>
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-width: 1080px;
  overflow: auto;
}
</style>
