/*!
 *  build: 杭州数蛙科技有限公司 
 *  copyright: dgiot-dashboard 
 *  author: h7ml(h7ml@qq.com) 
 *  Time: 2022年10月12日13时37分41秒
 */
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-22c74f2d"],{"3e35f":function(e,t,i){e.exports=i.p+"static/img/background.bce5c49a.jpg"},"528f":function(e,t,i){"use strict";i("ead5")},"7d37":function(e,t,i){"use strict";i.r(t);var s=function(){var e=this;e._self._c;return e._m(0)},r=[function(){var e=this,t=e._self._c;return t("div",{attrs:{id:"loader-wrapper"}},[t("div",{staticClass:"loader-section section-left"}),t("div",{staticClass:"loader-section section-right"}),t("div",{staticClass:"load_title",staticStyle:{"font-size":"16px !important"}},[t("img",{staticStyle:{width:"120px",height:"120px"},attrs:{src:"/assets/images/loading.gif"}})])])}],o=i("3e35f"),a=i.n(o),n=i("5880"),l=i("28d7"),h=i("1c4e"),c=Object.defineProperty,u=Object.defineProperties,d=Object.getOwnPropertyDescriptors,m=Object.getOwnPropertySymbols,g=Object.prototype.hasOwnProperty,f=Object.prototype.propertyIsEnumerable,p=(e,t,i)=>t in e?c(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,y=(e,t)=>{for(var i in t||(t={}))g.call(t,i)&&p(e,i,t[i]);if(m)for(var i of m(t))f.call(t,i)&&p(e,i,t[i]);return e},w=(e,t)=>u(e,d(t)),b=(e,t,i)=>new Promise((s,r)=>{var o=e=>{try{n(i.next(e))}catch(t){r(t)}},a=e=>{try{n(i.throw(e))}catch(t){r(t)}},n=e=>e.done?s(e.value):Promise.resolve(e.value).then(o,a);n((i=i.apply(e,t)).next())}),v={name:"JwtLogin",directives:{focus:{inserted(e){e.querySelector("input").focus()}}},beforeRouteLeave(e,t,i){clearInterval(this.timer),clearInterval(this.interval),i()},data(){const e=(e,t,i)=>{""===t?i(new Error(this.info.empty)):i()},t=(e,t,i)=>{let s=4;Object(l["isPassword"])(t,s)?i():i(new Error(this.info.than+s+this.info.Bit))};return{interval:null,isShow:!1,locationPath:location.href.split("/#")[0],info:{empty:this.$translateTitle("home.Username can not be empty"),than:this.$translateTitle("home.Password cannot be less than"),Bit:this.$translateTitle("home.Bit")},backgroundImage:a.a,nodeEnv:"production",form:{username:"dgiot_admin",password:"dgiot_admin"},rules:{username:[{required:!0,trigger:"blur",validator:e}],password:[{required:!0,trigger:"blur",validator:t}]},loading:!1,passwordType:"password",redirect:void 0,timer:0}},computed:y({},Object(n["mapGetters"])({language:"settings/language",Default:"acl/Default",license:"acl/license",logo:"user/logo",objectId:"user/objectId",backgroundimage:"user/backgroundimage"})),watch:{language:{handler(e){this.changeInfo(e),this.$nextTick(()=>{this.$refs.form.resetFields()})},deep:!0,immediate:!0},"Default.background":{handler(e){this.backgroundImage=e},immediate:!0},$route:{handler(e){this.redirect=e.query&&e.query.redirect||"/"},immediate:!0}},beforeDestroy(){window.removeEventListener("message",this.iframeLogin)},mounted(){return b(this,null,(function*(){yield this.initShuwa(),this.$nextTick(()=>b(this,null,(function*(){yield this.defaultSet(),yield this.init()})))}))},created(){this.goHome(),this.$route.query.id_token&&this.jwtlogin(this.$route.query.id_token),window.addEventListener("message",this.iframeLogin)},methods:w(y(w(y({},Object(n["mapMutations"])({setTitle:"settings/setTitle",setCopyright:"acl/setCopyright",setDefault:"acl/setDefault"})),{iframeLogin(e){return b(this,null,(function*(){try{const t={value:moment().format("YYYY:MM:DD  HH:mm:ss"),key:"startIframe",action:"save",type:"cookie",time:moment().format("YYYY:MM:DD  HH:mm:ss")};e.source.postMessage(t,e.origin);moment().format("YYYY:MM:DD  HH:mm:ss"),moment().format("YYYY:MM:DD  HH:mm:ss")}catch(t){console.log(t),this.$baseMessage(this.$translateTitle("alert.Data request error")+""+t,"error","dgiot-hey-message-error")}}))},routeDgiot(){return b(this,null,(function*(){try{yield setTimeout(()=>{this.objectId},1200)}catch(e){console.log(e),this.$baseMessage(this.$translateTitle("alert.Data request error")+""+e,"error","dgiot-hey-message-error")}}))},init(){return b(this,null,(function*(){try{Cookies.remove("startIframe"),Cookies.remove("pwaLogin"),this.$nextTick(()=>b(this,null,(function*(){"dgiot_iframe"==window.name&&Cookies.set("startIframe",moment().format("YYYY:MM:DD HH:mm:ss"),{expires:18e5})})))}catch(e){console.log(e),this.$baseMessage(this.$translateTitle("alert.Data request error")+""+e,"error","dgiot-hey-message-error")}}))},defaultSet(){return b(this,null,(function*(){console.log("dgiot build time: "+dgiot.dateTime),console.log("startIframe time: "+Cookies.get("startIframe")),this.backgroundImage=Cookies.get("startIframe")?"https://s2.loli.net/2021/12/15/ciVTb7w62rxQ3a9.jpg":this.backgroundimage;const e=location.origin;Cookies.set("fileServer",e,{expires:18e5})}))},changeInfo(e){this.$set(this.info,"empty",this.$translateTitle("home.Username can not be empty")),this.$set(this.info,"than",this.$translateTitle("home.Password cannot be less than")),this.$set(this.info,"Bit",this.$translateTitle("home.Bit")),this.$forceUpdate()},forgotPwd(){this.$message(this.$translateTitle("home.Forgot password"))}}),Object(n["mapActions"])({login:"user/login",queryAll:"user/queryAll",jwtlogin:"user/jwtlogin"})),{getCategory(e){let t="";return this.category.filter(i=>{i.type==e&&(t=i.data.CategoryName)}),t},initShuwa(){return b(this,null,(function*(){const e=yield Object(h["SiteDefault"])(),{copyright:t,logo:i,objectId:s,title:r}=e;this.setDefault(e),this.setTitle(r),this.setCopyright(t)}))},handlePassword(){"password"===this.passwordType?this.passwordType="":this.passwordType="password",this.$nextTick(()=>{this.$refs.password.focus()})},handleRoute(){return"/404"===this.redirect||"/403"===this.redirect?"/":this.redirect},handleLogin(){this.$refs.form.validate(e=>b(this,null,(function*(){if(!e)return!1;try{this.loading=!0,yield this.login(this.form)}finally{this.loading=!1}})))},goHome(){return b(this,null,(function*(){try{this.interval=setInterval(()=>b(this,null,(function*(){""!=Cookies.get("handleRoute")&&(yield this.$router.push(this.handleRoute()),yield this.routeDgiot(),clearInterval(this.interval),window.clearInterval(this.interval))})),1500)}catch(e){console.log(e),this.$baseMessage(this.$translateTitle("alert.Data request error")+""+e,"error","dgiot-hey-message-error")}}))}})},$=v,k=(i("528f"),i("2877")),D=Object(k["a"])($,s,r,!1,null,"b1b8c7d8",null);t["default"]=D.exports},ead5:function(e,t,i){}}]);