<template>
  <div>
    <Alert show-icon class="tips-box" type="warning">
        小提示
        <Icon type="md-bulb" slot="icon"></Icon>
        <template slot="desc">用户管理。</template>
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
        <Button type="error" icon="md-trash" size="large" @click="batchDelete">批量删除</Button> &ensp;
        <Button type="success" icon="md-add" size="large" @click="addUser">添加用户</Button> &emsp;
        显示 <InputNumber v-model="pageSize" size="large" @on-change="changePageSize" :min="1" :max="10"></InputNumber> 条
        <span style="float: right; margin: 0 20px 0 0; font-size: 18px;">
          共有 {{usersData.length}} 条记录
        </span>
      </div>
    </div>
    <Table border ref="selection" :current="curPage" :columns="columns" :data="historyData" @on-selection-change="select" no-data-text="用户列表空空如也，请添加~~~"></Table>
    <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>

    <Modal
      v-model="modalStatus"
      title="提示"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>确定将该用户删除吗？</p>
    </Modal>

    <Modal
      v-model="modalStatus1"
      title="提示"
      @on-ok="ok1"
      @on-cancel="cancel1">
      <p>确定批量删除这些用户吗？</p>
    </Modal>

    <Modal
      v-model="modalStatus2"
      title="添加新用户"
      @on-ok="ok2('newUserData')"
      @on-cancel="cancel2">
      <Form ref="newUserData" :model="newUserData" :rules="ruleUserData">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="用户名" prop="userName" label-position="top">
              <Input v-model="newUserData.userName" placeholder="请输入用户名" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="性别" label-position="top">
              <Select v-model="newUserData.gender" placeholder="请选择性别">
                <Option value="男"><Icon type="ios-man" color="#2575EC" size="18" style="margin: 0 10px 0 5px;"/>男</Option>
                <Option value="女"><Icon type="ios-woman" color="#F55EB1" size="18" style="margin: 0 10px 0 5px;"/>女</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="设置密码" prop="password" label-position="top">
              <Input v-model="newUserData.password" type="password" placeholder="请输入密码" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="确认密码" prop="password2" label-position="top">
              <Input v-model="newUserData.password2" type="password" placeholder="请再次输入密码" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="手机号" prop="phone" label-position="top">
              <Input v-model="newUserData.phone" placeholder="请输入手机号" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="邮箱号" prop="email" label-position="top">
              <Input v-model="newUserData.email" placeholder="请输入邮箱号" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="居住地" label-position="top">
              <Cascader :data="address" v-model="newUserData.address"></Cascader>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="家乡" label-position="top">
              <Cascader :data="address" v-model="newUserData.hometown"></Cascader>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="生日" label-position="top">
              <DatePicker type="date" placeholder="选择生日" v-model="newUserData.birthday"></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="上传头像" label-position="top">
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
      :styles="styles">
      <Form ref="formData" :model="formData" :rules="ruleUserData">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="用户名" prop="userName" label-position="top">
              <Input v-model="formData.userName" placeholder="请输入用户名" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="性别" label-position="top">
              <Select v-model="formData.gender" placeholder="请选择性别">
                <Option value="男"><Icon type="ios-man" color="#2575EC" size="18" style="margin: 0 10px 0 5px;"/>男</Option>
                <Option value="女"><Icon type="ios-woman" color="#F55EB1" size="18" style="margin: 0 10px 0 5px;"/>女</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="设置密码" prop="password" label-position="top">
              <Input v-model="formData.password" type="password" placeholder="请输入密码" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="确认密码" prop="password2" label-position="top">
              <Input v-model="formData.password2" type="password" placeholder="请再次输入密码" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="手机号" prop="phone" label-position="top">
              <Input v-model="formData.phone" placeholder="请输入手机号" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="邮箱号" prop="email" label-position="top">
              <Input v-model="formData.email" placeholder="请输入邮箱号" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="居住地" label-position="top">
              <Cascader :data="address" v-model="formData.address"></Cascader>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="家乡" label-position="top">
              <Cascader :data="address" v-model="formData.hometown"></Cascader>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="生日" label-position="top">
              <DatePicker type="date" placeholder="选择生日" v-model="formData.birthday"></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="上传头像" label-position="top">
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
        <Button type="primary" @click="Submit('formData')">提交修改</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
