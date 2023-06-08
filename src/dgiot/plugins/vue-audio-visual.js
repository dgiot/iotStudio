import AudioVisual from 'vue-audio-visual'
import BaiduMap from 'vue-baidu-map'
Vue.use(AudioVisual)
Vue.use(BaiduMap, {
  ak: Vue.prototype.$dgiot.secret.baidu.map,
})
