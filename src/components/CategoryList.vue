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
      modalStatus: false,
      newAppendData: {},
      categoryData: [
        {
            "cat_id": "1",
            "cat_parent_id": "21",
            "cat_name": "手机",
            "cat_status": "1",
            "sort_order": "100",
            "create_time": "17/3/2019 18:56:42",
            "update_time": "17/3/2019 18:56:44"
        },
        {
            "cat_id": "2",
            "cat_parent_id": "23",
            "cat_name": "电话卡",
            "cat_status": "1",
            "sort_order": "99",
            "create_time": "17/3/2019 18:57:00",
            "update_time": "17/3/2019 18:57:02"
        },
        {
            "cat_id": "3",
            "cat_parent_id": "22",
            "cat_name": "电视",
            "cat_status": "1",
            "sort_order": "98",
            "create_time": "17/3/2019 18:57:23",
            "update_time": "17/3/2019 18:57:25"
        },
        {
            "cat_id": "4",
            "cat_parent_id": "22",
            "cat_name": "电视盒子",
            "cat_status": "1",
            "sort_order": "97",
            "create_time": "17/3/2019 18:57:42",
            "update_time": "17/3/2019 18:57:44"
        },
        {
            "cat_id": "5",
            "cat_parent_id": "21",
            "cat_name": "笔记本",
            "cat_status": "1",
            "sort_order": "96",
            "create_time": "17/3/2019 18:58:14",
            "update_time": "17/3/2019 18:58:16"
        },
        {
            "cat_id": "6",
            "cat_parent_id": "21",
            "cat_name": "平板",
            "cat_status": "1",
            "sort_order": "95",
            "create_time": "17/3/2019 18:58:33",
            "update_time": "17/3/2019 18:58:35"
        },
        {
            "cat_id": "7",
            "cat_parent_id": "22",
            "cat_name": "家电",
            "cat_status": "1",
            "sort_order": "94",
            "create_time": "17/3/2019 18:59:03",
            "update_time": "17/3/2019 18:59:05"
        },
        {
            "cat_id": "8",
            "cat_parent_id": "22",
            "cat_name": "插线板",
            "cat_status": "1",
            "sort_order": "93",
            "create_time": "17/3/2019 18:59:58",
            "update_time": "17/3/2019 19:00:01"
        },
        {
            "cat_id": "9",
            "cat_parent_id": "23",
            "cat_name": "出行",
            "cat_status": "1",
            "sort_order": "92",
            "create_time": "17/3/2019 19:00:17",
            "update_time": "17/3/2019 19:00:19"
        },
        {
            "cat_id": "10",
            "cat_parent_id": "23",
            "cat_name": "穿戴",
            "cat_status": "1",
            "sort_order": "91",
            "create_time": "17/3/2019 19:00:39",
            "update_time": "17/3/2019 19:00:41"
        },
        {
            "cat_id": "11",
            "cat_parent_id": "22",
            "cat_name": "智能",
            "cat_status": "1",
            "sort_order": "90",
            "create_time": "17/3/2019 19:00:57",
            "update_time": "17/3/2019 19:00:59"
        },
        {
            "cat_id": "12",
            "cat_parent_id": "22",
            "cat_name": "路由器",
            "cat_status": "1",
            "sort_order": "89",
            "create_time": "17/3/2019 19:01:16",
            "update_time": "17/3/2019 19:01:18"
        },
        {
            "cat_id": "13",
            "cat_parent_id": "23",
            "cat_name": "电源",
            "cat_status": "1",
            "sort_order": "87",
            "create_time": "17/3/2019 19:01:55",
            "update_time": "17/3/2019 19:01:57"
        },
        {
            "cat_id": "14",
            "cat_parent_id": "23",
            "cat_name": "配件",
            "cat_status": "1",
            "sort_order": "86",
            "create_time": "17/3/2019 19:02:10",
            "update_time": "17/3/2019 19:02:12"
        },
        {
            "cat_id": "15",
            "cat_parent_id": "22",
            "cat_name": "健康",
            "cat_status": "1",
            "sort_order": "85",
            "create_time": "17/3/2019 19:02:26",
            "update_time": "17/3/2019 19:02:28"
        },
        {
            "cat_id": "16",
            "cat_parent_id": "23",
            "cat_name": "儿童",
            "cat_status": "1",
            "sort_order": "84",
            "create_time": "17/3/2019 19:02:45",
            "update_time": "17/3/2019 19:02:47"
        },
        {
            "cat_id": "17",
            "cat_parent_id": "23",
            "cat_name": "耳机",
            "cat_status": "1",
            "sort_order": "83",
            "create_time": "17/3/2019 19:03:02",
            "update_time": "17/3/2019 19:03:04"
        },
        {
            "cat_id": "18",
            "cat_parent_id": "22",
            "cat_name": "音箱",
            "cat_status": "1",
            "sort_order": "82",
            "create_time": "17/3/2019 19:03:34",
            "update_time": "17/3/2019 19:03:36"
        },
        {
            "cat_id": "19",
            "cat_parent_id": "23",
            "cat_name": "生活",
            "cat_status": "1",
            "sort_order": "81",
            "create_time": "17/3/2019 19:03:48",
            "update_time": "17/3/2019 19:03:50"
        },
        {
            "cat_id": "20",
            "cat_parent_id": "23",
            "cat_name": "箱包",
            "cat_status": "1",
            "sort_order": "80",
            "create_time": "17/3/2019 19:44:02",
            "update_time": "17/3/2019 19:44:04"
        },
        {
            "cat_id": "21",
            "cat_parent_id": "0",
            "cat_name": "移动设备",
            "cat_status": "1",
            "sort_order": "79",
            "create_time": "17/3/2019 19:51:16",
            "update_time": "17/3/2019 19:51:17"
        },
        {
            "cat_id": "22",
            "cat_parent_id": "0",
            "cat_name": "家用设备",
            "cat_status": "1",
            "sort_order": "78",
            "create_time": "17/3/2019 19:51:38",
            "update_time": "17/3/2019 19:51:40"
        },
        {
            "cat_id": "23",
            "cat_parent_id": "0",
            "cat_name": "其它",
            "cat_status": "1",
            "sort_order": "77",
            "create_time": "17/3/2019 19:51:54",
            "update_time": "17/3/2019 19:51:56"
        }
      ],
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
      this.newAppendData = data;
      this.modalStatus = true;
    },
    remove (root, node, data) {
      if (node.parent == undefined) {
        this.$Message.error("根结点不能移除");
        return;
      }
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
      const children = data.children || [];
      children.push({
        title: this.newName,
        expand: true
      });
      this.$set(data, 'children', children);
      this.newName = '';
    },
    cancel() {

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
    for (var i = 0; i < this.categoryData.length; i++) {
      if (this.categoryData[i].cat_parent_id == 0) {
        this.data.push({
          id: this.categoryData[i].cat_id,
          title: this.categoryData[i].cat_name,
          parent_id: this.categoryData[i].cat_parent_id,
          expand: true,
          children:[]
        });
      }
    }
    for (var i = 0; i < this.categoryData.length; i++) {
      for (var j = 0; j < this.data.length; j++) {
        if (this.categoryData[i].cat_parent_id == this.data[j].id) {
          this.data[j].children.push({
            id: this.categoryData[i].cat_id,
            title: this.categoryData[i].cat_name,
            parent_id: this.categoryData[i].cat_parent_id,
            expand: true,
            children:[]
          });
          break;
        }
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
