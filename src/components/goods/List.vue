<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb>
      <BreadcrumbItem :to="{ path: '/home' }">
        <Icon type="ios-home-outline"></Icon> 首页
      </BreadcrumbItem>
      <BreadcrumbItem>
        <Icon type="logo-buffer"></Icon> 商品管理
      </BreadcrumbItem>
      <BreadcrumbItem>
        <Icon type="ios-cafe"></Icon> 商品列表
      </BreadcrumbItem>
    </Breadcrumb>

    <!-- 卡片视图区域 <Icon type="ios-search" />-->
    <Card>
      <Row :gutter="20">
        <Col :span="8">
          <Input placeholder="请输入内容" v-model="queryInfo.query"  @clear="getGoodsList">
            <Icon type="ios-search" slot="append" @click="getGoodsList" />
          </Input>
        </Col>
        <Col :span="4">
          <Button type="primary" @click="goAddpage">添加商品</Button>
        </Col>
      </Row>

      <!-- table表格区域 -->
      <Table border :columns="columns" :data="goodslist">
        <template slot-scope="scope" slot="add_time">
            {{scope.row.add_time | dateFormat}}
        </template>
        <template slot-scope="scope" slot="delGoods">
          <Button @click="removeById(scope.row.goods_id)" type="primary">删除</Button>
        </template>
      </Table>
      <!-- 分页区域 -->
      <Page 
        :total="total" 
        show-sizer 
        @on-change="PageChange"
        @on-page-size-change="PageSizeChange"
        show-total
      />
    </Card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodslist: [],
      //iview渲染列表
      columns: [
        {
          type:'index',
          width: 60,
          align: 'center'
        },
        {
          title: '商品名称',
          key: 'goods_name'
        },
        {
          title: '商品价格',
          key: 'goods_price',
          width:95
        },
        {
          title: '商品重量',
          key: 'goods_weight',
          width:95
        },
        {
          title: '商品数量',
          key: 'goods_number',
          width:95
        },
        {
          title: '添加时间',
          key: 'add_time',
          slot:'add_time',
          width:120
        },
        {
          title: '操作',
          width:130,
          slot: 'delGoods',
          align: 'center'
        }
      ],
      // 总数据条数
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取对应的商品列表
    getGoodsList() {
      this.$http.get('goods',{
        params:this.queryInfo
      }).then(res => {
        let body=res.data
        if(body.meta.status==200){
          this.goodslist = body.data.goods
          this.total = body.data.total
          this.goodid=body.data.goods_id
        }else{
          this.$message.error('获取商品列表失败')
        }
      })
    },
    PageSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    PageChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async removeById(id) {
      const MsgResult = await this.$confirm(
        '此操作将删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (MsgResult !== 'confirm') {
        return this.$message.info('取消删除！')
      }

      this.$http.delete(`goods/${id}`)
        .then(res=>{
          let body=res.data
          if(body.meta.status==200){
            this.$message.success('删除成功！')
            this.getGoodsList()
          }else{
            this.$message.error('删除失败')
          }
      })
    },
    goAddpage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>
