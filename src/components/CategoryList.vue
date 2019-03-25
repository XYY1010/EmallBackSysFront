<template>
  <div style="width:100%; height:100%;">
    <div style="margin: 0 auto;">
      <Tree :data="treeData" :render="renderContent" style="width:600px;"></Tree>
    </div>
    <Modal
      v-model="modalStatus"
      title="新分类"
      @on-ok="ok(newAppendData)"
      @on-cancel="cancel">
      <Form>
          <Row :gutter="32">
              <Col span="32">
                  <FormItem label="新的分类名" label-position="top">
                      <Input v-model="newName" placeholder="请输入新的分类名" />
                  </FormItem>
              </Col>
          </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "categorylist",
  data() {
    return {
      treeData: [],
      data: [],
      newName: '',
      parentId:'',
      modalStatus: false,
      newAppendData: {},
      categoryData: [],
      buttonProps: {
        type: 'default',
        size: 'small',
      }
    }
  },
  methods: {
    renderContent (h, { root, node, data }) {
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%'
        }
      }, [
        h('span', [
          h('Icon', {
            props: {
              type: 'ios-paper-outline'
            },
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.title)
        ]),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '32px'
          }
        }, [
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-add'
            }),
            style: {
              marginRight: '8px'
            },
            on: {
              click: () => { this.append(data) }
            }
          }),
          h('Button', {
            props: Object.assign({}, this.buttonProps, {
              icon: 'ios-remove'
            }),
            on: {
              click: () => { this.remove(root, node, data) }
            }
          })
        ])
      ]);
    },
    append (data) {
      if(data.parent_id!=0&&data.id!=undefined){
        this.$Notice.open({
          title:"失败",
          desc:"该分类是最终分类，不能继续添加"
        });
        return ;
      }
      this.parentId = data.id;
      this.newAppendData = data;
      this.modalStatus = true;
    },
    remove (root, node, data) {
      if (node.parent == undefined) {
        this.$Message.error("根结点不能移除");
        return;
      }
      this.$axios({
        method:'post',
        url:'/Category/deleteCategory',
        params:{
          catId:node.node.id
        }
      }).then(res=>{
        this.$Notice.open({
          title:"成功",
          desc:res.data.data
        });
        
      }).catch(error=>{
        this.$Notice.open({
          title:"失败",
          desc:"删除失败"
        });
       
        return;
      });
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    },
    ok(data) {
      if(this.newName.length === 0) {
        this.$Message.error("请输入分类名！！");
        return;
      }
      if(this.parentId==undefined) this.parentId=0;
      this.$axios({
        method:'post',
        url:'/Category/addCategory',
        params:{
          catParentId:this.parentId,
          catName:this.newName
        }
      }).then(res=>{
          this.$Notice.open({
            title:"成功",
            desc:res.data.data
          });
          this.parentId='';
      }).catch(error=>{
          this.$Notice.open({
            title:"失败",
            desc:res.data.data
          });
          this.parentId='';
          return ;
      });
      const children = data.children || [];
      children.push({
        title: this.newName,
        expand: true
      });
      this.$set(data, 'children', children);
      this.newName = '';
    },
    cancel() {
      this.parentId='';
    },
		getAllCategory(){
			this.$axios({
				method:'get',
				url:'/Category/getAllCategory'
			}).then(res=>{
				this.categoryData = res.data.data;
			}).catch(error=>{
				this.$Notice.open({
					title:"错误",
					desc:"显示分类列表失败"
				});
			});
		}
  },
	watch:{
		categoryData(val,newval){
			for (var i = 0; i < this.categoryData.length; i++) {
          if (this.categoryData[i].catParentId == 0) {
            this.data.push({
              id: this.categoryData[i].catId,
              title: this.categoryData[i].catName,
              parent_id: this.categoryData[i].catParentId,
              expand: true,
              children:[]
            });
          }
        }
        for (var i = 0; i < this.categoryData.length; i++) {
          for (var j = 0; j < this.data.length; j++) {
            if (this.categoryData[i].catParentId == this.data[j].id) {
              this.data[j].children.push({
                id: this.categoryData[i].catId,
                title: this.categoryData[i].catName,
                parent_id: this.categoryData[i].catParentId,
                expand: true,
                children:[]
              });
              break;
            }
          }
        }
		}
	},
  mounted() {
    this.treeData.push({
        title: '分类列表',
        expand: true,
        children: this.data,
          render: (h, { root, node, data }) => {
            return h('span', {
              style: {
                display: 'inline-block',
                width: '100%'
              }
            }, [
              h('span', [
                h('Icon', {
                  props: {
                    type: 'ios-folder'
                  },
                  style: {
                    marginRight: '8px'
                  }
                }),
                h('span', data.title)
              ]),
              h('span', {
                style: {
                  display: 'inline-block',
                  float: 'right',
                  marginRight: '32px'
                }
              }, [
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-add',
                    type: 'primary'
                  }),
                  style: {
                    width: '64px'
                  },
                  on: {
                    click: () => { this.append(data) }
                  }
                })
              ])
            ]);
          }
    });
		this.getAllCategory();
  }
}
</script>

<style lang="css" scoped>
</style>
