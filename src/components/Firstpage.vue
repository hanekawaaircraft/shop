<template>
  <div>
    <h1>首页</h1>
    <p>{{username}},欢迎使用</p>
    
    <div class="pie">
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main1" style="float:left;width:750px;height: 300px"></div>
    </div>
    <div style="margin-top:55px">
      <i-circle  
        :size="180"
        :trail-width="4"
        :stroke-width="5"
        :percent="72"
        stroke-linecap="square"
        stroke-color="#5cb85c">
        <div class="demo-Circle-custom">
          <p>消费人群规模</p>
          <h1>42,001,776</h1>
          <span>
            总占人数
            <i>72%</i>
            <p>纯属虚构</p>
          </span>
        </div>
      </i-circle>
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
          data: ['亲朋访问','网页营销','微博广告','feed流']
        },
        series : [
          {
            name: '访问来源',
            type: 'pie',
            radius : '55%',
            center: ['50%', '50%'],
            data:[
              {value:335, name:'亲朋访问'},
              {value:310, name:'网页营销'},
              {value:234, name:'微博广告'},
              {value:135, name:'feed流'}
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
.demo-Circle-custom{
  & h1{
    color: #3f414d;
    font-size: 28px;
    font-weight: normal;
  }
  & p{
    color: #657180;
    font-size: 14px;
    margin: 10px 0 15px;
  }
  & span{
    display: block;
    padding-top: 15px;
    color: #657180;
    font-size: 14px;
    &:before{
      content: '';
      display: block;
      width: 50px;
      height: 1px;
      margin: 0 auto;
      background: #e0e3e6;
      position: relative;
      top: -15px;
    };
  }
  & span i{
    font-style: normal;
    color: #3f414d;
  }
}
</style>