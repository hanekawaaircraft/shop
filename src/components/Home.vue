<template>
  <Layout class="home-container">
    <Header>
      <div>
        <span>电商后台管理系统</span>
      </div>
      <Button type="info" @click="logout">退出</Button>
    </Header>

    <Layout>    
      <Sider :width="'240px'">  
        <Menu :theme="theme1" :active-name="activePath" accordion>
          <Submenu v-for="item in menulist" :key="item.id" :index="item.id + ''" :name="item.id">
            <template slot="title">             
              <i :class="iconsObj[item.id]"></i>             
              <span>{{item.authName}}</span>
            </template>
            <MenuItem :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" :name="subItem.id">
              <router-link :to="('/' + subItem.path)"> 
                <span class="activeColor">{{subItem.authName}}</span>            
              </router-link> 
            </MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <!-- 右侧内容主体 -->
      <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
        <!-- 路由占位符 -->
        <router-view></router-view>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
export default {
  data() {
    return {
      theme1:"dark",
      // 左侧菜单数据
      menulist: [
       {
          id: 145,
          authName: "数据统计",
          path: "reports",
          children: [
            {
              id: 146,
              authName: "数据报表",
              path: "reports",
              children: [],
            }
          ]
        },
        {
          id: 103,
          authName: "权限管理",
          path: "rights",
          children: [
            {
              id: 111,
              authName: "角色列表",
              path: "roles",
              children: [],
            },
            {
              id: 112,
              authName: "权限列表",
              path: "rights",
              children: [],
            }
          ]
        },
        {
          id: 101,
          authName: "商品管理",
          path: "goods",
          children: [
            {
              id: 104,
              authName: "商品列表",
              path: "goods",
              children: [],
            },
            {
              id: 115,
              authName: "分类参数",
              path: "params",
              children: [],
            },
            {
              id: 121,
              authName: "商品分类",
              path: "cate",
              children: [],
            },
          ]
        },
        {
          id: 102,
          authName: "订单管理",
          path: "orders",
          children: [
            {
              id: 107,
              authName: "订单列表",
              path: "orders",
              children: [],
            }
          ]
        },
        { 
          id: 125,
          authName: "用户管理",
          path: "users",
          children: [
            {
              id: 110,
              authName: "用户列表",
              path: "users",
              children: [],
            }
          ]
        }
      ],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.ivu-layout-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.ivu-layout-sider {
  background-color: #333744;
  min-width:240px !important;
}

.ivu-layout-content {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}
.activeColor{
  color: #fff;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
