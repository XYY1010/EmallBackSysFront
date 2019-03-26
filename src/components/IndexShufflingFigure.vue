<template>
  <div>
    <Alert show-icon class="tips-box" type="warning">
        小提示
        <Icon type="md-bulb" slot="icon"></Icon>
        <template slot="desc">首页轮播图添加、删除、修改。</template>
    </Alert>
    <div class="btns-div">
      <Button type="error" icon="md-trash" size="large" @click="batchDelete">批量删除</Button>
      <Button type="success" icon="md-add" size="large" @click="modalStatus2 = true">添加轮播图</Button>
      显示 <InputNumber v-model="pageSize" size="large" @on-change="changePageSize" :min="1" :max="4"></InputNumber> 条
    </div>
    <Table border ref="selection" :columns="columns" :data="historyData" @on-selection-change="select" no-data-text="分类导航空空如也，请添加~~~"></Table>
    <Page :total="dataCount" :current="curPage" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>

    <Modal
            v-model="modalStatus"
            title="提示"
            @on-ok="ok"
            @on-cancel="cancel">
            <p>确定将该轮播图移除吗？</p>
        </Modal>
        <Modal
                v-model="modalStatus1"
                title="提示"
                @on-ok="ok1"
                @on-cancel="cancel1">
                <p>确定批量移除这些轮播图吗？</p>
            </Modal>
            <Modal
                    v-model="modalStatus2"
                    title="添加新轮播图"
                    @on-ok="ok2"
                    @on-cancel="cancel2">
                    <Form :model="newFigureData">
                      <Row :gutter="32">
                          <Col span="24">
                              <FormItem label="跳转链接">
                                  <Input v-model="newFigureData.sourceUrl" placeholder="请输入跳转链接">
                                  </Input>
                              </FormItem>
                          </Col>
                      </Row>
                      <Row :gutter="32">
                          <Col span="24">
                              <FormItem label="轮播图Url">
                                <Input v-model="newFigureData.imgUrl" placeholder="请输入缩略图地址">
                                </Input>
                              </FormItem>
                          </Col>
                      </Row>
                      <FormItem label="轮播图" label-position="left">
                        <Img :src="newFigureData.imgUrl" style="width:300px;height:200px;"/>
                      </FormItem>
                      <Row :gutter="32">
                          <Col span="24">
                              <FormItem label="排序值">
                                <InputNumber :max="10" :min="1" v-model="newFigureData.sorted"></InputNumber>
                              </FormItem>
                          </Col>
                      </Row>
                      <Row :gutter="32">
                          <Col span="24">
                              <FormItem label="上传轮播图" label-position="top">
                                <Upload multiple ref="upload" :format="['jpg','jpeg','png']" :max-size="2048" :before-upload="handleBeforeUpload" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" type="drag" action="//jsonplaceholder.typicode.com/posts/">
                                    <div style="padding: 20px 0">
                                        <Icon type="md-add" size="20"></Icon>
                                    </div>
                                </Upload>
                              </FormItem>
                          </Col>
                      </Row>
                    </Form>
                </Modal>
    <Drawer
    title="修改"
    v-model="show"
    width="330"
    :mask-closable="false"
    :styles="styles"
    >
            <Form :model="formData">
                <Row :gutter="32">
                    <Col span="24">
                        <FormItem label="跳转链接">
                            <Input v-model="formData.sourceUrl" placeholder="请输入跳转链接">
                            </Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="24">
                        <FormItem label="轮播图Url">
                          <Input v-model="formData.imgUrl" placeholder="请输入缩略图地址">
                          </Input>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="轮播图" label-position="left">
                  <Img :src="formData.imgUrl" style="width:300px;height:200px;"/>
                </FormItem>
                <Row :gutter="32">
                    <Col span="24">
                        <FormItem label="排序值">
                          <InputNumber :max="10" :min="1" v-model="formData.sorted"></InputNumber>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="24">
                        <FormItem label="上传轮播图" label-position="top">
                          <Upload multiple ref="upload" :format="['jpg','jpeg','png']" :max-size="2048" :before-upload="handleBeforeUpload" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" type="drag" action="//jsonplaceholder.typicode.com/posts/">
                              <div style="padding: 20px 0">
                                  <Icon type="md-add" size="20"></Icon>
                              </div>
                          </Upload>
                        </FormItem>
                    </Col>
                </Row>
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
  name: "indexshufflingfigure",
  data() {
    return {
      ajaxHistoryData:[],
      // 初始化信息总条数
      dataCount:0,
      // 每页显示多少条
      pageSize:4,
      historyData: [],
      loading: false,
      modalStatus: false,
      modalStatus1: false,
      modalStatus2: false,
      rmIndex: -1,
      curPage: 1,
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
          title: '轮播图',
          key: 'img',
          width: 400,
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.imgUrl,
                  style: "width:300px; height:130px;"
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
          title: '排序值',
          key: 'sorted',
          align: 'center',
          sortable: true
        },
        {
          title: '创建日期',
          key: 'createdDate',
          align: 'center'
        },
        {
          title: '更新日期',
          key: 'updatedDate',
          align: 'center'
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 100,
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
                      this.formData.sourceUrl = params.row.sourceUrl;
                      this.formData.imgUrl = params.row.imgUrl;
                      this.formData.sorted = params.row.sorted;
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
      shufflingFigureData: [
        {id: 1, sourceUrl: '/goodsdetail', imgUrl: 'http://139.199.125.60/xmad1.jpg', sorted: 1, createdDate: '1970-01-01 00:00', updatedDate: '1970-01-01 00:00'},
        {id: 2, sourceUrl: '/goodsdetail', imgUrl: 'http://139.199.125.60/xmad2.jpg', sorted: 2, createdDate: '1970-01-01 00:00', updatedDate: '1970-01-01 00:00'},
        {id: 3, sourceUrl: '/goodsdetail', imgUrl: 'http://139.199.125.60/xmad3.jpg', sorted: 3, createdDate: '1970-01-01 00:00', updatedDate: '1970-01-01 00:00'},
        {id: 4, sourceUrl: '/goodsdetail', imgUrl: 'http://139.199.125.60/xmad4.jpg', sorted: 4, createdDate: '1970-01-01 00:00', updatedDate: '1970-01-01 00:00'},
        {id: 5, sourceUrl: '/goodsdetail', imgUrl: 'http://139.199.125.60/xmad5.jpg', sorted: 5, createdDate: '1970-01-01 00:00', updatedDate: '1970-01-01 00:00'},
        {id: 6, sourceUrl: '/goodsdetail', imgUrl: 'http://139.199.125.60/xmad6.jpg', sorted: 6, createdDate: '1970-01-01 00:00', updatedDate: '1970-01-01 00:00'},
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
        sorted: 0,
      },
      newFigureData: {
        sourceUrl: '',
        imgUrl: '',
        sorted: 0,
      },
      Selected: []
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
      this.shufflingFigureData.splice(index, 1);
      this.ajaxHistoryData = this.shufflingFigureData;
      this.dataCount = this.shufflingFigureData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.shufflingFigureData.length < this.curPage * this.pageSize){
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.shufflingFigureData.length);
        if (this.shufflingFigureData.length === (this.curPage-1)*this.pageSize) {
          this.curPage--;
          this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.shufflingFigureData.length);
        }
      }
      else if (this.shufflingFigureData.length > this.curPage * this.pageSize) {
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.curPage * this.pageSize);
      }
      // 后端数据库删除请求
    },
    select(selection) {
      this.Selected = selection;
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
      this.ajaxHistoryData = this.shufflingFigureData
      this.dataCount = this.shufflingFigureData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.shufflingFigureData.length < this.pageSize){
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
        for (var j = 0; j < this.shufflingFigureData.length; j++) {
          if (this.Selected[i].id === this.shufflingFigureData[j].id) {
            this.shufflingFigureData.splice(j, 1);
            break;
          }
        }
      }
      this.ajaxHistoryData = this.shufflingFigureData;
      this.dataCount = this.shufflingFigureData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.shufflingFigureData.length < this.curPage * this.pageSize){
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.shufflingFigureData.length);
        if (this.shufflingFigureData.length === (this.curPage-1)*this.pageSize) {
          this.curPage--;
          this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.shufflingFigureData.length);
        }
      }
      else if (this.shufflingFigureData.length > this.curPage * this.pageSize) {
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.curPage * this.pageSize);
      }
      this.$Message.success('批量移除成功！');
        // 后台数据更新
      },
    cancel1() {
      this.$Message.success('取消移除！');
    },
    ok2() {
      this.handleListApproveHistory();
      this.$Message.success('添加成功！');
        // 后台数据更新
      },
    cancel2() {
      this.$Message.success('取消添加！');
    },
    handleBeforeUpload(file) {
        // 创建一个 FileReader 对象
        let reader = new FileReader()
        // readAsDataURL 方法用于读取指定 Blob 或 File 的内容
        // 当读操作完成，readyState 变为 DONE，loadend 被触发，此时 result 属性包含数据：URL（以 base64 编码的字符串表示文件的数据）
        // 读取文件作为 URL 可访问地址
        reader.readAsDataURL(file)

        const _this = this
        reader.onloadend = function (e) {
            file.url = reader.result;
            _this.formData.imgUrl = file;
        }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
      })
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
      })
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
