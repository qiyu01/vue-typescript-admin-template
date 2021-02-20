<template>
  <div class="finance">
    <div class="finance-total">
      <cards :cardlist="cardList" />
      <div class="analysis">
        <div class="analysis-filter">
          <div class="analysis-title">趋势对比分析图</div>
          <el-radio-group
            v-model="range"
            class="tab"
            size="medium"
            @change="rangeChange"
          >
            <el-radio-button label="1">近7日</el-radio-button>
            <el-radio-button label="2">近30日</el-radio-button>
            <el-radio-button label="3">自定义</el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-show="timeShow"
            ref="time"
            v-model="time"
            size="medium"
            class="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="timeChange"
          />
        </div>
        <div class="analysis-radio">
          <el-radio-group v-model="type" @change="radioChange">
            <el-radio
              v-for="(item, i) in radioText"
              :key="i"
              :label="item.label"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </div>
        <div v-loading="loading" class="analysis-chart">
          <div ref="main" style="max-width:1620px;height:500px;" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import echarts, { EChartOption } from 'echarts'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'

import { Component, Watch, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import Cards from './components/Cards.vue'
import { getTrendChartInfo } from '@/api/finance'
// import EditorDashboard from "./editor/index.vue";

export interface Queryparams {
  type?: number
  endDateTime: string
  [x: string]: any // 动态添加属性
}
let _minTime: any = null
let _maxTime: any = null
const _nowTime: any = new Date().getTime()
var seriesData: any[] = []
var seriesData2: any[] = []
const animationDuration = 6000
// vue-property-decorator
// vue: 实际上就是 Vue 本身,继承vue相关属性和函数

// @Component 声明成一个vue的组件实例，如果不使用，则不能得到一个vue组件
// @Component 装饰器可以接收一个对象作为参数，可以在对象中声明 components ，filters，directives等未提供装饰器的选项
@Component({
  name: 'Dashboard',
  components: {
    Cards
  }
})
export default class extends mixins(ResizeMixin) {
  @Watch('options', { deep: true })
  private onOptionsChange(value: EChartOption) {
    this.setOptions(value)
  }

  private currentRole = 'admin-dashboard';
  private cardList = [
    {
      name: '总流水',
      sum: '00.00',
      tip: '去掉商家补贴后的GMV（用户实付+平台补贴）'
    },
    {
      name: '可提现',
      sum: '00.00',
      tip:
        '待结算订单（订单状态已完成）三天后变为已结算订单，先转入每个店铺“不可提现部分”超过部分可提现，“可提现”是可提现部分金额之和'
    },
    {
      name: '不可提现',
      sum: '00.00',
      tip:
        '创建店铺时填入每个店铺的不可提现收入，如果该部分不满，订单收入先转入。“不可提现”是实际不可提现收入之和'
    },
    {
      name: '平台补贴',
      sum: '00.00',
      tip: '已支付的订单平台补贴之和（按商品计算）'
    },
    {
      name: '店铺补贴',
      sum: '00.00',
      tip: '已支付的订单店铺补贴之和（按商品计算）'
    },
    {
      name: '服务费',
      sum: '00.00',
      tip: '已支付的每个订单服务费之和（按每单计算）'
    },
    {
      name: '已结算',
      sum: '00.00',
      tip: '(订单状态已完成)三天后变为已结算订单'
    },
    {
      name: '待结算',
      sum: '00.00',
      tip:
        '用户已支付的订单金额，去除掉已结算订单金额后的金额和。15天未核销则自动核销'
    }
  ];

  private range = '1';
  private type = 1; // 1总流水，2服务费，3平台补贴...
  private time = '';
  private timeShow = false;
  private loading = false;
  private pickerOptions = {
    onPick(time: any) {
      // console.log(time.minDate.getTime())

      // 如果选择了只选择了一个时间
      if (!time.maxDate) {
        const timeRange = 124 * 24 * 60 * 60 * 1000 // 124天
        _minTime = time.minDate.getTime() - timeRange // 最小时间
        _maxTime = time.minDate.getTime() + timeRange // 最大时间
        // 如果选了两个时间，那就清空本次范围判断数据，以备重选
      } else {
        _minTime = _maxTime = null
      }
    },
    disabledDate(time: any) {
      if (_minTime && _maxTime) {
        return (
          time.getTime() < _minTime ||
          time.getTime() > _nowTime ||
          time.getTime() > _maxTime
        )
      } else {
        return time.getTime() > _nowTime
      }
    }
  };

  private radioText = [
    { name: '总流水', label: 1 },
    { name: '服务费', label: 2 },
    { name: '平台补贴', label: 3 },
    { name: '订单数', label: 4 },
    { name: '可提现', label: 5 },
    { name: '核销订单数', label: 6 }
  ];

  private options = {
    title: {
      text: ''
    },
    tooltip: {
      extraCssText: 'box-shadow:0px 1px 4px rgba(0,0,0,0.3);',
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,1)',
      //   borderWidth: "1",
      //   borderColor: "gray",
      formatter: function(params: any) {
        // console.log(params)
        var index = params[0].dataIndex
        var name = params[0].seriesName
        var status = 0
        // console.log(seriesData[index], seriesData[index - 1])
        var num = seriesData[index] - seriesData[index - 1]

        if (index === 0 || seriesData[index] === seriesData[index - 1]) {
          status = 0
        } else if (num > 0) {
          status = 1
        } else if (num < 0) {
          status = 2
        }
        // console.log(status)
        var text = `<span class="tooldate" >${moment(seriesData2[index]).format(
          'M月D日'
        )}</span>
                        <div class="toolsum">
                          <div class="toolleft">
                             <span class="tooltotal" >${name}</span><br/>
                             <span class="toolup"  style="color: #666;">比前1日</span>
                          </div>
                        `
        var up = ''
        var upsum =
          name === '订单数' || name === '核销订单数'
            ? seriesData[index] - seriesData[index - 1]
            : (seriesData[index] - seriesData[index - 1]).toFixed(2)
        var downsum =
          name === '订单数' || name === '核销订单数'
            ? seriesData[index - 1] - seriesData[index]
            : (seriesData[index - 1] - seriesData[index]).toFixed(2)
        if (status === 2) {
          up = `<div><span class="tooldata">${seriesData[index]}</span><br/><span class="toolupgreen" style="color: green;">↓${downsum}</span></div>`
        } else if (status === 1) {
          up = `<div><span class="tooldata">${seriesData[index]}</span><br/><span class="toolupred" style="color: #f85340;">↑${upsum}</span></div>`
        } else {
          up = `<div><span class="tooldata">${seriesData[index]}</span><br/><span style="color: #666;">-</span></div>`
        }

        return text + up + '</div>'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      height: '80%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
      axisLabel: {
        show: true,
        interval: 0,
        rotate: -45,
        margin: 10
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      splitNumber: 4
    },
    series: [
      {
        name: '总流水',
        type: 'line',
        showSymbol: false,
        smooth: true,
        data: [],
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(251,176,59,1)'
            },
            {
              offset: 1,
              color: 'rgba(251,176,59,0)'
            }
          ]),
          opacity: '0.2'
        },
        itemStyle: {
          color: '#FBB03B', // 改变折线点的颜色
          opacity: '0.5',
          lineStyle: {
            color: '#FBB03B', // 改变折线颜色
            opacity: '0.5'
          }
        }
      }
    ]
  };

  //   get roles() {
  //     return UserModule.roles;
  //   }

  mounted() {
    // console.log(this.$el as HTMLDivElement);

    this.initChart()
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }

  private rangeChange(label: string) {
    // 7日，30日，自定义单选
    var params: Queryparams = {
      type: this.type,
      endDateTime: moment().format('YYYY-MM-DDT23:59:59')
    }
    if (label === '3') {
      if (this.time) {
        // 选择了自定义时间
        params.beginDateTime = moment(this.time[0]).format(
          'YYYY-MM-DDT00:00:00'
        )
        params.endDateTime = moment(this.time[1]).format('YYYY-MM-DDT23:59:59')
        this.timeShow = true
        this.getChartInfo(params)
      } else {
        // 选择了自定义但是没选时间，默认7日
        this.timeShow = true
      }
    } else if (label === '2') {
      // 近30日
      this.timeShow = false
      params.beginDateTime = moment()
        .subtract(29, 'days')
        .format('YYYY-MM-DDT00:00:00')
      this.getChartInfo(params)
    } else {
      // 近7日
      this.timeShow = false
      params.beginDateTime = moment()
        .subtract(6, 'days')
        .format('YYYY-MM-DDT00:00:00')
      this.getChartInfo(params)
    }
  }

  private timeChange() {
    if (this.time) {
      var params: Queryparams = {
        beginDateTime: moment(this.time[0]).format('YYYY-MM-DDT00:00:00'),
        endDateTime: moment(this.time[1]).format('YYYY-MM-DDT23:59:59')
      }
      this.getChartInfo(params)
    }
  }

  private radioChange(label: string) {
    // 总流水，服务费，补贴。。。单选
    var params: Queryparams = {
      type: Number(label),
      endDateTime: moment().format('YYYY-MM-DDT23:59:59')
    }
    if (this.range === '3') {
      if (this.time) {
        // 选择了自定义时间
        params.beginDateTime = moment(this.time[0]).format(
          'YYYY-MM-DDT00:00:00'
        )
        params.endDateTime = moment(this.time[1]).format('YYYY-MM-DDT23:59:59')
      } else {
        // 选择了自定义但是没选时间，默认7日
        params.beginDateTime = moment()
          .subtract(6, 'days')
          .format('YYYY-MM-DDT00:00:00')
      }
    } else if (this.range === '2') {
      // 近30日
      params.beginDateTime = moment()
        .subtract(29, 'days')
        .format('YYYY-MM-DDT00:00:00')
    } else {
      // 近7日
      params.beginDateTime = moment()
        .subtract(6, 'days')
        .format('YYYY-MM-DDT00:00:00')
    }
    this.getChartInfo(params)
  }

  private async getChartInfo(params?: Queryparams) {
    this.loading = true
    var obj: Queryparams = {
      type: this.type,
      beginDateTime: moment()
        .subtract(6, 'days')
        .format('YYYY-MM-DDT00:00:00'),
      endDateTime: moment().format('YYYY-MM-DDT23:59:59')
    }
    if (params) {
      Object.assign(obj, params)
    }

    // console.log(obj)
    // this.setChartData([], obj.beginDateTime, obj.endDateTime)
    const { data } = await getTrendChartInfo(obj)
    // console.log(data);

    if (data.data) {
      this.setChartData(data.data, obj.beginDateTime, obj.endDateTime)
      this.loading = false
    } else {
      // 没有数据的时候处理
      this.setChartData([], obj.beginDateTime, obj.endDateTime)
      this.loading = false
    }
  }

  private setChartData(res: any[], start: string, end: string) {
    var day = moment(end).diff(moment(start), 'days')
    // console.log(day)

    // interval为x轴的间隔
    var interval: number
    if (day <= 31) {
      interval = 0
    } else if (day <= 62) {
      interval = 1
    } else if (day <= 93) {
      interval = 2
    } else {
      interval = 3
    }
    var arr1: any[] = []
    var arr2: any[] = []
    if (res) {
      var cur = moment(start)
      var zero = true
      arr1.push(cur.format('M-D'))
      //   console.log(res);
      for (let i = 0; i < res.length; i++) {
        // 需要先执行一次把第1天的数据添加进去（下面一个循环是从第二天开始的）
        if (res[i].dateValue === cur.format('YYYY-MM-DD')) {
          arr2.push(res[i].dataValue)
          zero = false
          break
        }
      }
      zero ? arr2.push(0) : (zero = true) // zero为真说明后端这一天的值没有返回就是0，否则重置zero以便下一次循环
      for (let j = 0; j < day; j++) {
        cur = cur.add(1, 'days')
        arr1.push(cur.format('M-D'))
        for (let i = 0; i < res.length; i++) {
          if (res[i].dateValue === cur.format('YYYY-MM-DD')) {
            arr2.push(res[i].dataValue)
            zero = false
            break
          }
        }
        zero ? arr2.push(0) : (zero = true)
      }
      //   console.log(arr2);
      if (this.type === 5) {
        // 可提现是累加的,需要对arr2进行处理
        if (Number(arr2[0]) === 0) {
          // 后端返回的res里第一个值是当前选择日期的第一天的前一天值（约定），如果第一天的值是0，那就把第一天的值设置为前一天的值（累加），（否则说明这天有返回值，后端返回的已经是累加的了，不需要改动）
          arr2[0] = res[0].dataValue
        }
        var val = Number(arr2[0])
        for (let k = 1; k < arr2.length; k++) {
          if (Number(arr2[k]) === 0) {
            // 这一天后端返回0，值是前一天的（累加）
            arr2[k] = val
            // console.log(this.type);
          } else {
            // 不是0.说明这天的有返回值，后端返回的已经是累加的了，不需要再累加一遍。储存给val以便下一次0时候累加
            val = arr2[k]
          }
        }
      }
      //   console.log(arr2);
    }
    var name!: string
    for (var i of this.radioText) {
      if (i.label === this.type) {
        name = i.name
      }
    }
    // console.log(name)

    this.$set(this.options.series[0], 'name', name)
    this.$set(this.options.xAxis.axisLabel, 'interval', interval)
    this.$set(this.options.xAxis, 'data', arr1)
    this.$set(this.options.series[0], 'data', arr2)
    // console.log(this.options)

    // this.options.series[0].name = name
    seriesData = arr2
    seriesData2 = arr1
  }

  private initChart() {
    this.getChartInfo()
    this.chart = echarts.init(this.$refs.main as HTMLDivElement)
    this.chart.setOption(this.options as EChartOption)
  }

  private setOptions(options: EChartOption) {
    if (this.chart) {
      this.chart.setOption(options as EChartOption)
    }
  }
}
</script>

