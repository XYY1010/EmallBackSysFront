<template>
  <div>
    <Alert show-icon class="tips-box" type="warning">
        小提示
        <Icon type="md-bulb" slot="icon"></Icon>
        <template slot="desc">订单管理。</template>
    </Alert>
    <div class="searchDiv">
      <span>
        <Input placeholder="输入要查询的订单ID" style="width:300px; margin: 0px 10px 0px 0px" size="large"></Input>
        <Button type="primary" shape="circle" icon="ios-search" size="large">搜订单</Button>
        <Button type="error" shape="circle" icon="md-close" size="large">取消检索</Button>
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
        {
            orderId: '1552717032322132',
            payment: '120',
            userName: '李大大',
            remark: '',
            createdDate: '2019-1-16 14:22',
            paymentDate: '',
            closeDate: '',
            endDate: '',
            orderStatus: 0
        },
        {
            orderId: '155271703406154',
            payment: '120',
            userName: '李大大',
            remark: '',
            createdDate: '2019-3-16 14:22',
            paymentDate: '',
            closeDate: '',
            endDate: '',
            orderStatus: 0
        }
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
          key:'closeDate',
          align: 'center'
        },
        {
          title: '完成时间',
          key:'endDate',
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
                      style: 'background-color: #83c44e; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "已取消")
              ]);
            } else if (params.row.orderStatus == 1) {
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #83c44e; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "待支付")
              ]);
            } else {
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #e53935; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "禁用")
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
              label: '交易关闭',
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
        this.remove((this.curPage-1)*this.pageSize+this.rmIndex);
        this.$Message.success('移除成功！');
        this.rmIndex = -1;
        // 后台数据更新
      }
    },
    cancel() {
      this.$Message.success('取消移除！');
      this.rmIndex = -1;
    },
    ok1() {
      for (var i = 0; i < this.$refs.selection.getSelection().length; i++) {
        for (var j = 0; j < this.orderData.length; j++) {
          if (this.$refs.selection.getSelection()[i].orderId == this.orderData[j].orderId) {
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
      // 后台进行持久层变更
      this.rmIndex = -1;
    },
    cancel3() {
    }
  },
  created() {
    this.handleListApproveHistory();
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
