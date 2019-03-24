<template>
  <div class="main">
    <div class="container">
        <h1>Emall后台系统登录</h1>
        <Input prefix="ios-contact" placeholder="请输入账号" size="large" v-model="form.user" style="width: 300px; margin: 15px 0px 0px 0px;" />
        <Input prefix="ios-lock" placeholder="请输入密码" size="large" v-model="form.password" type="password" style="width: 300px; margin: 10px 0px 0px 0px;" />
        <Button type="primary" @click="Submit" size="large" style="width: 200px; margin: 30px 0px 10px 0px;">登录</Button>
    </div>
    <div class="copyright">
      © 2018-Present EMall. All rights reserved
    </div>
    <video class="bg_video" autoplay loop muted>
      <source src="/static/photographer.mp4" type="video/mp4"/>
        浏览器不支持 video 标签，建议升级浏览器。
          <!-- <source src="PATH_TO_WEBM" type="video/webm"/>
          浏览器不支持 video 标签，建议升级浏览器。 -->
      </video>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      form: {
        user: '',
        password: ''
      }
    }
  },
  methods: {
    Submit() {
      if (this.form.user.length === 0) {
        this.$Message.error("请输入用户名！！");
      }
      if (this.form.password.length === 0) {
        this.$Message.error("请输入密码！！");
      }
      if(this.form.user.length != 0 && this.form.password.length != 0) {
        this.$store.commit('initUser', {user: {
              userName: this.form.user,
              password: this.form.password,
        }});
        this.$Message.success("登录成功");
        this.$router.push("/index-content/index-nav");
      }
    }
  },
  mounted: function() {
  }
}
</script>

<style lang="css" scoped>
body{}
.main{
  border:1px solid #aaa;position: relative;overflow: hidden;
  width:100%;
  height: 1000px;
  object-fit:fill;
}
.main:before{
  content:"";
  display: table;
}
.main:after{
  content:"";
  display: table;
  clear: both;
}

 .container{
   width:500px; margin: 300px auto;
   background: rgba(255,255,255,0.6);
   border: 1px solid #aaa;
   border-radius:6px;
   text-align: center;
 }

 .copyright {
   width: 600px; margin: 400px auto;
   font-size: 20px;
   text-align: center;
   color: #FFF;
 }

.bg_video{
  width: 100%;
  height: 1000px;
  position: absolute;
  left:0;
  top:0px;
  z-index:-1;
  object-fit:fill;
}

</style>
