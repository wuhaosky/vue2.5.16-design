<template lang="html">
<div class="app">
    <div class="app-text">vue: {{amount}}</div>
    <div class="app-btn" @click="onBtnClick">点击我</div>
</div>
</template>

<script>
export default {
    name: 'app',
    components: {
    },
    data () {
      return {
        amount: 0
      }
    },
    mounted () {
    },
    methods: {
      onBtnClick(){
        this.amount += 1;
      }
    }
}
</script>

<style scoped lang="less" rel="stylesheet/less">
.app {
  &-text{
    text-align: center;
  }
  &-btn{
    text-align: center;
  }
}
</style>
