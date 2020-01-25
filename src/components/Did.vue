<template>
  <el-row class="didContainer" v-loading="floading" element-loading-background="rgba(240, 240, 240, 0.95)" element-loading-text="Decrypting Keystore...">
    <el-col :span="12" :offset="6">
      <div class="" v-if="!loggedin">
        <div class="headerText">Enter an ethereum keystore to get started</div>
        <el-button type="primary" class="getKeystoreBtn" @click="chooseKeystore()">Load Keystore</el-button>
        <input type="file" ref="fileSelect" style="display: none" v-on:change="handleKeystoreSelect()">
      </div>
      <div v-else>
        <div class="headerText">Select a file you would like to upload</div>
        <input type="file" ref="fileSelect" style="display: none" v-on:change="handleUpload()">
        <div class="btnContainer">
          <el-button type="primary" icon="el-icon-upload" class="uploadBtn" @click="handleUploadBtnClick()">Upload File</el-button>
        </div>
        <div class="errorContainer">{{ errorMsg }}</div>
        <div class="filesContainer" v-if="uploadDone">
          <el-row>
            <el-col :span="18" class="did">{{ did }}</el-col>
            <el-col :span="2" class="shareBtnContainer">
              <el-button type="text" class="shareBtn" @click="handleCopy()">Copy</el-button>
            </el-col>
            <el-col :span="2" class="shareBtnContainer">
              <el-button type="text" class="shareBtn" @click="handleShareBtnClick()">Share</el-button>
            </el-col>
            <el-col :span="2" class="shareBtnContainer">
              <el-button type="text" class="revokeBtn" @click="handleRevoke()">Revoke</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { ethers } from 'ethers'
const Newfang = window.newfang.default
const { Uploader } = Newfang
const wallet = new ethers.Wallet("B2F6ACDF8D47EDD53A38D573325DAA9D2418A6FB1B141DB7A4AFAFB985E6BA49")

export default {
  name: 'did',
  props: {
  },
  data() {
    return {
      did: '',
      errorMsg: '',
      keystore: '',
      floading: false,
      loggedin: false,
      uploadDone: false
    }
  },
  methods: {
    chooseKeystore() {
      this.$refs.fileSelect.click()
    },

    handleKeystoreSelect () {
      const file = this.$refs.fileSelect.files[0]
      if (file !== undefined) {
        var reader = new FileReader();
        reader.readAsText(file, "utf-8")
        const self = this
        reader.onload = function (evt) {
          self.keystore = evt.target.result
          self.getPassword()
        }
      }
    },

    getPassword () {
      this.$prompt('Please enter your password', 'Enter Password', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        inputType: 'password'
      }).then(({ value }) => {
        this.floading = true
        this.checkPassword(value)
      }).catch(() => {
      })
    },

    async checkPassword(pass) {
      let wallet = null
      try {
        wallet = await ethers.Wallet.fromEncryptedJson(this.keystore, pass)
        console.log(wallet)
        this.floading = false
        localStorage.setItem('pvt_key', wallet.privateKey)
        const pub_key = wallet.signingKey.publicKey.split('0x')[1]
        console.log(pub_key)
        localStorage.setItem('pub_key', pub_key)
        localStorage.setItem('addr', wallet.address)
        this.loggedin = true
        this.$root.$emit("loggedin")
      }
      catch(error) {
        this.floading = false
        this.$message.error('Invalid password or keystore. Try again')
        this.getPassword()
      }
    },

    handleUploadBtnClick() {
      this.$refs.fileSelect.click()
    },

    handleUpload() {
      const file = this.$refs.fileSelect.files[0]
      if (file !== undefined) {
        const convergence = Uploader.generate_convergence();
        const uploader = new Uploader({ file, convergence }, {blockchain: {
            provider: ethers,
            wallet
        }});

        uploader.setIdentity(localStorage.getItem('pvt_key'));
        uploader.on("upload_complete", (url) => {
          console.log("upload complete: ", url);
          // inform your app
        });

        uploader.on("error", (e) => console.log(e));

        uploader.on("did_created", (did) => {
          console.log({did});
          this.did = did;
          this.uploadDone = true;
        })

        uploader.on("upload_progress", (percentage) => {
          console.log("upload progress: ", percentage + "%");
          // inform your app
        });
        uploader.start_upload();
        return uploader;
      }
    },

    handleCopy() {
      navigator.clipboard.writeText(this.did).then(() => {
        this.$message({
          message: 'DID copied to clipboard.',
          type: 'success',
        });
      },
      () => {
        this.$message.error('Copy failed. Try again');
      });
    }
  },
  mounted() {
    if(localStorage.getItem('pvt_key')) {
      this.loggedin = true
    }
    this.$root.$on("loggedout", () => {
      this.keystore = ''
      this.loggedin = false
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.didContainer {
  padding-top: 30px;
  height: calc(100vh - 50px);
}

.headerText {
  font-size: 40px;
  font-weight: 200;
  padding: 30px;
}

.errorContainer {
  font-size: 10px;
  font-weight: 600;
  color: rgb(219, 65, 65);
  text-align: left;
  padding-left: 2px;
  height: 20px;
  line-height: 20px;
}

.btnContainer {
  text-align: center;
}

.filesContainer {
  margin: 20px;
  border-top: 1px dashed #ccc;
  border-bottom: 1px dashed #ccc;
}

.did {
  line-height: 36px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shareBtn, .revokeBtn {
  border: none;
}

.shareBtn:hover, .revokeBtn:hover {
  background: none;
  border: none;
  color: #ff7500;
  text-decoration: underline;
}
</style>
