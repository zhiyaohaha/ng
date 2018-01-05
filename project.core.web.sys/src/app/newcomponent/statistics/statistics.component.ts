import { Component, OnInit } from "@angular/core";
import { fadeIn } from "./../../common/animations";
import * as echarts from 'echarts';


@Component({
  selector: "app-statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.scss"],
  animations: [fadeIn]
})
export class StatisticsComponent implements OnInit {
  showTab: number = 1;
  data: Array<any> = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

  constructor() {
  }

  ngOnInit() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));

    // 指定图表的配置项和数据
    var option = {
      tooltip: {
        trigger: 'axis'
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataZoom: { show: true },
          dataView: { show: true },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      dataZoom: {
        type: 'slider',
        startValue: 1500,
        endValue: 1487
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: function () {
            var list = [];
            var n = 0;
            while (n++ < 1500) {
              var string = `2017.12.${n}`
              list.push(string);
            }
            return list;
          }(),

        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'dz',
          type: 'line',
          data: function () {
            var list = [];
            for (var i = 1; i <= 1500; i++) {
              list.push(Math.round(Math.random() * 30));
            }
            return list;
          }()
        }
      ],
      calculable: false
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }

  changeTabOne() {
    this.showTab = 1;
    //this.data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  }
  changeTabTwo() {
    this.showTab = 2;
    //this.data = [20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1];
  }
  changeTabThree() {
    this.showTab = 3;
  }
}
