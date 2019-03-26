<template>
  <div>
    <Alert show-icon class="tips-box" type="warning">
        小提示
        <Icon type="md-bulb" slot="icon"></Icon>
        <template slot="desc">首页配件板块管理。</template>
    </Alert>
    <div class="btns-div">
      <Button type="primary" icon="md-refresh" size="large" @click="changeAD">更换左侧宣传广告</Button>
      显示 <InputNumber v-model="pageSize" size="large" @on-change="changePageSize" :min="1" :max="8"></InputNumber> 条
    </div>
    <Table border :columns="columns" :data="historyData" no-data-text="配件模块信息空空如也，请添加~~~"></Table>
    <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>

    <Modal
            v-model="modal1"
            title="更换左侧宣传图"
            @on-ok="ok"
            @on-cancel="cancel">
            <Form :model="newPhoneData">
                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="跳转链接" label-position="top">
                            <Input v-model="newPhoneData.sourceUrl" placeholder="请输入跳转链接">
                            </Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="宣传图Url" label-position="top">
                          <Input v-model="newPhoneData.imgUrl" placeholder="请输入缩略图地址">
                          </Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                  <Col span="12">
                    <FormItem label="宣传图" label-position="top">
                      <Img :src="newPhoneData.imgUrl" style="width:134px;height:314px;"/>
                    </FormItem>
                  </Col>
                  <Col span="12">
                      <FormItem label="上传宣传图" label-position="top">
                        <Upload multiple ref="upload" :format="['jpg','jpeg','png']" :max-size="2048" :before-upload="handleBeforeUpload" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" type="drag" action="//jsonplaceholder.typicode.com/posts/">
                            <div style="width:134px;height:314px;padding: 157px 67px">
                                <Icon type="md-add" size="20"></Icon>
                            </div>
                        </Upload>
                      </FormItem>
                  </Col>
                </Row>
            </Row>
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
                        <FormItem label="商品名" label-position="top">
                            <Input v-model="formData.title" placeholder="请输入商品名" />
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
                        <FormItem label="现价" label-position="top">
                          <InputNumber
                           size="large"
                           :min="0"
                           v-model="formData.price"
                           :formatter="value => `￥ ${value}`"></InputNumber>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="原价" label-position="top">
                          <InputNumber
                           size="large"
                           :min="0"
                           v-model="formData.oldPrice===undefined?0:formData.oldPrice"
                           :formatter="value => `￥ ${value}`"></InputNumber>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="展示图Url" label-position="top">
                          <Input v-model="formData.imgUrl" placeholder="请输入缩略图地址">
                          </Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="排序值">
                          <InputNumber :max="8" :min="1" v-model="formData.sorted"></InputNumber>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="12">
                      <FormItem label="展示图" label-position="top">
                        <Img :src="formData.imgUrl" style="width:200px;height:200px;"/>
                      </FormItem>
                    </Col>
                    <Col span="12">
                      <FormItem label="商品描述" label-position="top">
                        <Input type="textarea" v-model="formData.desc" :rows="7" placeholder="请输入商品描述" />
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
  name: 'accessory',
  data() {
    return {
      ajaxHistoryData:[],
      // 初始化信息总条数
      dataCount:0,
      // 每页显示多少条
      pageSize:5,
      historyData: [],
      loading: false,
      show: false,
      modal1: false,
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 70,
          align: 'center',
          sortable: true
        },
        {
          title: '展示图',
          key: 'img',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.imgUrl,
                  style: "width:100px; height:100px;"
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
          title: '商品名',
          key: 'title',
          align: 'center'
        },
        {
          title: '原价',
          key: 'oldPrice',
          align: 'center'
        },
        {
          title: '现价',
          key: 'price',
          align: 'center'
        },
        {
          title: '排序值',
          key: 'sorted',
          align: 'center',
          sortable: true
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
                      this.formData.title = params.row.title;
                      this.formData.sourceUrl = params.row.sourceUrl;
                      this.formData.imgUrl = params.row.imgUrl;
                      this.formData.price = params.row.price;
                      this.formData.sorted = params.row.sorted;
                    }
                  }
              })
            ])
          }
        }
      ],
      accessoryData: [
        {id: 1, sourceUrl: '//item.mi.com/1153300034.html', imgUrl: '//i2.mifile.cn/a1/T1COAjB7WT1RXrhCrK.jpg?width=150&height=150', title: '指环式防滑手机支架', price: '12.5', sorted: 1},
				{id: 2, sourceUrl: '//item.mi.com/1151500039.html', imgUrl: '//i2.mifile.cn/a1/T1_SDgB4KT1RXrhCrK.jpg?width=150&height=150', title: '小米自拍杆', price: '49', sorted: 2},
				{id: 3, sourceUrl: '//item.mi.com/1154900023.html', imgUrl: '//i2.mifile.cn/a1/T1l9WjBTbT1RXrhCrK.jpg?width=150&height=150', title: '青米USB快速充电数据线', price: '14.9', sorted: 3},
				{id: 4, sourceUrl: '//item.mi.com/1135200036.html', imgUrl: '//i2.mifile.cn/a1/T1zL_vByCT1RXrhCrK.jpg?width=150&height=150', title: '小米随身WIFI', price: '19.9', sorted: 4},
				{id: 5, sourceUrl: '//item.mi.com/1154900055.html', imgUrl: '//i2.mifile.cn/a1/T1AmJgBsKT1RXrhCrK.jpg?width=150&height=150', title: '苹果Lightning to USB数据线', price: '39', sorted: 5},
				{id: 6, sourceUrl: '//item.mi.com/1162800007.html', imgUrl: '//i2.mifile.cn/a1/pms_1468287589.40786199.jpg?width=150&height=150', title: '米家随身风扇', price: '19.9', sorted: 6},
				{id: 7, sourceUrl: '//item.mi.com/1144900003.html', imgUrl: '//i2.mifile.cn/a1/T1_8YvBKJT1RXrhCrK.jpg?width=150&height=150', title: '功夫米兔手机支架', price: '19', sorted: 7}
      ],
      accessoryPropagandaData: {
        sourceUrl: '#',
        imgUrl: 'https://i1.mifile.cn/a4/xmad_1544580545953_UvEXK.jpg'
      },
      Selected: [],
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      formData: {
        sourceUrl: '',
        imgUrl: '',
        title: '',
        price: 0,
        oldPrice: 0,
        sorted: 0,
      },
      newPhoneData: {
        sourceUrl: '',
        imgUrl: ''
      },
    }
  },
  methods: {
    changePageSize(size) {
      this.pageSize = size;
      this.handleListApproveHistory();
    },
    changeAD() {
      this.modal1 = true;
      this.newPhoneData.sourceUrl = this.accessoryPropagandaData.sourceUrl;
      this.newPhoneData.imgUrl = this.accessoryPropagandaData.imgUrl;
    },
    Submit() {
      this.show = false;
       this.$Message.success('修改成功！');
    },
    ok() {
      this.$Message.success('更换成功！');
      console.log(this.newPhoneData);
    },
    cancel() {
      this.$Message.success('取消更换！');
    },
    // 获取历史记录信息
    handleListApproveHistory(){
      // 保存取到的所有数据
      this.ajaxHistoryData = this.accessoryData
      this.dataCount = this.accessoryData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.accessoryData.length < this.pageSize){
        this.historyData = this.ajaxHistoryData;
      }else{
        this.historyData = this.ajaxHistoryData.slice(0,this.pageSize);
      }
    },
    changepage(index){
      var _start = ( index - 1 ) * this.pageSize;
      var _end = index * this.pageSize;
      this.historyData = this.ajaxHistoryData.slice(_start,_end);
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
.btns-div {
  margin: 5px 0px 5px 10px;
}
.paging{
  margin:10px 0px;
  text-align: right;
}
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
</style>
