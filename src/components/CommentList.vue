<template>
  <div>
    <Alert show-icon class="tips-box" type="warning">
        小提示
        <Icon type="md-bulb" slot="icon"></Icon>
        <template slot="desc">用户评论管理。</template>
    </Alert>

    <div class="searchDiv">
      <span>
        <Input placeholder="输入要查询的用户名" style="width:300px; margin: 0px 10px 0px 0px" size="large"></Input>
        <Button type="primary" shape="circle" icon="ios-search" size="large">搜用户</Button>
        <Button type="error" shape="circle" icon="md-close" size="large">取消检索</Button>
      </span>
    </div>
    <div class="operationDiv">
      <div class="subDiv">
        显示 <InputNumber v-model="pageSize" size="large" @on-change="changePageSize" :min="1" :max="10"></InputNumber> 条
        <span style="float: right; margin: 0 20px 0 0; font-size: 18px;">
          共有 {{commentsData.length}} 条记录
        </span>
      </div>
    </div>

    <Table border :columns="columns" :data="historyData" no-data-text="暂无用户评论~~~"></Table>
    <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>
    <Modal
      v-model="modalStatus2"
      title="评论详情">
      <Form ref="checkCommentData" :model="checkCommentData">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="评论ID" label-position="top">
              <Input v-model="checkCommentData.commentId" disabled />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="用户名" label-position="top">
              <Input v-model="checkCommentData.userName" disabled />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="商品名" label-position="top">
              <Input v-model="checkCommentData.itemName" disabled />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="商品属性" abel-position="top">
              <Input v-model="checkCommentData.itemVals" disabled />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="评论内容" label-position="top">
              <Input v-model="checkCommentData.content" type="textarea" :rows="4" disabled />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="评论时间" label-position="top">
              <Input v-model="checkCommentData.commentDate" disabled />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="32">
            <FormItem label="评论图片" label-position="top">
              <div class="" v-for="(imgUrl, index) in checkCommentData.commentImg" :key="index">
                <Img style="float:left; width:50px; height: 50px; box-shadow:2px 2px 2px 2px #ccc; margin:0 2px 0 2px;" :src="imgUrl"/>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Drawer
      title="回复评论"
      v-model="show"
      width="330"
      :mask-closable="false"
      :styles="styles">
      <Form ref="formData" :model="formData">
        <Row :gutter="32">
          <Col span="32">
            <FormItem label="回复内容" prop="phone" label-position="top">
              <Input v-model="formData.commentContent" type="textarea" :rows="10" placeholder="请输入回复内容" />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="drawer-footer">
        <Button style="margin-right: 8px" @click="show = false">取消</Button>
        <Button type="primary" @click="Submit('formData')">回复</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
