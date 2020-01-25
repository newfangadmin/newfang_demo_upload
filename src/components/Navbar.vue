<template>
  <div class="navbar">
    <el-row :gutter="20">
      <el-col :span="2" class="logoContainer">
        <img class="logo" src="~@/assets/horizontal_white.png" />
      </el-col>
      <el-col :span="16" :offset="4" v-if="loggedin" class="ethAddrContainer">
        <span class="ethAddr">{{ addr }}</span>
        <i class="el-icon-copy-document copyBtn" @click="copyAddr()"></i>
      </el-col>
      <el-col :span="2" v-if="loggedin">
        <el-button class="secondaryBtn logoutBtn" @click="logout()">Logout</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'navbar',
  data() {
    return {
      loggedin: false,
      addr: ''
    }
  },
  methods: {
    logout() {
      localStorage.clear()
      this.loggedin = false
      this.addr = ''
      this.$root.$emit("loggedout")
    },

    copyAddr() {
      navigator.clipboard.writeText(this.addr).then(() => {
        this.$message({
          message: 'Address copied to clipboard.',
          type: 'success'
        })
      }, () => {
        this.$message.error('Copy failed. Try again')
      })
    }
  },
  mounted() {
    this.$root.$on("loggedin", () => {
      this.addr = localStorage.getItem('pub_key')
      this.loggedin = true
    })

    this.addr = localStorage.getItem('pub_key')
    if(this.addr) {
      this.loggedin = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #222;
    color: #f2f2f2;
    border-bottom: 1px solid #e6e6e6;
  }

  .logo {
    height: 24px;
    margin: 12px;
    margin-left: 10px;
    color: #fff;
    font-weight: 600;
    line-height: 50px;
    font-size: 14px;
    vertical-align: middle;
  }

  .ethAddrContainer {
    text-align: right;
  }

  .ethAddr {
    line-height: 50px;
    text-align: right;
    font-weight: 600;
    margin-right: 6px;
  }

  .logoutBtn {
    line-height: 26px;
  }

  .copyBtn {
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
  }

  .copyBtn:hover {
    color: #ff7500;
  }
</style>