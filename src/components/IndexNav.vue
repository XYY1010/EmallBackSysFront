<template>
  <div>
    <Alert show-icon class="tips-box" type="warning">
        小提示
        <Icon type="md-bulb" slot="icon"></Icon>
        <template slot="desc">分类导航商品添加、查询、修改、删除管理。</template>
    </Alert>
    <div class="btns-div">
      <Button type="error" icon="md-trash" size="large" @click="batchDelete">批量删除</Button>
      <Button type="success" icon="md-add" size="large" @click="modalStatus2 = true">添加导航栏内容</Button>
      显示 <InputNumber v-model="pageSize" size="large" @on-change="changePageSize" :min="1" :max="10"></InputNumber> 条
    </div>
    <Table border ref="selection" :columns="columns" :data="historyData" @on-selection-change="select" no-data-text="分类导航空空如也，请添加~~~"></Table>
    <Page :total="dataCount" :page-size="pageSize" :current="curPage" show-total class="paging" @on-change="changepage"></Page>

    <Modal
            v-model="modalStatus"
            title="提示"
            @on-ok="ok"
            @on-cancel="cancel">
            <p>确定将该导航移除吗？</p>
        </Modal>
        <Modal
                v-model="modalStatus1"
                title="提示"
                @on-ok="ok1"
                @on-cancel="cancel1">
                <p>确定批量移除这些导航吗？</p>
            </Modal>
            <Modal
                    v-model="modalStatus2"
                    title="添加新导航"
                    @on-ok="ok2"
                    @on-cancel="cancel2">
                    <Form :model="newNavData">
                        <Row :gutter="32">
                            <Col span="12">
                                <FormItem label="导航商品名" label-position="top">
                                    <Input v-model="newNavData.name" placeholder="请输入导航商品名" />
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="跳转链接" label-position="top">
                                    <Input v-model="newNavData.sourceUrl" placeholder="请输入跳转链接">
                                    </Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="32">
                            <Col span="12">
                                <FormItem label="所在分类" label-position="top">
                                    <Select v-model="newNavData.classify" placeholder="请选择分类">
                                        <Option value="手机 电话卡">手机 电话卡</Option>
                                        <Option value="电视 盒子">电视 盒子</Option>
                                        <Option value="笔记本 平板">笔记本 平板</Option>
                                        <Option value="家电 插线板">家电 插线板</Option>
                                        <Option value="出行 穿戴">出行 穿戴</Option>
                                        <Option value="智能 路由器">智能 路由器</Option>
                                        <Option value="电源 配件">电源 配件</Option>
                                        <Option value="健康 儿童">健康 儿童</Option>
                                        <Option value="耳机 音响">耳机 音响</Option>
                                        <Option value="生活 箱包">生活 箱包</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="购买状态" label-position="top">
                                    <Select v-model="newNavData.buyStatus" placeholder="请选择购买状态">
                                        <Option value="true">可购买</Option>
                                        <Option value="false">售罄</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="32">
                            <Col span="12">
                                <FormItem label="缩略图Url" label-position="top">
                                  <Input v-model="newNavData.imgUrl" placeholder="请输入缩略图地址">
                                  </Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem label="缩略图" label-position="top">
                          <Img :src="newNavData.imgUrl" style="width:300px;height:200px;"/>
                        </FormItem>
                    </Form>
                </Modal>
    <Drawer
            title="修改"
            v-model="show"
            width="720"
            :mask-closable="false"
            :styles="styles"
        >
            <Form :model="formData">
                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="导航商品名" label-position="top">
                            <Input v-model="formData.name" placeholder="请输入导航商品名" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="跳转链接" label-position="top">
                            <Input v-model="formData.sourceUrl" placeholder="请输入跳转链接">
                            </Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="所在分类" label-position="top">
                            <Select v-model="formData.classify" placeholder="请选择分类">
                                <Option value="手机 电话卡">手机 电话卡</Option>
                                <Option value="电视 盒子">电视 盒子</Option>
                                <Option value="笔记本 平板">笔记本 平板</Option>
                                <Option value="家电 插线板">家电 插线板</Option>
                                <Option value="出行 穿戴">出行 穿戴</Option>
                                <Option value="智能 路由器">智能 路由器</Option>
                                <Option value="电源 配件">电源 配件</Option>
                                <Option value="健康 儿童">健康 儿童</Option>
                                <Option value="耳机 音响">耳机 音响</Option>
                                <Option value="生活 箱包">生活 箱包</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="购买状态" label-position="top">
                            <Select v-model="formData.buyStatus" placeholder="请选择购买状态">
                                <Option value="true">可购买</Option>
                                <Option value="false">售罄</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="缩略图Url" label-position="top">
                          <Input v-model="formData.imgUrl" placeholder="请输入缩略图地址">
                          </Input>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="缩略图" label-position="top">
                  <Img :src="formData.imgUrl" style="width:300px;height:200px;"/>
                </FormItem>
            </Form>
            <div class="drawer-footer">
                <Button style="margin-right: 8px" @click="show = false">取消</Button>
                <Button type="primary" @click="Submit()">提交修改</Button>
            </div>
        </Drawer>
  </div>