export default {
  name: "commentlist",
  data() {
    return {
      ajaxHistoryData:[],
      // 初始化信息总条数
      dataCount:0,
      // 每页显示多少条
      pageSize:10,
      historyData: [],
      modalStatus2: false,
      show: false,
      commentsData: [
        {commentId: '42346568078112456', userName: '李大大', itemName: '【国内柜台】雅诗兰黛新沁水粉底液 30ml 新款 60# 63# 61#', itemVals: '62#新款', content: '真的良心价呀～ 本大干皮也没觉得沁水有多润（小声bb）做好保湿才能保证不起皮，我用下来的心得就是千万不要涂太多，薄薄的一层妆效最好看。粉底不会暗沉，我用一整天下来晚上脸还是白白的～', commentImg: ['https://gd2.alicdn.com/imgextra/i2/48997906/O1CN01dAPWRB28Gzn78ycjw_!!48997906.jpg_50x50.jpg_.webp', 'https://gd2.alicdn.com/imgextra/i2/48997906/O1CN01gWlh1f28Gzn8HkTAz_!!48997906.jpg_50x50.jpg_.webp', 'https://gd2.alicdn.com/imgextra/i2/48997906/O1CN013gh8K528Gzn22NX0H_!!48997906.jpg_50x50.jpg_.webp'], commentType: '好评', commentStatus: 'false', commentDate: '2019年03月01日 09:54'},
        {commentId: '42346568078111111', userName: '李大大', itemName: 'BO5 Puma 彪马 Ignite Evoknit 高帮袜子军绿189697_05 190454_04', itemVals: '颜色分类：军绿2代190454_04国内现货  鞋码：45', content: '鞋子很靓，微信知解鉴定了是假的，差评', commentImg: ['https://img.alicdn.com/imgextra/i4/0/O1CN011TZrq9uc2apk28G_!!0-rate.jpg_40x40.jpg', 'https://img.alicdn.com/imgextra/i3/0/O1CN011TZrqBBHm0pqnSF_!!0-rate.jpg_400x400.jpg', 'https://img.alicdn.com/imgextra/i1/0/O1CN011TZrqBh2CwhX7bR_!!0-rate.jpg_400x400.jpg', 'https://img.alicdn.com/imgextra/i1/0/O1CN011TZrqApF2xwISj6_!!0-rate.jpg_40x40.jpg'], commentType: '差评', commentStatus: 'true', commentDate: '2018年10月29日 12:11'}
      ],
      columns: [
        {
          title: 'ID',
          key: 'commentId',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('a', {
                attrs: {
                },
                on: {
                  click: () => {
                    this.modalStatus2 = true;
                    this.checkCommentData.commentId =  params.row.commentId;
                    this.checkCommentData.userName = params.row.userName;
                    this.checkCommentData.itemName = params.row.itemName;
                    this.checkCommentData.itemVals = params.row.itemVals
                    this.checkCommentData.content = params.row.content;
                    this.checkCommentData.commentImg = params.row.commentImg;
                    this.checkCommentData.commentStatus = params.row.commentStatus;
                    this.checkCommentData.commentDate = params.row.commentDate;
                  }
                }
              }, params.row.commentId)
            ]);
          },
          sortable: true
        },
        {
          title: '用户名',
          key: 'userName',
          width: 86,
          align: 'center'
        },
        {
          title: '商品名',
          key: 'itemName',
          align: 'center',
          render:(h, params) => {
            return h('div', [
              h('span', {
                  attrs: {
                  }
              }, params.row.itemName.substring(0, 20) + '...')
            ]);
          }
        },
        {
          title: '商品属性',
          key: 'itemVals',
          align: 'center',
        },
        {
          title: '评论内容',
          key:'content',
          align: 'center',
          render:(h, params) => {
            return h('div', [
              h('span', {
                  attrs: {
                  }
              }, params.row.content.substring(0, 15) + '...')
            ]);
          }
        },
        {
          title: '评论图片',
          key:'commentImg',
          align: 'center',
          render: (h, params) => {
            for (var i = 0; i < params.row.commentImg.length; i++) {
              return h('div', [
                  h('img', {
                    attrs: {
                      src: params.row.commentImg[i],
                      style: "width: 50px; height: 50px;"
                    }
                  })
              ]);
            }
          },
        },
        {
          title: '评论类型',
          key:'commentType',
          align: 'center',
          width: 110,
          render: (h, params) => {
            if (params.row.commentType === '好评') {
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #83c44e; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "好评")
              ]);
            } else if (params.row.commentType === '中评') {
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #ffac13; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "中评")
              ])
            } else if (params.row.commentType === '差评') {
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #e53935; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "差评")
              ]);
            }
          },
          filters: [
            {
              label: '好评',
              value: 0
            },
            {
              label: '中评',
              value: 1
            },
            {
              label: '差评',
              value: 2
            }
          ],
          filterMultiple: true,
          filterMethod (value, row) {
            if (value === 0) {
                return row.commentType === '好评';
            } else if (value === 1) {
                return row.commentType === '中评';
            } else if (value === 2) {
                return row.commentType === '差评';
            }
          }
        },
        {
          title: '评论状态',
          key:'commentStatus',
          align: 'center',
          width: 110,
          render: (h, params) => {
            if (params.row.commentStatus === 'true') {
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #83c44e; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "已回复")
              ]);
            } else if (params.row.commentStatus === 'false') {
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #e53935; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "未回复")
              ]);
            }
          },
          filters: [
            {
              label: '未回复',
              value: 0
            },
            {
              label: '已回复',
              value: 1
            }
          ],
          filterMultiple: true,
          filterMethod (value, row) {
            if (value === 0) {
                return row.commentStatus === 'false';
            } else if (value === 1) {
                return row.commentStatus === 'true';
            }
          }
        },
        {
          title: '评论时间',
          key:'commentDate',
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
                    type: "ios-create",
                    size: 20
                  },
                  on: {
                    click: () => {
                      this.show = true;
                      this.formData.commentId = params.row.commentId;
                    }
                  }
              })
            ])
          }
        }
      ],
      checkCommentData: {
        commentId: '',
        userName: '',
        itemName: '',
        itemVals: '',
        content: '',
        commentImg: [],
        commentStatus: '',
        commentDate: ''
      },
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      formData: {
        commentId: '',
        commentContent: ''
      }
    }
  },
  methods: {
    changePageSize(size) {
      this.pageSize = size;
      this.handleListApproveHistory();
    },
    Submit() {
      if (this.formData.commentContent.length === 0) {
          this.$Message.error('回复内容不能为空!');
      } else {
        console.log(this.formData);
      }
    },
    // 获取历史记录信息
    handleListApproveHistory(){
      // 保存取到的所有数据
      this.ajaxHistoryData = this.commentsData
      this.dataCount = this.commentsData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.commentsData.length < this.pageSize){
        this.historyData = this.ajaxHistoryData;
      }else{
        this.historyData = this.ajaxHistoryData.slice(0,this.pageSize);
      }
    },
    changepage(index){
      var _start = ( index - 1 ) * this.pageSize;
      var _end = index * this.pageSize;
      this.historyData = this.ajaxHistoryData.slice(_start,_end);
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