// import addressData from '../db/generateAddressData';
// const {address} = require('../db/generateAddressData');
export default {
  name: 'userlist',
  data() {
    return {
      address: [],
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
      rmIndex: -1,
      show: false,
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
          key: 'userId',
          width: 100,
          align: 'center',
          sortable: true
        },
        {
          title: '用户名',
          key: 'userName',
          width: 86,
          render: (h, params) => {
            return h('div', [
              h('a', {
                attrs: {
                },
                on: {
                  click: () => {

                  }
                }
              }, params.row.userName)
            ]);
          },
          align: 'center'
        },
        {
          title: '手机号',
          key: 'phone',
          align: 'center'
        },
        {
          title: '地址',
          key:'address',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                attrs: {

                }
              }, params.row.address[0] + ' ' + params.row.address[1] + ' ' + params.row.address[2])
            ]);
          }
        },
        {
          title: '邮箱',
          key:'email',
          align: 'center'
        },
        {
          title: '性别',
          key:'gender',
          align: 'center',
          render: (h, params) => {
            if (params.row.gender === '男') {
              return h('div', [
                h('Icon', {
                  attrs: {
                    type: "ios-man",
                    color: "#2575EC",
                    size: "25"
                  }
                })
              ]);
            } else if (params.row.gender === '女') {
              return h('div', [
                h('Icon', {
                  attrs: {
                    type: "ios-woman",
                    color: "#F55EB1",
                    size: "25"
                  }
                })
              ]);
            }
          },
        },
        {
          title: '头像',
          key:'avatarUrl',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.avatarUrl,
                  style: "width: 50px; height: 50px;"
                }
              })
            ]);
          },
        },
        {
          title: '生日',
          key:'birthday',
          align: 'center'
        },
        {
          title: '家乡',
          key:'hometown',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                attrs: {

                }
              }, params.row.hometown[0] + ' ' + params.row.hometown[1] + ' ' + params.row.hometown[2])
            ]);
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
                      this.formData.userName = params.row.userName;
                      this.formData.phone = params.row.phone;
                      this.formData.address = params.row.address;
                      this.formData.email = params.row.email;
                      this.formData.gender = params.row.gender;
                      this.formData.avatarUrl = params.row.avatarUrl;
                      this.formData.birthday = params.row.birthday;
                      this.formData.hometown = params.row.hometown;
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
      usersData: [
        {userId: '42346568078196736', userName: '李大大', phone: '17845897418', gender: '男', address: ['浙江省', '宁波市', '鄞州区'], email: 'zsvip@163.com', avatarUrl: 'https://raw.githubusercontent.com/XYY1010/WebImgSrc/master/test/3.jpg', birthday: '1970-10-10', hometown: ['浙江省', '宁波市', '鄞州区']},
        {userId: '42346568078196224', userName: 'dsds', phone: '17845895566', gender: '女', address: ['浙江省', '宁波市', '北仑区'], email: '5dvip@163.com', avatarUrl: 'https://raw.githubusercontent.com/XYY1010/WebImgSrc/master/test/5.jpg', birthday: '1970-10-10', hometown: ['浙江省', '宁波市', '鄞州区']}
      ],
      newUserData: {
        userName: '',
        password: '',
        password2: '',
        email: '',
        phone: '',
        gender: '',
        address: [],
        avatarUrl: '',
        birthday: '',
        hometown: []
      },
      formData: {
        userName: '',
        password: '',
        password2: '',
        email: '',
        phone: '',
        gender: '',
        address: [],
        avatarUrl: '',
        birthday: '',
        hometown: []
      },
      Selected: [],
      ruleUserData: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: this.checkConfirmPassword }
        ],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          { validator: this.checkEmail }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: this.checkPhone }
        ]
      },
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      }
    }
  },
  methods: {
    addUser() {
      this.modalStatus2 = true;
      setTimeout(() => {
        var addressData = require('../db/generateAddressData');
        this.address = addressData.default.address;
      }, 5);
    },
    changePageSize(size) {
      this.pageSize = size;
      this.handleListApproveHistory();
    },
    checkConfirmPassword(rule, value, callback) {
      if (typeof (value) == undefined) {
        callback('请再次输入密码');
      } else {
        if (value === this.newUserData.password) {
          callback();
        } else {
          callback('密码不一致');
        }
      }
    },
    checkEmail(rule, value, callback) {
        if (value.length == 0) {
          callback();
        }
        if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value)) {
          callback("邮箱号错误");
        } else {
          callback();
        }
    },
    checkPhone(rule, value, callback) {
        if (value.length == 0) {
          callback();
        }
        if (!/^1[34578]\d{9}$/.test(value)) {
          callback("手机号码错误");
        } else {
          callback();
        }
    },
    Submit(e) {
      this.$refs[e].validate((valid) => {
        if (valid) {
        this.show = false;
        console.log(this.formData);
        this.handleListApproveHistory();
        this.$Message.success('添加成功！');
          // 后台数据更新
        } else {
          this.$Message.error('添加失败!');
        }
      });
    },
    // 获取历史记录信息
    handleListApproveHistory(){
      // 保存取到的所有数据
      this.ajaxHistoryData = this.usersData
      this.dataCount = this.usersData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.usersData.length < this.pageSize){
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
      this.usersData.splice(index, 1);// 保存取到的所有数据
      this.ajaxHistoryData = this.usersData;
      this.dataCount = this.usersData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.usersData.length < this.curPage * this.pageSize){
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.usersData.length);
        if (this.usersData.length === (this.curPage-1)*this.pageSize) {
          this.curPage--;
          this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.usersData.length);
        }
      }
      else if (this.usersData.length > this.curPage * this.pageSize) {
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
        for (var j = 0; j < this.usersData.length; j++) {
          if (this.Selected[i].userId === this.usersData[j].userId) {
            this.usersData.splice(j, 1);
            break;
          }
        }
      }
      this.ajaxHistoryData = this.usersData;
      this.dataCount = this.usersData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.usersData.length < this.curPage * this.pageSize){
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.usersData.length);
        if (this.usersData.length === (this.curPage-1)*this.pageSize) {
          this.curPage--;
          this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.usersData.length);
        }
      }
      else if (this.usersData.length > this.curPage * this.pageSize) {
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.curPage * this.pageSize);
      }
      this.$Message.success('批量移除成功！');
        // 后台数据更新
      },
    cancel1() {
      this.$Message.success('取消移除！');
    },
    ok2(e) {
      this.$refs[e].validate((valid) => {
        if (valid) {
        console.log(this.newUserData);
        this.usersData.push(this.newUserData);
        this.handleListApproveHistory();
        this.$Message.success('添加成功！');
          // 后台数据更新
        } else {
          this.$Message.error('添加失败!');
        }
      });
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
.paging{
  margin:10px 0px;
  text-align: right;
}
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
</style>
