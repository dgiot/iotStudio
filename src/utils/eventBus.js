// * @Author: h7ml
// * @Date: 2021-09-01 10:38:18
// * @LastEditors: h7ml
// * @LastEditTime: 2021-09-01 10:38:18
// * @Description:
// * @FilePath: src\utils\eventBus.js
// * @DocumentLink: https://juejin.cn/post/6844903763560366093
/**
 *
 * @type {Vue}
 */
import { getMqttEventId } from '@/utils'
const Bus = new Vue({
  methods: {
    emit(event, ...args) {
      this.$emit(getMqttEventId(event), ...args)
    },
    on(event, callback) {
      this.$on(getMqttEventId(event), callback)
    },
    off(event, callback) {
      this.$off(getMqttEventId(event), callback)
    },
  },
})
export default Bus

// user
// $emit 传递
//
// let arr1 = ['hi~'];
// function aa(){
//   return arr1;
// }
// let str = 'hello';
// let arr = [2,3,4,5];
// this.$dgiotBus.$emit('log',aa())
// this.$dgiotBus.$emit('log1',str)
// this.$dgiotBus.$emit('log2',arr)

// $on 接受

// created() {
// this.$dgiotBus.$on('log',(res)=>{
//   console.log(res);
// })
// this.$dgiotBus.$on('log1',(res)=>{
//   console.log(res);
// })
// this.$dgiotBus.$on('log2',(res)=>{
//   console.log(res);
// })
// }

// $off 清空
//
// this.$dgiotBus.$off('log')
// this.$dgiotBus.$off('log1')
// this.$dgiotBus.$off('log2')
