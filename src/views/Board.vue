<template>
  <div class="board" @contextmenu.prevent>
    <div class="board-content">
      <table class="board-table">
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <td v-for="col in row" :key="col.col">
            <square :data="col"/>
          </td>
        </tr>
      </table>
    </div>
    <div class="pause-mask" v-show="status === 'pause'">
      <i class="iconfont icon-play" @click="onResume"/>
    </div>
    <div class="result" :class="{'result-visible': !!result}" @click="$store.commit('clearResult')">
      <div v-if="result === 'completed'">
        <i class="iconfont icon-Smile"/>
        <div class="text">
          Hallelu Yah, You smart guy
        </div>
      </div>
      <div v-if="result === 'exploded'">
        <i class="iconfont icon-cry"/>
        <div class="text">
          Oops, you poor guy
        </div>
      </div>
    </div>
    <tool-panel v-show="!result" @restart="onRestart" @pause="onPause"/>
  </div>
</template>

<script>
import Vue from 'vue'
import Square from './Square'
import ToolPanel from './ToolPanel'
import {mapState} from 'vuex'

export default {
  name: 'Board',
  components: {ToolPanel, Square},
  data () {
    const eventBus = new Vue()
    return {
      data: [],
      eventBus,
      timerHandle: -1,
      explodeHandle: -1
    }
  },
  provide () {
    return {
      eventBus: this.eventBus
    }
  },
  mounted () {
    this.eventBus.$on('clip', this.onSquareClipped)
    this.eventBus.$on('flag-on', ({row, col}) => {
      this.$store.commit('increaseFlagCount')
      this.data[row][col].flag = true
      this.checkComplete()
    })
    this.eventBus.$on('flag-off', ({row, col}) => {
      this.$store.commit('decreaseFlagCount')
      this.data[row][col].flag = false
    })
    this.eventBus.$on('request-auto-clip', this.onRequestAutoClip)
    this.timerHandle = setInterval(() => {
      if (this.status !== 'play') {
        return
      }

      this.$store.commit('updateTime')
    }, 50)
    this.$store.commit('updateLevel', 1)
    this.build()
  },
  computed: {
    ...mapState(['status', 'mineCount', 'size', 'clipCount', 'squareCount', 'result', 'level', 'flagCount'])
  },
  watch: {
    level () {
      this.build()
    }
  },
  methods: {
    build () {
      let temp = {}
      let data = []

      clearInterval(this.explodeHandle)

      this.$store.commit('reset')

      this.eventBus.$emit('ready')

      while (Object.keys(temp).length < this.mineCount) {
        let x = this.getRandomPosition()
        let y = this.getRandomPosition()
        let key = `${x}-${y}`
        if (temp.hasOwnProperty(key)) {
          continue
        }
        temp[key] = 1
      }

      for (let i = 0; i < this.size; i++) {
        const row = []
        for (let j = 0; j < this.size; j++) {
          let key = `${i}-${j}`
          row.push({
            row: i,
            col: j,
            count: 0,
            mine: temp.hasOwnProperty(key),
            flag: false,
            clipped: false
          })
        }
        data.push(row)
      }
      // 计算数字
      for (let i = 0; i < data.length; i++) {
        const row = data[i]
        for (let j = 0; j < row.length; j++) {
          let square = row[j]
          if (square.mine) {
            continue
          }
          square.count = this.getMineCount(square, data)
        }
      }

      this.data = data
    },
    getMineCount (square, data) {
      let count = 0

      this.walkAround(square, (x, y) => {
        if (data[x][y].mine) {
          count++
        }
      })
      return count
    },
    getRandomPosition () {
      return Math.round(Math.random() * this.size * 100) % this.size
    },
    onSquareClipped (data) {
      if (!this.clipCount) {
        this.$store.commit('initTime')
        this.$store.commit('updateStatus', 'play')
      }
      if (data.mine) {
        this.onMineExploded()
        return
      }
      this.$store.commit('increaseClipCount')
      if (data.count === 0 && !data.mine) {
        this.clipNeighbour(data.row, data.col)
      }
      this.checkComplete()
    },
    clipNeighbour (row, col) {
      this.walkAround({row, col}, (x, y) => {
        let square = this.data[x][y]
        // 加上动画
        setTimeout(() => {
          this.eventBus.$emit('chain-clip', square)
        }, 50)
      })
    },
    onRequestAutoClip ({row, col, count}) {
      // 周围已经标记的数量
      let flagCount = 0
      let squares = []
      this.walkAround({row, col}, (x, y) => {
        let square = this.data[x][y]
        if (square.flag) {
          flagCount++
          return
        }
        squares.push(square)
      })
      if (count !== flagCount) {
        return
      }
      for (let square of squares) {
        // 加上动画
        setTimeout(() => {
          this.eventBus.$emit('chain-clip', square)
        }, 50)
      }
    },
    /**
     * @param {Object} square
     * @param {Function} callback
     */
    walkAround ({row, col}, callback) {
      let checkBoundary = (x, y) => {
        if (x < 0 || y < 0) {
          return
        }
        if (x >= this.size || y >= this.size) {
          return
        }
        callback(x, y)
      }
      // 左上
      checkBoundary(row - 1, col - 1)
      // 上
      checkBoundary(row - 1, col)
      // 右上
      checkBoundary(row - 1, col + 1)
      // 右
      checkBoundary(row, col + 1)
      // 右下
      checkBoundary(row + 1, col + 1)
      // 下
      checkBoundary(row + 1, col)
      // 左下
      checkBoundary(row + 1, col - 1)
      // 左
      checkBoundary(row, col - 1)
    },
    onMineExploded () {
      let index = 0
      let temp = []
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          temp.push(this.data[i][j])
        }
      }

      this.explodeHandle = setInterval(() => {
        let square = temp[index++]
        while (square.clipped) {
          square = temp[index++]
          if (index >= this.squareCount) {
            clearInterval(this.explodeHandle)
            this.afterGameOver()
            this.$store.commit('updateResult', 'exploded')
            return
          }
        }
        if (square.clipped) {
          return
        }
        this.eventBus.$emit('explode', square)

        if (index < this.squareCount) {
          return
        }
        clearInterval(this.explodeHandle)
        this.afterGameOver()
        this.$store.commit('updateResult', 'exploded')
      }, 50)
    },
    checkComplete () {
      if (this.squareCount - this.clipCount > this.mineCount) {
        return
      }

      this.afterGameOver()
      // 完成
      this.$store.commit('updateResult', 'completed')
    },
    afterGameOver () {
      this.$store.commit('updateStatus', 'end')
    },
    onRestart () {
      if (this.result === 'completed' && this.level < 5) {
        this.$store.commit('updateLevel', this.level + 1)
      }
      this.$store.commit('updateResult', null)
      this.$store.commit('updateStatus', '')

      this.build()
    },
    onPause () {
      this.$store.commit('updateStatus', 'pause')
    },
    onResume () {
      this.$store.commit('updateStatus', 'play')
    }
  },
  beforeDestroy () {
    clearInterval(this.timerHandle)
  }
}
</script>

<style lang="less" scoped>
.board {
  float: left;
  padding: 20px;
}

.board-table {
  border-collapse: collapse;
  border: 1px solid #44aacc;
  margin: auto;
}

td {
  padding: 0;
  border: 1px solid #c7e6ee;
}

.board-content {
  position: relative;
}

.text {
  font-size: 60px;
}

.pause-mask {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #596558;

  i {
    font-size: 120px;
    color: #cccccc;
    cursor: pointer;
    border: 2px solid #cccccc;
    border-radius: 50%;
    display: block;
    width: 150px;
    height: 150px;
    padding: 10px 22px;
    box-sizing: border-box;

    &:hover {
      color: #ffffff;
      border-color: #ffffff;
    }
  }
}

.result {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.73);
  color: rgba(196, 251, 162, 0.8);
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transform: translateY(100%);
  transition: transform 2s;

  &.result-visible {
    transform: translateY(0);
  }
}

.result .iconfont {
  font-size: 400px;
}
</style>
