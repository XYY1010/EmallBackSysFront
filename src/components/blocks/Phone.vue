<template>
  <div>
    <Alert show-icon class="tips-box" type="warning">
        小提示
        <Icon type="md-bulb" slot="icon"></Icon>
        <template slot="desc">首页手机板块管理。</template>
    </Alert>
    <div class="btns-div">
      <Button type="primary" icon="md-refresh" size="large" @click="changeAD">更换左侧宣传广告</Button>
      显示 <InputNumber v-model="pageSize" size="large" @on-change="changePageSize" :min="1" :max="8"></InputNumber> 条
    </div>
    <Table border ref="selection" :columns="columns" :data="historyData" @on-selection-change="select" no-data-text="手机模块信息空空如也，请添加~~~"></Table>
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
                           v-model="formData.oldPrice===undefine?0:formData.oldPrice"
                           :formatter="value => `￥ ${value}`"></InputNumber>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="优惠类型" label-position="top">
                            <Select v-model="formData.discountType" placeholder="请选择类型">
                                <Option value="new">新品</Option>
                                <Option value="discount">折扣</Option>
                                <Option value="free">免邮</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="优惠描述" label-position="top">
                            <Input placeholder="请输入价格描述" v-model="formData.discount"></Input>
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
  name: 'phone',
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
          title: '商品描述',
          key: 'desc',
          align: 'center'
        },
        {
          title: '优惠类型',
          key: 'discountType',
          align: 'center',
          render: (h, params) => {
            if (params.row.discountType === 'new') {
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #83c44e; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "新品")
              ])
            } else if (params.row.discountType === 'free') {
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #ffac13; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "免邮")
              ])
            } else if (params.row.discountType === 'discount') {
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #e53935; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "折扣")
              ])
            }
          },
          filters: [
            {
              label: '新品',
              value: 0
            },
            {
              label: '折扣',
              value: 1
            },
            {
              label: '免邮',
              value: 2
            }
          ],
          filterMultiple: true,
          filterMethod (value, row) {
            if (value === 0) {
                return row.discountType === 'new';
            } else if (value === 1) {
                return row.discountType === 'discount';
            } else if (value === 2) {
                return row.discountType === 'free';
            }
          }
        },
        {
          title: '优惠描述',
          key: 'discount',
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
                      this.formData.desc = params.row.desc;
                      this.formData.price = params.row.price;
                      this.formData.oldPrice = params.row.oldPrice;
                      this.formData.sorted = params.row.sorted;
                      this.formData.discount = params.row.discount;
                      this.formData.discountType = params.row.discountType;
                    }
                  }
              })
            ])
          }
        }
      ],
      phoneData: [
        {id:1, sourceUrl: '//item.mi.com/1161200059.html', imgUrl: 'https://i1.mifile.cn/a1/pms_1537323963.1278763!220x220.jpg', title: '小米8 青春版 4GB+64GB', desc: '潮流镜面渐变色，2400万自拍旗舰', price: '1299', discountType: 'new', discount: '新品', sorted: 1},
        {id:2, sourceUrl: '//www.mi.com/mibicycle/', imgUrl: 'https://i1.mifile.cn/a1/pms_1545457703.71734471!220x220.png', title: '小米Play', desc: '内置每月10GB高速流量，高颜值流光渐变色', price: '1099', discountType: 'new', discount: '新品', sorted: 2},
        {id:3, sourceUrl: '//www.mi.com/mitu/', imgUrl: 'https://i1.mifile.cn/a1/pms_1527685277.65255600!220x220.jpg', title: '小米8 SE 6GB+64GB', desc: 'AI 超感光双摄，三星 AMOLED 屏幕', price: '1699', oldPrice: '1999', discountType: 'discount', discount: '减300元', sorted: 3},
        {id:4, sourceUrl: '//www.mi.com/water2/', imgUrl: 'https://i1.mifile.cn/a1/pms_1522034061.12391230!220x220.jpg', title: '小米MIX 2S 8GB+256GB', desc: '骁龙845 年度旗舰处理器，艺术品般陶瓷机身', price: '3399', oldPrice: '3999', discountType: 'discount', discount: '减600元', sorted: 4},
        {id:5, sourceUrl: '//www.mi.com/ihealth/ ', imgUrl: 'https://i1.mifile.cn/a1/pms_1524621350.77238418!220x220.jpg', title: '小米6X 6GB+128GB', desc: '轻薄美观的拍照手机', price: '1499', oldPrice: '1999', discountType: 'discount', discount: '享八折', sorted: 5},
        {id:6, sourceUrl: '//www.mi.com/dianfanbao/', imgUrl: 'https://i1.mifile.cn/a1/pms_1531878001.22998509!220x220.jpg', title: '小米Max 3 4GB+64GB', desc: '', price: '1599', oldPrice: '1699', discountType: 'discount', discount: '减100元', sorted: 6},
        {id:7, sourceUrl: '//item.mi.com/1163200015.html', imgUrl: 'https://i1.mifile.cn/a1/pms_1529635747.42979757!220x220.jpg', title: '红米6 Pro', desc: '高颜值大电量 红米旗舰', price: '1029', oldPrice: '1299', discountType: 'discount', discount: '享八折', sorted: 7},
        {id:8, sourceUrl: '//list.mi.com/accessories/tag?id=guangganban', imgUrl: 'https://i1.mifile.cn/a1/pms_1528719461.20891365!220x220.jpg', title: '红米6A 2GB+16GB', desc: '', price: '549', oldPrice: '599', discountType: 'discount', discount: '减50元', sorted: 8}
      ],
      phonePropagandaData: {
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
        desc: '',
        discountType: '',
        discount: '',
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
      this.newPhoneData.sourceUrl = this.phonePropagandaData.sourceUrl;
      this.newPhoneData.imgUrl = this.phonePropagandaData.imgUrl;
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
      this.ajaxHistoryData = this.phoneData
      this.dataCount = this.phoneData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.phoneData.length < this.pageSize){
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
