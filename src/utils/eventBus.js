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
const Bus = new Vue({
  methods: {
    emit(event, ...args) {
      this.$emit(event, ...args)
    },
    on(event, callback) {
      this.$on(event, callback)
    },
    off(event, callback) {
      this.$off(event, callback)
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
// this.$bus.$emit('log',aa())
// this.$bus.$emit('log1',str)
// this.$bus.$emit('log2',arr)

// $on 接受

// created() {
// this.$bus.$on('log',(res)=>{
//   console.log(res);
// })
// this.$bus.$on('log1',(res)=>{
//   console.log(res);
// })
// this.$bus.$on('log2',(res)=>{
//   console.log(res);
// })
// }

// $off 清空
//
// this.$bus.$off('log')
// this.$bus.$off('log1')
// this.$bus.$off('log2')
