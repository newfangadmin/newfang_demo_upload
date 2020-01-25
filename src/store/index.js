import Vue from 'vue'
import Vuex from 'vuex'
import { setPvtKey } from '../utils/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    pvt_key: '',
    pub_key: '',
    addr: ''
  },
  mutations: {
    SET_PVT_KEY: (state, pvt_key) => {
      state.pvt_key = pvt_key
      setPvtKey(pvt_key)
    },
    SET_PUB_KEY: (state, pub_key) => {
      state.pub_key = pub_key
    },
    SET_ADDR: (state, addr) => {
      state.addr = addr
    }
  },

})

export default store