<template>
  <div>
    <Alert show-icon class="tips-box" type="warning">
        小提示
        <Icon type="md-bulb" slot="icon"></Icon>
        <template slot="desc">商品管理。</template>
    </Alert>
    <div class="searchDiv">
      <span>
        <Input placeholder="输入要查询的商品ID" style="width:300px; margin: 0px 10px 0px 0px" size="large"></Input>
        <Button type="primary" shape="circle" icon="ios-search" size="large">搜商品</Button>
        <Button type="error" shape="circle" icon="md-close" size="large">取消检索</Button>
      </span>
    </div>
    <div class="operationDiv">
      <div class="subDiv">
        <Button type="error" icon="md-trash" size="large" @click="batchDelete">批量删除</Button> &ensp;
        <Button type="success" icon="md-add" size="large" @click="modalStatus2=true">添加商品</Button> &emsp;
        显示 <InputNumber v-model="pageSize" size="large" @on-change="changePageSize" :min="1" :max="10"></InputNumber> 条
        <span style="float: right; margin: 0 20px 0 0; font-size: 18px;">
          共有 {{goodsData.length}} 条记录
        </span>
      </div>
    </div>

    <Modal
      v-model="modalStatus"
      title="提示"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>确定将该商品删除吗？</p>
    </Modal>

    <Modal
      v-model="modalStatus1"
      title="提示"
      @on-ok="ok1"
      @on-cancel="cancel1">
      <p>确定批量删除这些商品吗？</p>
    </Modal>

    <Modal
      v-model="modalStatus2"
      title="添加新商品"
      fullscreen
      @on-ok="ok2"
      @on-cancel="cancel2">
      <div class="addGoodsClassify">
        <div style="text-align: center; padding: 10px 0px 10px 0px;">
          <h2>选择分类</h2>
          <Select v-model="newGoodInfo.classify" style="width: 300px; margin: 5px 0px 5px 0px;" placeholder="请选择分类">
              <Option v-for="(item, index) in classifyList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </div>
      </div>
      <div class="addGoodsBaseInfo">
        <div style="text-align: center; padding: 10px 0px 10px 0px;">
          <h2>商品基本信息</h2>
          <div style="10px 20px 10px 20px;">
            <Form :model="newGoodInfo" label-position="right">
              <Row :gutter="32">
                  <Col span="12">
                    <FormItem label="商品名称">
                        <Input v-model="newGoodInfo.goodName" style="width: 200px;" placeholder="请输入商品名称">
                        </Input>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="商品单位">
                      <Input v-model="newGoodInfo.goodUnit" style="width: 200px;" placeholder="请输入商品单位">
                      </Input>
                    </FormItem>
                  </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    </Modal>

    <Table border ref="selection" :current="curPage" :columns="columns" :data="historyData" @on-selection-change="select" no-data-text="暂无商品，请添加~~~"></Table>
    <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>
  </div>
</template>

