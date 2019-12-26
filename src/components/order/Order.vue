<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb>
        <BreadcrumbItem :to="{ path: '/home' }">
          <Icon type="ios-home-outline"></Icon> 首页
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Icon type="logo-buffer"></Icon> 订单管理
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Icon type="ios-cafe"></Icon> 订单列表
        </BreadcrumbItem>
    </Breadcrumb>


    <!-- 卡片视图区域 -->
    <Card>
      <!-- 订单列表数据 -->
      <Table border :columns="columns" :data="orderlist">
        <template slot-scope="scope" slot="pay_status">
          <Tag color="success" v-if="scope.row.pay_status === '1'">已付款</Tag>
          <Tag color="default" v-else>未付款</Tag>
        </template>
        <template slot-scope="scope" slot="is_send">
          <template>
            {{scope.row.is_send}}
          </template>
        </template>
        <template slot-scope="scope" slot="create_time">
          {{scope.row.create_time | dateFormat}}
        </template>
        <template slot-scope="scope" slot="active">
          <Icon type="ios-cog" size="30" @click="showBox"/>
          <Icon type="ios-bus" size="30" @click="showProgressBox"/>
        </template>
      </Table>
     
       <Page 
        :total="total" 
        show-sizer 
        @on-change="PageChange"
        @on-page-size-change="PageSizeChange"
        show-total
      />
    </Card>

    <!-- 修改地址的对话框 -->
    <Modal title="修改地址" v-model="addressVisible" width="50%" @close="addressDialogClosed">
      <Form :model="addressForm" :rules="addressFormRules" ref="addressFormRef">
        <FormItem label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </FormItem>
        <FormItem label="详细地址" prop="address2">
          <Input v-model="addressForm.address2"></Input>
        </FormItem>
      </Form>
      <span slot="footer" class="dialog-footer">
        <Button @click="addressVisible = false">取 消</Button>
        <Button type="primary" @click="addressVisible = false">确 定</Button>
      </span>
    </Modal>

    <!-- 展示物流进度的对话框 -->
    <Modal title="物流进度" v-model="progressVisible" width="50%">
      <!-- 时间线 -->
      <Timeline>
        <TimelineItem v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </TimelineItem>
      </Timeline>
    </Modal>
  </div>
</template>

<script>
import cityData from './citydata.js'

export default {
  data() {
    return {
      //iview渲染表格
      columns: [
        {
          type:'index',
          width: 60,
          align: 'center'
        },
        {
          title: '订单编号',
          key: 'order_number'
        },
        {
          title: '订单价格',
          key: 'order_price',
          width: 130,
        },
        {
          title: '是否付款',
          key: 'pay_status',
          slot:'pay_status',
          width: 130,
        },
        {
          title: '是否发货',
          slot: 'is_send',
          key: 'is_send',
          width: 130,
        },
        {
          title: '下单时间',
          slot: 'create_time',
          key: 'create_time'
        },
        {
          title: '操作',
          slot: 'active',
          align: 'center',
          width: 130,
        }
      ],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderlist: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      progressVisible: false,
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败！')
      }

      console.log(res)
      this.total = res.data.total
      this.orderlist = res.data.goods
    },
    PageSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    PageChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 展示修改地址的对话框
    showBox() {
      this.addressVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')

      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败！')
      }

      this.progressInfo = res.data

      this.progressVisible = true
      console.log(this.progressInfo)
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
.ivu-page{
  margin-top: 15px;
}
</style>
