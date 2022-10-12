/*!
 *  build: 杭州数蛙科技有限公司 
 *  copyright: dgiot-dashboard 
 *  author: h7ml(h7ml@qq.com) 
 *  Time: 2022年10月12日13时37分41秒
 */
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-8c2e60e4"],{"10ab":function(e,t,s){"use strict";s("756b")},"3fb4":function(e,t,s){"use strict";s.r(t);var r=function(){var e=this,t=e._self._c;return t("div",{ref:"container",staticClass:"login-container",style:{backgroundImage:"url("+e.backgroundImage+")",backgroundRepeat:"no-repeat",backgroundSize:"100% 100%"}},[e.isShow?t("el-row",{staticStyle:{position:"absolute",width:"100%",height:"100%"}},[t("el-col",{attrs:{lg:14,md:11,sm:24,xl:14,xs:24}},[t("div",{staticStyle:{color:"transparent"}},[e._v("占位符")])]),t("el-col",{attrs:{lg:9,md:12,sm:24,xl:9,xs:24}},[t("el-form",{ref:"form",staticClass:"login-form",attrs:{"label-position":"left",model:e.form,rules:e.rules}},[e.Default.title?t("div",{staticClass:"title-tips"},[e._v(" "+e._s(e.$translateTitle("home.login title"))+" ")]):e._e(),t("el-form-item",{staticStyle:{"margin-top":"40px"},attrs:{prop:"username"}},[t("el-input",{directives:[{name:"focus",rawName:"v-focus"}],attrs:{placeholder:e.$translateTitle("home.Please enter user name"),tabindex:"1",type:"text"},scopedSlots:e._u([{key:"prefix",fn:function(){return[t("dgiot-icon",{attrs:{icon:"user-line"}})]},proxy:!0}],null,!1,584386874),model:{value:e.form.username,callback:function(t){e.$set(e.form,"username","string"===typeof t?t.trim():t)},expression:"form.username"}})],1),t("el-form-item",{attrs:{prop:"password"}},[t("el-input",{key:e.passwordType,ref:"password",attrs:{placeholder:e.$translateTitle("home.Please enter the password"),tabindex:"2",type:e.passwordType},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleLogin.apply(null,arguments)}},scopedSlots:e._u([{key:"prefix",fn:function(){return[e.form.password.length?t("dgiot-icon",{attrs:{icon:"lock-line"}}):e._e()]},proxy:!0},"password"===e.passwordType&&e.form.password.length?{key:"suffix",fn:function(){return[t("dgiot-icon",{staticClass:"show-password",attrs:{icon:"eye-off-line"},nativeOn:{click:function(t){return e.handlePassword.apply(null,arguments)}}})]},proxy:!0}:{key:"suffix",fn:function(){return[e.form.password.length?t("dgiot-icon",{staticClass:"show-password",attrs:{icon:"eye-line"},nativeOn:{click:function(t){return e.handlePassword.apply(null,arguments)}}}):e._e()]},proxy:!0}],null,!0),model:{value:e.form.password,callback:function(t){e.$set(e.form,"password","string"===typeof t?t.trim():t)},expression:"form.password"}})],1),t("div",[t("el-button",{staticClass:"login-btn",attrs:{slot:"append",loading:e.loading},nativeOn:{click:function(t){return e.handleLogin.apply(null,arguments)}},slot:"append"},[e._v(" "+e._s(e.$translateTitle("home.login"))+" ")])],1),t("span",[t("router-link",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],staticStyle:{float:"left"},attrs:{to:"/register"}},[t("div",{staticStyle:{"margin-top":"20px"}},[e._v(" "+e._s(e.$translateTitle("home.registered"))+" ")])]),t("dgiot-language",{staticStyle:{float:"right","margin-top":"20px",cursor:"pointer"}})],1)],1)],1)],1):e._e()],1)},o=[],i=s("5880"),a=s("28d7"),n=s("1c4e"),l=s("bc35"),c=Object.defineProperty,u=Object.defineProperties,d=Object.getOwnPropertyDescriptors,h=Object.getOwnPropertySymbols,m=Object.prototype.hasOwnProperty,p=Object.prototype.propertyIsEnumerable,g=(e,t,s)=>t in e?c(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,f=(e,t)=>{for(var s in t||(t={}))m.call(t,s)&&g(e,s,t[s]);if(h)for(var s of h(t))p.call(t,s)&&g(e,s,t[s]);return e},y=(e,t)=>u(e,d(t)),w=(e,t,s)=>new Promise((r,o)=>{var i=e=>{try{n(s.next(e))}catch(t){o(t)}},a=e=>{try{n(s.throw(e))}catch(t){o(t)}},n=e=>e.done?r(e.value):Promise.resolve(e.value).then(i,a);n((s=s.apply(e,t)).next())}),b={name:"Login",directives:{focus:{inserted(e){e.querySelector("input").focus()}}},beforeRouteLeave(e,t,s){clearInterval(this.timer),clearInterval(this.interval),s()},data(){const e=(e,t,s)=>{""===t?s(new Error(this.info.empty)):s()},t=(e,t,s)=>{let r=4;Object(a["isPassword"])(t,r)?s():s(new Error(this.info.than+r+this.info.Bit))};return{interval:null,isShow:"dgiot_iframe"!=window.name,locationPath:location.href.split("/#")[0],info:{empty:this.$translateTitle("home.Username can not be empty"),than:this.$translateTitle("home.Password cannot be less than"),Bit:this.$translateTitle("home.Bit")},backgroundImage:"",nodeEnv:"production",form:{username:"",password:""},rules:{username:[{required:!0,trigger:"blur",validator:e}],password:[{required:!0,trigger:"blur",validator:t}]},loading:!1,passwordType:"password",redirect:void 0,timer:0}},computed:f({},Object(i["mapGetters"])({language:"settings/language",Default:"acl/Default",license:"acl/license",logo:"user/logo",objectId:"user/objectId",backgroundimage:"user/backgroundimage",currentDepartment:"user/currentDepartment"})),watch:{language:{handler(e){this.changeInfo(e),this.$nextTick(()=>{this.$refs.form.resetFields()})},deep:!0,immediate:!0},"Default.background":{handler(e){this.backgroundImage=e},immediate:!0},$route:{handler(e){this.redirect=e.query&&e.query.redirect||"/"},immediate:!0}},beforeDestroy(){window.removeEventListener("message",this.iframeLogin)},mounted(){return w(this,null,(function*(){yield this.initShuwa(),this.$nextTick(()=>w(this,null,(function*(){yield this.defaultSet(),yield this.init()})))}))},created(){this.$removeToken(),this.isShow="dgiot_iframe"!=window.name,window.addEventListener("message",this.iframeLogin)},methods:y(f(y(f({},Object(i["mapMutations"])({setTitle:"settings/setTitle",setCopyright:"acl/setCopyright",setDefault:"acl/setDefault",setRoleTree:"user/setRoleTree"})),{iframeLogin(e){return w(this,null,(function*(){try{const t={value:moment().format("YYYY:MM:DD  HH:mm:ss"),key:"startIframe",action:"save",type:"cookie",time:moment().format("YYYY:MM:DD  HH:mm:ss")};e.source.postMessage(t,e.origin);moment().format("YYYY:MM:DD  HH:mm:ss"),moment().format("YYYY:MM:DD  HH:mm:ss")}catch(t){console.log(t),this.$baseMessage(this.$translateTitle("alert.Data request error")+""+t,"error","dgiot-hey-message-error")}}))},init(){return w(this,null,(function*(){try{Cookies.remove("startIframe"),Cookies.remove("pwaLogin"),this.$nextTick(()=>w(this,null,(function*(){"dgiot_iframe"==window.name&&(Cookies.set("startIframe",moment().format("YYYY:MM:DD HH:mm:ss"),{expires:18e5}),yield this.login({username:"yanshizhanghao",password:"yanshizhanghao"}),yield this.goHome())})))}catch(e){console.log(e),this.$baseMessage(this.$translateTitle("alert.Data request error")+""+e,"error","dgiot-hey-message-error")}}))},defaultSet(){return w(this,null,(function*(){this.backgroundImage=Cookies.get("startIframe")?"https://s2.loli.net/2021/12/15/ciVTb7w62rxQ3a9.jpg":this.backgroundimage;const e=location.origin;Cookies.set("fileServer",e,{expires:18e5}),console.log("backgroundimage:",this.backgroundimage)}))},changeInfo(e){this.$set(this.info,"empty",this.$translateTitle("home.Username can not be empty")),this.$set(this.info,"than",this.$translateTitle("home.Password cannot be less than")),this.$set(this.info,"Bit",this.$translateTitle("home.Bit")),this.$forceUpdate()},forgotPwd(){this.$message(this.$translateTitle("home.Forgot password"))}}),Object(i["mapActions"])({login:"user/login",queryAll:"user/queryAll",jwtlogin:"user/jwtlogin"})),{getCategory(e){let t="";return this.category.filter(s=>{s.type==e&&(t=s.data.CategoryName)}),t},initShuwa(){return w(this,null,(function*(){const e=yield Object(n["SiteDefault"])(),{copyright:t,logo:s,objectId:r,title:o}=e;this.setDefault(e),this.setTitle(o),this.setCopyright(t)}))},handlePassword(){"password"===this.passwordType?this.passwordType="":this.passwordType="password",this.$nextTick(()=>{this.$refs.password.focus()})},handleRoute(){return"/404"===this.redirect||"/403"===this.redirect?"/":this.redirect},handleLogin(){this.$refs.form.validate(e=>w(this,null,(function*(){if(!e)return!1;try{this.loading=!0,yield this.login(this.form),yield this.goHome()}finally{this.loading=!1}})))},goHome(){return w(this,null,(function*(){try{if(""!=Cookies.get("handleRoute")){console.log("handleRoute 存在，跳转页面");const{results:e=[]}=yield Object(l["Roletree"])();this.setRoleTree(e),yield this.$router.push(this.handleRoute())}}catch(e){console.log(e),this.$baseMessage(this.$translateTitle("alert.Data request error")+""+e,"error","dgiot-hey-message-error")}}))}})},v=b,k=(s("10ab"),s("2877")),$=Object(k["a"])(v,r,o,!1,null,"52174120",null);t["default"]=$.exports},"756b":function(e,t,s){}}]);