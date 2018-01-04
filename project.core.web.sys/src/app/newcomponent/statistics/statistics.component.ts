import { Component, OnInit } from "@angular/core";
import { fadeIn } from "./../../common/animations";

@Component({
  selector: "app-statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.scss"],
  animations: [fadeIn]
})
export class StatisticsComponent implements OnInit {
  options: { elements: { line: { tension: number; }; }; };

  chartColors: { red: string; orange: string; yellow: string; green: string; blue: string; purple: string; grey: string; };
  weeks: string[];

  lineData: any;

  constructor() { 
    this.chartColors = {
      red: 'rgba(255, 99, 132, .5)',
      orange: 'rgba(255, 159, 64, .5)',
      yellow: 'rgba(255, 205, 86, .5)',
      green: 'rgba(75, 192, 192, .5)',
      blue: 'rgba(54, 162, 235, .5)',
      purple: 'rgba(153, 102, 255, .5)',
      grey: 'rgba(201, 203, 207, .5)'
    };
    this.weeks = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    this.lineData = {
      labels: this.weeks,
      datasets: [

        {
          label: 'The First Week',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          backgroundColor: this.chartColors.blue,
          borderColor: this.chartColors.blue
        },
        {
          label: 'The Second Week',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          backgroundColor: this.chartColors.red,
          borderColor: this.chartColors.red
        },
        {
          label: 'The Third Week',
          data: [20, 38, 60, 29, 420, 47, 30],
          fill: false,
          backgroundColor: this.chartColors.yellow,
          borderColor: this.chartColors.yellow
        }
      ]

    };
    //默认是曲线，可以设置直线，如数据量大性能不好，可改用直线提升性能
    this.options = {
      elements: {
        line: {
          tension: 0, // disables bezier curves
        }
      }
    }
   }

  ngOnInit() {
  }

}
