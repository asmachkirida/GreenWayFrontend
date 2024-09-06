import { Component, OnInit } from '@angular/core';
import { ApexNonAxisChartSeries, ApexChart, ApexResponsive, ApexLegend, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ApexTooltip, ApexDataLabels } from 'ngx-apexcharts';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  rideData: any[] = [];
  chartData: any[] = [];

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

  constructor(private http: HttpClient) {
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
          data: []
        }
      ],
      chart: {
        type: 'bar',
        height: 350
      },
      xaxis: {
        categories: []
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

  ngOnInit(): void {
    this.fetchRideData().subscribe(data => {
      this.rideData = data;
      this.prepareChartData();
      this.updateBarChart();  // Update the bar chart with the new data
    });
  }

  fetchRideData(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/rides');
  }

  prepareChartData(): void {
    const monthlyCounts: { [key: string]: number } = {};
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
    this.rideData.forEach(ride => {
      const date = new Date(ride.date);
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-based index
  
      const key = `${year}-${month}`; // Use year and month to avoid collisions
  
      if (!monthlyCounts[key]) {
        monthlyCounts[key] = 0;
      }
      
      monthlyCounts[key]++;
    });
  
    // Convert to array and sort by year and month
    this.chartData = Object.keys(monthlyCounts).map(key => {
      const [year, month] = key.split('-');
      return {
        month: `${monthNames[parseInt(month, 10)]} ${year}`,
        count: monthlyCounts[key]
      };
    }).sort((a, b) => {
      const [monthA, yearA] = a.month.split(' ');
      const [monthB, yearB] = b.month.split(' ');
  
      // Convert years to numbers
      const yearAInt = parseInt(yearA, 10);
      const yearBInt = parseInt(yearB, 10);
  
      // Convert month names to indices
      const monthIndexA = monthNames.indexOf(monthA);
      const monthIndexB = monthNames.indexOf(monthB);
  
      // Perform arithmetic operations with numbers
      return (yearAInt - yearBInt) || (monthIndexA - monthIndexB);
    });
  }
  

  updateBarChart(): void {
    this.barChartOptions.series = [
      {
        name: 'Rides',
        data: this.chartData.map(d => d.count)
      }
    ];
    this.barChartOptions.xaxis = {
      categories: this.chartData.map(d => d.month)
    };
  }
}
