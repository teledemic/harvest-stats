import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip } from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import CSVReader from './csvreader';

import './App.css';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      csvfile: undefined
    };
  }
  render() {
    return (
      <div className="App">
        {
          !this.state.stats &&
          <Dropzone accept=".csv" onDrop={this.onDrop.bind(this)}>
            <p>Drop a harvest time export .csv here, or click to browse</p>
          </Dropzone>
        }
        {
          this.state.stats &&
          <div>
            <BarChart width={400} height={400} data={this.state.yearGraph} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <XAxis dataKey="name" />
              <Tooltip />
              <CartesianGrid stroke="#f5f5f5" />
              <Bar dataKey="hours" fill="#ff7300" yAxisId={0} />
              <Bar dataKey="money" fill="#387908" yAxisId={1} />
            </BarChart>
            <CalendarHeatmap classForValue={this.heatmapClassForValue} startDate={this.state.dayGraph.startDate} endDate={this.state.dayGraph.endDate} values={this.state.dayGraph.days} />
          </div>
        }
      </div>
    );
  }
  async onDrop(acceptedFiles, rejectedFiles) {
    if (acceptedFiles) {
      const csv = (await CSVReader.ReadFile(acceptedFiles[0])).slice(1);
      const startDate = new Date(csv[0][0]);
      const endDate = new Date();
      const currentYear = endDate.getFullYear();
      let years = {};
      for (let i = startDate.getFullYear(); i <= currentYear; i++) {
        years[i] = { hours: 0, money: 0, months: {} };
        for (let month = 0; month < 12; month++) {
          years[i].months[month] = { hours: 0, money: 0 };
        }
      }
      // Round down to Sunday
      startDate.setDate(startDate.getDate() - startDate.getDay());
      const startDay = Math.floor(startDate.getTime() / 1000 / 60 / 60 / 24);
      const endDay = Math.floor(endDate.getTime() / 1000 / 60 / 60 / 24);
      let days = new Array(endDay - startDay);
      for (let day = 0; day < endDay - startDay; day++) {
        days[day] = { date: (startDay + day) * 1000 * 60 * 60 * 24, hours: 0, money: 0 };
      }

      for (let row of csv) {
        const date = new Date(row[0]);
        const dayIndex = Math.floor(date.getTime() / 1000 / 60 / 60 / 24) - startDay;
        const hours = Number(row[7]);
        const money = Number(row[15]);
        const year = years[date.getFullYear()];
        const month = year.months[date.getMonth()];
        year.hours += hours;
        year.money += money;
        month.hours += hours;
        month.money += money;
        days[dayIndex].hours += hours;
        days[dayIndex].money += money;
      }
      let yearGraph = [];
      for (let year of Object.keys(years)) {
        yearGraph.push({ name: year, hours: years[year].hours, money: years[year].money });
      }
      this.setState({ yearGraph });
      this.setState({ dayGraph: { startDate, endDate, days } });
      this.setState({ stats: { years, days } });
    }
  }
  heatmapClassForValue(value) {
    if (!value) return 'color-github-0';
    if (!value.hours) return 'color-github-0';
    if (value.hours < 1) return `color-github-1`;
    if (value.hours < 2) return `color-github-2`;
    if (value.hours < 3) return `color-github-3`;
    return `color-github-4`;

  }
}

export default App;
