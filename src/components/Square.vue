<template>
  <div class="square" :class="computedClass" @click="onClick">
    <span class="text" v-if="clipped && square.mine">雷</span>
    <span class="text" v-if="clipped && !square.mine">{{square.count}}</span>
  </div>
</template>

<script>
export default {
  name: "Square",
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 标记此区是否已经被翻开
      clipped: false
    };
  },
  computed: {
    // 自动计算样式
    computedClass() {
      return {
        clipped: this.clipped
      };
    },
    square() {
      return this.data || {};
    }
  },
  methods: {
    onClick() {
      this.clipped = true;
    }
  }
};
</script>
<style lang="less" scoped>
.square {
  display: block;
  height: 30px;
  line-height: 30px;
  width: 30px;
  text-align: center;
  background-color: burlywood;
  /* 设置鼠标动作交互 */
  &:hover {
    background-color: lightblue;
  }
}

.clipped,
.clipped:hover {
  background-color: #ffffff;
}
</style>