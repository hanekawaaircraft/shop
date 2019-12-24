<template>
  <div>
    <h1>首页</h1><p>欢迎使用</p>
    <Circle
      :size="250"
      :trail-width="4"
      :stroke-width="5"
      :percent="75"
      stroke-linecap="square"
      stroke-color="#43a3fb">
      <div class="demo-Circle-custom">
        <h1>42,001,776</h1>
        <p>消费人群规模</p>
        <span>
          总占人数
          <i>75%</i>
        </span> 
      </div>
    </Circle>
  </div>
</template>
<script>
export default {
    
}
</script>
<style lang="less">
  
</style>