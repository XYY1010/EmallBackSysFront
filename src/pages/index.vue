<template>
<div >
  <Layout>
  <Affix>
  <Menu mode="horizontal" :theme="theme1" active-name="1" @on-select="selectTheme">
        <MenuItem name="0">
            <font size="4" font-weight="bold;">Emall 后台管理系统</font>
        </MenuItem>
        <MenuItem name="1">
            <Icon type="md-analytics" size="18"/>
            平台
        </MenuItem>
        <MenuItem name="2">
            <Icon type="md-home" size="18"/>
            商城前台
        </MenuItem>
        <Submenu name="4" style="float:right;">
            <template slot="title">
                <Icon type="md-shirt" size="18" />
                皮肤
            </template>
                <MenuGroup title="选择" >
                    <MenuItem name="4-1"><Icon type="ios-shirt-outline" size="12" />light</MenuItem>
                    <MenuItem name="4-2"><Icon type="md-shirt" size="12" color="#40475A"/>dark</MenuItem>
                    <MenuItem name="4-3"><Icon type="md-shirt" size="12" color="#2575EC"/>primary</MenuItem>
                </MenuGroup>
        </Submenu>
        <Submenu name="3" style="float:right;">
            <template slot="title">
                <Icon type="ios-person" size="18" />
                {{userName}}
            </template>
            <MenuGroup title="操作">
                <MenuItem name="3-1">切换用户</MenuItem>
                <MenuItem name="3-2">注销</MenuItem>
            </MenuGroup>
        </Submenu>
    </Menu>
  </Affix>
  </Layout>
    <Layout>
       <Sider class="side" hide-trigger>
      <Menu theme="light" width="auto" :open-names="['1']" accordion>
        <Submenu v-for="subMenu in menu" :name="subMenu.id" :key="subMenu.id">
                <template slot="title">
                  <Icon :type="subMenu.icon"/> {{subMenu.name}}
                </template>
                <MenuItem v-for="menuItem in subMenu.menuItems" :name="menuItem.id" :key="menuItem.id">
                  <router-link :to="menuItem.link" class="router-link-style">{{menuItem.name}}</router-link>
                </MenuItem>
          </Submenu>
      </Menu>
    </Sider>
      <Layout>
          <Content class="content">
            <router-view></router-view>
          </Content>
      </Layout>
    </Layout>
</div>
</template>

<script>
import db from '../db/meta';
const {menu} = db;
export default {
  name: "index",
  data() {
    return {
      menu,
      userName: 'user1',
      theme1: 'dark'
    }
  },
  methods: {
    selectTheme(name) {
      if (name == "4-1") {
        this.theme1 = "light";
      }
      if (name == "4-2") {
        this.theme1 = "dark";
      }
      if (name == "4-3") {
        this.theme1 = "primary";
      }
      if (name == "3-1") {
        this.$router.push("/");
      }
      if (name == "3-2") {
        this.$router.push("/");
      }
    }
  },
  mounted() {
    if (this.$store.getters.user != null) {
      this.userName = this.$store.getters.user.userName;
    }
  }
}
</script>

<style lang="css" scoped>
.router-link-style {
    color: #222;
    width: 100%;
    height: 100%;
  }
  .side {
    background-color: #FFFFFF;
  }
  .router-link-style:hover {
    color: #2575ec;
    text-decoration: none;
  }
  .content {
    background-color: #FFF;
  }
</style>
