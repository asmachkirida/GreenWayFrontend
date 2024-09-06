import { Component } from '@angular/core';
import { ApexNonAxisChartSeries, ApexChart, ApexResponsive, ApexLegend, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ApexTooltip, ApexDataLabels } from 'ngx-apexcharts';

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
    colors: string[];
  };

  public barChartOptions: {
    series: any;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    colors: string[];
    title: ApexTitleSubtitle;
    dataLabels: ApexDataLabels;
    tooltip: ApexTooltip;
  };

  public lineChartOptions: {
    series: any;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    colors: string[];
    title: ApexTitleSubtitle;
    dataLabels: ApexDataLabels;
    tooltip: ApexTooltip;
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
      },
      colors: ['#9b7f56', '#8b9384', '#d0d0d0', '#e0e0e0'] // Example colors
    };

    this.barChartOptions = {
      series: [
        {
          name: 'Rides',
          data: [30, 40, 35, 50, 49, 60, 70]
        }
      ],
      chart: {
        type: 'bar',
        height: 350
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      },
      yaxis: {
        title: {
          text: 'Number of Rides'
        }
      },
      title: {
        text: 'Monthly Rides'
      },
      colors: ['#9b7f56'],
      dataLabels: {
        enabled: false
      },
      tooltip: {
        shared: true,
        intersect: false
      }
    };

    this.lineChartOptions = {
      series: [
        {
          name: 'Bike Rides',
          data: [20, 40, 60, 80, 100, 120, 140]
        }
      ],
      chart: {
        type: 'line',
        height: 350
      },
      xaxis: {
        categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']
      },
      yaxis: {
        title: {
          text: 'Number of Rides'
        }
      },
      title: {
        text: 'Weekly Bike Rides'
      },
      colors: ['#8b9384'],
      dataLabels: {
        enabled: false
      },
      tooltip: {
        shared: true,
        intersect: false
      }
    };
  }
}
