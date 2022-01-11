import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Cascader, Checkbox, Divider, Tree } from 'antd';
import { getAllAreas } from '@service/common';
import * as division from '../../utils/division';

import './style.less';

function getDefaultChecks(data, targetId) {
    return data.filter(item => item.product_ids && item.product_ids.includes(targetId)).map(item => item.id);
}

let cacheData = null, currentCity;

export default function AreasSelector({withContainers, onChange, value, product_id, city}) {

    const [ data, setData ] = useState([]);
    const [ areasValue, setAreasValue ] = useState([]);

    const getData = useCallback(async (val) => {
        const res = await getAllAreas({province: val[0], city: val[1]});
        const resData = res.data.map(item => ({
            label: item.title,
            value: item.title,
            withContainers,
            children: item.children.map(el => ({
                label: el.title, 
                value: !withContainers ? el.id : el.title, 
                checkable: true,
                checkedValues: !withContainers ? [] : getDefaultChecks(el.children, product_id),
                children: withContainers ? el.children.map(item => ({label: item.title, value: item.id})) : []
            }))
        }))
        currentCity = val.join('_');
        setData(resData);
    }, [product_id])

    useEffect(() => {
        const initialCity = city || ['湖北省', '武汉市'];
        cacheData = {};
        if(!withContainers && value){
            let area_ids = [];
            cacheData = value;
            for(const k in value){
                area_ids = area_ids.concat(value[k].map(item => item.value));
                cacheData[k] = value[k].map(item => item.value);
            }
            setAreasValue(area_ids);
        }
        getData(initialCity);
        return () => {
            cacheData = null;
            currentCity = '';
        }
    }, [])

    const handleContainerChange = (val, key) => {
        cacheData[key] = val;
        var values = [];
        for(let k in cacheData){
            values = values.concat(cacheData[k])
        }
        onChange(values);
    }

    const handleCommunityChange = (val, key) => {
        cacheData[key] = val;
        var ids = [], values = {};
        for(let k in cacheData){
            ids = ids.concat(cacheData[k])
        }
        data.forEach(item => {
            item.children.forEach(el => {
                if(ids.includes(el.value)){
                    if(!values[item.label]){
                        values[item.label] = [{label: el.label, value: el.value}]
                    }else{
                        values[item.label].push({label: el.label, value: el.value})
                    }
                }
            })
        })
        setAreasValue(ids);
        onChange({
            title: currentCity,
            community: values
        })
    }
    
    return (
        <section className="">
            <div className="cascader-wrapper">
                <Cascader
                    placeholder="选择省市" 
                    options={division.cityOptions} 
                    onChange={getData} 
                    defaultValue={city || ['湖北省','武汉市']}
                />
            </div>
            <div className="cascader-options-wrapper tree-wrapper">
                {
                   data.map(item => {
                       return (
                           <div className="tree-item" key={item.value}>
                                <div>
                                    <h4>{item.label}</h4>
                                </div>
                                {
                                    item.withContainers ? 
                                    item.children.map(el => <Item key={el.value} value={el.checkedValues} onChange={(val) => handleContainerChange(val, `${item.label}${el.label}`)} data={el} />) :
                                    <div className="flexbox tree-node">
                                        <Checkbox.Group 
                                            options={item.children} 
                                            value={areasValue}
                                            onChange={(val) => {
                                                handleCommunityChange(val, `${item.label}`)
                                            }} 
                                        />
                                    </div>
                                }
                           </div>
                       )
                   }) 
                }
            </div>
        </section>
    )
}

function Item({data, value, onChange}) {

    const [checkedList, setCheckedList] = useState(value);
    const [indeterminate, setIndeterminate] = useState(value.length !== data.children.length);
    const [checkAll, setCheckAll] = useState(value.length === data.children.length);

    const onItemChange = list => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < data.children.length);
        setCheckAll(list.length === data.children.length);
        onChange(list)
    };

    const onCheckAllChange = e => {
        const ids = e.target.checked ? data.children.map(item => item.value) : [];
        setCheckedList(ids);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
        onChange(ids)
    };

    return <div className="flexbox tree-node">
        <div>
            <Checkbox 
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
            >{data.label}</Checkbox>
        </div>
        {
            data.children.length > 0 && <>
                <div className="divider" />
                <div className="flex1">
                    <Checkbox.Group options={data.children} value={checkedList} onChange={onItemChange} />
                </div>
            </>
        }
    </div>
}