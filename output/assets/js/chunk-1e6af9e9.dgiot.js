/*!
 *  build: 杭州数蛙科技有限公司 
 *  copyright: dgiot-dashboard 
 *  author: h7ml(h7ml@qq.com) 
 *  Time: 2022年08月23日19时51分14秒
 */
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1e6af9e9"],{20297:function(t,e,s){"use strict";s("3e40")},"3e40":function(t,e,s){},"8cdb":function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t._self._c;return e("div",{staticClass:"error-container"},[e("div",{staticClass:"error-content"},[e("el-row",{attrs:{gutter:20}},[e("el-col",{attrs:{lg:12,md:12,sm:24,xl:12,xs:24}},[e("div",{staticClass:"pic-error"},[e("el-image",{staticClass:"pic-error-parent",attrs:{src:s("a81b")}}),e("el-image",{staticClass:"pic-error-child left",attrs:{src:s("a81b")}})],1)]),e("el-col",{attrs:{lg:12,md:12,sm:24,xl:12,xs:24}},[e("div",{staticClass:"bullshit"},[e("div",{staticClass:"bullshit-oops"},[t._v(" "+t._s(t.oops)+" ")]),e("div",{staticClass:"bullshit-headline"},[t._v(" "+t._s(t.headline)+" ")]),e("div",{staticClass:"bullshit-info"},[t._v(" "+t._s(t.info)+" ")]),e("el-button",{staticStyle:{float:"left"},attrs:{round:"",size:"medium",type:"primary"},on:{click:t.back}},[t._v(" "+t._s(t.$translateTitle("message.return to previous page"))+" ")]),e("router-link",{staticClass:"bullshit-return-home",attrs:{to:"/"}},[t._v(" "+t._s(t.$translateTitle("message.Exit home"))+" ")]),e("el-button",{staticStyle:{"margin-left":"20px"},attrs:{round:"",size:"medium",type:"primary"},on:{click:t.logout}},[t._v(" "+t._s(t.$translateTitle("message.sign out"))+" ")])],1)])],1)],1)])},r=[],o=s("5880"),a=s("1e51"),l=Object.defineProperty,n=Object.defineProperties,u=Object.getOwnPropertyDescriptors,c=Object.getOwnPropertySymbols,p=Object.prototype.hasOwnProperty,d=Object.prototype.propertyIsEnumerable,h=(t,e,s)=>e in t?l(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s,m=(t,e)=>{for(var s in e||(e={}))p.call(e,s)&&h(t,s,e[s]);if(c)for(var s of c(e))d.call(e,s)&&h(t,s,e[s]);return t},b=(t,e)=>n(t,u(e)),v=(t,e,s)=>new Promise((i,r)=>{var o=t=>{try{l(s.next(t))}catch(e){r(e)}},a=t=>{try{l(s.throw(t))}catch(e){r(e)}},l=t=>t.done?i(t.value):Promise.resolve(t.value).then(o,a);l((s=s.apply(t,e)).next())}),f={name:"Page404",beforeRouteLeave(t,e,s){this.delVisitedRoute(this.$route.path),clearInterval(this.timer),s()},data(){return{jumpTime:5,oops:"抱歉!",headline:"当前页面不存在...",info:"请检查您输入的网址是否正确，或点击下面的按钮返回首页。",btn:"返回首页",timer:0}},computed:m({},Object(o["mapGetters"])({visitedRoutes:"tabs/visitedRoutes",objectId:"user/objectId"})),mounted(){},methods:b(m({},Object(o["mapActions"])({delVisitedRoute:"tabs/delVisitedRoute",_logout:"user/logout"})),{timeChange(){this.timer=setInterval(()=>{this.jumpTime?this.jumpTime--:(this.delVisitedRoute(this.$route.path),this.$router.push("/"),clearInterval(this.timer))},1e3)},logout(){return v(this,null,(function*(){yield this._logout(),yield this.$router.push(Object(a["toLoginRoute"])(this.$route))}))},back(){return v(this,null,(function*(){yield this.$router.go(-1)}))}})},g=f,y=(s("20297"),s("2877")),_=Object(y["a"])(g,i,r,!1,null,"e3165680",null);e["default"]=_.exports},a81b:function(t,e,s){t.exports=s.p+"static/img/404.e51b09c3.png"}}]);