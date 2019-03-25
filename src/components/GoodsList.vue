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
          <Select v-model="newGoodInfo.classify" style="width: 300px; margin: 10px 0px 5px 0px;" placeholder="请选择分类">
              <Option v-for="(item, index) in classifyList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </div>
      </div>
      <div class="addGoodsBaseInfo">
        <div style="text-align: center; padding: 10px 0px 0px 0px;">
          <h2>商品基本信息</h2>
          <div style="margin:10px 20px 0px 20px;">
            <Form :model="newGoodInfo" label-position="right" :label-width="120">
              <Row type="flex" justify="center">
                  <Col span="10">
                    <FormItem label="商品名称">
                        <Input v-model="newGoodInfo.goodName" style="width: 400px;" placeholder="请输入商品名称">
                        </Input>
                    </FormItem>
                  </Col>
                  <Col span="10">
                    <FormItem label="商品单位">
                      <Input v-model="newGoodInfo.goodUnit" style="width: 400px;" placeholder="请输入商品单位">
                      </Input>
                    </FormItem>
                  </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col span="10">
                  <FormItem label="已出售量">
                      <Input v-model="newGoodInfo.goodName" style="width: 400px;" placeholder="请输入已出售量">
                      </Input>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="限购量">
                    <Input v-model="newGoodInfo.goodUnit" style="width: 400px;" placeholder="请输入限购量">
                    </Input>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col span="10">
                  <FormItem label="商品缩略图">
                    <Upload
                      multiple
                      type="drag"
                      action="//jsonplaceholder.typicode.com/posts/" style="width:400px; margin: 0 0 0 10px;">
                      <div style="padding: 20px 0">
                          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                          <p>点击或拖拽入此区域进行上传</p>
                      </div>
                  </Upload>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="服务内容">
                    <Input v-model="newGoodInfo.goodName" type="textarea" :rows="6" style="width: 400px;" placeholder="例子：正品保障,极速发货,7天退换货。多个请使用英文逗号,分隔">
                    </Input>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col span="10">
                  <FormItem label="售价">
                      <Input v-model="newGoodInfo.goodName" style="width: 400px;" placeholder="请输入已出售量">
                      </Input>
                  </FormItem>
                </Col>
                <Col span="10">
                  <FormItem label="原价">
                    <Input v-model="newGoodInfo.goodUnit" style="width: 400px;" placeholder="请输入限购量">
                    </Input>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col span="10">
                  <FormItem label="商品图片">
                    <div class="demo-upload-list" v-for="item in uploadList">
                      <template v-if="item.status === 'finished'">
                          <img :src="item.url">
                          <div class="demo-upload-list-cover">
                              <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                          </div>
                      </template>
                      <template v-else>
                          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                      </template>
                    </div>
                    <Upload
                      ref="upload"
                      :show-upload-list="false"
                      :on-success="handleSuccess"
                      :format="['jpg','jpeg','png']"
                      :max-size="2048"
                      :on-format-error="handleFormatError"
                      :on-exceeded-size="handleMaxSize"
                      :before-upload="handleBeforeUpload"
                      multiple
                      type="drag"
                      action="//jsonplaceholder.typicode.com/posts/"
                      style="display: inline-block;width:58px;">
                      <div style="width: 58px;height:58px;line-height: 58px;">
                          <Icon type="ios-add" size="30"></Icon>
                      </div>
                  </Upload>
                  <Modal title="View Image" v-model="visible">
                      <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
                  </Modal>
                  </FormItem>
                </Col>
                <Col span="10">
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>

      <div class="addGoodsStock">
        <div style="text-align: center; padding: 10px 0px 10px 0px;">
          <h2>规格库存</h2>
          <div style="margin:10px 20px 0px 20px;">
            <Form :model="newGoodInfo" label-position="right" :label-width="120">
              <Row type="flex" justify="center">
                  <Col span="10">
                    <FormItem label="商品库存">
                        <Input v-model="newGoodInfo.goodName" style="width: 400px;" placeholder="请输入商品库存" :disabled="stockDisabled">
                          <span slot="append">件</span>
                        </Input>
                    </FormItem>
                  </Col>
                  <Col span="10">
                    <FormItem label="是否使用规格">
                      <Checkbox v-model="single" @on-change="checkBoxChange">使用规格</Checkbox>
                    </FormItem>
                  </Col>
              </Row>
              <Row type="flex" justify="center" v-show="moduleGroupShow">
                  <Col span="10">
                    <FormItem label="规格组和规格值">
                        <Input v-model="moduleGroup" style="width: 400px;" placeholder="如颜色、尺码、套餐">
                          <span slot="prepend">规格组</span>
                          <Button slot="append" @click="addModule">添加</Button>
                        </Input>
                    </FormItem>
                    <div class="module" v-for="(item, index) in moduleList" :key="index">
                      <h3>{{item.name}} <Icon type="ios-close-circle" size="15" @click="removeModule(index)"></Icon></h3>
                      <div style="display: inline-block; text-align: left;">
                        <div class="moduleVule" v-for="(value, i) in item.value" :key="i">
                          <span style="background: #eee; padding: 2px 5px 2px 5px; margin: 5px 10px 5px 10px;">{{value.name}}<Icon type="md-close" size="15" @click="removeValue(index, i)"></Icon></span>
                        </div>
                      </div>
                      <Input v-model="item.valueInput" style="width: 350px; margin: 10px 0px 10px 20px" placeholder="如红色、白色">
                        <span slot="prepend">规格值</span>
                        <Button slot="append" @click="addModuleValue(index)">添加</Button>
                      </Input>
                    </div>
                  </Col>
                  <Col span="10">
                  </Col>
              </Row>
              <Row type="flex" justify="center" v-show="moduleGroupShow">
                  <Col span="20">
                    <FormItem label="价格和库存">
                      <Table border :columns="columns1" :data="stockData" no-data-text="请设置规格值~~~"></Table>
                    </FormItem>
                  </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>

    </Modal>

    <Table border ref="selection" :current="curPage" :columns="columns" :data="historyData" no-data-text="暂无商品，请添加~~~"></Table>
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
      imgName: '',
      visible: false,
      uploadList: [],
      single: false,
      moduleGroupShow: false,
      stockDisabled: false,
      moduleList: [],
      moduleGroup: '',
      columns1: [
        {
          title: '库存',
          key: 'stock',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('InputNumber', {
                  attrs: {
                    value: params.row.stock,
                    style: "text-align:center;",
                    min: 0
                  }
              })
            ])
          }
        },
        {
          title: '价格',
          key: 'price',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('InputNumber', {
                  attrs: {
                    value: params.row.price,
                    style: "text-align:center;",
                    min: 0
                  }
              })
            ])
          }
        },
        {
          title: '规格图片',
          key: 'img',
          align: 'center'
        }
      ],
      stockData: [],
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
        goodUnit: '件',
        imgList: [],
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

    },
    handleView (name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess (res, file) {
      file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
      file.name = '7eb99afb9d5f317c912f08b5212fd69a';
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: file.name + ' 文件格式不正确, 请重新选择 jpg 或 png。'
      });
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: file.name + ' 文件大小太大了, 不能超过 2M。'
      });
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: '最多上传五张图片。'
        });
      }
      return check;
    },
    checkBoxChange() {
      if (this.single === true) {
        this.moduleGroupShow = true;
        this.stockDisabled = true;
      } else {
        this.moduleGroupShow = false;
        this.stockDisabled = false;
      }
    },
    addModule() {
      if (this.moduleList.length >= 3) {
        this.$Message.error("规格组设置不能超过三个！！！");
        return;
      }
      if (this.moduleGroup.length == 0) {
        this.$Message.error("请输入规格组名！！！");
      } else {
        this.moduleList.push({
          name: this.moduleGroup,
          valueInput: '',
          value: []
        });
        this.changeColumns(this.moduleGroup, this.moduleList.length-1);
      }
      this.moduleGroup = '';
    },
    removeModule(index) {
      this.moduleList.splice(index, 1);
      this.columns1.splice(index, 1);
      this.changeTableData();
    },
    addModuleValue(index) {
      if (this.moduleList[index].valueInput.length == 0) {
        this.$Message.error("请输入规格值名！！！");
      } else {
        this.moduleList[index].value.push({
          name: this.moduleList[index].valueInput,
        });
        this.changeTableData();
      }
      this.moduleList[index].valueInput = '';
    },
    removeValue(index, i) {
      this.moduleList[index].value.splice(i, 1);
      this.changeTableData();
    },
    changeColumns(e, index) {
      this.columns1.splice(index, 0,
        {
          title: e,
          key: "module" + index,
          align: "center"
        }
      );
    },
    changeTableData() {
      this.stockData = [];
      for (var i = 0; i < this.moduleList[0].value.length; i++) {
        if(this.moduleList.length < 2) {
          this.stockData.push(
            {
              module0: this.moduleList[0].value[i].name,
              stock: 0,
              price: 0,
              img: []
            }
          );
        } else {
          for (var j = 0; j < this.moduleList[1].value.length; j++) {
            if(this.moduleList.length < 3) {
              this.stockData.push(
                {
                  module0: this.moduleList[0].value[i].name,
                  module1: this.moduleList[1].value[j].name,
                  stock: 0,
                  price: 0,
                  img: []
                }
              );
            } else {
              for (var k = 0; k < this.moduleList[2].value.length; k++) {
                this.stockData.push(
                  {
                    module0: this.moduleList[0].value[i].name,
                    module1: this.moduleList[1].value[j].name,
                    module2: this.moduleList[2].value[k].name,
                    stock: 0,
                    price: 0,
                    img: []
                  }
                );
              }
            }
          }
        }
      }
    }
  },
  created() {
    this.handleListApproveHistory();
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList;
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

.addGoodsStock {
  width: 95%;
  margin: 10px 50px 10px 50px;
  border: 1px solid #ccc;
  border-radius: 10px;
}

.demo-upload-list{
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 4px;
}
.demo-upload-list img{
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover{
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
  display: block;
}
.demo-upload-list-cover i{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.module {
  width: 400px;
  margin: 10px 50px 10px 120px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.moduleVule {
  text-align: left;
  display: inline-block;
  margin: 2px;
}
</style>
