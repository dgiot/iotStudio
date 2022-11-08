/*!
 *  build: 杭州数蛙科技有限公司 
 *  copyright: dgiot-dashboard 
 *  author: h7ml(h7ml@qq.com) 
 *  Time: 2022年11月08日18时29分35秒
 */
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2cd30aa5"],{"1b07":function(e,t,l){"use strict";l.r(t),l.d(t,"resourceTypes",(function(){return i})),l.d(t,"putResourceTypes",(function(){return n})),l.d(t,"get_actions",(function(){return s})),l.d(t,"get_resources",(function(){return o})),l.d(t,"get_rule_id",(function(){return a})),l.d(t,"put_rule_id",(function(){return c})),l.d(t,"addRule",(function(){return m})),l.d(t,"getRule",(function(){return u})),l.d(t,"getRuleDetail",(function(){return d})),l.d(t,"ruleDelete",(function(){return p})),l.d(t,"getActions",(function(){return f})),l.d(t,"getResource",(function(){return g})),l.d(t,"postResource",(function(){return h})),l.d(t,"ruleTest",(function(){return b})),l.d(t,"sqlTpl",(function(){return v}));var r=l("1395");function i(){return Object(r["default"])({url:"resource_types",method:"get",params:{}})}function n(e){return Object(r["default"])({url:"resource_types",method:"put",data:e})}function s(){return Object(r["default"])({url:"actions",method:"get"})}function o(){return Object(r["default"])({url:"resources",method:"get"})}function a(e){return Object(r["default"])({url:"rule/"+e,method:"get"})}function c(e,t){return Object(r["default"])({url:"rule/"+e,method:"put",data:t})}function m(e){return Object(r["default"])({url:"rules",method:"post",data:e})}function u(){return Object(r["default"])({url:"rules",method:"get",params:{}})}function d(e){return Object(r["default"])({url:"rule/"+e,method:"get",params:{}})}function p(e){return Object(r["default"])({url:"rule/"+e,method:"delete",params:{}})}function f(){return Object(r["default"])({url:"rule_actions",method:"get",params:{}})}function g(){return Object(r["default"])({url:"rule_resource",method:"get",params:{}})}function h(e,t,l,i){return Object(r["default"])({url:"rule_resource",method:"post",data:{config:e,description:t,name:l,type:i}})}function b(e,t,l,i,n,s){return Object(r["default"])({url:"rule_test",method:"post",data:{actions:e,ctx:t,description:l,for:i,name:n,rawsql:s}})}function v(e){return Object(r["default"])({url:"rulesql",method:"post",data:e})}},3005:function(e,t,l){"use strict";l.r(t);var r=function(){var e=this,t=e._self._c;return t("div",{staticClass:"main"},[t("linkedge")],1)},i=[],n=l("bae2"),s={components:{linkedge:n["default"]}},o=s,a=l("2877"),c=Object(a["a"])(o,r,i,!1,null,null,null);t["default"]=c.exports},"415c":function(e,t,l){"use strict";l("d3d1")},bae2:function(e,t,l){"use strict";l.r(t);var r,i,n=function(){var e=this,t=e._self._c;return t("div",{staticClass:"addengine"},[t("div",{staticClass:"addcontent"},[t("el-card",{staticClass:"box-card"},[t("el-form",{ref:"formInline",attrs:{"label-width":"75px",model:e.formInline,rules:e.formlinerule,size:"mini"}},[t("div",{staticClass:"form-block__title"},[e._v(" "+e._s(e.$translateTitle("rule.condtion"))+" "),t("div",{staticClass:"form-block__title-tips"},[e._v(" "+e._s(e.$translateTitle("rule.Processing"))+" ")])]),t("el-row",{attrs:{gutter:24}},[t("el-col",{attrs:{span:e.row1}},[t("el-row",{attrs:{gutter:24}},[t("el-col",{attrs:{span:6}},[t("el-form-item",{attrs:{label:"触发器","label-width":"70px",prop:"trigger"}},[t("el-select",{attrs:{placeholder:"请选择触发器类型"},on:{change:e.tiggerAction},model:{value:e.formInline.from.trigger,callback:function(t){e.$set(e.formInline.from,"trigger",t)},expression:"formInline.from.trigger"}},e._l(e.formInline.triggerSelect,(function(e){return t("el-option",{key:e.value,attrs:{disabled:e.disabled,label:e.value,value:e.label}})})),1)],1)],1),"device"==e.formInline.from.trigger?t("el-col",{directives:[{name:"loading",rawName:"v-loading",value:e.formInline.triggerSelect[0].loading,expression:"formInline.triggerSelect[0].loading"}],attrs:{"element-loading-background":"rgba(0, 0, 0, 0.8)","element-loading-spinner":"el-icon-loading","element-loading-text":"查询产品列表",span:6}},[t("el-form-item",{attrs:{label:"产品信息","label-width":"80px",prop:"from.from.productid"}},[t("el-select",{attrs:{placeholder:"请选择产品"},on:{change:e.tiggerProduct},model:{value:e.formInline.from.from.productid,callback:function(t){e.$set(e.formInline.from.from,"productid",t)},expression:"formInline.from.from.productid"}},e._l(e.formInline.triggerSelect[0].children,(function(e){return t("el-option",{key:e.objectId,attrs:{label:e.name,value:e.objectId}})})),1)],1)],1):e._e(),e.formInline.from.from.productid?t("el-col",{directives:[{name:"loading",rawName:"v-loading",value:e.formInline.triggerSelect[0].devaddr,expression:"formInline.triggerSelect[0].devaddr"}],attrs:{"element-loading-background":"rgba(0, 0, 0, 0.8)","element-loading-spinner":"el-icon-loading","element-loading-text":"查询设备列表",span:6}},[t("el-form-item",{attrs:{label:"设备信息","label-width":"80px",prop:"from.from.devaddr"}},[t("el-select",{attrs:{placeholder:"请选择设备"},on:{change:e.tiggerDevice},model:{value:e.formInline.from.from.devaddr,callback:function(t){e.$set(e.formInline.from.from,"devaddr",t)},expression:"formInline.from.from.devaddr"}},e._l(e.formInline.device,(function(e){return t("el-option",{key:e.devaddr,attrs:{label:e.name,value:e.devaddr}})})),1)],1)],1):e._e(),e.formInline.from.from.devaddr?t("el-col",{directives:[{name:"loading",rawName:"v-loading",value:e.formInline.triggerSelect[0].device,expression:"formInline.triggerSelect[0].device"}],attrs:{"element-loading-background":"rgba(0, 0, 0, 0.8)","element-loading-spinner":"el-icon-loading","element-loading-text":"查询设备列表",span:6}},[t("el-form-item",{attrs:{label:"事件信息","label-width":"80px",prop:"from.method"}},[t("el-select",{attrs:{placeholder:"请选择触发方式"},on:{change:e.setDefaultWhere},model:{value:e.formInline.from.method,callback:function(t){e.$set(e.formInline.from,"method",t)},expression:"formInline.from.method"}},e._l(e.formInline.methodSelect,(function(e){return t("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),1)],1)],1):e._e(),t("el-col",{directives:[{name:"show",rawName:"v-show",value:"cron"==e.formInline.from.trigger,expression:"formInline.from.trigger == 'cron'"}],attrs:{span:6}},[t("el-form-item",{attrs:{label:"触发器",prop:"trigger"}},[t("el-input",{attrs:{placeholder:"请输入Cron表达式"},model:{value:e.formInline.from.cron,callback:function(t){e.$set(e.formInline.from,"cron",t)},expression:"formInline.from.cron"}})],1)],1)],1),e._l(e.formInline.from.where,(function(l,r){return t("el-row",{directives:[{name:"show",rawName:"v-show",value:"device"==e.formInline.from.trigger,expression:"formInline.from.trigger == 'device'"}],key:l.key,attrs:{gutter:24}},[t("el-divider",{attrs:{"content-position":"left"}},[e._v(" "+e._s("执行条件:"+Number(r+1))+" ")]),t("el-col",{attrs:{prop:"trigger",span:"mqttEvent"===e.formInline.from.method?20:6}},[t("el-form-item",{attrs:{label:"属性","label-width":"70px",prop:"trigger"}},["properties"==e.formInline.from.method?t("el-select",{attrs:{placeholder:"物模型属性"},model:{value:e.formInline.from.where[r].identifier,callback:function(t){e.$set(e.formInline.from.where[r],"identifier",t)},expression:"formInline.from.where[index].identifier"}},e._l(e.formInline.data.properties,(function(l){return t("el-option",{key:l.lable+l.disable,attrs:{disabled:e.computedDisable(l),label:l.lable,value:l.value}})})),1):e._e(),"Event"==e.formInline.from.method?t("el-select",{attrs:{placeholder:"物模型事件"},model:{value:e.formInline.from.where[r].identifier,callback:function(t){e.$set(e.formInline.from.where[r],"identifier",t)},expression:"formInline.from.where[index].identifier"}},e._l(e.formInline.data.events,(function(l){return t("el-option",{key:l.lable+l.disable,attrs:{disabled:e.computedDisable(l),label:l.lable,value:l.value}})})),1):e._e(),"mqttEvent"==e.formInline.from.method?t("el-select",{attrs:{placeholder:"mqtt事件"},model:{value:e.formInline.from.where[r].identifier,callback:function(t){e.$set(e.formInline.from.where[r],"identifier",t)},expression:"formInline.from.where[index].identifier"}},e._l(e.formInline.mqttEvent,(function(l){return t("el-option",{key:l.lable,attrs:{disabled:e.computedDisable(l),label:l.label,value:l.value}})})),1):e._e(),"mqttConfig"==e.formInline.from.method?t("el-select",{attrs:{placeholder:"mqtt属性"},model:{value:e.formInline.from.where[r].identifier,callback:function(t){e.$set(e.formInline.from.where[r],"identifier",t)},expression:"formInline.from.where[index].identifier"}},e._l(e.formInline.mqttConfig,(function(l){return t("el-option",{key:l.label,attrs:{disabled:e.computedDisable(l),label:l.label,value:l.value}})})),1):e._e()],1)],1),"mqttEvent"!==e.formInline.from.method?t("el-col",{attrs:{span:6}},[t("el-form-item",{attrs:{label:"条件","label-width":"70px",prop:"trigger"}},[t("el-select",{attrs:{placeholder:"请选择比较条件"},model:{value:e.formInline.from.where[r].operator,callback:function(t){e.$set(e.formInline.from.where[r],"operator",t)},expression:"formInline.from.where[index].operator"}},e._l(e.formInline.erlOperator,(function(e){return t("el-option",{key:e,attrs:{label:e,value:e}})})),1)],1)],1):e._e(),"mqttEvent"!==e.formInline.from.method?t("el-col",{attrs:{span:6}},[t("el-form-item",{attrs:{label:"值","label-width":"70px",prop:"trigger"}},[t("el-input",{attrs:{placeholder:"请输入比较参数"},model:{value:e.formInline.from.where[r].value,callback:function(t){e.$set(e.formInline.from.where[r],"value",t)},expression:"formInline.from.where[index].value"}})],1)],1):e._e(),t("el-col",{attrs:{span:4}},[t("el-form-item",{attrs:{label:"","label-width":"0px"}},[0===r&&"mqttEvent"!==e.formInline.from.method?t("el-button",{attrs:{disabled:1==e.calculateDisable,type:"info"},on:{click:function(t){return t.preventDefault(),e.addWhere(e.formInline.from.method)}}},[e._v(" 新增 ")]):e._e(),0===r?t("el-button",{attrs:{disabled:1==e.calculateDisable,type:"success"},nativeOn:{click:function(t){return e.generatorSql(e.formInline.from)}}},[e._v(" 生成sql ")]):e._e(),0!==r?t("el-button",{attrs:{type:"warning"},on:{click:function(t){return t.preventDefault(),e.removeDomain(e.formInline.from.method,l)}}},[e._v(" 删除 ")]):e._e()],1)],1)],1)})),t("el-form-item",{directives:[{name:"show",rawName:"v-show",value:e.formInline.from.method.length,expression:"formInline.from.method.length"}],attrs:{label:"执行动作","label-width":"80px",prop:"trigger"}},[t("el-select",{staticStyle:{width:"60%"},attrs:{placeholder:"请选择执行动作"},model:{value:e.formInline.from.action,callback:function(t){e.$set(e.formInline.from,"action",t)},expression:"formInline.from.action"}},e._l(e.formInline.actionSelect,(function(e){return t("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),1)],1),t("el-form-item",{attrs:{label:e.$translateTitle("rule.RuleSQL"),prop:"enginesql"}},[t("pre",{staticClass:"ace_editor",staticStyle:{"min-height":"300px"},attrs:{id:"editor1"}},[t("el-input",{staticClass:"ace_text-input",attrs:{type:"textarea"},model:{value:e.formInline.enginesql,callback:function(t){e.$set(e.formInline,"enginesql",t)},expression:"formInline.enginesql"}})],1)]),t("el-form-item",{attrs:{label:e.$translateTitle("rule.rule Id")}},[t("el-input",{attrs:{readonly:"编辑"==e.title,type:"text"},model:{value:e.formInline.ruleId,callback:function(t){e.$set(e.formInline,"ruleId",t)},expression:"formInline.ruleId"}})],1),t("el-form-item",{attrs:{label:e.$translateTitle("rule.Remarks")}},[t("el-input",{attrs:{type:"text"},model:{value:e.formInline.remarks,callback:function(t){e.$set(e.formInline,"remarks",t)},expression:"formInline.remarks"}})],1),t("el-form-item",{attrs:{label:e.$translateTitle("rule.SQLtest")}},[t("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"gray"},on:{change:e.getEditor2},model:{value:e.formInline.sqltest,callback:function(t){e.$set(e.formInline,"sqltest",t)},expression:"formInline.sqltest"}}),t("el-popover",{attrs:{content:"自定义模拟数据进行 SQL 命令测试，仅用于测试功能",placement:"top-start",trigger:"hover",width:"200"}},[t("i",{staticClass:"el-icon-question",staticStyle:{color:"#71737d"},attrs:{slot:"reference"},slot:"reference"})])],1)],2),t("el-col",{staticClass:"animated fadeInRightBig",attrs:{span:e.row2}},[1==e.formInline.sqltest?t("el-form-item",{attrs:{label:"clientid","label-width":"80px",prop:"clientid",rules:[{required:!0,message:"clientid 不能为空",trigger:"blur"}]}},[t("el-input",{model:{value:e.formInline.clientid,callback:function(t){e.$set(e.formInline,"clientid",t)},expression:"formInline.clientid"}})],1):e._e(),1==e.formInline.sqltest?t("el-form-item",{attrs:{label:"username","label-width":"80px",prop:"username",rules:[{required:!0,message:"username 不能为空",trigger:"blur"}]}},[t("el-input",{model:{value:e.formInline.username,callback:function(t){e.$set(e.formInline,"username",t)},expression:"formInline.username"}})],1):e._e(),1==e.formInline.sqltest?t("el-form-item",{attrs:{label:"topic","label-width":"80px",prop:"topic",rules:[{required:!0,message:"topic 不能为空",trigger:"blur"}]}},[t("el-input",{model:{value:e.formInline.topic,callback:function(t){e.$set(e.formInline,"topic",t)},expression:"formInline.topic"}})],1):e._e(),1==e.formInline.sqltest?t("el-form-item",{attrs:{label:"qos","label-width":"80px",prop:"qos",rules:[{required:!0,message:"qos 不能为空",trigger:"blur"}]}},[t("el-input",{model:{value:e.formInline.qos,callback:function(t){e.$set(e.formInline,"qos",e._n(t))},expression:"formInline.qos"}})],1):e._e(),1==e.formInline.sqltest?t("el-form-item",{attrs:{label:"payload","label-width":"80px",prop:"payload",rules:[{required:!0,message:"请填写payload",trigger:"blur"}]}},[t("pre",{staticClass:"ace_editor",staticStyle:{"min-height":"100px"},attrs:{id:"editor2"}})]):e._e(),1==e.formInline.sqltest?t("el-form-item",{attrs:{label:" ","label-width":"80px"}},[t("el-button",{attrs:{type:"success"},nativeOn:{click:function(t){return e.testRule("formInline")}}},[e._v(" "+e._s(e.$translateTitle("rule.Test"))+" ")]),t("el-input",{staticStyle:{visibility:"hidden"},attrs:{type:"text"},model:{value:e.formInline.payload,callback:function(t){e.$set(e.formInline,"payload",t)},expression:"formInline.payload"}}),t("el-input",{staticClass:"ace_text-input",attrs:{type:"textarea"},model:{value:e.formInline.payload,callback:function(t){e.$set(e.formInline,"payload",t)},expression:"formInline.payload"}})],1):e._e(),1==e.formInline.sqltest?t("el-form-item",{attrs:{label:e.$translateTitle("rule.TestJie")}},[t("dgiot-editor",{key:e.formInline.result,staticStyle:{"min-height":"100px"},attrs:{height:100,lang:"sql","min-lines":100,readonly:!0,theme:"eclipse"},model:{value:e.formInline.result,callback:function(t){e.$set(e.formInline,"result",t)},expression:"formInline.result"}})],1):e._e()],1)],1),t("div",{staticClass:"tablebottom"},[t("div",{staticClass:"form-block__title"},[t("span",{staticStyle:{color:"rgb(255, 109, 109)"}},[e._v("*")]),e._v(" "+e._s(e.$translateTitle("rule.ResponseAction"))+" "),t("div",{staticClass:"form-block__title-tips"},[e._v(" "+e._s(e.$translateTitle("rule.Processing"))+" ")])]),t("div",{staticClass:"bottomtable",staticStyle:{"padding-left":"20px"}},[t("div",{staticClass:"tableaction"},[t("el-table",{staticStyle:{width:"100%"},attrs:{"cell-style":{"text-align":"center"},data:e.actionData,"header-cell-style":{"text-align":"center"}}},[t("el-table-column",{attrs:{label:e.$translateTitle("rule.channel")},scopedSlots:e._u([{key:"default",fn:function({row:l}){return[l.params.$resource?t("span",[e._v(" "+e._s("关联资源:"+l.params.$resource)+" ")]):t("span")]}}])}),t("el-table-column",{attrs:{label:e.$translateTitle("rule.target_topic")},scopedSlots:e._u([{key:"default",fn:function({row:t}){return[e._v(" "+e._s(t.params.target_topic)+" ")]}}])}),t("el-table-column",{attrs:{label:e.$translateTitle("rule.target_qos")},scopedSlots:e._u([{key:"default",fn:function({row:t}){return[e._v(" "+e._s(t.params.target_qos)+" ")]}}])}),t("el-table-column",{attrs:{label:e.$translateTitle("rule.payload_tmpl")},scopedSlots:e._u([{key:"default",fn:function({row:t}){return[e._v(" "+e._s(t.params.payload_tmpl)+" ")]}}])}),t("el-table-column",{attrs:{label:e.$translateTitle("developer.operation"),width:"180"},scopedSlots:e._u([{key:"default",fn:function({row:l,$index:r}){return[t("el-button",{attrs:{size:"mini",type:"warning"},on:{click:function(t){return e.editAisle(l)}}},[e._v(" "+e._s(e.$translateTitle("button.edit"))+" ")]),t("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(t){return e.deleteOneData(r)}}},[e._v(" "+e._s(e.$translateTitle("button.delete"))+" ")])]}}])})],1),t("div",[t("el-button",{staticStyle:{"margin-top":"20px"},attrs:{icon:"el-icon-circle-plus-outline",plain:"",size:"small",type:"success"},on:{click:e.addresouce}},[e._v(" "+e._s(e.$translateTitle("rule.Addto"))+" ")])],1)],1)]),t("div",[t("el-dialog",{attrs:{"append-to-body":!0,"close-on-click-modal":!1,title:e.$translateTitle("rule.ResponseAction"),top:"10%",visible:e.dialogFormVisible,width:"40%"},on:{"update:visible":function(t){e.dialogFormVisible=t},close:function(t){return e.resetForm("params")}}},[t("el-form",{ref:"params",attrs:{"label-position":"left","label-width":"140px",model:e.params,rules:e.paramsrules}},[t("el-form-item",{attrs:{prop:"channel"}},[t("span",{attrs:{slot:"label"},slot:"label"},[t("span",{staticClass:"span-box"},[t("i",{staticClass:"icon-dd-schetit"}),t("span",[e._v(e._s(e.$translateTitle("rule.channel")))]),t("el-tooltip",{staticClass:"item",attrs:{content:"重新发布消息到物联网通道",effect:"dark",placement:"top-start"}},[t("i",{staticClass:"el-icon-question"})])],1)]),t("el-select",{staticStyle:{width:"100%"},model:{value:e.params.channel,callback:function(t){e.$set(e.params,"channel",t)},expression:"params.channel"}},e._l(e.channellist,(function(l){return t("el-option",{key:l.name,attrs:{disabled:"dgiot"!=l.name,label:l.title.zh,value:l.title.zh}},[t("span",{staticStyle:{float:"left"}},[l.title?t("i",[e._v(" "+e._s(l.title.zh)+" ")]):e._e()]),t("span",{staticStyle:{float:"right",color:"#8492a6"}},[e._v(" "+e._s(l.description.zh)+" ")])])})),1)],1),t("el-form-item",{attrs:{label:e.$translateTitle("rule.resource"),prop:"resources"}},[t("span",{attrs:{slot:"label"},slot:"label"},[t("span",{staticClass:"span-box"},[t("i",{staticClass:"icon-dd-schetit"}),t("span",[e._v(e._s(e.$translateTitle("rule.resource")))]),t("el-tooltip",{staticClass:"item",attrs:{content:e.$translateTitle("rule.resource"),effect:"dark",placement:"top-start"}},[t("i",{staticClass:"el-icon-question"})])],1)]),t("el-select",{staticStyle:{width:"100%"},model:{value:e.params.resources,callback:function(t){e.$set(e.params,"resources",t)},expression:"params.resources"}},e._l(e.resources,(function(l){return t("el-option",{key:l.id,attrs:{label:l.description,value:l.id}},[t("span",{staticStyle:{float:"left"}},[l.description?t("i",[e._v(" "+e._s(l.description)+" ")]):e._e()]),t("span",{staticStyle:{float:"right",color:"#8492a6"}},[e._v(" "+e._s(l.id)+" ")])])})),1)],1),t("el-form-item",{attrs:{label:e.$translateTitle("rule.target_qos")}},[t("span",{attrs:{slot:"label"},slot:"label"},[t("span",{staticClass:"span-box"},[t("i",{staticClass:"icon-dd-schetit"}),t("span",[e._v(e._s(e.$translateTitle("rule.target_qos")))]),t("el-tooltip",{staticClass:"item",attrs:{content:"重新发布消息时用的 QoS 级别, 设置为 -1 以使用原消息中的 QoS",effect:"dark",placement:"top-start"}},[t("i",{staticClass:"el-icon-question"})])],1)]),t("el-select",{staticStyle:{width:"100%"},model:{value:e.params.target_qos,callback:function(t){e.$set(e.params,"target_qos",t)},expression:"params.target_qos"}},e._l(e.params.target_qosSelect,(function(e){return t("el-option",{key:e,attrs:{label:e,value:e}})})),1)],1),t("el-form-item",{attrs:{label:e.$translateTitle("rule.target_topic")}},[t("span",{attrs:{slot:"label"},slot:"label"},[t("span",{staticClass:"span-box"},[t("i",{staticClass:"icon-dd-schetit"}),t("span",[e._v(e._s(e.$translateTitle("rule.target_topic")))]),t("el-tooltip",{staticClass:"item",attrs:{content:"重新发布消息到哪个主题",effect:"dark",placement:"top-start"}},[t("i",{staticClass:"el-icon-question"})])],1)]),t("el-input",{model:{value:e.params.target_topic,callback:function(t){e.$set(e.params,"target_topic",t)},expression:"params.target_topic"}})],1),t("el-form-item",{attrs:{label:e.$translateTitle("rule.payload_tmpl")}},[t("span",{attrs:{slot:"label"},slot:"label"},[t("span",{staticClass:"span-box"},[t("i",{staticClass:"icon-dd-schetit"}),t("span",[e._v(e._s(e.$translateTitle("rule.payload_tmpl")))]),t("el-tooltip",{staticClass:"item",attrs:{content:"消息内容模板，支持变量",effect:"dark",placement:"top-start"}},[t("i",{staticClass:"el-icon-question"})])],1)]),t("el-input",{attrs:{rows:2,type:"textarea"},model:{value:e.params.payload_tmpl,callback:function(t){e.$set(e.params,"payload_tmpl",t)},expression:"params.payload_tmpl"}})],1),t("el-form-item",[e.aisleRow.name?t("el-button",{on:{click:function(t){return e.editFom("formInline")}}},[e._v(" "+e._s(e.$translateTitle("button.modify"))+" ")]):t("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.submitForm("params")}}},[e._v(" "+e._s(e.$translateTitle("button.create"))+" ")]),t("el-button",{on:{click:function(t){e.dialogFormVisible=!e.dialogFormVisible}}},[e._v(" "+e._s(e.$translateTitle("button.cancel"))+" ")])],1)],1)],1)],1)]),t("el-form-item",{attrs:{"label-width":"90"}},[e.ruleId.length?t("el-button",{attrs:{type:"success"},on:{click:function(t){return e.editrules(e.ruleId,"formInline")}}},[e._v(" "+e._s(e.$translateTitle("button.modify"))+" ")]):t("el-button",{attrs:{type:"success"},nativeOn:{click:function(t){return e.addrules("formInline")}}},[e._v(" "+e._s(e.$translateTitle("button.create"))+" ")]),t("el-button",[e._v(e._s(e.$translateTitle("button.cancel")))])],1)],1)],1)],1)])},s=[],o=l("1b07"),a=l("f61a"),c=l("7212"),m=l("1285"),u=(e,t,l)=>new Promise((r,i)=>{var n=e=>{try{o(l.next(e))}catch(t){i(t)}},s=e=>{try{o(l.throw(e))}catch(t){i(t)}},o=e=>e.done?r(e.value):Promise.resolve(e.value).then(n,s);o((l=l.apply(e,t)).next())}),d={data(){return{calculateDisable:!0,ruleId:this.$route.query.id||"",uid:this.$route.query.uid||"",ruleType:this.$route.query.type||"",resources:[],aisleRow:{},params:{name:"",payload_tmpl:"${payload}",target_qos:0,target_qosSelect:[-1,0,1,2],target_topic:"thing/${productid}/${clientid}/post",$resource:"",resources:"",channel:""},dialogVisible:!1,resourceform:{objectId:"",region:"data_resource",desc:""},resourcerule:{objectId:[{required:!0,message:"请填写通道编号",trigger:"blur"}],desc:[{required:!0,message:"请填写通道描述",trigger:"blur"}]},row1:24,row2:0,dialogFormVisible:!1,title:"",formInline:{data:{},mqttEvent:[{label:"消息投递",value:"message_delivered"},{label:"消息确认",value:"message_acked"},{label:"消息丢弃",value:"message_dropped"},{label:"连接完成",value:"client_connected"},{label:"连接断开",value:"client_disconnected"},{label:"订阅",value:"session_subscribed"},{label:"取消订阅",value:"session_unsubscribed"}],mqttConfig:[{label:"消息目的 Client ID",value:"clientid"},{label:"终端连接完成时间 (s)",value:"connected_at"},{label:"MQTT 消息 ID",value:"id"},{label:"用户名",value:"username"},{label:"客户端地址",value:"peerhost"},{label:"MQTT topic",value:"topic"},{label:"MQTT qos",value:"qos"},{label:"MQTT flags",value:"flags"},{label:"事件触发时间 (ms)",value:"timestamp"},{label:"PUBLISH 消息到达 Broker 的时间 (ms)",value:"publish_received_at"},{label:"事件触发节点",value:"node"}],Event:[],triggerSelect:[{label:"device",value:"设备触发",children:[],loading:!1,device:!1}],device:[{name:"全部设备",devaddr:"#"}],sqlOperator:[">",">=","<","<=","==","!=","in"],erlOperator:[">",">=","<","<=","==","=:=","/=","=/="],value:"",actionSelect:[{label:"设备输出",value:"device output"},{label:"规则输出",value:"rule output"},{label:"函数输出",value:"function output"},{label:"告警输出",value:"Alarm output"}],methodSelect:[{value:"properties",label:"物模型属性触发"},{value:"Event",label:"物模型事件触发"},{value:"mqttConfig",label:"mqtt属性触发",disable:!0},{value:"mqttEvent",label:"mqtt事件触发",disable:!0}],property:[],user:"",region:"",enginesql:"SELECT\n    payload.msg as msg,\n    clientid,\n    'productid' as productid\nFROM\n    \"t/#\"\nWHERE\n    msg = 'hello'",remarks:"",sqltest:!1,clientid:"c_swqx",username:"u_swqx",qos:1,topic:"t/a",payload:"",result:"",productid:"",devaddr:"",select:{mqttConfig:[],thingConfig:[]},trigger:"device",cron:"",method:"properties",from:{productid:"",devaddr:"",select:{mqttConfig:[],thingConfig:[]},trigger:"device",cron:"",method:"properties",from:{productid:"",devaddr:""},where:[{identifier:"",operator:"",value:"",config:"clientid",event:"message_delivered"}],action:[]},where:[{identifier:"",operator:"",value:"",config:"clientid",event:"message_delivered"}],action:[]},formlinerule:{region:[{required:!0,message:"请选择触发事件",trigger:"change"}],"from.from.productid":[{required:!0,message:"请选择产品",trigger:"change"}],"from.method":[{required:!0,message:"请选择触发方式",trigger:"change"}],"from.from.devaddr":[{required:!0,message:"请选择设备",trigger:"change"}],enginesql:[{required:!0,message:"请填写规则SQL",trigger:"blur"}],trigger:[{required:!0,message:"请选择触发规则",trigger:"change"}],method:[{required:!0,message:"请选择触发方式",trigger:"change"}],"where.identifier":[{required:!0,message:"请选择物模型",trigger:"change"}],"where.operator":[{required:!0,message:"请选择物模型执行条件",trigger:"change"}],"where.value":[{required:!0,message:"请输入比较参数",trigger:"blue"}]},actionData:[],form:{action:"dgiot_resource",resource:""},paramsrules:{channel:[{required:!0,message:"请选择通道",trigger:"change"}],resources:[{required:!0,message:"请选择关联资源",trigger:"change"}]},formrule:{action:[{required:!0,message:"请选择动作",trigger:"change"}]},productid:"",resourcelist:[],channellist:[],ctype:"",originlist:a["default"],client:[],sqlexample:"SELECT payload.msg as msg\n                   FROM \"t/#\"\n                   WHERE msg = 'hello'",actionslist:[],allChannelstart:0}},watch:{"formInline.from.where":{handler(e,t){""==this.formInline.from.from.devaddr&&(this.calculateDisable=!0),e.forEach(e=>{""==e.identifier?this.calculateDisable=!0:this.calculateDisable=!1,this.formInline.data[this.formInline.from.method]&&this.formInline.data[this.formInline.from.method].forEach(t=>{t.disabled=!1,e.identifier==t.value&&(t.disabled=!0)})})},deep:!0}},mounted(){this.$route.query.type&&this.$route.query.uid&&this.queryRule(`rule:${this.$route.query.type}_${this.$route.query.uid}`),this.$nextTick(()=>{this.tiggerAction("device"),r=ace.edit("editor1"),this.ruleId&&this.queryRule(this.ruleId),this.title=this.$route.query.title,this.productid=this.$route.query.productid,r.session.setMode("ace/mode/sql"),r.setTheme("ace/theme/eclipse"),r.setOptions({enableBasicAutocompletion:!0,enableSnippets:!0,enableLiveAutocompletion:!0}),r.setValue(this.formInline.enginesql)})},methods:{computedDisable(e){let t=!1;return this.formInline.from.where.forEach(l=>{l.identifier==e.value&&(t=!0)}),t},setDefaultWhere(){this.formInline.from.where=[{identifier:"",operator:"",value:"",config:"",event:""}],console.log("toggle",this.formInline.from.method)},addWhere(e){return u(this,null,(function*(){console.log(e),this.formInline.data[this.formInline.from.method].length<=this.formInline.from.where.length?this.$message({showClose:!0,duration:2e3,message:`最多只能添加${this.formInline.data[this.formInline.from.method].length}个比较参数`,type:"warning"}):yield this.formInline.from.where.push({identifier:"",operator:"",value:""})}))},removeDomain(e,t){var l=this.formInline.from.where.indexOf(t);-1!==l&&this.formInline.from.where.splice(l,1)},generatorSql(e){console.error(e);const t="#"==e.devaddr?`SELECT\n      payload.msg as msg,\n      clientid,\n      'productid' as productid\nFROM\n      "thing/${e.productid}/#"\nWHERE\n      msg = 'hello'`:`SELECT\n      payload.msg as msg,\n      clientid,\n      'productid' as productid\nFROM\n      "thing/${e.productid}/${e.devaddr}"\nWHERE\n      msg = 'hello'`;switch(e.method){case"device":e.select.payload=e.where.map(e=>e.identifier);break;case"properties":e.select.payload=e.where.map(e=>e.identifier);break;case"mqttConfig":e.select.mqttConfig=e.where.map(e=>e.identifier);break;case"mqttEvent":e.select.thingConfig=e.where.map(e=>e.identifier);break}this.$refs.formInline.validate(l=>u(this,null,(function*(){if(!l)return console.log("error submit!!"),!1;try{const l=this.$baseLoading(1);dgiotlogger.log("处理后的form表单",e),dgiotlogger.log("处理后的form表单select参数",e.select);const{template:i=t}=yield Object(o["sqlTpl"])(e);this.formInline.enginesql=i,yield r.setValue(i),dgiotlogger.log(i),l.close()}catch(i){console.log(i),this.$baseMessage(this.$translateTitle("alert.Data request error")+""+i,"error","dgiot-hey-message-error")}})))},tiggerAction(e){return u(this,null,(function*(){yield console.log(e),"device"===e&&(yield this.getProduct())}))},getProduct(){return u(this,null,(function*(){this.formInline.triggerSelect[0].loading=!0;try{const e={order:"-updatedAt",count:"objectId"},{results:t=[]}=yield Object(c["queryProduct"])(e);this.formInline.triggerSelect[0].loading=!1,this.formInline.triggerSelect[0].children=t}catch(e){this.formInline.triggerSelect[0].loading=!1}}))},tiggerProduct(e){return u(this,null,(function*(){this.formInline.property=[],this.formInline.from.identifier="",this.formInline.from.devaddr="",this.formInline.from.where=[{identifier:"",operator:"",value:""}];var t=[];for(var l in this.formInline.triggerSelect[0].children.forEach(l=>{l.objectId==e&&(t=l.thing||[])}),dgiotlogger.log("Thing",t),t){this.formInline.data[l]=[],console.error(t[l]);for(let e in t[l])this.formInline.data[l].push({lable:t[l][e].name,value:t[l][e].identifier,data:t[l][e],disabled:!1})}dgiotlogger.log(this.formInline.property,"line 928 property"),dgiotlogger.log(this.formInline.data,"line 1160 linkedge"),this.formInline.triggerSelect[0].device=!0,yield console.log(e);const r={order:"-updatedAt",count:"objectId",where:{product:e}},{results:i=[]}=yield Object(m["queryDevice"])(r);dgiotlogger.info("results",i),this.formInline.device=i,this.formInline.device.unshift({name:"全部设备",devaddr:"#"}),this.formInline.triggerSelect[0].device=!1}))},selectRegion(e){this.originlist.map(t=>{t.event==e&&(this.client=t.columns,this.sqlexample=t.sql_example)})},tiggerDevice(e){return u(this,null,(function*(){dgiotlogger.log(e)}))},getEditor2(e){1==e?(this.row1=16,this.row2=8,this.$nextTick(()=>{i=ace.edit("editor2"),i=ace.edit("editor2"),i.session.setMode("ace/mode/json"),i.setTheme("ace/theme/eclipse"),i.setOptions({enableBasicAutocompletion:!0,enableSnippets:!0,enableLiveAutocompletion:!0}),i.setValue('{"msg":"hello"}'),window.editor2=i})):(this.row1=24,this.row2=0)},queryRule(e){return u(this,null,(function*(){try{const{data:t={id:e,actions:[],description:"",rawsql:"SELECT\n      payload.msg as msg,\n      clientid,\n      'productid' as productid\nFROM\n      \"t/#\"\nWHERE\n      msg = 'hello'"}}=yield Object(o["get_rule_id"])(e);dgiotlogger.log(t),this.actionData=t.actions,this.formInline.enginesql=t.rawsql,r.setValue(this.formInline.enginesql),this.formInline.ruleId=t.id,this.formInline.remarks=t.description,r.setValue(t.rawsql)}catch(t){dgiotlogger.error(t),this.formInline.ruleId=e}}))},submitForm(e){this.$refs[e].validate(e=>{if(!e)return console.log("error submit!!"),!1;this.relationChannel(this.params)})},editFom(e){console.log(this.params),this.aisleRow.name=this.params.name,this.aisleRow.params.payload_tmpl=this.params.payload_tmpl,this.aisleRow.params.target_qos=this.params.target_qos,this.aisleRow.params.target_topic=this.params.target_topic,this.aisleRow.params.$resource=this.params.$resource,this.aisleRow.params.resources=this.params.resources,this.aisleRow.params.channel=this.params.channel,this.dialogFormVisible=!this.dialogFormVisible,this.aisleRow={}},resetForm(e){this.$refs[e].resetFields(),this.aisleRow={}},relationChannel(e){console.log(e),this.actionData.push({name:"dgiot",params:{$resource:e.resources,target_topic:e.target_topic,target_qos:e.target_qos,payload_tmpl:e.payload_tmpl,channel:this.params.channel},fallbacks:[]}),console.log(this.actionData,"this.actionData"),this.dialogFormVisible=!this.dialogFormVisible},_get_actions(){return u(this,null,(function*(){const{data:e}=yield Object(o["get_actions"])();this.channellist=e}))},_get_resources(){return u(this,null,(function*(){const{data:e}=yield Object(o["get_resources"])();this.resources=e}))},testRule(e){this.formInline.result="{}",this.formInline.payload=i.getValue(),this.formInline.enginesql=r.getValue(),this.$refs[e].validate(e=>{if(e){var t=/from[^"]+?"([^"]+)"/im,l={clientid:this.formInline.clientid,payload:i.getValue(),qos:this.formInline.qos,topic:this.formInline.topic,username:this.formInline.username};console.log(r.getValue(),"rawsql"),window.editor1=r,window.editor1Value=r.getValue(),console.log(r,r.getValue().match(t)[1],"for");const e={actions:this.actionData,ctx:l,description:this.formInline.remarks,for:r.getValue().match(t)[1],name:this.formInline.username,rawsql:r.getValue(),test:"true"};Object(o["addRule"])(e).then(e=>{console.log("response",e);const{code:t,message:l="",data:r={}}=e;0==t?(this.formInline.result=JSON.stringify(r,null,2),console.log("     this.formInline.result ",this.formInline.result),this.$message({showClose:!0,duration:2e3,message:"sql测试成功",type:"success"})):(this.formInline.result=JSON.stringify(e,null,2),this.$message({message:"sql测试失败"+l,type:"error"}))}).catch(e=>{this.$message({message:"sql测试失败，原因"+e,type:"error"}),console.log(e)})}})},editrules(e,t){return u(this,null,(function*(){var l={clientid:this.formInline.clientid,payload:i.getValue(),qos:this.formInline.qos,topic:this.formInline.topic,username:this.formInline.username};const n={actions:this.actionData,ctx:l,description:this.formInline.remarks,for:'["t/#"]',rawsql:r.getValue()},s=yield Object(o["put_rule_id"])(e,n);console.log(e,t,s),this.$message("修改成功"),this.$router.push({path:"/rules_engine/engine"})}))},addrules(e){this.formInline.payload=i.getValue(),this.formInline.enginesql=r.getValue(),this.$refs[e].validate(e=>{if(e){if(0==this.actionData.length)return void this.$message("动作不能为空");var t={clientid:this.formInline.clientid,payload:i.getValue(),qos:this.formInline.qos,topic:this.formInline.topic,username:this.formInline.username};const e={actions:this.actionData,ctx:t,description:this.formInline.remarks,for:'["t/#"]',rawsql:r.getValue()};this.$route.query.type&&this.$route.query.uid&&(e.id=`rule:${this.$route.query.type}_${this.$route.query.uid}`),Object(o["addRule"])(e).then(e=>{console.log(e),e&&(this.$message("创建成功"),this.$router.push({path:"/rules_engine/engine"}))}).catch(e=>{console.log(e),this.$baseMessage(""+e.error,"error","dgiot-hey-message-error")})}else this.$message("有必填项未填写")})},addresouce(){console.log(this.aisleRow),this._get_actions(),this._get_resources(),this.aisleRow.name&&(this.params={name:this.aisleRow.name,payload_tmpl:this.aisleRow.params.payload_tmpl,target_qos:this.aisleRow.params.target_qos,target_qosSelect:[-1,0,1,2],target_topic:this.aisleRow.params.target_topic,$resource:this.aisleRow.params.$resource,resources:this.aisleRow.params.$resource,channel:this.aisleRow.params.channel}),this.dialogFormVisible=!0},addRes(e){this.$refs[e].validate(t=>{if(!t)return this.$baseMessage("error submit!!","error","dgiot-hey-message-error"),!1;Object(o["postResource"])({channel:this.resourceform.objectId},this.resourceform.desc,"","data_resource").then(t=>{t&&(this.$message("创建成功"),this.$refs[e].resetFields(),this.dialogVisible=!1)})})},deleteOneData(e){this.actionData.splice(e,1)},editAisle(e){this.aisleRow=e,this.addresouce()}}},p=d,f=(l("415c"),l("2877")),g=Object(f["a"])(p,n,s,!1,null,"61408db3",null);t["default"]=g.exports},d3d1:function(e,t,l){},f61a:function(e,t,l){"use strict";l.r(t);var r=[{columns:["clientid","username","event","id","payload","peerhost","qos","timestamp","topic","node"],description:{en:"message publish",zh:"消息发布"},event:"message.publish",sql_example:"SELECT payload.msg as msg FROM \"message.publish\" WHERE topic =~ 't/#' and msg = 'hello'",test_columns:{clientid:"c_emqx",username:"u_emqx",topic:"t/a",qos:1,payload:'{"msg": "hello"}'},title:{en:"message publish",zh:"消息发布"}},{columns:["clientid","username","event","auth_result","mountpoint","id","payload","peerhost","topic","qos","timestamp","node"],description:{en:"message delivered",zh:"消息投递"},event:"message.delivered",sql_example:"SELECT payload.msg as msg FROM \"message.delivered\" WHERE topic =~ 't/#' and msg = 'hello'",test_columns:{clientid:"c_emqx",username:"u_emqx",topic:"t/a",qos:1,payload:'{"msg": "hello"}'},title:{en:"message delivered",zh:"消息投递"}},{columns:["clientid","username","event","id","payload","peerhost","topic","qos","timestamp","node"],description:{en:"message acked",zh:"消息应答"},event:"message.acked",sql_example:"SELECT payload.msg as msg FROM \"message.acked\" WHERE topic =~ 't/#' and msg = 'hello'",test_columns:{clientid:"c_emqx",username:"u_emqx",topic:"t/a",qos:1,payload:'{"msg": "hello"}'},title:{en:"message acked",zh:"消息应答"}},{columns:["clientid","username","event","id","payload","peerhost","qos","timestamp","topic","node"],description:{en:"message dropped",zh:"消息丢弃"},event:"message.dropped",sql_example:"SELECT payload.msg as msg FROM \"message.dropped\" WHERE topic =~ 't/#' and msg = 'hello'",test_columns:{clientid:"c_emqx",username:"u_emqx",topic:"t/a",qos:1,payload:'{"msg": "hello"}'},title:{en:"message dropped",zh:"消息丢弃"}},{columns:["clientid","username","event","auth_result","clean_start","connack","connected_at","is_bridge","keepalive","mountpoint","peerhost","proto_ver","timestamp","node"],description:{en:"client connected",zh:"连接建立"},event:"client.connected",sql_example:'SELECT * FROM "client.connected"',test_columns:{clientid:"c_emqx",username:"u_emqx",auth_result:"success",peerhost:"127.0.0.1"},title:{en:"client connected",zh:"连接建立"}},{columns:["clientid","username","event","auth_result","mountpoint","peerhost","reason_code","timestamp","node"],description:{en:"client disconnected",zh:"连接断开"},event:"client.disconnected",sql_example:'SELECT * FROM "client.disconnected"',test_columns:{clientid:"c_emqx",username:"u_emqx",reason_code:"normal"},title:{en:"client disconnected",zh:"连接断开"}},{columns:["clientid","username","event","auth_result","mountpoint","peerhost","topic_filters","topic","qos","timestamp","node"],description:{en:"client subscribe",zh:"终端订阅"},event:"client.subscribe",sql_example:"SELECT * FROM \"client.subscribe\" WHERE topic =~ 't/#'",test_columns:{clientid:"c_emqx",username:"u_emqx",topic_filters:[{topic:"t/a",qos:0},{topic:"t/b",qos:1}]},title:{en:"client subscribe",zh:"终端订阅"}},{columns:["clientid","username","event","auth_result","mountpoint","peerhost","topic_filters","topic","qos","timestamp","node"],description:{en:"client unsubscribe",zh:"终端取消订阅"},event:"client.unsubscribe",sql_example:"SELECT * FROM \"client.unsubscribe\" WHERE topic =~ 't/#'",test_columns:{clientid:"c_emqx",username:"u_emqx",topic_filters:["t/a","t/b"]},title:{en:"client unsubscribe",zh:"终端取消订阅"}},{columns:["clientid","username","event","topic","qos","nl","rap","rc","rh","timestamp","node"],description:{en:"session subscribed",zh:"会话订阅完成"},event:"session.subscribed",sql_example:"SELECT * FROM \"session.subscribed\" WHERE topic =~ 't/#'",test_columns:{clientid:"c_emqx",username:"u_emqx",topic:"t/a",qos:1},title:{en:"session subscribed",zh:"会话订阅完成"}},{columns:["clientid","username","event","topic","qos","nl","rap","rc","rh","timestamp","node"],description:{en:"session unsubscribed",zh:"会话取消订阅完成"},event:"session.unsubscribed",sql_example:"SELECT * FROM \"session.unsubscribed\" WHERE topic =~ 't/#'",test_columns:{clientid:"c_emqx",username:"u_emqx",topic:"t/a",qos:1},title:{en:"session unsubscribed",zh:"会话取消订阅完成"}}];t["default"]=r}}]);