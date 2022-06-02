import isFunction from "lodash-es/isFunction";
import React, { useRef, useState } from "react";
import { Input, Select } from 'antd';

function getYear(y) {
  return !y ? '' : y;
}

function formatDate(d) {
  return d ? (+d < 10 ? `0${+d}` : d) : '';
}

function inputFocus(ref) {
  ref.current.focus();
}

export default function DateFormPicker({value, onChange, hiddenLunar}){

    const { date, type } = value;
  
    const isEdit = date && date !== '';
  
    const [ year, month, day ] = isEdit && date.split('-') || [null, null, null];
  
    const yearRef = useRef('year');
    const monthRef = useRef('month');
    const dayRef = useRef('day');
  
    const [ state, setState ] = useState({
      type: type || 1,
      year,
      month,
      day
    })
  
    const handleChange = (name, val) => {
      const newState = {
        ...state,
        [name]: val
      }
      setState(newState);
      onChange({
        type: newState.type,
        date: `${getYear(newState.year)}-${formatDate(newState.month)}-${formatDate(newState.day)}`
      });
    }
  
    const handleBlur = (name, ev) => {
      const val = ev.target.value;
      const newState = {
        ...state,
        [name]: val
      }
      // setState(newState);
      // console.log(newState)
      onChange({
        type: state.type,
        date: `${getYear(newState.year)}-${formatDate(newState.month)}-${formatDate(newState.day)}`
      });
    }
  
    const handleInputChange = (name, next, ev) => {
      const reg = {
        year_input: /^\d{1,4}$/,
        year: /^\d{4}$/,
        month_input: /^\d{1,2}$/,
        month: /^\d{2}$/,
        day_input: /^\d{1,2}$/,
        day: /^\d{2}$/,
      }
      const val = ev.target.value;
      if(val === '' || new RegExp(reg[`${name}_input`]).test(val)){
        setState({
          ...state,
          [name]: val
        })
      }
      
      if(new RegExp(reg[name]).test(val)){
        if(next && isFunction(next))next();
      }
    }
  
    return (
      <Input.Group compact>
        {
          !hiddenLunar && 
          <Select 
            style={{width: 70}} 
            defaultValue={state.type} 
            onChange={handleChange.bind(null, 'type')}
            options={[
              {label: '阳历', value: 1},
              {label: '阴历', value: 2},
            ]}
          />
        }
        <Input
          ref={yearRef}
          style={{width: 80}} 
          placeholder="年"
          onBlur={handleBlur.bind(null, 'year')}
          onChange={handleInputChange.bind(null, 'year', inputFocus.bind(null, monthRef))}
          value={state.year}
        />
        <Input
          ref={monthRef}
          style={{width: 60}} 
          placeholder="月" 
          value={state.month}
          onBlur={handleBlur.bind(null, 'month')}
          onChange={handleInputChange.bind(null, 'month', inputFocus.bind(null, dayRef))}
        />
        <Input
          ref={dayRef}
          style={{width: 60}} 
          placeholder="日"
          value={state.day}
          onBlur={handleBlur.bind(null, 'day')}
          onChange={handleInputChange.bind(null, 'day', null)}
         />
      </Input.Group>
    )
  }