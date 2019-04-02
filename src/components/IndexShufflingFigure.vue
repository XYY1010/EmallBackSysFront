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
                          <Col span="12">
                              <FormItem label="选择分类">
                                <Select v-model="categoryIdSelected" placeholder="请选择分类">
                                  <Option v-for="(item,index) in categoryList" :key="index" :value="item.categoryId">{{item.categoryName}}</Option>
                                </Select>
                              </FormItem>
                          </Col>
                          <Col span="12">
                              <FormItem label="选择跳转商品">
                                <Select v-model="itemIdSelected" placeholder="请选择商品">
                                  <Option v-for="(item,index) in itemList" :key="index" :value="item.itemId">{{item.title}}</Option>
                                </Select>
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
                                <Upload multiple 
                                ref="upload"
                                name="upfile"
                                :headers="headers"
                                :on-error="uploadError"
                                :on-success="addUploadSuccess"
                                :format="['jpg','jpeg','png']" 
                                :max-size="2048" 
                                :before-upload="handleBeforeUpload" 
                                :on-format-error="handleFormatError" 
                                :on-exceeded-size="handleMaxSize" 
                                type="drag" 
                                action="http://139.199.125.60:8090/file/uploading">
                                    <div style="padding: 20px 0">
                                        <Icon type="md-add" size="20"></Icon>
                                    </div>
                                </Upload>
                              </FormItem>
                          </Col>
                      </Row>
                    </Form>
                </Modal>
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
      headers:{
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Access-Control-Allow-Origin': '*'
      },
      categoryIdSelected:'',
      categoryList:[],
      itemIdSelected:'',
      itemList:[],
      columns: [
        {
          type: 'selection',
          title: '全选',
          width: 58,
          align: 'center'
        },
        {
          title: 'ID',
          key: 'shufflingId',
          width: 170,
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
      ],
      show: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      newFigureData: {
        itemId:'',
        sourceUrl: '',
        imgUrl: '',
        sorted: 0,
      },
      Selected: []
    }
  },
  methods: {
    getCategoryList(){
      this.$axios({
        method:'get',
        url:'/Category/getAllCategoryVO'
      }).then(res=>{
        this.categoryList = res.data.data;
      }).catch(error=>{
        this.$Message.error("服务器错误！");
      });
    },
    deleteShuffleFigure(idGroup){
      this.$axios({
        method:'get',
        url:'/shufflingFigureData/deleteShufflingFigureData',
        params:{
          idGroup:idGroup
        }
      }).then(res=>{
        if(this.rmIndex!=-1){
          this.remove((this.curPage-1)*this.pageSize+this.rmIndex);
          this.rmIndex = -1;
        }else{
          this.afterBatchDelete();
        }
      }).catch(error=>{
        this.$Message.error("服务器错误,删除失败");
      });
    },
    addNewShuffleFigure(){
      if(this.newFigureData.itemId==undefined){
        this.$Message.error("请选择跳转商品！");
        return;
      }
      if(this.newFigureData.imgUrl==''){
        this.$Message.error("请选择录播图！");
        return;
      }
      if(this.newFigureData.sourceUrl=='') this.newFigureData.sourceUrl = '#';
      this.$axios({
        method:'post',
        url:'/shufflingFigureData/addShufflingFigureData',
        params:{
          itemId:this.newFigureData.itemId,
          sourceUrl:this.newFigureData.sourceUrl,
          imgUrl:this.newFigureData.imgUrl,
          sorted:this.newFigureData.sorted
        }
      }).then(res=>{
        this.getAllShuffleFigure();
      }).catch(error=>{
        this.$Message.error("服务器错误,添加轮播图失败!");
      });
    },
    getItemList(catId){
      this.$axios({
        method:'get',
        url:'/item/getByCatId',
        params:{
          catId:catId
        }
      }).then(res=>{
        this.itemList = res.data.data;
      }).catch(error=>{
        this.$Message.error("服务器错误!");
      });
    },
    getAllShuffleFigure(){
      this.$axios({
        method:'get',
        url:'/shufflingFigureData/getAllShuffleFigure'
      }).then(res=>{
        this.shufflingFigureData = res.data.data;
        for(var i = 0; i < this.shufflingFigureData.length; i++){
          this.shufflingFigureData[i].createdDate = this.dateUtil(this.shufflingFigureData[i].createdDate);
          this.shufflingFigureData[i].updatedDate = this.dateUtil(this.shufflingFigureData[i].updatedDate);
        }
        this.handleListApproveHistory();
      }).catch(error=>{
        this.$Message.error("服务器错误,轮播图获得失败!");
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
      this.$Message.success('移除成功！');
      this.rmIndex = -1;
    },
    select(selection) {
      this.Selected = selection;
    },
    ok() {
      if(this.rmIndex != -1) {
          this.deleteShuffleFigure(this.historyData[this.rmIndex].shufflingId);
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
    afterBatchDelete(){
      this.Selected = this.$refs.selection.getSelection().splice(0);
      for (var i = 0; i < this.Selected.length; i++) {
        for (var j = 0; j < this.shufflingFigureData.length; j++) {
          if (this.Selected[i].shufflingId === this.shufflingFigureData[j].shufflingId) {
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
    },
    ok1() {
      var idGroup = this.Selected[0].shufflingId;
      for(var i = 1; i < this.Selected.length; i++){
        idGroup += ","+ this.Selected[i].shufflingId;
      }
      this.deleteShuffleFigure(idGroup);
    },
    cancel1() {
      this.$Message.success('取消移除！');
    },
    ok2() {
      this.addNewShuffleFigure();
      this.$Message.success('添加成功！');
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
    },
    addUploadSuccess(res,file,fileList){
      this.$Message.success("上传成功");
      this.newFigureData.imgUrl = res.data;
    },
    uploadError(a,b,c){
      this.$Message.error(a.data);
    }
  },
  created(){
    this.getAllShuffleFigure();
    this.getCategoryList();
  },
  watch:{
    categoryIdSelected(val,newVal){
      this.getItemList(this.categoryIdSelected);
    },
    itemIdSelected(val,newVal){
      this.newFigureData.itemId = this.itemIdSelected;
    }
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
