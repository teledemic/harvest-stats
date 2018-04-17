import React, { Component } from "react";

import "./YearHeatmap.css";

export class YearHeatmap extends Component {
	constructor(props, context) {
		super(props, context);
		this.days = [];
		const startDay = new Date(this.props.year, 0, 1);
		for (let i = 0; i < startDay.getDay(); i++) {
			this.days.push(null);
		}
		while (startDay.getFullYear() === this.props.year) {
			this.days.push({
				date: startDay.toLocaleDateString(),
				hours: 0,
				money: 0,
			});
			startDay.setDate(startDay.getDate() + 1);
		}
		for (let i = 0; i < (7 - startDay.getDay()); i++) {
			this.days.push(null);
		}
		for (let day of this.props.days) {
			const date = new Date(day.date);
			if (date.getFullYear() === this.props.year) {
				const dayOfYear = this.getDayOfYear(date);
				this.days[dayOfYear] = day;
			}
		}
		if (this.days.length % 7 !== 0) throw new Error("Got uneven number of weeks");
		this.weeks = [];
		for (let i = 0; i < this.days.length / 7; i++) {
			this.weeks.push(this.days.slice(i * 7, (i * 7) + 7));
		}
		console.log(this.weeks);
	}
	getDayOfYear(date) {
		var start = new Date(date.getFullYear(), 0, 0);
		var diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
		var oneDay = 1000 * 60 * 60 * 24;
		var day = Math.floor(diff / oneDay);
		return day;
	}
	binColor(day) {
		if (!day) return "inherit";
		return "rgb(" + day.hours * 8 + "," + day.hours * 8 + ", 0)";
	}
	render() {
		return (
			<div className="year">
				{
					this.weeks.map((week, weekIdx) =>
						<div className="week" key={weekIdx}>
							{
								week.map((day, dayIdx) =>
									<div className="day" key={dayIdx} style={{ backgroundColor: this.binColor(day) }}>
										
									</div>
								)
							}
						</div>
					)
				}
			</div>
		);
	}
}