<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb>
      <BreadcrumbItem :to="{ path: '/home' }">
        <Icon type="ios-home-outline"></Icon> 首页
      </BreadcrumbItem>
      <BreadcrumbItem>
        <Icon type="logo-buffer"></Icon> 权限管理
      </BreadcrumbItem>
      <BreadcrumbItem>
        <Icon type="ios-cafe"></Icon> 权限列表
      </BreadcrumbItem>
    </Breadcrumb>

    <!-- 卡片视图 -->
    <Card>
      <Table border :columns="columns" :data="rightsList" style="width: 100%;">
        <template slot-scope="scope" slot="level">
          <Tag v-if="scope.row.level==='0'">一级</Tag>
          <Tag color="green" v-else-if="scope.row.level==='1'">二级</Tag>
          <Tag color="volcano" v-else>三级</Tag>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      rightsList: [],
      columns: [
        {
          type:'index',
          width: 60,
          align: 'center'
        },
        {
          title: '权限名称',
          key: 'authName'
        },
        {
          title: '路径',
          key: 'path'
        },
        {
          title: '权限等级',
          sortable: true,
          slot: 'level',
          key: 'level'
        }
      ],
    }
  },
  created() {
    // 获取所有的权限
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      this.$Loading.start();
      this.$http.get('rights/list')
        .then(res=>{
        let body=res.data
        if (body.meta.status == 200) {
          this.rightsList = body.data
          console.log(this.rightsList)
          this.$Loading.finish();
        }
        else{
          return this.$message.error('获取商品分类失败！')
          this.$Loading.error();
        }
      })
    }
  }
}
</script>

<style scoped>
.ivu-table-overflowX {
  overflow-x: hidden !important;
}
</style>
