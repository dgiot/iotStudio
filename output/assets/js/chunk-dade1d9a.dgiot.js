/*!
 *  build: 杭州数蛙科技有限公司 
 *  copyright: dgiot-dashboard 
 *  author: h7ml(h7ml@qq.com) 
 *  Time: 2022年08月12日17时10分42秒
 */
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-dade1d9a"],{"2f6b":function(e,t,r){},"8f8d":function(e,t,r){"use strict";r("2f6b")},ccbf:function(e,t,r){"use strict";r.r(t);var s=function(){var e=this,t=e._self._c;return t("div",{staticClass:"register-container"},[t("el-row",[t("el-col",{attrs:{lg:14,md:11,sm:24,xl:14,xs:24}},[t("div",{staticStyle:{color:"transparent"}},[e._v("占位符")])]),t("el-col",{attrs:{lg:9,md:12,sm:24,xl:9,xs:24}},[t("el-form",{ref:"registerForm",staticClass:"register-form",attrs:{model:e.form,rules:e.registerRules,size:"mini"}},[t("div",{staticClass:"title-tips"},[e._v(" "+e._s(e.$translateTitle("注册"))+" ")]),t("el-form-item",{attrs:{prop:"username"}},[t("el-input",{directives:[{name:"focus",rawName:"v-focus"}],attrs:{"auto-complete":"off",placeholder:e.$translateTitle("请输入用户名"),type:"text"},scopedSlots:e._u([{key:"prefix",fn:function(){return[t("dgiot-icon",{attrs:{icon:"user-line"}})]},proxy:!0}]),model:{value:e.form.username,callback:function(t){e.$set(e.form,"username","string"===typeof t?t.trim():t)},expression:"form.username"}})],1),t("el-form-item",{attrs:{prop:"phone"}},[t("el-input",{attrs:{maxlength:"11",placeholder:e.$translateTitle("请输入手机号"),"show-word-limit":"",type:"text"},scopedSlots:e._u([{key:"prefix",fn:function(){return[t("dgiot-icon",{attrs:{icon:"smartphone-line"}})]},proxy:!0}]),model:{value:e.form.phone,callback:function(t){e.$set(e.form,"phone","string"===typeof t?t.trim():t)},expression:"form.phone"}})],1),t("el-form-item",{staticStyle:{position:"relative"},attrs:{prop:"phoneCode"}},[t("el-input",{attrs:{placeholder:e.$translateTitle("请输入手机验证码"),type:"text"},scopedSlots:e._u([{key:"prefix",fn:function(){return[t("dgiot-icon",{attrs:{icon:"barcode-box-line"}})]},proxy:!0}]),model:{value:e.form.phoneCode,callback:function(t){e.$set(e.form,"phoneCode","string"===typeof t?t.trim():t)},expression:"form.phoneCode"}}),t("el-button",{staticClass:"phone-code",attrs:{disabled:e.isGetPhone,type:"primary"},on:{click:e.getPhoneCode}},[e._v(" "+e._s(e.phoneCode)+" ")])],1),t("el-form-item",{attrs:{prop:"password"}},[t("el-input",{attrs:{autocomplete:"new-password",placeholder:e.$translateTitle("请输入密码"),type:"password"},scopedSlots:e._u([{key:"prefix",fn:function(){return[t("dgiot-icon",{attrs:{icon:"lock-line"}})]},proxy:!0}]),model:{value:e.form.password,callback:function(t){e.$set(e.form,"password","string"===typeof t?t.trim():t)},expression:"form.password"}})],1),t("el-form-item",[t("el-button",{staticClass:"register-btn",attrs:{type:"primary"},nativeOn:{click:function(t){return t.preventDefault(),e.handleRegister.apply(null,arguments)}}},[e._v(" "+e._s(e.$translateTitle("注册"))+" ")]),t("span",[t("router-link",{staticStyle:{float:"left"},attrs:{to:"/login"}},[t("div",{staticStyle:{"margin-top":"20px"}},[e._v(" "+e._s(e.$translateTitle("登录"))+" ")])]),t("dgiot-language",{staticStyle:{float:"right","margin-top":"20px","margin-right":"28px",cursor:"pointer"}})],1)],1)],1)],1),t("el-col",{attrs:{lg:1,md:1,sm:24,xl:1,xs:24}},[t("div",{staticStyle:{color:"transparent"}},[e._v("占位符")])])],1)],1)},o=[],i=r("28d7"),n=r("8665"),a=(e,t,r)=>new Promise((s,o)=>{var i=e=>{try{a(r.next(e))}catch(t){o(t)}},n=e=>{try{a(r.throw(e))}catch(t){o(t)}},a=e=>e.done?s(e.value):Promise.resolve(e.value).then(i,n);a((r=r.apply(e,t)).next())}),l={name:"Register",directives:{focus:{inserted(e){e.querySelector("input").focus()}}},data(){const e=(e,t,r)=>{""===t?r(new Error(this.$translateTitle("用户名不能为空"))):r()},t=(e,t,r)=>{Object(i["isPassword"])(t)?r():r(new Error(this.$translateTitle("密码不能少于6位")))},r=(e,t,r)=>{Object(i["isPhone"])(t)?r():r(new Error(this.$translateTitle("请输入正确的手机号")))};return{isGetPhone:!1,getPhoneInterval:null,phoneCode:this.$translateTitle("获取验证码"),showRegister:!1,nodeEnv:"production",form:{},registerRules:{username:[{required:!0,trigger:"blur",message:this.$translateTitle("请输入用户名")},{validator:e,trigger:"blur"}],phone:[{required:!0,trigger:"blur",message:this.$translateTitle("请输入手机号")},{validator:r,trigger:"blur"}],password:[{required:!0,trigger:"blur",message:this.$translateTitle("请输入密码")},{validator:t,trigger:"blur"}],phoneCode:[{required:!0,trigger:"blur",message:this.$translateTitle("请输入手机验证码")}]},loading:!1,passwordType:"password"}},beforeUnmount(){this.getPhoneInterval=null,clearInterval(this.getPhoneInterval)},methods:{getPhoneCode(){if(!Object(i["isPhone"])(this.form.phone))return void this.$refs["registerForm"].validateField("phone");this.isGetPhone=!0;let e=60;this.getPhoneInterval=setInterval(()=>{e>0?(e--,this.phoneCode=this.$translateTitle("获取验证码 ")+e+"s"):(this.getPhoneInterval=null,clearInterval(this.getPhoneInterval),this.phoneCode=this.$translateTitle("获取验证码"),this.isGetPhone=!1)},1e3)},handleRegister(){this.$refs["registerForm"].validate(e=>a(this,null,(function*(){if(e){const{msg:e}=yield Object(n["register"])(this.form);this.$baseMessage(e,"success",!1,"dgiot-hey-message-success")}})))}}},c=l,p=(r("8f8d"),r("2877")),u=Object(p["a"])(c,s,o,!1,null,"56520f64",null);t["default"]=u.exports}}]);