<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb separator-class="el-icon-arrow-right">
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
      <Table border :columns="columns12" :data="goodslist">
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
        @on-change="handleCurrentChange"
        @on-page-size-change="handleSizeChange"
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
      columns12: [
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
          title: '商品重量',
          key: 'goods_price',
          width:95
        },
        {
          title: '商品价格',
          key: 'goods_weight',
          width:70
        },
        {
          title: '创建时间',
          width:110,
          slot: 'add_time',
          key: 'add_time'
        },
        {
          title: '操作',
          width:130,
          slot: 'delGoods',
          align: 'center'
          // render: (h, params) => {
          //   return h('div', [
          //     h('Button', {
          //       props: {
          //         type: 'primary',
          //         size: 'small'
          //       },
          //       on: {
          //         click: () => {
          //           this.removeById(goodid)
          //         }
          //       }
          //     }, '删除'),
          //   ]);
          // }
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
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }

      this.$message.success('获取商品列表成功！')
      console.log(res.data)
      this.goodslist = res.data.goods
      this.total = res.data.total
      this.goodid=res.data.goods_id
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async removeById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除！')
      }

      const { data: res } = await this.$http.delete(`goods/${id}`)

      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }

      this.$message.success('删除成功！')
      this.getGoodsList()
    },
    goAddpage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
.ivu-row{
  margin: 0 0 10px 0
}
.ivu-page{
  margin-top: 20px;
}
</style>
