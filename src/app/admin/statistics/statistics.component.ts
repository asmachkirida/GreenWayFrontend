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
  bikeRideData: any[] = [];
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
      series: [44, 55, 13, 43], 
      chart: { width: 380, type: 'pie' },
      responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' }}}],
      legend: { position: 'right' },
      title: { text: 'Revenue Distribution' },
      colors: ['#9b7f56', '#8b9384', '#d0d0d0', '#e0e0e0']
    };

    this.barChartOptions = {
      series: [{ name: 'Rides', data: [] }],
      chart: { type: 'bar', height: 350 },
      xaxis: { categories: [] },
      yaxis: { title: { text: 'Number of Rides' }},
      title: { text: 'Monthly Rides' },
      colors: ['#9b7f56'],
      dataLabels: { enabled: false },
      tooltip: { shared: true, intersect: false }
    };

    this.lineChartOptions = {
      series: [{ name: 'Bike Rides', data: [] }],
      chart: { type: 'line', height: 350 },
      xaxis: { categories: [] },
      yaxis: { title: { text: 'Number of Bike Rides' }},
      title: { text: 'Weekly Bike Rides' },
      colors: ['#8b9384'],
      dataLabels: { enabled: false },
      tooltip: { shared: true, intersect: false }
    };
  }

  ngOnInit(): void {
    this.fetchRideData().subscribe(data => {
      this.rideData = data;
      this.prepareChartData();
      this.updateBarChart();
    });

    this.fetchBikeRideData().subscribe(data => {
      this.bikeRideData = data;
      this.updateLineChart();
    });
  }

  fetchRideData(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/rides');
  }

  fetchBikeRideData(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/bike-rides');
  }

  prepareChartData(): void {
    const monthlyCounts: { [key: string]: number } = {};
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    this.rideData.forEach(ride => {
      const date = new Date(ride.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const key = `${year}-${month}`;
      if (!monthlyCounts[key]) monthlyCounts[key] = 0;
      monthlyCounts[key]++;
    });

    this.chartData = Object.keys(monthlyCounts).map(key => {
      const [year, month] = key.split('-');
      return {
        month: `${monthNames[parseInt(month, 10)]} ${year}`,
        count: monthlyCounts[key]
      };
    }).sort((a, b) => {
      const [monthA, yearA] = a.month.split(' ');
      const [monthB, yearB] = b.month.split(' ');
      return (parseInt(yearA) - parseInt(yearB)) || (monthNames.indexOf(monthA) - monthNames.indexOf(monthB));
    });
  }

  updateBarChart(): void {
    this.barChartOptions.series = [{ name: 'Rides', data: this.chartData.map(d => d.count) }];
    this.barChartOptions.xaxis = { categories: this.chartData.map(d => d.month) };
  }

  updateLineChart(): void {
    const weeklyCounts: { [key: string]: number } = {};
    const getWeekOfYear = (date: Date) => {
      const start = new Date(date.getFullYear(), 0, 1);
      return Math.ceil((((date as any) - (start as any)) / 86400000 + start.getDay() + 1) / 7);
    };

    this.bikeRideData.forEach(ride => {
      const date = new Date(ride.date);
      const week = getWeekOfYear(date);
      const key = `${date.getFullYear()}-Week-${week}`;
      if (!weeklyCounts[key]) weeklyCounts[key] = 0;
      weeklyCounts[key]++;
    });

    const sortedData = Object.keys(weeklyCounts).sort().map(week => ({
      week,
      count: weeklyCounts[week]
    }));

    this.lineChartOptions.series = [{ name: 'Bike Rides', data: sortedData.map(d => d.count) }];
    this.lineChartOptions.xaxis = { categories: sortedData.map(d => d.week) };
  }
}
