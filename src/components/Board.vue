<template>
  <div class="board">
    <table>
      <tr v-for="i in rows" :key="i">
        <td v-for="j in cols" :key="j">{{i}}-{{j}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "Board",
  data() {
    return {
      // 使用 data 作为扫雷的数据存储
      data: [],
      level: 1,
      mineCount: 9,
      rows: 9,
      cols: 9
    };
  }
};
</script>
