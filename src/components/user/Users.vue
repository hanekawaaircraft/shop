<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb>
        <BreadcrumbItem :to="{ path: '/home' }">
          <Icon type="ios-home-outline"></Icon> 首页
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Icon type="logo-buffer"></Icon> 用户管理
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Icon type="ios-cafe"></Icon> 用户列表
        </BreadcrumbItem>
    </Breadcrumb>

    <!-- 卡片视图区域 -->
    <Card>
      <!-- 用户列表区域 -->
      <Table border :columns="columns" :data="userlist">
        <template slot-scope="scope" slot="mg_state">
          <i-switch v-model="scope.row.mg_state" @on-change="userStateChanged(scope.row)">
          </i-switch>
        </template>
        <template slot-scope="scope" slot="active">
          <!-- 修改按钮 -->
          <Icon type="md-settings" size="30" @click="showEditModal(scope.row.id)"/>
          <!-- 删除按钮 -->
          <Icon type="ios-trash" size="32" @click="removeUserById(scope.row.id)"/>
          <!-- 分配角色按钮 -->
          <Tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <Icon type="ios-pie"size="29" @click="setRole(scope.row)"/>
          </Tooltip>
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

    <!-- 添加用户的对话框 -->
    <Modal title="添加用户" v-model="addModalShow" width="50%" @close="addModalHide">
      <!-- 内容主体区域 -->
      <Form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <FormItem label="用户名" prop="username">
          <Input v-model="addForm.username"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="addForm.password"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="addForm.email"></Input>
        </FormItem>
        <FormItem label="手机" prop="mobile">
          <Input v-model="addForm.mobile"></Input>
        </FormItem>
      </Form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <Button @click="addModalShow = false">取 消</Button>
        &nbsp;
        <Button type="primary" @click="addUser">确 定</Button>
      </span>
    </Modal>

    <!-- 修改用户的对话框 -->
    <Modal title="修改用户" v-model="editModalShow" width="50%" @close="addModalHide">
      <Form :model="editForm" :rules="editFormRules" ref="editFormRef">
        <FormItem label="用户名">
          <Input v-model="editForm.username" disabled></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="editForm.email"></Input>
        </FormItem>
        <FormItem label="手机" prop="mobile">
          <Input v-model="editForm.mobile"></Input>
        </FormItem>
      </Form>
      <span slot="footer" class="dialog-footer">
        <Button @click="editModalShow = false">取 消</Button>
        &nbsp;
        <Button type="primary" @click="editUserInfo">确 定</Button>
      </span>
    </Modal>

    <!-- 分配角色的对话框 -->
    <Modal title="分配角色" v-model="setRoleModalShow" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <Select v-model="selectedRoleId" placeholder="请选择">
            <Option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </Option>
          </Select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button @click="setRoleModalShow = false">取 消</Button>
        &nbsp;
        <Button type="primary" @click="saveRoleInfo">确 定</Button>
      </span>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的正则表达式
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的正则表达式
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10
      },
      userlist: [],
      //iview渲染表格
      columns: [
        {
          type:'index',
          width: 60,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'username'
        },
        {
          title: '邮箱',
          key: 'email',
        },
        {
          title: '电话',
          key: 'mobile',
        },
        {
          title: '角色',
          key: 'role_name',
        },
        {
          title: '状态',
          key: 'mg_state',
          slot:'mg_state',
          width:90
        },
        {
          title: '操作',
          key: 'active',
          slot:'active',
          width:150
        }
      ],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addModalShow: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editModalShow: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleModalShow: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色Id值
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听 pagesize 改变的事件
    PageSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    PageChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听 switch 开关状态的改变
    async userStateChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    // 监听添加用户对话框的关闭事件
    addModalHide() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)

        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }

        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
        this.addModalShow = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditModal(id) {
      // console.log(id)
      const { data: res } = await this.$http.get('users/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }

      this.editForm = res.data
      this.editModalShow = true
    },
    // 监听修改用户对话框的关闭事件
    addModalHide() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }

        // 关闭对话框
        this.editModalShow = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
    // 根据Id删除对应的用户信息
    async removeUserById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('users/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }

      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    // 展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo

      // 在展示对话框之前，获取所有角色的列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }

      this.rolesList = res.data

      this.setRoleModalShow = true
    },
    // 点击按钮，分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }

      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }

      this.$message.success('更新角色成功！')
      this.getUserList()
      this.setRoleModalShow = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>
<style scpoed>
 
</style>
