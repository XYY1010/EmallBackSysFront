<template>
  <div>
    <div class="operationDiv">
      <div class="subDiv">
        <RadioGroup v-model="radioVal" type="button" size="large" @on-change="handleChange">
            <Radio label="本周"></Radio>
            <Radio label="本月"></Radio>
            <Radio label="上个月"></Radio>
        </RadioGroup>
        <span style="float:right; font-size: 18px; font-weight: bold;">
          总销售额：￥{{totalSales}}元
        </span>
      </div>
    </div>
    <div>
      <div style="min-height: 700px; margin-top:20px;"  ref="echart1"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'statistics',
  data() {
    return {
      radioVal: '上周',
      totalSales: 10000,
      option1: {
        title : {
          text: '订单销量统计',
          subtext: 'Emall 商城',
  			},
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross',
                  crossStyle: {
                      color: '#999'
                  }
              }
          },
          toolbox: {
              feature: {
                  dataView: {show: true, readOnly: false},
                  magicType: {show: true, type: ['line', 'bar']},
                  restore: {show: true},
                  saveAsImage: {show: true}
              }
          },
          legend: {
              data:['销售额','销量']
          },
          xAxis: [
              {
                  type: 'category',
                  data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                  axisPointer: {
                      type: 'shadow'
                  }
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  name: '销售额',
                  min: 0,
                  max: 100000,
                  interval: 10000,
                  axisLabel: {
                      formatter: '{value} 元'
                  }
              },
              {
                  type: 'value',
                  name: '销量',
                  min: 0,
                  max: 25,
                  interval: 5,
                  axisLabel: {
                      formatter: '{value} 件'
                  }
              }
          ],
          series: [
              {
                  name:'销售额',
                  type:'bar',
                  data:[]
              },
              {
                  name:'销量',
                  type:'bar',
                  data:[]
              }
          ]
      },
      xAxisData: [],
      seriesSalesData: [],
      seriesAmountData:[]
    }
  },
  methods: {
    getStatistic(){
      this.$axios({
        method:'get',
        url:'/Statistic/getStatistic'
      }).then(res=>{
        this.option1.series[0].data = res.data.data.sales;
        this.option1.series[1].data = res.data.data.items;
      }).catch(error=>{
        this.$Message.error(error);
      });
    },
    initChart() {
      this.chart = this.$echarts.init(this.$refs.echart1);
      // 把配置和数据放这里
      this.chart.setOption(this.option1)
    },
    handleChange(e) {
      this.xAxisData = [];
      this.seriesSalesData = [];
      this.seriesAmountData = [];
      if (e === '本周') {
        for (var i = 6; i >= 0; i--) {
          var curDate = new Date();
          var date = new Date(curDate.getTime() - 24*60*60*1000*i);
          this.xAxisData.push(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
          this.seriesSalesData.push(i*10+i);
          this.seriesAmountData.push(i*2);
        }
      } else if (e === '本月') {
        for (var i = 30; i >= 0; i--) {
          var curDate = new Date();
          var date = new Date(curDate.getTime() - 24*60*60*1000*i);
          this.xAxisData.push(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
          this.seriesSalesData.push(i*5+i);
          this.seriesAmountData.push(i*0.5);
        }
      } else if (e === '上个月') {
        for (var i = 60; i >= 30; i--) {
          var curDate = new Date();
          var date = new Date(curDate.getTime() - 24*60*60*1000*i);
          this.xAxisData.push(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
          this.seriesSalesData.push(i*0.5+i);
          this.seriesAmountData.push(i*0.2);
        }
      }
      this.option1.xAxis[0].data = this.xAxisData.splice(0);
      this.option1.series[0].data = this.seriesSalesData.splice(0);
      this.option1.series[1].data = this.seriesAmountData.splice(0);
      this.initChart();
    }
  },
  mounted() {
    this.getStatistic();
    setTimeout(() => {
      this.initChart();
        }, 500);
    }
}
</script>

<style lang="css" scoped>
.operationDiv {
  width: 100%;
  background-color: #F3F9FE;
}
.subDiv {
  margin: 5px 10px 5px 10px;
  padding: 10px 5px 10px 5px;
}
</style>
