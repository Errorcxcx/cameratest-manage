<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--      订单列表数据-->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status==='0'">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>

          </template>

        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">
            {{scope.row.create_time|dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="是否发货">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showDialog"></el-button>
            <el-button type="success" icon="el-icon-location" @click="showProgressDialog"></el-button>

          </template>

        </el-table-column>
      </el-table>

      <!--      分页区-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalSize">
      </el-pagination>
    </el-card>

    <!--    修改地址的对话框-->
    <el-dialog
      title="修应地址"
      :visible.sync="addressVisible"
      @close="addressDialofClosed"
      width="50%">
      <el-form :model="addressForm" :rules="addressFormRules"  ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
<!--展示物流进度的对话框-->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      @close="addressDialofClosed"
      width="50%">
      <!--时间线-->
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

  </div>
</template>

<script>
  import {getRequest, putRequest, postRequest, deleteRequest} from "../../network/request";
  import cityData from './citydata'
  export default {
    name: "Order",
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        totalSize: 0,
        orderList: [],
        addressVisible:false,
        addressForm:{
          address1:[],
          address2:''
        },
        addressFormRules:{
          address1:[
            {required: true, message: '请选择省市区/县', trigger: 'blur'},
          ],
          address2:[
            {required: true, message: '请填写详细地址', trigger: 'blur'},
          ]
        },
        cityData,

        progressVisible:false,
        progressInfo:[]
      }
    },
    created() {
      console.log('ssss');
      this.getOrderList()
    },
    methods: {
      getOrderList() {
        getRequest('orders', {params: this.queryInfo})
          .then(res => {

            if (res.data.meta.status !== 200) return this.$message.error('获取失败')
            this.totalSize = res.data.data.total
            this.orderList = res.data.data.goods
          })

          .catch()
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagenum = 1
        this.queryInfo.pagesize = newSize
        this.getOrderList()
      },
      handleCurrentChange(newNum) {
        this.queryInfo.pagenum = newNum
        this.getOrderList()
      },
      //展示修改地址
      showDialog() {
        this.addressVisible = true
      },
      addressDialofClosed(){
        this.$refs.addressFormRef.resetFields()
      },
      showProgressDialog(){
        getRequest('/kuaidi/804909574412544580')
          .then(res=>{
            if(res.data.meta.status !== 200) return this.$message.error('获取物流信息失败')
            this.progressInfo = res.data.data
            console.log(this.progressInfo);

          })
          .catch()
        this.progressVisible = true
      }
    }

  }
</script>

<style lang="less" scoped>
  .el-cascader{
    width: 100%;
  }
</style>
