<template>
  <div id="app">
    <navbar />
    <did />
  </div>
</template>

<script>
import navbar from '@/components/Navbar'
import did from '@/components/Did'

export default {
  name: 'app',
  components: {
    navbar,
    did
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 0;
}
</style>
