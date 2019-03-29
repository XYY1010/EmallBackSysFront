<template>
  <div>
    <Alert show-icon class="tips-box" type="warning">
        小提示
        <Icon type="md-bulb" slot="icon"></Icon>
        <template slot="desc">管理员列表。</template>
    </Alert>
    <div class="operationDiv">
      <span>
        <Button type="error" icon="md-trash" size="large" @click="batchDelete">批量删除</Button> &ensp;
        <Button type="success" icon="md-add" size="large" @click="modalStatus2 = true">添加管理员</Button> &emsp;
        显示 <InputNumber v-model="pageSize" size="large" @on-change="changePageSize" :min="1" :max="10"></InputNumber> 条
        <span style="float: right; margin: 0 20px 0 0; font-size: 18px;">
          共有 {{adminsData.length}} 条记录
        </span>
      </span>
    </div>
    <Table border ref="selection" :current="curPage" :columns="columns" :data="historyData" @on-selection-change="select" no-data-text="管理员列表空空如也，请添加~~~"></Table>
    <Page :total="dataCount" :page-size="pageSize" show-total class="paging" @on-change="changepage"></Page>

    <Modal
      v-model="modalStatus"
      title="提示"
      @on-ok="ok"
      @on-cancel="cancel">
      <p>确定将该管理员删除吗？</p>
    </Modal>

    <Modal
      v-model="modalStatus1"
      title="提示"
      @on-ok="ok1"
      @on-cancel="cancel1">
      <p>确定批量删除这些管理员吗？</p>
    </Modal>

    <Modal
      v-model="modalStatus2"
      title="添加新管理员"
      @on-ok="ok2('newAdminData')"
      @on-cancel="cancel2">
      <Form ref="newAdminData" :model="newAdminData" :rules="ruleAdminData">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="登录名" prop="adminName" label-position="top">
              <Input v-model="newAdminData.adminName" placeholder="请输入用户名" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="性别" label-position="top">
              <Select v-model="newAdminData.gender" placeholder="请选择性别">
                <Option value="男"><Icon type="ios-man" color="#2575EC" size="18" style="margin: 0 10px 0 5px;"/>男</Option>
                <Option value="女"><Icon type="ios-woman" color="#F55EB1" size="18" style="margin: 0 10px 0 5px;"/>女</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="设置密码" prop="password" label-position="top">
              <Input v-model="newAdminData.password" type="password" placeholder="请输入密码" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="确认密码" prop="password2" label-position="top">
              <Input v-model="newAdminData.password2" type="password" placeholder="请再次输入密码" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="手机号" prop="phone" label-position="top">
              <Input v-model="newAdminData.phone" placeholder="请输入手机号" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="邮箱号" prop="email" label-position="top">
              <Input v-model="newAdminData.email" placeholder="请输入邮箱号" />
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
      <Form ref="formData" :model="formData" :rules="ruleAdminData1">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="登录名" prop="userName" label-position="top">
              <Input v-model="formData.adminName" placeholder="请输入用户名" />
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
            <FormItem label="启用状态" label-position="top">
              <Select v-model="formData.used" placeholder="请选择启用状态">
                  <Option value=true>启用</Option>
                  <Option value=false>禁用</Option>
              </Select>
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
import addressData from '../db/generateAddressData';
const {address} = addressData;
export default {
  name: 'adminlist',
  data() {
    return {
      address,
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
          key: 'adminId',
          width: 100,
          align: 'center',
          sortable: true
        },
        {
          title: '登录名',
          key: 'adminName',
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
              }, params.row.adminName)
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
          title: '邮箱',
          key:'email',
          align: 'center'
        },
        {
          title: '性别',
          key:'gender',
          align: 'center',
          render: (h, params) => {
            if (params.row.gender === "男") {
              return h('div', [
                h('Icon', {
                  attrs: {
                    type: "ios-man",
                    color: "#2575EC",
                    size: "25"
                  }
                })
              ]);
            } else if (params.row.gender === "女") {
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
          title: '创建时间',
          key:'createdDate',
          align: 'center'
        },
        {
          title: '更新时间',
          key:'updatedDate',
          align: 'center'
        },
        {
          title: '是否已启用',
          key:'used',
          align: 'center',
          render: (h, params) => {
            if (params.row.used == true) {
              return h('div', [
                h('span', {
                    attrs: {
                      style: 'background-color: #83c44e; color: #fff; padding: 5px 5px 5px 5px;'
                    }
                }, "已启用")
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
              label: '已启用',
              value: 0
            },
            {
              label: '禁用',
              value: 1
            }
          ],
          filterMultiple: true,
          filterMethod (value, row) {
            if (value === 0) {
                return row.used === true;
            } else if (value === 1) {
                return row.used === false;
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
                      this.formData.adminName = params.row.adminName;
                      this.formData.phone = params.row.phone;
                      this.formData.address = params.row.address;
                      this.formData.email = params.row.email;
                      this.formData.gender = params.row.gender;
                      this.formData.used = params.row.used;
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
      adminsData: [],
      newAdminData: {
        adminId:'',
        adminName: '',
        password: '',
        password2: '',
        email: '',
        phone: '',
        gender: '',
        used: "true",
        createdDate: '',
        updatedDate: ''
      },
      formData: {
        adminId:'',
        adminName: '',
        password: '',
        password2: '',
        email: '',
        phone: '',
        gender: '',
        used: "true",
        createdDate: '',
        updatedDate: ''
      },
      Selected: [],
      ruleAdminData: {
        adminName: [
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
      ruleAdminData1: {
        adminName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: this.checkConfirmPassword1 }
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
    getAllAdmin(){
      this.$axios({
        method:'get',
        url:'/admin/getAll'
      }).then(res=>{
        this.adminsData = res.data.data;
        console.log(this.adminsData);
        for(var i = 0; i < this.adminsData.length; i++){
          this.adminsData[i].createdDate = this.dateUtil(this.adminsData[i].createdDate);
          this.adminsData[i].updatedDate = this.dateUtil(this.adminsData[i].updatedDate);
        }
        this.handleListApproveHistory();
      }).catch(error=>{
        this.$Message.error("服务器错误,获得列表失败");
      });
    },
    addAdmin(){
      var params = new URLSearchParams();
      params.append('adminName', this.newAdminData.adminName);
      params.append('password', this.newAdminData.password);
      params.append('email', this.newAdminData.email);
      params.append('phone', this.newAdminData.phone);
      params.append('gender', this.newAdminData.gender);
      this.$axios({
        method:'post',
        url:'/admin/addAdmin',
        data:params
      }).then(res=>{
        var data = res.data.data;
        this.newAdminData.adminId = data.adminId;
        this.newAdminData.createdDate = data.createdDate;
        this.newAdminData.updatedDate = data.updatedDate;
        this.newAdminData.used = true;
        this.adminsData.push(this.newAdminData);
        this.handleListApproveHistory();
        this.$Message.success('添加成功！');
          // 后台数据更新
      }).catch(error=>{
        this.$Message.error(error);
      });
    },
    deleteAdmin(idGroup){
      this.$axios({
        method:'get',
        url:'/admin/deleteAdmin',
        params:{
          idGroup:idGroup
        }
      }).then(res=>{
        this.Selected =this.$refs.selection.getSelection().splice(0);
        for (var i = 0; i < this.Selected.length; i++) {
          for (var j = 0; j < this.adminsData.length; j++) {
            if (this.Selected[i].adminId === this.adminsData[j].adminId) {
              this.adminsData.splice(j, 1);
              break;
            }
          }
        }
        this.ajaxHistoryData = this.adminsData;
        this.dataCount = this.adminsData.length;
        // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
        if(this.adminsData.length < this.curPage * this.pageSize){
          this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.adminsData.length);
          if (this.adminsData.length === (this.curPage-1)*this.pageSize) {
            this.curPage--;
            this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.adminsData.length);
          }
        }
        else if (this.adminsData.length > this.curPage * this.pageSize) {
          this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.curPage * this.pageSize);
        }
        this.$Message.success('批量移除成功！'); 
      }).catch(error=>{
        this.$Message.error(error);
      });
    },
    dateUtil(originDate){
      var date = new Date(+new Date(originDate)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
      return date.split(" ")[0];
    },
    changePageSize(size) {
      this.pageSize = size;
      this.handleListApproveHistory();
    },
    checkConfirmPassword(rule, value, callback) {
      if (typeof (value) == undefined) {
        callback('请再次输入密码');
      } else {
        if (value === this.newAdminData.password) {
          callback();
        } else {
          callback('密码不一致');
        }
      }
    },
    checkConfirmPassword1(rule, value, callback) {
      if (typeof (value) == undefined) {
        callback('请再次输入密码');
      } else {
        if (value === this.formData.password) {
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
      this.ajaxHistoryData = this.adminsData
      this.dataCount = this.adminsData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.adminsData.length < this.pageSize){
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
      this.adminsData.splice(index, 1);
      // 保存取到的所有数据
      this.ajaxHistoryData = this.adminsData;
      this.dataCount = this.adminsData.length;
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if(this.adminsData.length < this.curPage * this.pageSize){
        this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.adminsData.length);
        if (this.adminsData.length === (this.curPage-1)*this.pageSize) {
          this.curPage--;
          this.historyData = this.ajaxHistoryData.slice((this.curPage-1)*this.pageSize, this.adminsData.length);
        }
      }
      else if (this.adminsData.length > this.curPage * this.pageSize) {
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
      var indexSelected = this.Selected[0].adminId;
      for(var i = 1; i < this.Selected.length; i++){
        indexSelected += ","+this.Selected[i].adminId;
      }
      this.deleteAdmin(indexSelected);
    },
    cancel1() {
      this.$Message.success('取消移除！');
    },
    ok2(e) {
      this.$refs[e].validate((valid) => {
        if (valid) {
          this.addAdmin();
        } else {
          this.$Message.error('添加失败!');
        }
      });
    },
    cancel2() {
      this.$Message.success('取消添加！');
    }
  },
  created() {
    this.getAllAdmin();
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
  margin: 5px 10px 20px 10px;
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
</style>
