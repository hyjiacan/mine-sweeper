<template>
  <div class="board-square" :class="{clipped}" @click.left="onClick" @click.right.prevent="onFlag">
    <span class="icon-value" v-show="clipped && !data.mine && data.count">{{data.count}}</span>
    <i class="iconfont" :class="classes"/>
    <i class="iconfont icon-flag" v-show="isFlagVisible"/>
    <i class="iconfont icon-question" v-show="isQuestionVisible"/>
    <i class="iconfont icon-cross" v-show="exploded && data.flag && !data.mine"/>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'Square',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  inject: ['eventBus'],
  data () {
    return {
      // 是否已经翻开
      clipped: false,
      questionMark: false,
      exploded: false,
      leftButtonClickTime: 0,
      ready4explode: false
    }
  },
  mounted () {
    this.eventBus.$on('chain-clip', this.onChainClipped)
    this.eventBus.$on('ready', () => {
      this.clipped = false
      this.questionMark = false
      this.exploded = false
      this.leftButtonClickTime = 0
      this.ready4explode = false
    })
    this.eventBus.$on('explode', ({row, col}) => {
      this.ready4explode = true
      if (this.data.row !== row || this.data.col !== col) {
        return
      }
      this.exploded = true
      if (this.data.flag) {
        return
      }
      this.clipped = true
    })
  },
  computed: {
    ...mapState(['status', 'question', 'mineCount', 'flagCount']),
    classes () {
      return {
        'icon-Balloons': !this.clipped,
        'icon-boom': this.clipped && this.data.mine
      }
    },
    isFlagVisible () {
      return (!this.clipped && this.data.flag) || (this.exploded && this.data.flag && !this.data.mine)
    },
    isQuestionVisible () {
      return !this.clipped && this.questionMark
    }
  },
  methods: {
    onClick () {
      if (this.ready4explode || this.status === 'end') {
        return
      }
      if (this.clipped) {
        this.leftButtonClickTime = new Date()
        return
      }
      if (this.data.flag || this.questionMark) {
        return
      }
      this.clipped = true
      this.data.clipped = true
      this.eventBus.$emit('clip', this.data)
    },
    onChainClipped ({row, col}) {
      if (this.data.row === row && this.data.col === col) {
        this.onClick()
      }
    },
    onFlag () {
      if (this.clipped) {
        this.checkAutoClip()
        return
      }
      if (this.data.flag) {
        if (this.question) {
          this.questionMark = true
        }
        this.eventBus.$emit('flag-off', this.data)
        return
      }

      if (this.question && this.questionMark) {
        this.questionMark = false
        return
      }

      if (this.mineCount > this.flagCount) {
        this.eventBus.$emit('flag-on', this.data)
      }
    },
    checkAutoClip () {
      // click right button after left button in 500ms, do auto clip
      let now = new Date()
      if (now - this.leftButtonClickTime >= 500) {
        return
      }
      this.eventBus.$emit('request-auto-clip', this.data)
    }
  },
  beforeDestroy () {
    this.clipped = false
    this.data.flag = false
    this.questionMark = false
  }
}
</script>

<style lang="less" scoped>
.board-square {
  width: 40px;
  height: 40px;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  position: relative;
  cursor: url('../assets/icon/needle.svg'), default;

  &.clipped {
    cursor: default;
  }
}

.iconfont {
  font-size: 28px;
  color: #9baf9e;
}

.icon-Balloons {
  &:hover {
    color: #d0796a;
  }
}

@keyframes fadein {
  0% {
    opacity: 0;
    transform: scale(0.5);
    border-radius: 50%;
  }
  20% {
    transform: scale(2);
  }
  25% {
    transform: scale(1);
  }
  30% {
    transform: scale(2);
  }
  60% {
    transform: scale(1.5);
    border-radius: 50%;
  }
  65% {
    transform: scale(1);
  }
  70% {
    transform: scale(3);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    border-radius: 0;
    background-color: #f32a15;
    color: #ffffff;
  }
}

.icon-boom {
  color: #333333;
  width: 40px;
  height: 40px;
  animation-delay: 100ms;
  animation-name: fadein;
  animation-duration: 1s;
  animation-timing-function: ease-out;
}

.icon-flag {
  color: #e46c6c;
}

.icon-question {
  color: rgba(255, 0, 165, 0.93);
}

.icon-cross, .icon-question, .icon-flag {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