<script>
export default {
  name: 'goodslist',
  data() {
    return {
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
      goodsData: [
        {
            "item_id": "37849334754447360",
            "category_id": "1",
            "item_title": "小米MIX3",
            "item_sales": "100",
            "item_main_image": "http://139.199.125.60/商品图片/Mix3/mix3_main_1.jpg",
            "item_detail_image": "\"http://139.199.125.60/商品图片/Mix3/mix3_detail_1.jpg\", \"http://139.199.125.60/商品图片/Mix3/mix3_detail_2.jpg\", \"http://139.199.125.60/商品图片/Mix3/mix3_detail_3.jpg\", \"http://139.199.125.60/商品图片/Mix3/mix3_detail_4.jpg\"",
            "item_intro_image": "\"http://139.199.125.60/商品图片/Mix3/mix3_intro_1.jpg\", \"http://139.199.125.60/商品图片/Mix3/mix3_intro_2.jpg\", \"http://139.199.125.60/商品图片/Mix3/mix3_intro_3.jpg\", \"http://139.199.125.60/商品图片/Mix3/mix3_intro_4.jpg\"",
            "create_time": "2019-1-15 00:00:00",
            "update_time": "2019-1-15 00:00:00"
        },
        {
            "item_id": "37854334218014720",
            "category_id": "2",
            "item_title": "小米MAX3",
            "item_sales": "150",
            "item_main_image": "http://139.199.125.60/商品图片/Max3/max3_main_1.jpg",
            "item_detail_image": "\"http://139.199.125.60/商品图片/Max3/max3_detail_1.jpg\", \"http://139.199.125.60/商品图片/Max3/max3_detail_2.jpg\", \"http://139.199.125.60/商品图片/Max3/max3_detail_3.jpg\", \"http://139.199.125.60/商品图片/Max3/max3_detail_4.jpg\"",
            "item_intro_image": "\"http://139.199.125.60/商品图片/Max3/max3_intro_1.jpg\", \"http://139.199.125.60/商品图片/Max3/max3_intro_2.jpg\", \"http://139.199.125.60/商品图片/Max3/max3_intro_3.jpg\", \"http://139.199.125.60/商品图片/Max3/max3_intro_4.jpg\"",
            "create_time": "2019-1-15 00:00:00",
            "update_time": "2019-1-15 00:00:00"
        },
        {
            "item_id": "37905485735006208",
            "category_id": "3",
            "item_title": "红米6A",
            "item_sales": "120",
            "item_main_image": "http://139.199.125.60/商品图片/红米6A/6a_main_1.jpg",
            "item_detail_image": "\"http://139.199.125.60/商品图片/红米6A/6a_detail_1.jpg\", \"http://139.199.125.60/商品图片/红米6A/6a_detail_2.jpg\", \"http://139.199.125.60/商品图片/红米6A/6a_detail_3.jpg\", \"http://139.199.125.60/商品图片/红米6A/6a_detail_4.jpg\"",
            "item_intro_image": "\"http://139.199.125.60/商品图片/红米6A/6a_intro_1.jpg\", \"http://139.199.125.60/商品图片/红米6A/6a_intro_2.jpg\", \"http://139.199.125.60/商品图片/红米6A/6a_intro_3.jpg\", \"http://139.199.125.60/商品图片/红米6A/6a_intro_4.jpg\"",
            "create_time": "2019-1-15 00:00:00",
            "update_time": "2019-1-15 00:00:00"
        },
        {
            "item_id": "37930332053704704",
            "category_id": "4",
            "item_title": "小米8青春版",
            "item_sales": "130",
            "item_main_image": "http://139.199.125.60/商品图片/小米8青春版/m8yang_main_1.jpg",
            "item_detail_image": "\"http://139.199.125.60/商品图片/小米8青春版/m8yang_detail_4.jpg\",\"http://139.199.125.60/商品图片/小米8青春版/m8yang_detail_1.jpg\",\"http://139.199.125.60/商品图片/小米8青春版/m8yang_detail_2.jpg\",\"http://139.199.125.60/商品图片/小米8青春版/m8yang_detail_3.jpg\"",
            "item_intro_image": "\"http://139.199.125.60/商品图片/小米8青春版/m8yang_intro_1.jpg\",\"http://139.199.125.60/商品图片/小米8青春版/m8yang_intro_3.jpg\",\"http://139.199.125.60/商品图片/小米8青春版/m8yang_intro_2.jpg\",\"http://139.199.125.60/商品图片/小米8青春版/m8yang_intro_4.jpg\"",
            "create_time": "2019-1-15 00:00:00",
            "update_time": "2019-1-15 00:00:00"
        },
        {
            "item_id": "37938115868233728",
            "category_id": "5",
            "item_title": "小米8",
            "item_sales": "110",
            "item_main_image": "http://139.199.125.60/商品图片/小米8/m8_main_1.jpg",
            "item_detail_image": "\"http://139.199.125.60/商品图片/小米8/m8_detail_1.jpg\",\"http://139.199.125.60/商品图片/小米8/m8_detail_3.jpg\",\"http://139.199.125.60/商品图片/小米8/m8_detail_2.jpg\",\"http://139.199.125.60/商品图片/小米8/m8_detail_4.jpg\"",
            "item_intro_image": "\"http://139.199.125.60/商品图片/小米8/m8_intro_1.jpg\",\"http://139.199.125.60/商品图片/小米8/m8_intro_3.jpg\",\"http://139.199.125.60/商品图片/小米8/m8_intro_2.jpg\",\"http://139.199.125.60/商品图片/小米8/m8_intro_4.jpg\"",
            "create_time": "2019-1-15 00:00:00",
            "update_time": "2019-1-15 00:00:00"
        }
      ],
      columns: [
        {
          type: 'selection',
          title: '全选',
          width: 58,
          align: 'center'
        },
        {
          title: '商品ID',
          key: 'item_id',
          width: 100,
          align: 'center',
          sortable: true
        },
        {
          title: '商品图片',
          key: 'item_main_image',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.item_main_image,
                  style: "width: 100px; height: 100px;"
                }
              })
            ]);
          },
        },
        {
          title: '商品名称',
          key: 'item_title',
          width: 200,
          align: 'center'
        },
        {
          title: '单价',
          key: 'price',
          align: 'center'
        },
        {
          title: '创建时间',
          key:'create_time',
          align: 'center',
        },
        {
          title: '更新时间',
          key:'update_time',
          align: 'center'
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
      newGoodInfo: {
        classify: '',
        goodName: '',
        goodUnit: '件'
      },
      classifyList: [
        {
          value: '手机',
          label: '手机'
        },
        {
          value: '笔记本',
          label: '笔记本'
        },
        {
          value: '平板',
          label: '平板'
        },
        {
          value: '电视',
          label: '电视'
        },
        {
          value: '电视盒子',
          label: '电视盒子'
        },
        {
          value: '家电',
          label: '家电'
        },
        {
          value: '插线板',
          label: '插线板'
        },
        {
          value: '智能',
          label: '智能'
        },
        {
          value: '路由器',
          label: '路由器'
        },
        {
          value: '健康',
          label: '健康'
        },
        {
          value: '音箱',
          label: '音箱'
        },
        {
          value: '电话卡',
          label: '电话卡'
        },
        {
          value: '出行',
          label: '出行'
        },
        {
          value: '穿戴',
          label: '穿戴'
        },
        {
          value: '电源',
          label: '电源'
        },
        {
          value: '配件',
          label: '配件'
        },
        {
          value: '儿童',
          label: '儿童'
        },
        {
          value: '耳机',
          label: '耳机'
        },
        {
          value: '生活',
          label: '生活'
        },
        {
          value: '箱包',
          label: '箱包'
        }
      ]
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
      this.ajaxHistoryData = this.goodsData
      this.dataCount = this.goodsData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.goodsData.length < this.pageSize){
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
    batchDelete() {
      if (this.$refs.selection.getSelection().length === 0) {
        this.$Message.error('未选中批量数据！！！');
      } else {
        this.modalStatus1 = true;
      }
    },
    remove(index) {
      this.goodsData.splice(index, 1);
      // 保存取到的所有数据
      this.ajaxHistoryData = this.goodsData;
      this.dataCount = this.goodsData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.goodsData.length < this.curPage * this.pageSize){
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.goodsData.length);
        if (this.goodsData.length === (this.curPage-1)*this.pageSize) {
          this.curPage--;
          this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.goodsData.length);
        }
      }
      else if (this.goodsData.length > this.curPage * this.pageSize) {
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
      this.Selected = this.$refs.selection.getSelection().splice(0);
      for (var i = 0; i < this.Selected.length; i++) {
        for (var j = 0; j < this.goodsData.length; j++) {
          if (this.Selected[i].item_id == this.goodsData[j].item_id) {
            this.goodsData.splice(j, 1);
            break;
          }
        }
      }
      this.Selected = [];
      // 保存取到的所有数据
      this.ajaxHistoryData = this.goodsData;
      this.dataCount = this.goodsData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.goodsData.length < this.curPage * this.pageSize){
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.goodsData.length);
        if (this.goodsData.length === (this.curPage-1)*this.pageSize) {
          this.curPage--;
          this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.goodsData.length);
        }
      }
      else if (this.goodsData.length > this.curPage * this.pageSize) {
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
.paging {
  margin:10px 0px;
  text-align: right;
}

.addGoodsClassify {
  width: 95%;
  margin: 10px 50px 10px 50px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.addGoodsBaseInfo {
  width: 95%;
  margin: 10px 50px 10px 50px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
</style>
