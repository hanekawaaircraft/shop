<template>
 <!-- eslint-disable -->
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
        <Icon type="ios-cafe"></Icon> 分类列表
      </BreadcrumbItem>
    </Breadcrumb>

    <!-- 卡片视图区域 -->
    <Card>
      <!-- 表格 -->
      <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false"><Icon type="ios-checkmark-circle-outline" color="blue" size="20"/></i>
          <i v-else><Icon type="ios-alert-outline" color="danger" size="20"/></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <Tag v-if="scope.row.cat_level===0">一级</Tag>
          <Tag color="success" v-else-if="scope.row.cat_level===1">二级</Tag>
          <Tag color="warning" v-else>三级</Tag>
        </template>
        <!-- 操作 -->
        <!-- <template slot="active">
          <Button type="primary">编辑</Button>
          &nbsp;
          <Button>删除</Button>
        </template> -->
      </tree-table>

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
/* eslint-disable*/
export default {
  data() {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      // 商品分类
      catelist: [],
      // 总数据
      total: 0,
      //iview渲染表格项
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        // {
        //   label: '操作',
        //   type: 'template',
        //   template: 'active',
        //   width:200
        // }
      ],
      // 添加分类
      addCateShow: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 大类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
    }
  },
  mounted() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    getCateList() {
      this.$Loading.start();
      this.$http.get('categories',{
        params: this.querInfo
      }).then(res=>{
        let body=res.data
        if (body.meta.status == 200) {
          console.log(body)
          this.catelist = body.data.result
          this.total = body.data.total
          this.$Loading.finish();
        }
        else{
          return this.$message.error('获取商品分类失败！')
          this.$Loading.error();
        }
      })
    },
    //pagesize 
    PageSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    //pagenum
    PageChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.ivu-layout-sider{
  min-width:240px !important;
}
.zk-table__body-wrapper{ 
  overflow: hidden !important;
  }
</style>
