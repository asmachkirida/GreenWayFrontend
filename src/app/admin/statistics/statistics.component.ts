import { Component } from '@angular/core';
import { ApexNonAxisChartSeries, ApexChart, ApexResponsive, ApexLegend, ApexTitleSubtitle } from 'ngx-apexcharts';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  public pieChartOptions: {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    legend: ApexLegend;
    title: ApexTitleSubtitle;
  };

  constructor() {
    this.pieChartOptions = {
      series: [44, 55, 13, 43], // Example data
      chart: {
        width: 380,
        type: 'pie',
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      legend: {
        position: 'right'
      },
      title: {
        text: 'Revenue Distribution'
      }
    };
  }
}
