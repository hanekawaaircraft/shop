<template>
  <div>
    <h1>{{username}},欢迎使用</h1>
      <Row>
        <Col :span="6">
          <Card>
            <Icon type="md-document"  size="60" style="float:right" />
            <span>昨日分享数:</span>
            <h1>1,587</h1>
          </Card> 
        </Col>
        <Col :span="6">
          <Card> 
            <Icon type="md-share-alt" size="60" style="float:right" />
            <span>平均转化率为:</span>
            <h1>25%</h1>
          </Card>
        </Col>
        <Col :span="6">
          <Card>
            <Icon type="md-eye" size="60" style="float:right" />
            <span>新注册用户:</span>    
            <h1>120</h1>     
          </Card>
        </Col>
        <Col :span="6">
          <Card>
            <Icon type="ios-notifications" size="60" style="float:right" />
            <span> 新提醒</span>  
            <h1>58</h1>  
          </Card>
        </Col>
      </Row>
      <Row :gutter="20">
        <Col :span="12" class="echarts-item">
          <div class="content-title">网站营收</div>
          <ve-line :data="lineChartData" :settings="lineChartSettings" :mark-point="lineChartMarkPoint"  :colors="['#87a997', '#d49ea2']"></ve-line>
        </Col>
        <Col :span="11" class="echarts-item">
          <div class="content-title">网站浏览量</div>
          <ve-pie :data="pieChartData" :settings="pieChartSettings"></ve-pie>
        </Col>
      </Row>
      <Row>
        <Col :span="6">
          <Card to="/rights">
            <div style="text-align:center">
              <Icon type="ios-albums" size="50" />
              <h2>权限管理</h2>
            </div>
          </Card>
        </Col>
        <Col :span="6">
          <Card to="/goods">
            <div style="text-align:center">
              <Icon type="md-cart" size="50"/>
              <h2>商品管理</h2>
            </div>
          </Card>
        </Col>
        <Col :span="6">
          <Card to="users">
            <div style="text-align:center">
              <Icon type="md-contact" size="50" />
              <h2>用户管理</h2>
            </div>
          </Card>
        </Col>
        <Col :span="6">
          <Card to="orders">
            <div style="text-align:center">
              <Icon type="ios-book" size="50"/>
              <h2>订单管理</h2>
            </div>
          </Card>
        </Col>
      </Row> 
      
  </div>
</template>
<script>
import Vue from 'vue'
import VCharts from 'v-charts'
Vue.use(VCharts)
export default {
  // components: { VeLine,VeRing},
  data(){
    return {
      lineChartData: {
        columns: ['日期', '营业额', '毛利', '占比', '其他'],
        rows: [{
          '营业额': 1123, '日期': '1月1日', '毛利': 900, 
        }, {
          '营业额': 1323, '日期': '1月2日', '毛利': 1123,
        }, {
          '营业额': 2123, '日期': '1月3日', '毛利': 1423,
        }, {
          '营业额': 4123, '日期': '1月4日', '毛利': 2023,
        }, {
          '营业额': 3123, '日期': '1月5日', '毛利': 1523,
        }, {
          '营业额': 7183, '日期': '1月6日', '毛利': 2723, 
        },{
          '营业额': 7123, '日期': '1月7日', '毛利': 2423, 
        },{
          '营业额': 6523, '日期': '1月8日', '毛利': 2223, 
        },{
          '营业额': 5623, '日期': '1月9日', '毛利': 1488, 
        },{
          '营业额': 4523, '日期': '1月10日', '毛利': 852, 
        },{
          '营业额': 6123, '日期': '1月11日', '毛利': 2323,
        }]
      },
      lineChartSettings: {
        metrics: ['营业额', '毛利'],
        dimension: ['日期']
      },
      lineChartMarkPoint: {
        data: [{
          name: '最大值',
          type: 'max'
        }]
      },
      pieChartData: {
        columns: ['日期', '浏览量', '讨论量'],
        rows: [{
          '日期': '1月1号', '浏览量': 123, '讨论量': 3
        }, {
          '日期': '1月2号', '浏览量': 823, '讨论量': 60
        }, {
          '日期': '1月3号', '浏览量': 923, '讨论量': 90
        }, {
          '日期': '1月4号', '浏览量': 623, '讨论量': 12
        }, {
          '日期': '1月5号', '浏览量': 523, '讨论量': 15
        }, {
          '日期': '1月6号', '浏览量': 163, '讨论量': 21
        }]
      },
      pieChartSettings: {
        dimension: '日期',
        metrics: '浏览量'
      }
    }
  },
  created(){
    this.getUsername()
  },
  mounted(){
  },
  methods:{
    getUsername(){
      var that=this
      that.username=sessionStorage.getItem('user');
    }
  }
}
</script>
<style lang="less">
.ivu-card{
  margin:4px;
}
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