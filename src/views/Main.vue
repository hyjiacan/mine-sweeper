<template>
  <div class="container">
    <div class="water-print">
      <div class="content" :style="waterPrintStyle">
        <div>
          Designed by hyjiacan
        </div>
        <div>
          Powered by Vue.js
        </div>
      </div>
    </div>
    <board/>
  </div>
</template>

<script>
import Board from './Board'

export default {
  name: 'Main',
  components: {Board},
  data () {
    return {
      timerHandle: -1,
      offsetX: 0,
      offsetY: 0,
      rotate: 0
    }
  },
  mounted () {
    this.timerHandle = setInterval(this.updateTransform, 10000)
    requestAnimationFrame(() => {
      this.updateTransform()
    })
  },
  methods: {
    updateTransform () {
      this.offsetX = Math.random() * window.innerWidth - 100
      this.offsetY = Math.random() * window.innerHeight - 200
      this.rotate = Math.round(Math.random() * 360)
    }
  },
  computed: {
    waterPrintStyle () {
      return {
        position: 'absolute',
        transform: `translate3d(${this.offsetX}px, ${this.offsetY}px, 0) rotate3d(1, 0, 0, ${this.rotate}deg)`
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
}

/*@media screen and (max-width: 1280px) {*/
/*  .container {*/
/*    justify-content: left;*/
/*  }*/
/*}*/

.water-print {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  font-size: 60px;
  line-height: 2;
  user-select: none;

  .content {
    color: rgba(95, 95, 95, 0.1);
    will-change: transform;
    transform: translate3d(0, 0, 0) rotate3d(0, 0, 0, 0);
    transition: transform 10000ms;

    &:hover {
      color: rgba(95, 95, 95, 0.2);
    }
  }
}
</style>
