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
        <Icon type="ios-cafe"></Icon> 添加商品
      </BreadcrumbItem>
    </Breadcrumb>

    <!-- 卡片视图 -->
    <Card>
       <!-- 提示区域 -->
      <Alert type="info" center show-icon :closable="false">添加商品信息
      </Alert>
      <!-- 步骤条区域 -->
      <Steps :space="200" :current="activeIndex - 0" status="finish" align-center >
        <Step title="基本信息" content=""></Step>
        <Step title="商品参数" content=""></Step>
        <Step title="商品属性" content=""></Step>
        <Step title="商品图片" content=""></Step>
        <Step title="商品内容" content=""></Step>
        <Step title="完成" content=""></Step>
      </Steps>

      <!-- tab栏区域 -->

      <Form :model="addForm" :rules="addRules" ref="addFormRef" label-position="top">
        <Tabs v-model="activeIndex" @on-click="tabClicked">
          <TabPane label="基本信息" name="0">
            <Alert center show-icon :closable="false">本页面均为必填项</Alert>
            <FormItem label="商品名称" prop="goods_name">
              <Input v-model="addForm.goods_name"></Input>
            </FormItem>
            <FormItem label="商品价格" prop="goods_price">
              <Input v-model="addForm.goods_price" type="number"></Input>
            </FormItem>
            <FormItem label="商品重量" prop="goods_weight">
              <Input v-model="addForm.goods_weight" type="number"></Input>
            </FormItem>
            <FormItem label="商品数量" prop="goods_number">
              <Input v-model="addForm.goods_number" type="number"></Input>
            </FormItem>
            <FormItem label="商品分类" prop="goods_cat">
              <el-cascader expand-trigger="hover" :options="catelist" :props="cateProps" v-model="addForm.goods_cat" @change="handleChange">
              </el-cascader>
            </FormItem>
          </TabPane>
          <TabPane label="商品参数" name="1">
            <!-- 渲染表单的Item项-->
            <FormItem :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <CheckboxGroup v-model="item.attr_vals">
                <Checkbox :label="checkTab" v-for="(checkTab, i) in item.attr_vals" :key="i"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </TabPane>
          <TabPane label="商品属性" name="2">
            <FormItem :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <Input v-model="item.attr_vals"></Input>
            </FormItem>
          </TabPane>
          <TabPane label="商品图片" name="3">
            <!-- action 表示图片要上传到的后台API地址 -->
            <Upload :action="uploadURL" :on-preview="handleShow" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <Button size="small" type="primary">点击上传</Button>
            </Upload>
          </TabPane>
          <TabPane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <Button type="primary" class="btnAdd" @click="add">添加商品</Button>
          </TabPane>
        </Tabs>
      </Form>

    </Card>

    <!-- 图片预览 -->
    <Modal title="图片预览" v-model="photoShow" width="50%">
      <img :src="photoPath" alt="" class="previewImg">
    </Modal>
  </div>
</template>

<script>
/*  eslint-disable */
import _ from 'lodash'

export default {
  data() {
    return {
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: []
      },
      addRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类'}
        ]
      },
      // 商品分类列表
      catelist: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 上传图片的URL地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      photoPath: '',
      photoShow: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类数据
    getCateList() {
      this.$http.get('categories').then(res=>{
        if (res.data.meta.status == 200) {
          this.catelist = res.data.data
          console.log(this.catelist)
        }else{
          this.$message.error('获取商品分类数据失败！')
        }
      })
    },
    // 级联选择器选中项变化，会触发这个函数
    handleChange() {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    tabClicked() {
      // 证明访问的是动态参数面板
      if (this.activeIndex === '1') {
        this.$http.get(`categories/${this.cateId}/attributes`,{
            params: { sel: 'many' }
          }).then(res=>{
            if (res.data.meta.status == 200) {
              res.data.data.forEach(item => {
                item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
              })
              this.manyTableData = res.data.data
            }else{
              this.$message.error('获取动态参数列表失败！')
            }
          })
     
      } else if (this.activeIndex === '2') {
        this.$http.get(`categories/${this.cateId}/attributes`,{
            params: { sel: 'only' }
          }).then(res=>{
            if (res.data.meta.status == 200) {
              this.onlyTableData = res.data.data
            }else{
              this.$message.error('获取静态属性失败！')
            }
          })
      }
    },
    // 处理图片预览效果
    handleShow(file) {
      this.photoPath = file.response.data.url
      this.photoShow = true
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(i, 1)
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // 1. 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2. 将图片信息对象，push 到pics数组中
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        // 执行添加的业务逻辑
        // lodash   cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs

        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        this.$http.post('goods', form).then(res=>{
          if (res.data.meta.status == 201) {
            this.$message.success('添加商品成功！')
            this.$router.push('/goods')
          }else{
            this.$message.error('添加商品失败！')
          }
        })
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.btnAdd {
  margin-top: 15px;
}
</style>