<style lang="scss">
.finance {
  background-color: #f0f0f0;
  .tooldate {
    color: #666;
    width: 100px;
    display: inline-block;
    margin-bottom: 10px;
  }
  .toolsum {
    display: flex;
    // background-color: #fff;
  }
  .toolleft {
    min-width: 60px;
    margin-right: 10px;
  }
  .tooltotal {
    color: #666;
    // display: inline-block;
    // max-width:80px ;
    // text-align: center;
    margin-bottom: 3px;
  }
  .tooldata {
    margin-bottom: 3px;
  }
  .analysis {
    background-color: #fff;
    border-radius: 4px;
    &-filter {
      display: flex;
      height: 60px;
      padding-top: 20px;
      align-items: center;
      padding-left: 20px;
      .analysis-title {
        font-size: 14px;
        margin-right: 20px;
      }
      .tab {
        margin-right: 20px;
        margin-top: -1px;
        .el-radio-button.is-active {
          .el-radio-button__inner {
            background-color: rgba(248, 83, 64, 0.1) !important;
            color: #f85340;
            border: solid 1px rgba(248, 83, 64, 0.6) !important;
            box-shadow: rgba(248, 83, 64, 0.15) -1px 0px 0px 0px !important;
          }
        }
        .el-radio-button {
          .el-radio-button__inner {
            border: 1px solid #dcdfe6;
          }
        }
      }
    }
    &-radio {
      text-align: center;
      margin-top: 20px;
    }
    &-chart {
      height: 500px;
    }
  }
}
</style>
