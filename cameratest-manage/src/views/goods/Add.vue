<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    卡片视图区-->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
      </el-alert>
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>

      </el-steps>
      <!--      左侧标签页-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">

        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_weight">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover" :options="cateList" :props="cateProps" v-model="addForm.goods_cat"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--            渲染表单的item项-->
            <el-form-item v-for="item in  manyTableData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">

            <!--            action表示图片要上传的后台API地址-->
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headersObj"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--            富文本编辑器组件-->
            <quill-editor v-model="addForm.good_introduce">

            </quill-editor>

            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
        <!--      form表单区域-->
      </el-form>

    </el-card>
  </div>
</template>

<script>
  import {getRequest, putRequest, postRequest, deleteRequest} from "../../network/request";

  export default {
    name: "Add",
    data() {
      return {
        activeIndex: 0,
        addForm: {
          goods_name: '',
          goods_price: 0,
          goods_weight: 0,
          goods_number: 0,
          //商品所属分类数组
          goods_cat: [],

          //图片的数组
          pics: [],

          //商品的详情描述
          good_introduce: '',

          attrs: []
        },
        addFormRules: {
          goods_name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'}
          ],
          goods_price: [
            {required: true, message: '请输入商品价格', trigger: 'blur'}
          ],
          goods_weight: [
            {required: true, message: '请输入商品重量', trigger: 'blur'}
          ],
          goods_number: [
            {required: true, message: '请输入商品数量', trigger: 'blur'}
          ],
          goods_cat: [
            {required: true, message: '请选择商品类别', trigger: 'blur'}

          ]
        },
        cateList: [],
        cateProps: {
          label: 'cat_name',
          value: 'cat_id',
          children: 'children'
        },
        selectedCateKeys: [],
        //商品参数列表
        manyTableData: [],
        onlyTableData: [],

        //上传图片的url地址
        uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',

        //图片上传组件的headers请求头对象
        headersObj: {
          Authorization: this.$store.state.user.token
        },


      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      getCateList() {
        getRequest('categories')
          .then(res => {
            if (res.data.meta.status !== 200) return this.$message.error('获取商品分类失败')
            this.cateList = res.data.data
          })
          .catch()
      },
      //级联选择器选中项变化，会触发这个函数
      handleChange() {
        console.log(this.addForm.goods_cat);
        if (this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = []
        }
      },
      beforeTabLeave(activeName, oldActiveName) {
        if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
          return false
        }
      },
      tabClicked() {
        //证明访问的是动态参数面板
        if (this.activeIndex === '1') {
          console.log(this.cateId);
          getRequest(`categories/${this.cateId}/attributes`, {
            params: {
              sel: 'many'
            }
          }).then(res => {
            console.log(res.data);
            if (res.data.meta.status !== 200) {
              return this.$message.success('获取失败')
            }
            res.data.data.forEach(item => {
              item.attr_vals = item.attr_vals.trim().length !== 0 ? item.attr_vals.split(' ') : []
            })

            console.log(res.data.data);
            this.manyTableData = res.data.data
          })
            .catch()
        } else if (this.activeIndex === '2') {
          getRequest(`categories/${this.cateId}/attributes`, {
            params: {
              sel: 'only'
            }
          }).then(res => {
            console.log(res.data);
            if (res.data.meta.status !== 200) {
              return this.$message.success('获取失败')
            }
            this.onlyTableData = res.data.data
          }).catch()


        }
      },
      //处理图片预览效果
      handlePreview() {

      },

      //处理图片删除效果
      handleRemove(file) {
        const filePath = file.response.data.tmp_path
        console.log(filePath)
        console.log(this.addForm.pics);
        const i = this.addForm.pics.findIndex(x => {
          return x.pic === filePath
        })
        console.log(i);
        this.addForm.pics.splice(i, 1)
        console.log(this.addForm);

      },
      //监听图片上传成功
      handleSuccess(response) {
        const picInfo = {
          pic: response.data.tmp_path

        }
        console.log(response.data);
        this.addForm.pics.push(picInfo)
        console.log(this.addForm);

      },
      add() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) {
            return this.$message.error('请填写必要的表单项')
          }
          const form = JSON.parse(JSON.stringify(this.addForm))
          form.goods_cat = form.goods_cat.join(',')

          //处理动态参数
          this.manyTableData.forEach(item => {
            const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals.join('')}
            this.addForm.attrs.push(newInfo)
          })

          //处理静态属性
          this.onlyTableData.forEach(item => {
            const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals}
            this.addForm.attrs.push(newInfo)
          })

          form.attrs = this.addForm.attrs
          //发起请求添加商品
          //商品名称必须是唯一的
          postRequest('goods', form)
            .then(res => {
              console.log(res.data);
              if (res.data.meta.status !== 201){
                return this.$message.error('添加商品失败')
              }
              this.$message.success('添加商品成功')
              this.$router.push('/goods')
                })
            .catch()
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
  .el-steps {
    margin: 20px 0px;
  }

  .el-checkbox {
    margin: 0 15px 0px 0px !important;
  }

  .btnAdd {
    margin-top: 20px;
  }

</style>
