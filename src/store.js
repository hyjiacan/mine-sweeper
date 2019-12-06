import Vue from 'vue'
import VueX from 'vuex'

Vue.use(VueX)

const store = new VueX.Store({
  state: {
    level: 1,
    question: true,
    size: 0,
    squareCount: 0,
    mineCount: 0,
    status: '',
    clipCount: 0,
    flagCount: 0,
    times: [],
    result: null
  },
  mutations: {
    updateLevel (state, level) {
      state.level = level
      state.size = Math.round(Math.sqrt(state.level) * 9)
      state.squareCount = state.size ** 2
      state.mineCount = Math.round((state.level * Math.sqrt(state.level)) * 9)
    },
    increaseClipCount (state) {
      state.clipCount++
    },
    increaseFlagCount (state) {
      state.flagCount++
    },
    decreaseFlagCount (state) {
      state.flagCount--
    },
    updateTime (state) {
      const times = state.times
      times.splice(times.length - 1, 1, new Date())
    },
    initTime (state) {
      let now = new Date()
      state.times = [now, now]
    },
    updateStatus (state, status) {
      if (status === 'play') {
        let now = new Date()
        state.times.push(now, now)
      }
      state.status = status
    },
    updateResult (state, result) {
      state.result = result
    },
    clearResult (state) {
      state.result = null
    },
    reset (state) {
      state.flagCount = 0
      state.clipCount = 0
      state.status = ''
      state.times = []
    },
    updateQuestion (state, value) {
      state.question = value
    }
  },
  getters: {
    timeSpan (state) {
      const times = state.times

      if (!times.length) {
        return '00:00:00.000'
      }

      let span = 0
      for (let i = 0; i < times.length; i += 2) {
        let s = times[i]
        let e = times[i + 1]
        span += e - s
      }

      let ms = (span % 1000).toFixed(0).padStart(3, '0')
      span /= 1000
      let s = (span % 60).toFixed(0).padStart(2, '0')
      span /= 60
      let m = (span % 60).toFixed(0).padStart(2, '0')
      span /= 60
      let h = span.toFixed(0).padStart(2, '0')

      return `${h}:${m}:${s}.${ms}`
    }
  }
})

export default store
