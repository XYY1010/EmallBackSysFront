<template>
  <div>
    <Alert show-icon class="tips-box" type="warning">
        小提示
        <Icon type="md-bulb" slot="icon"></Icon>
        <template slot="desc">订单管理。</template>
    </Alert>
    <div class="searchDiv">
      <span>
        <Input placeholder="输入要查询的订单ID" 
        style="width:300px; margin: 0px 10px 0px 0px" size="large"
        v-model="searchData"></Input>
        <Button type="primary" shape="circle" 
        icon="ios-search" 
        size="large" 
        @click="confirmSearch">搜订单</Button>
        <Button type="error" 
        shape="circle"
        icon="md-close"
        size="large"
        @click="cancelSearch">取消检索</Button>
      </span>
    </div>
    <div class="operationDiv">
      <div class="subDiv">
        <Button type="error" icon="md-trash" size="large" @click="batchDelete">批量删除</Button> &ensp;
        显示 <InputNumber v-model="pageSize" size="large" @on-change="changePageSize" :min="1" :max="10"></InputNumber> 条
        <span style="float: right; margin: 0 20px 0 0; font-size: 18px;">
          共有 {{orderData.length}} 条记录
        </span>
      </div>
    </div>

    <Modal
      v-model="modalStatus"
      title="提示"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>确定将该订单删除吗？</p>
    </Modal>

    <Modal
      v-model="modalStatus1"
      title="提示"
      @on-ok="ok1"
      @on-cancel="cancel1">
      <p>确定批量删除这些订单吗？</p>
    </Modal>

    <Modal
      v-model="modalStatus2"
      title="备注信息"
      @on-ok="ok2"
      @on-cancel="cancel2">
      <Form :model="remarkInfo">
          <Row :gutter="32">
              <Col span="32">
                  <FormItem label="备注" label-position="top">
                      <Input v-model="remarkInfo.remark" type="textarea" :rows="8" placeholder="请输入备注信息" />
                  </FormItem>
              </Col>
          </Row>
      </Form>
    </Modal>

    <Modal
      v-model="modalStatus3"
      title="提示"
      @on-ok="ok3"
      @on-cancel="cancel3">
      <p>确定取消该订单吗？</p>
    </Modal>

    <Table border ref="selection" :current="curPage" :columns="columns" :data="historyData" @on-selection-change="select" no-data-text="暂无订单信息~~~"></Table>
    <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>
  </div>
</template>

