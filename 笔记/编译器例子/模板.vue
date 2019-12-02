<template>
<div class="app">
  <input v-model="modelText"/>
  <div v-for="(item, index) in list" :key="index">{{item}}</div>
  <div v-if="showCondition == 1">测试v-if指令</div>
  <div v-else-if="showCondition == 2">测试v-else-if指令</div>
  <div v-else>测试v-else指令</div>
  <div class="app-btn" @click.stop="onBtnClick">测试点击事件</div>
  <div class="app-text">测试纯文本{{interpolation}}</div>
  <div class="app-class" :class="{'active': isActive}">绑定HTML class</div>
  <div class="app-attr" attr1="val1" attr2="val2" :shop="shopId">测试属性</div>
  <div style="border: 3px solid #0f0" :style="styleObject">测试style</div>
  <hello :msg="helloMsg"></hello>
</div>
</template>
