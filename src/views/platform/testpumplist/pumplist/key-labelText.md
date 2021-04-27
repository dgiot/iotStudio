```markdown
[中文转拼音]('https://zhongwenzhuanpinyin.51240.com/' '中文转拼音')

英文单词: 大驼峰命名法
拼音: 全部小写

### 相关文件

TestConfigureForm.cs 测试设置

XSInfoInputForm.cs 型式试验

---

XSAutoMonitorForm 型式试验监控画面 自动
XSManualMonitorForm 型式试验监控画面 手动

## 基本信息 BasicInfo

BasicInfoObj {}
产品名称 chanpinmingchen --------- productName name
水泵型号 shuibengxinghao --------- xinghao **\***
出厂编号 chuchangbianhao ---------- chuchangbianhao **\***
试验标号 shiyanbiaohao ---------- bianhao \***\*111**
产品编号 chanpinbianhao --------- chanpinbianhao **\***
送样单位 jingxiaodanwei --------- songyangN **\***
单位地址 danweidizhi1 ----------- jingxiaoAddr **\***
生产单位 shengchandanwei --------- shengchanN **\***
单位地址 danweidizhi2 ------------ shengchanAddr **\***
委托单位 weituodanwei ------------ weituo **\***
单位地址 danweidizhi3 ------------- weituoAddr **\***
受检单位 shoujiandanwei ----------- shoujianN **\***
检验依据 jianyanyiju -------------- jianyanbiaozhun **\***
抽样地点 chouyangdidian ----------- chouyangAddr **\***
抽样基数 chouyangjishu ----------- chouyangjishu **\***
电机规格 dianjiguige -------------- guige **\***
电机效率 dianjixiaolv ------------- xiaolv **\***
样品台数 yangpintaishu ------------ taishu **\***
样品状态 yangpinzhuangtai --------- dengji **\***
试验人员 shiyanrenyuan ----------- shiyanName **\***
试验日期 shiyanriqi --------------- shiyanDateTime **\***
送样人员 songyangrenyuan ---------- songyangN **\***
送样日期 songyangriqi ------------- songyangDateTime **\***
备注 beizhu ------------------- beizhu

## 台位信息 TableInfo

TableInfoObj {}
试验台位 shiyantaiwei --------- taiwei **\***
试验类型 shiyanleixing -------- leixing **\***
功率测量 gonglvceliang -------- Wtest
进口扬程算法 jinkouyangchengsuanfa ------ jkycsf (进口压力算法 0, 液位算法 1 )
是否接液位计 shifoujieyeweiji ------------ yeweiji (true,false)

流量测量 liuliangceliang --------- Qtest **\***
扭矩测量 niujuceliang ----------- 未找到
转速测量 zhuansuceliang --------- Ntest

进口压力测量 jinkouyaliceliang ------- inputPa **\***
出口压力测量 chukouyaliceliang -------- outputPa **\***
振动测量 zhendongceliang ---------- zhendongcl \*\*\*

温度测量 wenduceliang ------------ temcl
是否接温度传感器 shifoujiewenduchuanganqi ------- tem_install(true/false)
噪声测量 zaoshengceliang --------------- zaoshengcl
大气压力测量 daqiyaliceliang --------------- airpresscl

液位测量 yeweiceliang --------------- yeweicl
振动测量类型 zhendongceliangleixing ------- zdcl

进口测压处管径 jinkouceyachuguanjing ---- jinkouyaguanjing -> jinkouceyaguanjing **\***
出口测压处管径 chukouceyachuguanjing ---- chukouyaguanjing -> chuouceyaguanjing **\***
检测项目 jiancexiangmu -------------- jyxm

进口压力表至基准面距离 jinkouyalibiaozhijizhunmianjuli ----- jinkoujuli -> jinkouyalijuli \***\*111**
出口压力表至基准面距离 chukouyalibiaozhijizhunmianjuli ------ chukoujuli -> chukouyalijuli \***\*111**
汽化压力 qihuayali ----------------- Pv

泵进口直径 bengjinkouzhijing ------------- bengjingkou
泵出口直径 bengchukouzhijing ------------- bengchukou
水的密度 shuidemidu

叶轮外径/流道宽度 yelunwaijinghuozheliudaokuandu ------- yelunwaijin -> yelunwajing **\***
叶片角度 yepianjiaodu ----------------- yepianjiaodu **\***
介质温度 wendu ------------------- wendu **\***
大气压力 daqiyali ---------------- daqiyali

泵的安装高度 bengdeanzhuanggaodu hg (需要运算) **\***
进口管损 jinkouguansun ---------- hi_k
出口管损 chukouguansun ---------- ho_k
叶轮出口宽度 yelunchukoukuandu ------ yelunchukoukuandu

叶轮材质 yeluncaizhi ------------ yeluncaizhi

## 规定点信息 PrescribedPoint

PrescribedPointObj {}

测试点个数 ceshidiangeshu -------- point \***\*111**

流量作为均分点 averagePoint flow

    最小流量	zuixiaoliuliang  ------- 未传递
    最大流量	zuidaliuliang   ------- 未传递

扬程作为均分点 averagePoint lift

    最小扬程	zuixiaoyangcheng   ------- 未传递
    最大扬程	zuidayangcheng    ------- 未传递

额定转速 edingzhuansu ------ rpmeding rpm \***\*111**

均分点信息 pointDataArr

规定流量 guidingliuliang1 ------ Qmin Q1 \***\*111**
规定扬程 guidingyangcheng1 ------ Hmid H1 \***\*111**  
轴功率 zhougonglv1 ------ zhougv1 **\***
效率 xiaolv1 ------ xiaolv1 **\***
气蚀余量 qishiyuliang1 ------- qishi1 **\***

规定流量 guidingliuliang2 ----- Qmid Q2 \***\*111**
规定扬程 guidingyangcheng2 ------ Hmid H2 \***\*111**  
轴功率 zhougonglv2 ------ zhougv2 **\***
效率 xiaolv2 ------ xiaolv2 **\***
气蚀余量 qishiyuliang2 ------- qishi2 **\***

规定流量 guidingliuliang3 ------- Qmax Q3 \***\*111**
规定扬程 guidingyangcheng3 -------- Hmax H3 \***\*111**  
轴功率 zhougonglv3 ------ zhougv3 **\***
效率 xiaolv3 ------ xiaolv3 **\***
气蚀余量 qishiyuliang3 ------ qishi3 **\***

## 测试设置 TestSetting

TestSettingObj {}

基础设置 BasicSetting

    测试精度 Accuracy ----------  testPrecision -> 检测精度
    容差级别 ToleranceLevel ---------  rongchajibi -----> dengji_test  ***

公式设置 FormulaSetting

    转速换算公式 SpeedConversionFormula ----- 传的不是这个值!!

参数设置 ParameterSetting

    重力加速度 GravitationalAcceleration ----------- g
    进水管阻力损失 InletPipeResistanceLoss --------- hc
    潜水泵安装高度 HeightOfSubmersiblePump --------- qsbazgd
    平均次数 AverageNumber ------------------------- avg
    采集周期 AcquisitionCycle  --------------------- time_int (有代码转换)

    去最大值,最小值求平均值 RemoveMaxMinGetAverage(bool) ------ avg = 0
    和值求平均 SumAverage (bool)  ----------------------------- avg = 1

稳定条件设置 StabilitySetting

    	流量,扬程,效率 FlowHeadEfficiency  ---------------------- 未找到
    	转速 Speed												----------------------- 未找到

合格条件 QualifiedConditionsSetting

    合格条件 QualifiedConditions

            tQ ---------- tQz (this.tQzTextBox.Text);
            tH ---------- tHf (this.tHzTextBox.Text);
            tη ---------- tηz (this.tηzTextBox.Text);

波动范围设置 FluctuationSetting

    	波动范围当前值 CurrentValue ------- 未找到
    	波动范围设定值 SetValue	    ------- 未找到

## 其他任务信息 TaskFormBasic

TaskFormBasicObj {}

#### 水泵系数(旧)

    	水密度(查表)									density
    	额定转速											n
    	重力加速度										g
    	进口测压处管径								d1
    	出口测压处管径							  d2
    	进口压力表中心到基准面高度	  z1
    	出口压力表中心到基准面高度	  z2
    	进口扬程修正系数							c1
    	出口扬程修正系数							c2
    	进口扬程损失修正系数					c3
    	进口扬程损失修正系数					C4

#### 参数

RatePower -------- 功率
RateHead -------- 规定扬程
RateFlow -------- 规定流量
RateEffect ------ 效率
RateNPSH --------- 气蚀余量

    {
    	1U:{
    		th_up:0.06,
    		th_down:0.0,
    		tq_up:0.10,
    		tq_down:0.0,
    		tp_up:0.10,
    		te_down:0.0
    	},
    	1E:{
    		th_up:0.03,
    		th_down:-0.03,
    		tq_up:0.05,
    		tq_down:-0.05,
    		tp_up:0.04,
    		te_down:0.0
    	},
    	1B:{
    		th_up:0.03,
    		th_down:-0.03,
    		tq_up:0.05,
    		tq_down:-0.05,
    		tp_up:0.04,
    		te_down:-0.03
    	}
    	2B:{
    		th_up:0.05,
    		th_down:-0.05,
    		tq_up:0.08,
    		tq_down:-0.08,
    		tp_up:0.08,
    		te_down:-0.05
    	},
    	2U:{
    		th_up:0.10,
    		th_down:0.0,
    		tq_up:0.16,
    		tq_down:0.0,
    		tp_up:0.16,
    		te_down:-0.05,
    	},
    	3B:{
    		th_up:0.07,
    		th_down:-0.07,
    		tq_up:0.09,
    		tq_down:-0.09,
    		tp_up:0.09,
    		te_down:-0.07
    	}

    }
```
