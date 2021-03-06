<template>
  <div class="board">
    <div>雷数量: {{mineCount}}， 已标记: {{markCount}}，剩下: {{mineCount - markCount}}</div>
    <table>
      <tr v-for="(row, rowIndex) in data" :key="rowIndex">
        <td v-for="cell in row" :key="cell.col">
          <square :data="cell" @clipped="onClipped" @exploded="onExploded" @marked="onMarked" />
        </td>
      </tr>
    </table>
    <div class="result" v-if="result">{{result}}</div>
  </div>
</template>

<script>
import Square from "./Square";

export default {
  name: "Board",
  components: { Square },
  data() {
    return {
      // 使用 data 作为扫雷的数据存储
      data: [],
      level: 1,
      mineCount: 9,
      size: 9,
      // 标雷数量
      markCount: 0,
      // 翻开数量
      clipCount: 0,
      // 游戏结果
      result: null
    };
  },
  mounted() {
    this.build();
  },
  watch: {
    remainSquares(v) {
      if (v === 0) {
        this.result = "通关";
      }
    }
  },
  computed: {
    remainSquares() {
      return this.size ** 2 - this.markCount - this.clipCount;
    }
  },
  methods: {
    /**
     * 生成一个随机的位置(限制在 size 内)
     */
    getRandomPosition() {
      return Math.round(Math.random() * 100) % this.size;
    },
    /**
     * 遍历当前单元格周围的八个位置，统计出现雷的数量
     */
    getMineCount(square, data) {
      let count = 0;

      this.walkAround(square, (x, y) => {
        if (data[x][y].mine) {
          count++;
        }
      });
      return count;
    },
    /**
     * 遍历当指定单元格周围的八个位置
     * @param {Object} square
     * @param {Function} callback
     */
    walkAround({ row, col }, callback) {
      let checkBoundary = (x, y) => {
        if (x < 0 || y < 0) {
          return;
        }
        if (x >= this.size || y >= this.size) {
          return;
        }
        callback(x, y);
      };
      // 左上
      checkBoundary(row - 1, col - 1);
      // 上
      checkBoundary(row - 1, col);
      // 右上
      checkBoundary(row - 1, col + 1);
      // 右
      checkBoundary(row, col + 1);
      // 右下
      checkBoundary(row + 1, col + 1);
      // 下
      checkBoundary(row + 1, col);
      // 左下
      checkBoundary(row + 1, col - 1);
      // 左
      checkBoundary(row, col - 1);
    },
    /**
     * 生成雷区数据
     */
    build() {
      let temp = {};
      let data = [];

      // 首先生成雷出现的位置
      while (Object.keys(temp).length < this.mineCount) {
        let x = this.getRandomPosition();
        let y = this.getRandomPosition();
        let key = `${x}-${y}`;
        // 此位置已经被占用，重新生成
        if (temp.hasOwnProperty(key)) {
          continue;
        }
        // 标记为1，表示此处有雷
        temp[key] = 1;
      }

      // 填充数据
      for (let i = 0; i < this.size; i++) {
        const row = [];
        for (let j = 0; j < this.size; j++) {
          let key = `${i}-${j}`;
          row.push({
            row: i,
            col: j,
            // 周围的雷数量
            count: 0,
            // true 表示此处有雷
            mine: temp.hasOwnProperty(key)
          });
        }
        data.push(row);
      }

      // 计算雷周围的数字
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        for (let j = 0; j < row.length; j++) {
          let square = row[j];
          if (square.mine) {
            continue;
          }
          square.count = this.getMineCount(square, data);
        }
      }

      this.data = data;
    },
    onClipped() {
      this.clipCount++;
    },
    onExploded() {
      this.result = "背时，搞爆了";
    },
    onMarked(marked) {
      if (marked) {
        this.markCount++;
      } else {
        this.markCount--;
      }
    }
  }
};
</script>
<style lang="less" scoped>
table {
  border: 1px solid #aaaaaa;
  border-collapse: collapse;
}
td {
  border: 1px solid #aaaaaa;
  padding: 5px;
}
.result {
  font-size: large;
}
</style>
