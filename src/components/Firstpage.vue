<template>
  <div>
    <h1>首页</h1>
    <p>{{username}},欢迎使用</p>
    <div class="pie">
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main1" style="float:left;width:750px;height: 300px"></div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  data(){
    return{
      username:""
    }
  },
  created(){
    this.getUsername()
  },
  mounted(){
    this.initData();
  },
  methods:{
    getUsername(){
      var that=this
      that.username=sessionStorage.getItem('user');
    },
    //初始化数据
    initData() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main1'));
      // 绘制图表
      myChart.setOption({
        title : {
          text: '这个网站用户访问来源',
          subtext: '纯属虚构',
          x:'center',//x轴方向对齐方式
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          bottom: 'bottom',
          data: ['直接访问','邮件营销','视频广告','feed流']
        },
        series : [
          {
            name: '访问来源',
            type: 'pie',
            radius : '55%',
            center: ['50%', '50%'],
            data:[
              {value:335, name:'直接访问'},
              {value:310, name:'邮件营销'},
              {value:234, name:'feed流'},
              {value:135, name:'视频广告'}
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
    },
  }
}
</script>
<style lang="less">
  
</style>