</template>

<script>
export default {
  name: "indexnav",
  data() {
    return {
      ajaxHistoryData:[],
      // 初始化信息总条数
      dataCount:0,
      // 每页显示多少条
      pageSize:10,
      curPage: 1,
      historyData: [],
      loading: false,
      modalStatus: false,
      modalStatus1: false,
      modalStatus2: false,
      rmIndex: -1,
      columns: [
        {
          type: 'selection',
          title: '全选',
          width: 58,
          align: 'center'
        },
        {
          title: 'ID',
          key: 'id',
          width: 70,
          align: 'center',
          sortable: true
        },
        {
          title: '缩略图',
          key: 'img',
          width: 86,
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.imgUrl,
                  style: "width:50px; height:40px;"
                }
              })
            ]);
          },
          align: 'center'
        },
        {
          title: '跳转链接',
          key: 'sourceUrl',
          align: 'center'
        },
        {
          title: '导航名',
          key: 'name',
          align: 'center'
        },
        {
          title: '购买状态',
          key:'buyStatus',
          align: 'center',
          render: (h, params) => {
            if (params.row.buyStatus == true) {
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #83c44e; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "可购买")
              ]);
            } else {
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #e53935; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "售罄")
              ]);
            }
          },
          filters: [
            {
              label: '可购买',
              value: 0
            },
            {
              label: '售罄',
              value: 1
            }
          ],
          filterMultiple: true,
          filterMethod (value, row) {
            if (value === 0) {
                return row.buyStatus === true;
            } else if (value === 1) {
                return row.buyStatus === false;
            }
          }
        },
        {
          title: '所在分类',
          key:'classify',
          align: 'center',
          filters: [
            {
              label: '手机 电话卡',
              value: 0
            },
            {
              label: '电视 盒子',
              value: 1
            },
            {
              label: '笔记本 平板',
              value: 2
            },
            {
              label: '家电 插线板',
              value: 3
            },
            {
              label: '出行 穿戴',
              value: 4
            },
            {
              label: '智能 路由器',
              value: 5
            },
            {
              label: '电源 配件',
              value: 6
            },
            {
              label: '健康 儿童',
              value: 7
            },
            {
              label: '耳机 音响',
              value: 8
            },
            {
              label: '生活 箱包',
              value: 9
            }
          ],
          filterMultiple: true,
          filterMethod (value, row) {
              if (value === 0) {
                  return row.classify === '手机 电话卡';
              } else if (value === 1) {
                  return row.classify === '电视 盒子';
              } else if (value === 2) {
                  return row.classify === '笔记本 平板';
              } else if (value === 3) {
                  return row.classify === '家电 插线板';
              } else if (value === 4) {
                  return row.classify === '出行 穿戴';
              } else if (value === 5) {
                  return row.classify === '智能 路由器';
              } else if (value === 6) {
                  return row.classify === '电源 配件';
              } else if (value === 7) {
                  return row.classify === '健康 儿童';
              } else if (value === 8) {
                  return row.classify === '耳机 音响';
              } else if (value === 9) {
                  return row.classify === '生活 箱包';
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
                    type: "ios-create",
                    size: 20
                  },
                  on: {
                    click: () => {
                      this.show = true;
                      this.formData.id = params.row.id;
                      this.formData.sourceUrl = params.row.sourceUrl;
                      this.formData.imgUrl = params.row.imgUrl;
                      this.formData.name = params.row.name;
                      this.formData.buyStatus = params.row.buyStatus;
                      this.formData.classify = params.row.classify;
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
      navData: [
				  {id: 1, sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/xm5sp.png', name: '小米5s plus', buyStatus: true, classify: '手机 电话卡'},
          {id: 2, sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/xm5s.jpg', name: '小米5s', buyStatus: true, classify: '手机 电话卡'},
          {id: 3, sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/MIX.jpg', name: '小米mix', buyStatus: true, classify: '手机 电话卡'},
          {id: 4, sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/xm6.png', name: '小米6', buyStatus: true, classify: '手机 电话卡'},
          {id: 5, sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/xiaomiNOTE2.jpg', name: '小米Note2', buyStatus: true, classify: '手机 电话卡'},
          {id: 6, sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/max2.png', name: '小米Max2', buyStatus: true, classify: '手机 电话卡'},
          {id: 7, sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/mi5c.png', name: '小米5c', buyStatus: true, classify: '手机 电话卡'},
          {id: 8, sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/hm4.jpg', name: '红米4', buyStatus: true, classify: '手机 电话卡'},
          {id: 9, sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/hm4x.jpg', name: '红米4x', buyStatus: true, classify: '手机 电话卡'},
          {id: 10, sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/4g+.jpg', name: '移动4G+专区', buyStatus: true, classify: '手机 电话卡'},
          {id: 11, sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/compare.jpg', name: '手机对比服务', buyStatus: true, classify: '手机 电话卡'},
          {id: 12, sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/mimobile.jpg', name: '小米电话卡', buyStatus: true, classify: '手机 电话卡'},
    			{id: 13, sourceUrl: '/goodslist', imgUrl: 'http://139.199.125.60/baohutao.jpg', name: '手机保护套', buyStatus: false, classify: '手机 电话卡'},
          {id: 14, sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/xmyyong.png', name: '小米应用', buyStatus: true, classify: '手机 电话卡'},
          {id: 15, sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/bijiben12.5.jpg', name: '小米笔记本12.5寸', buyStatus: true, classify: '笔记本 平板'},
    			{id: 16,sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/bijiben13.3.jpg', name: '小米笔记本13.3寸', buyStatus: true, classify: '笔记本 平板'},
          {id: 17,sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/mipad3.png', name: '小米pad3', buyStatus: false, classify: '笔记本 平板'},
          {id: 18,sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/xmymjp.png', name: '小米键盘', buyStatus: true, classify: '笔记本 平板'},
          {id: 19,sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/shubiao.jpg', name: '小米鼠标', buyStatus: true, classify: '笔记本 平板'},
          {id: 20,sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/usbc-zjq.jpg', name: '转接器', buyStatus: true, classify: '笔记本 平板'},
          {id: 21,sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/xmjjsjb.jpg', name: '笔记本电脑双肩包', buyStatus: true, classify: '笔记本 平板'},
          {id: 22,sourceUrl: '/goodslist', buyUrl: '/', imgUrl: 'http://139.199.125.60/neidanbao.jpg', name: '内胆包', buyStatus: true, classify: '笔记本 平板'},
      ],
      show: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      formData: {
        id: '',
        sourceUrl: '',
        imgUrl: '',
        name: '',
        buyStatus: '',
        classify: '',
      },
      newNavData: {
        sourceUrl: '',
        imgUrl: '',
        name: '',
        buyStatus: '',
        classify: '',
      },
      navSelected: []
    }
  },
  methods: {
    changePageSize(size) {
      this.pageSize = size;
      this.handleListApproveHistory();
    },
    Submit() {
      this.show = false;
       this.$Message.success('修改成功！');
    },
    remove(index) {
      this.navData.splice(index, 1);
      // 保存取到的所有数据
      this.ajaxHistoryData = this.navData;
      this.dataCount = this.navData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.navData.length < this.curPage * this.pageSize){
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.navData.length);
        if (this.navData.length === (this.curPage-1)*this.pageSize) {
          this.curPage--;
          this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.navData.length);
        }
      }
      else if (this.navData.length > this.curPage * this.pageSize) {
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.curPage * this.pageSize);
      }
      // 后端数据库删除请求
    },
    select(selection) {
      this.navSelected = selection;
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
    // 获取历史记录信息
    handleListApproveHistory(){
      // 保存取到的所有数据
      this.ajaxHistoryData = this.navData
      this.dataCount = this.navData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.navData.length < this.pageSize){
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
    ok1() {
      this.Selected = this.$refs.selection.getSelection().splice(0);
      for (var i = 0; i < this.Selected.length; i++) {
        for (var j = 0; j < this.navData.length; j++) {
          if (this.Selected[i].id === this.navData[j].id) {
            this.navData.splice(j, 1);
            break;
          }
        }
      }
      // 保存取到的所有数据
      this.ajaxHistoryData = this.navData;
      this.dataCount = this.navData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.navData.length < this.curPage * this.pageSize){
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.navData.length);
        if (this.navData.length === (this.curPage-1)*this.pageSize) {
          this.curPage--;
          this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.navData.length);
        }
      }
      else if (this.navData.length > this.curPage * this.pageSize) {
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.curPage * this.pageSize);
      }
      this.$Message.success('批量移除成功！');
        // 后台数据更新
      },
    cancel1() {
      this.$Message.success('取消移除！');
    },
    ok2() {
      console.log(this.newNavData);
      this.handleListApproveHistory();
      this.$Message.success('添加成功！');
        // 后台数据更新
      },
    cancel2() {
      this.$Message.success('取消添加！');
    }
  },
  created(){
    this.handleListApproveHistory();
  }
}
</script>

<style lang="css" scoped>
.drawer-footer{
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.btns-div {
  margin: 5px 0px 5px 10px;
}
.paging{
  margin:10px 0px;
  text-align: right;
}
</style>
