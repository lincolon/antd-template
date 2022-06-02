import {
  formatDate,
  parseDate,
  getWeekNumber,
  isDate,
  clearMilliseconds,
  clearTime,
  prevYear,
  nextYear,
  prevMonth,
  nextMonth,
  prevDate,
  nextDate,
  getFirstDayOfMonth,
  getStartDateOfMonth,
  getDayCountOfMonth
} from './calendar.options.js';

class DatePicker {
  constructor(){
    this.tableRows = [ [], [], [], [], [], [] ];
    this.maxDate;
    this.minDate;
    this.disabledDate = {};
    this.selectedDate = [];
    this.value = {};
    this.firstDayPosition;
    this.offset = this.offsetDay(this.offsetWeek || 1);
    this.year;
    this.month;
  }

  offsetDay(week) {
    return week > 3 ? 7 - week : -week;
  }

  resetDate(){
    this.tableRows = [ [], [], [], [], [], [] ];
  }

  getRows(year, month) {
    this.resetDate();
    this.year = year;
    this.month = month;
    //当月1号
    const date = new Date(year, month, 1);
    //上月1号
    let prevMth = prevMonth(date);
    //这个月多少天
    const dateCountOfMonth = getDayCountOfMonth(date.getFullYear(), date.getMonth());
    //上个月多少天
    const dateCountOfLastMonth = getDayCountOfMonth(date.getFullYear(), (date.getMonth() === 0 ? 11 : date.getMonth() - 1));

    //当月1号是星期几
    let day = getFirstDayOfMonth(date); 
    day = (day === 0 ? 7 : day);
    const rows = this.tableRows;
    let count = 1;
    let firstDayPosition;

    const startDate = getStartDateOfMonth(year, month);
    const disabledDate = this.disabledDate;
    const selectedDate = this.selectedDate || this.value;
    const now = clearTime(new Date());

    for (let i = 0; i < 6; i ++) {
      const row = rows[i];

      if (this.showWeekNumber) {
        if (!row[0]) {
          row[0] = { type: 'week', text: getWeekNumber(nextDate(startDate, i * 7 + 1)) };
        }
      }

      for (let j = 0; j < 7; j++) {
        let cell = row[this.showWeekNumber ? j + 1 : j];
        if (!cell) {
          cell = { row: i, column: j, type: 'normal', inRange: false, start: false, end: false };
        }

        cell.type = 'normal';

        const index = i * 7 + j;//
        const time = nextDate(startDate, index - this.offset);
        cell.inRange =this.minDate && this.maxDate && time >= clearTime(this.minDate) && time <= clearTime(this.maxDate);
        cell.start = this.minDate && time === clearTime(this.minDate);
        cell.end = this.maxDate && time === clearTime(this.maxDate);

        if (i >= 0 && i <= 1) {
          if (j + i * 7 >= (day + this.offset)) {
            cell.text = count++;
            cell.date = new Date(year, month, cell.text);
            if (count === 2) {
              firstDayPosition = i * 7 + j;
            }
          } else {
            cell.text = dateCountOfLastMonth - Math.abs(day + this.offset - (i * 7 + j + 1));
            cell.type = 'prev-month';
            cell.date = new Date(prevMth.getFullYear(), prevMth.getMonth(), cell.text)
          }
        } else {
          if (count <= dateCountOfMonth) {
            cell.text = count++;
            cell.date = new Date(year, month, cell.text);
            if (count === 2) {
              firstDayPosition = i * 7 + j;
            }
          } else {
            cell.text = count++ - dateCountOfMonth;
            cell.type = 'next-month';
            cell.date = nextMonth(new Date(year, month, cell.text));
          }
        }

        if (now.getTime() === clearTime(cell.date).getTime()) {
          cell.type = 'today';
        }

        let newDate = new Date(time);
        cell.disabled = typeof disabledDate === 'function' && disabledDate(newDate);
        cell.selected = Array.isArray(selectedDate) &&
          selectedDate.filter(date => date.toString() === newDate.toString())[0];

        row.push(cell) 
      }

    }

    this.firstDayPosition = firstDayPosition;

    // console.log(rows);

    return rows;
  }

  // initPlan(data){
  //   let project = data || []
  // }

  setPlans(plans){
    this.resetDate();
    this.selectedDate = plans;
    return this.getRows(this.year, this.month)
  }
}

export default DatePicker;