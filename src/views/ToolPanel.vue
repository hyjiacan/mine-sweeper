<template>
  <div class="tool-panel">
    <div class="board-info">
      <div class="title">
        Mine Sweeper
      </div>
      <hr>
      <div class="control-buttons">
        <button @click="$emit('restart')" :disabled="controlButtonDisabled">
          <i class="iconfont icon-restart-fill"/>
          <span>restart</span>
        </button>
        <button @click="$emit('pause')" :disabled="controlButtonDisabled || status === 'end'">
          <i class="iconfont icon-pause"/>
          <span>pause</span>
        </button>
      </div>
      <div class="control">
        <label>
          <input type="checkbox" :disabled="status !== '' && status !== 'end'" @change="onQuestionChange"
                 style="vertical-align: -2px" checked/>
          <span>question mark</span>
        </label>
        <table class="level-control">
          <tr>
            <td v-for="i in 5" :key="i">
              <div :class="{active: level === i, disabled: status !== '' && status !== 'end'}" @click="updateLevel(i)">
                <span>L{{i}}</span>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <hr>
      <div class="info">
        <div>
          <i class="iconfont icon-Balloons"/>
          <span>{{flagCount + clipCount}}/{{squareCount}}</span>
        </div>
        <div>
          <i class="iconfont icon-boom"/>
          <span>{{flagCount}}/{{mineCount}}</span>
        </div>
        <div v-show="status !== ''">
          <i class="iconfont icon-clock"/>
          <span>{{timeSpan}}</span>
        </div>
      </div>
      <div>
        <a href="https://gitee.com/hyjiacan/mine-sweeper">Source Code</a>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'

export default {
  name: 'ToolPanel',
  inject: ['eventBus'],
  methods: {
    updateLevel (i) {
      this.$store.commit('updateLevel', i)
    },
    onQuestionChange (e) {
      this.$store.commit('updateQuestion', e.target.checked)
    }
  },
  computed: {
    controlButtonDisabled () {
      return this.status === '' || this.status === 'pause'
    },
    ...mapState(['status', 'mineCount', 'size', 'clipCount', 'squareCount', 'result', 'level', 'flagCount', 'question']),
    ...mapGetters(['timeSpan'])
  }
}
</script>

<style lang="less" scoped>
.board-info {
  position: fixed;
  right: 0;
  top: 0;
  color: #5887d3;
  font-size: 16px;
  line-height: 24px;
  width: 200px;
  padding: 20px;
  box-sizing: border-box;
  background-color: rgba(245, 249, 161, 0.23);

  > span {
    margin-right: 10px;
  }

  &:after {
    content: ' ';
    clear: both;
    display: block;
  }
}

.info {
  .iconfont {
    margin-right: 10px;
  }
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.level-control {
  margin-top: 10px;
  border-collapse: collapse;
  width: 100%;

  td {
    border: none;
  }

  div {
    display: block;
    padding: 2px;
    cursor: pointer;
    text-align: center;
    border-bottom: 2px solid transparent;

    &:not(.disabled):hover {
      border-color: #44aacc;
    }

    &.disabled {
      cursor: not-allowed;
    }

    &.active {
      border-color: #0077aa;
    }
  }
}

.control-buttons {
  padding-top: 10px;

  button {
    border: none;
    background: none;
    color: #558ccb;
    cursor: pointer;

    &:not(:disabled):hover {
      color: #0089ff;
    }

    &:disabled {
      cursor: not-allowed;
      color: #90aacb;
    }

    i {
      font-size: 40px;
    }

    > span {
      display: block;
      text-align: center;
      text-transform: uppercase;
    }
  }
}

a {
  font-size: 12px;
  margin-top: 20px;
  display: inline-block;
  color: #0089ff;

  &:hover {
    color: #d8533b;
    text-decoration: underline;
  }
}
</style>
