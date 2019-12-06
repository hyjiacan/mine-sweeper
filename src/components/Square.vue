<template>
  <div
    class="square"
    :class="computedClass"
    @click.left="onLeftClick"
    @click.right.prevent="onRightClick"
  >
    <span class="text" style="color:red" v-if="clipped && square.mine">雷</span>
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
      marked: false
    };
  },
  computed: {
    // 自动计算样式
    computedClass() {
      return {
        clipped: this.clipped,
        marked: this.marked
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
      if (this.clipped || this.marked) {
        return;
      }
      this.clipped = true;
      if (this.data.mine) {
        this.$emit("exploded");
      } else {
        this.$emit("clipped");
      }
    },
    onRightClick() {
      this.marked = !this.marked;
      this.$emit("marked", this.marked);
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

.marked {
  &:after {
    content: "旗";
    background-color: red;
    color: white;
    padding: 1px 3px;
    font-size: 12px;
  }
}
</style>