<script>
export default {
  name: 'order-list',
  data() {
    return  {
      ajaxHistoryData:[],
      // 初始化信息总条数
      dataCount:0,
      searchData:'',
      // 每页显示多少条
      pageSize:10,
      historyData: [],
      loading: false,
      modalStatus: false,
      modalStatus1: false,
      modalStatus2: false,
      modalStatus3: false,
      rmIndex: -1,
      show: false,
      curPage: 1,
      orderData: [
      ],
      Selected: [],
      columns: [
        {
          type: 'selection',
          title: '全选',
          width: 58,
          align: 'center'
        },
        {
          title: '订单ID',
          key: 'orderId',
          width: 100,
          align: 'center',
          sortable: true
        },
        {
          title: '支付金额',
          key: 'payment',
          width: 86,
          align: 'center'
        },
        {
          title: '用户账号',
          key: 'userName',
          align: 'center'
        },
        {
          title: '备注',
          key:'remark',
          align: 'center'
        },
        {
          title: '创建时间',
          key:'createdDate',
          align: 'center',
        },
        {
          title: '支付时间',
          key:'paymentDate',
          align: 'center'
        },
        {
          title: '关闭时间',
          key:'endDate',
          align: 'center'
        },
        {
          title: '完成时间',
          key:'closeDate',
          align: 'center'
        },
        {
          title: '订单状态',
          key:'orderStatus',
          align: 'center',
          render: (h, params) => {
            if (params.row.orderStatus == 0) {
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #e53935; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "已取消")
              ]);
            } else if (params.row.orderStatus == 1) {
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #43CD80; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "待支付")
              ]);
            } else if (params.row.orderStatus == 2) {
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #C0FF3E; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "已支付")
              ]);
            } else if (params.row.orderStatus == 3) {
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #EEC900; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "已发货")
              ]);
            } else{
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #006400; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "已完成")
              ]);
            } 
          },
          filters: [
            {
              label: '已取消',
              value: 0
            },
            {
              label: '待支付',
              value: 1
            },
            {
              label: '已支付',
              value: 2
            },
            {
              label: '已发货',
              value: 3
            },
            {
              label: '交易完成',
              value: 4
            }
          ],
          filterMultiple: true,
          filterMethod (value, row) {
            if (value === 0) {
                return row.orderStatus === 0;
            } else if (value === 1) {
                return row.orderStatus === 1;
            } else if (value === 2) {
                return row.orderStatus === 2;
            } else if (value === 3) {
                return row.orderStatus === 3;
            } else if (value === 4) {
                return row.orderStatus === 4;
            }
          }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                  attrs: {
                    type: "md-create",
                    size: 20
                  },
                  on: {
                    click: () => {
                      this.modalStatus2 = true;
                      this.remarkInfo.orderId = params.row.orderId;
                    }
                  }
              }),
              h('Icon', {
                  attrs: {
                    type: "md-close-circle",
                    size: 20
                  },
                  on: {
                    click: () => {
                      this.rmIndex = params.index;
                      this.modalStatus3 = true;
                    }
                  }
              }),
              h('Icon', {
                  attrs: {
                    type: "ios-trash",
                    size: 20
                  },
                  on: {
                    click: () => {
                      this.rmIndex = params.index;
                      this.modalStatus = true;
                    }
                  }
              })
            ])
          }
        }
      ],
      remarkInfo: {
        orderId: '',
        remark: ''
      }
    }
  },
  methods: {
    getAllOrder(){
      this.$axios({
        method:'get',
        url:'/order/getAllOrder'
      }).then(res=>{
        this.orderData = res.data.data;
        for(var i = 0; i < this.orderData.length; i++){
          this.orderData[i].createdDate = this.dateUtil(this.orderData[i].createdDate);
          this.orderData[i].paymentDate = this.dateUtil(this.orderData[i].paymentDate);
          this.orderData[i].endDate = this.dateUtil(this.orderData[i].endDate);
          this.orderData[i].closeDate = this.dateUtil(this.orderData[i].closeDate);
        }
        this.handleListApproveHistory();
      }).catch(error=>{
        this.$Message.error("服务器出错，获得订单失败");
      });
    },
    deleteOrder(idGroup){
      this.$axios({
        method:'get',
        url:'/order/deleteOrder',
        params:{
          idGroup:idGroup
        }
      }).then(res=>{
        if(this.rmIndex!=-1){
          this.afterDeleteOne();
        }else{
          this.afterDeleteGroup();
        }
      });
    },
    updateOrder(orderId,status){
      this.$axios({
        method:'get',
        url:'/order/updateStatus',
        params:{
          orderId:orderId,
          status:status
        }
      }).then(res=>{
        this.getAllOrder();
        this.$Message.success("订单取消完成！");
      }).catch(error=>{
        this.$Message.error("服务器错误,订单取消失败！");
      });
    },
    afterDeleteOne(){
      this.remove((this.curPage-1)*this.pageSize+this.rmIndex);
      this.$Message.success('移除成功！');
      this.rmIndex = -1;
    },
    afterDeleteGroup(){
      this.Selected = this.$refs.selection.getSelection().splice(0);
      for (var i = 0; i < this.Selected.length; i++) {
        for (var j = 0; j < this.orderData.length; j++) {
          if (this.Selected[i].orderId == this.orderData[j].orderId) {
            this.orderData.splice(j, 1);
            break;
          }
        }
      }
      // 保存取到的所有数据
      this.ajaxHistoryData = this.orderData;
      this.dataCount = this.orderData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.orderData.length < this.curPage * this.pageSize){
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.orderData.length);
        if (this.orderData.length === (this.curPage-1)*this.pageSize) {
          this.curPage--;
          this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.orderData.length);
        }
      }
      else if (this.orderData.length > this.curPage * this.pageSize) {
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.curPage * this.pageSize);
      }
      this.$Message.success('批量移除成功！');
        // 后台数据更新
    },
    dateUtil(originDate){
      var date = new Date(+new Date(originDate)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
      return date.split(" ")[0];
    },
    changePageSize(size) {
      this.pageSize = size;
      this.handleListApproveHistory();
    },
    // 获取历史记录信息
    handleListApproveHistory(){
      // 保存取到的所有数据
      this.ajaxHistoryData = this.orderData
      this.dataCount = this.orderData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.orderData.length < this.pageSize){
        this.historyData = this.ajaxHistoryData;
      }else{
        this.historyData = this.ajaxHistoryData.slice(0,this.pageSize);
      }
    },
    changepage(index){
      this.curPage = index;
      var _start = ( index - 1 ) * this.pageSize;
      var _end = index * this.pageSize;
      this.historyData = this.ajaxHistoryData.slice(_start,_end);
    },
    select(selection) {
      this.Selected = selection;
    },
    batchDelete() {
      if (this.$refs.selection.getSelection().length === 0) {
        this.$Message.error('未选中批量数据！！！');
      } else {
        this.modalStatus1 = true;
      }
    },
    remove(index) {
      this.orderData.splice(index, 1);
      // 保存取到的所有数据
      this.ajaxHistoryData = this.orderData;
      this.dataCount = this.orderData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.orderData.length < this.curPage * this.pageSize){
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.orderData.length);
        if (this.orderData.length === (this.curPage-1)*this.pageSize) {
          this.curPage--;
          this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.orderData.length);
        }
      }
      else if (this.orderData.length > this.curPage * this.pageSize) {
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.curPage * this.pageSize);
      }
      // 后端数据库删除请求
    },
    ok() {
      if(this.rmIndex != -1) {
        this.deleteOrder(this.historyData[this.rmIndex].orderId);
      }
    },
    cancel() {
      this.$Message.success('取消移除！');
      this.rmIndex = -1;
    },
    ok1() {
      var indexSelected = this.Selected[0].orderId;
      for(var i = 1; i < this.Selected.length; i++){
        indexSelected += "," + this.Selected[i].orderId;
      }
      this.deleteOrder(indexSelected);
    },
    cancel1() {
      this.$Message.success('取消移除！');
    },
    ok2() {

    },
    cancel2() {
      this.$Message.success('取消备注！');
    },
    ok3() {
      var order = this.orderData[(this.curPage-1)*this.pageSize+this.rmIndex];
      var orderId = order.orderId;
      this.updateOrder(orderId,0);
      this.rmIndex = -1;
    },
    cancel3() {
      this.rmIndex = -1;
    },
    isEqualSearchData(element){
      var reg = new RegExp(this.searchData);
      return element.orderId.match(reg);
    },
    confirmSearch(){
      this.ajaxHistoryData = this.orderData.filter(this.isEqualSearchData);
      if(this.ajaxHistoryData.length < this.pageSize){
        this.historyData = this.ajaxHistoryData;
      }else{
        this.historyData = this.ajaxHistoryData.slice(0,this.pageSize);
      }
    },
    cancelSearch(){
      this.handleListApproveHistory();
      this.searchData = '';
    }
  },
  created() {
    this.getAllOrder();
  }
}
</script>

<style lang="css" scoped>
.searchDiv {
  text-align: center;
  width: 100%;
}
.operationDiv {
  width: 100%;
  background-color: #F3F9FE;
}
.subDiv {
  margin: 5px 10px 5px 10px;
  padding: 10px 5px 10px 5px;
}
.paging{
  margin:10px 0px;
  text-align: right;
}
</style>
