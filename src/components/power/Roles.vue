<template>
 <!-- eslint-disable -->
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
        <Icon type="ios-cafe"></Icon> 角色列表
      </BreadcrumbItem>
    </Breadcrumb>

    <!-- 卡片视图 -->
    <Card>
      <!-- 添加角色按钮区域 -->
      <!-- <Row>
        <Col>
          <Button color="primary">添加角色</Button>
        </Col>
      </Row> -->

      <Table border :columns="columns" :data="rolelist">
        <template slot-scope="scope" slot="active">
          <!-- <Button type="primary">编辑</Button> &nbsp;-->
          <!-- <Button type="info">删除</Button>  &nbsp; -->
          <Button type="success" @click="showSetRightModal(scope.row)">分配权限</Button>
        </template>
      </Table>
    </Card>

    <!-- 分配权限的对话框 -->
    <Modal title="分配权限" v-model="setRightShow" width="50%" @on-close="setRightHide">
      <!-- 树形控件 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <Button @click="setRightShow = false">取 消</Button>
        <Button type="primary" @click="allotRights">确 定</Button>
      </span>
    </Modal>
  </div>
</template>

<script>
/*eslint-disable*/
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
          title: '角色名称',
          key: 'roleName'
        },
        {
          title: '角色描述',
          key: 'roleDesc',
        },
        {
          title: '操作',
          key: 'active',
          slot:'active',
          align: 'center',
        }
       ],
      // 所有角色列表数据
      rolelist: [],
      // 控制分配权限对话框的显示与隐藏
      setRightShow: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    getRolesList() {
      this.$http.get('roles').then(res => {
        let body=res.data
        if (body.meta.status == 200) {
          this.rolelist = res.data.data
        }else{
          return this.$message.error('获取角色列表失败！')
        }
      })
    },
    
    // 展示分配权限的对话框
    showSetRightModal(role) {
      this.defKeys = []
      this.roleId = role.id
      this.$http.get('rights/tree')
      .then(res => {
        if(res.data.meta.status==200){
          this.rightslist = res.data.data
          console.log(this.rightslist)
          // 递归获取三级节点的Id
          this.getLeafKeys(role, this.defKeys)
          this.setRightShow = true
        }else{
          this.$message.error('获取权限数据失败！')
        }
        
      })
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，那么就为三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightHide() {
      this.defKeys = []
    },
    // 点击为角色分配权限
      allotRights() {
      const keys = [
        //element ui官方API 返回目前半选中的节点所组成的数组 以及 目前半选中的节点的 key 所组成的数组
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')

      this.$http.post(`roles/${this.roleId}/rights`,{ 
        rids: idStr 
      }).then(res=>{
        if(res.data.meta.status==200){
          this.$message.success('分配权限成功!')
          this.getRolesList()
          this.setRightShow=false
        }else{
          this.$message.error('分配权限失败！')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .ivu-col{
    margin-bottom: 10px;
  }
</style>
