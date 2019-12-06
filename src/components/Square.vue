<template>
  <div
    class="square"
    :class="computedClass"
    @click.left="onLeftClick"
    @click.right.prevent="onRightClick"
  >
    <span class="text" v-if="clipped && square.mine">雷</span>
    <span class="text" v-if="clipped && !square.mine">{{countText}}</span>
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
      clipped: false,
      // 标记是否已经插上了旗
      flagged: false
    };
  },
  computed: {
    // 自动计算样式
    computedClass() {
      return {
        clipped: this.clipped,
        flagged: this.flagged
      };
    },
    square() {
      return this.data || {};
    },
    countText() {
      return this.data.count ? this.data.count : "";
    }
  },
  methods: {
    onLeftClick() {
      if (this.clipped || this.flagged) {
        return;
      }
      this.clipped = true;
    },
    onRightClick() {
      this.flagged = !this.flagged;
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

.flagged {
  &:after {
    content: "旗";
    background-color: red;
    color: white;
    padding: 1px 3px;
    font-size: 12px;
  }
}
</style>