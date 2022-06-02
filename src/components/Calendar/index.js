import { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import debounce from 'lodash/debounce';
import {
    CaretRightFilled,
    CaretLeftFilled,
    CheckOutlined,
    RollbackOutlined
} from '@ant-design/icons';
import { 
    DatePicker
} from 'antd';

import Calendar from './calendar.js';
import { nextMonth, prevMonth } from '../../utils/date';

import './style.less';
import isFunction from 'lodash-es/isFunction';

const calendarInstance = new Calendar();
const datesHeader = ['一','二','三','四','五','六','日'];

function clearCalendarActiveStatus(dates) {
    for(let i = 0, l = dates.length; i < l; i++){
        const item = dates[i];
        for(let j = 0; j < 7; j++){
            if(item[j].active){
                item[j].active = false;
                return;
            }
        }
    }
}

let calendarChangeDebounce;
export default function Index(props) {

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const [dates, setDates] = useState(calendarInstance.getRows(year, month));
    const [currentMonth, setMonth] = useState(moment());

    useEffect(() => {
        if(isFunction(props.onCalendarChange) && props.debounceTime){
            calendarChangeDebounce =  debounce((date)=> props.onCalendarChange(date), props.debounceTime);
        }
    }, []);

    useEffect(() => {   
        if(props.data){
            const newDates = dates.map(item => {
                return item.map(el => {
                    const _date = moment(el.date).format('YYYY-MM-DD');
                    if(props.data[_date]){
                        return {
                            ...el,
                            plan: props.data[_date],
                        }
                    }
                    return {
                        ...el, 
                        plan: false,
                    };
                })
            })
            setDates(newDates);
        }
    }, [props.data]);

    const handlePickerChange = (date) => {
        const _d = date.toDate();
        var y = _d.getFullYear(), m = _d.getMonth();
        setDates(calendarInstance.getRows(y, m));
        setMonth(date);
        props.onCalendarChange(date._d)
    }

    const handleChangeMonth = (type) => {
        const date = type === 'prev' ? prevMonth(currentMonth.toDate()) : nextMonth(currentMonth.toDate());
        const dateStr = moment(date).format('YYYY-MM');
        const [y,m] = dateStr.split('-');
        setDates(calendarInstance.getRows(y, m-1));
        setMonth(moment(date));
        if(props.debounceTime){
            calendarChangeDebounce && calendarChangeDebounce(date);
        }else{
            props.onCalendarChange && props.onCalendarChange(date);
        }
    }

    const handleCalendarClick = (val) => {
        const { type, date, row, column, plan } = val;

        if(['normal', 'today'].indexOf(type) === -1)return;

        const newDates = dates.slice();
        clearCalendarActiveStatus(newDates);
        newDates[row][column].active = true;
        setDates(newDates);
        props.onDateClick(plan, date);
    }
    
    return (
        <div className='calendar-wrapper'>
            <div className="flexbox calendar-header">
                <div className="prev_month" onClick={() => handleChangeMonth('prev')}>
                    <CaretLeftFilled style={{color: '#ccc'}} />
                </div>
                <div className="flex1 calendar-nav">
                    <DatePicker 
                        picker="month" 
                        onChange={handlePickerChange} 
                        value={currentMonth} 
                        format="YYYY年MM月"
                    />
                </div>
                <div className="next_month" onClick={() => handleChangeMonth('next')}>
                    <CaretRightFilled style={{color: '#ccc'}} />
                </div>
            </div>
            <div style={{position: 'relative'}}>
                <div className="flexbox">
                    {
                        datesHeader.map((item, idx) => <div className="flex1 header-date-item" key={idx}>{item}</div>)
                    }
                </div>
                <div>
                    {
                        dates.map((item, idx) => (
                            <div className="flexbox" key={idx}>
                            {
                                item.map((el, i) => {
                                    const now = new Date();
                                    const activeClass = el.active ? 'active' : '';
                                    const not_current_month = ['normal', 'today'].indexOf(el.type) === -1;
                                    const colorClass = not_current_month ? 'light val' : 'val';
                                    const activeFlagClass = el.date >= now ? 'active' : '';
                                    const planActiveClass = el.plan && (el.date > now ? 'hasplan' : 'hasplan overdate');
                                    
                                    return  <div 
                                                className="flex1 date-item box-center-horizontal" 
                                                key={i} 
                                                onClick={() => handleCalendarClick(el)}
                                                style={{height: not_current_month ? 0 : '6vh'}}
                                            >
                                                <div  
                                                    className={`${colorClass} ${planActiveClass} ${activeClass}`}
                                                >
                                                    {el.text}
                                                </div>
                                                {
                                                    el.type === 'today' && <div className={`flag ${activeFlagClass}`}></div>
                                                }
                                                {
                                                    el.plan && !not_current_month && <Counter data={el.plan} isOverDate={el.date >= now} />
                                                }
                                                {
                                                    el.plan && el.date < now && <Status data={el.plan} />
                                                }
                                            </div>
                                })
                            }
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

function Counter({data, isOverDate}) {
    const num = data.hasOwnProperty('number') ? data.number : data.reduce((acc, item) => acc+item.number, 0);
    return num > 0 && <div className={`count-tag ${isOverDate?'light':''}`}>{num}</div>
}

function Status({data}) {
    if(!Array.isArray(data))return null;
    const [ {get_user_id, status} ] = data;
    if(status === 4){
        if(get_user_id === 0)return <CheckOutlined className="status-icon" style={{color: '#ff4c3f'}} />;
        return <CheckOutlined className="status-icon" style={{color: '#35c791'}} />;
    }else if(status === 6){
        return <RollbackOutlined className="status-icon" style={{color: '#ff4c3f'}} />;
    }
    return null
}