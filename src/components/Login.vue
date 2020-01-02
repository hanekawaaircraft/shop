<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/login.png" alt="">
      </div>
      <Form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login_form">
        <FormItem prop="user">
          <Input type="text" v-model="loginForm.username" placeholder="用户名">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input v-model="loginForm.password" type="password" placeholder="密码">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem class="btns"> 
          <!-- <Checkbox v-model="checked">记住密码</Checkbox> -->
          <Button type="primary" @click="login">登录</Button>
          <!-- <Button @click="handleReset('loginFormRef')">重置</Button> -->
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      //记住密码默认状态
      // checked: false,
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则对象
      loginRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // postUser(){
    //   this.$http.psot('login',{
    //    this.loginForm
    //    }).then(res=>{
    //     if(res.data.meta.status==200){
    //       this.$message.success('登陆成功')
    //       this.$Loading.finish()
    //       let user=res.data.username
    //       window.sessionStorage.setItem('token', res.data.token)
    //       window.sessionStorage.setItem('user',res.data.username)
    //       this.$router.push('/home')
    //     }else{
    //       this.$message.error('登录失败！')
    //       this.$Loading.error();
    //     }
    //   })
    // },
    //登录验证
    login() {
      
      this.$Loading.start();
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        // { data : res } 从axios封装好的包中返回的对象中解构出data 并且重命名为res
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败！')
          this.$Loading.error();
        }
        else{
          this.$message.success('登录成功')
          this.$Loading.finish();
        }
        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        let user=res.data.username
        // console.log(user)
        window.sessionStorage.setItem('token', res.data.token)
        window.sessionStorage.setItem('user',res.data.username)
        this.$router.push('/home')
      })
    },
    // handleReset (loginFormRef) {
    //   console.log('提交后清空')
    //   console.log(this.loginFormRef)
    //   this.$refs.formFilter.resetFields()
    // }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-image: -webkit-linear-gradient(left , #4c0785, #9b1976);
  height: 100%;
}

.login_box {
  width: 450px;
  height: 250px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 120px;
    width: 120px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    bottom: 6%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px 0 70px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
