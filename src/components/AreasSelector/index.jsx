import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Popconfirm } from 'antd';
import { getAllAreas, activeCities } from '@service/common';
import cloneDeep from 'lodash-es/cloneDeep';
// import * as division from '../../utils/division';

import './style.less';

function getDefaultChecks(data, targetId) {
    const checked_ids = [];
    // const res = data.filter(item => item.products.includes(targetId));
    data.forEach(item => {
        item.products.forEach(el => {
            if(el.id === targetId){
                checked_ids.push(item.id);
            }
        })
    })
    return checked_ids
}


let cacheData = null, currentCity;

export default function AreasSelector({withContainers, onChange, value, product_id, city, containerCanCheck}) {

    const [ data, setData ] = useState([]);
    const [ areasValue, setAreasValue ] = useState([]);
    const [ cities, setCities ] = useState([]);

    const getData = useCallback(async (val) => {
        const res = await getAllAreas({province: val[0], city: val[1]});
        let checkedValues;
        const resData = res.data.map(item => ({
            label: item.title,
            value: item.title,
            withContainers,
            children: item.children.map(el => {
                if(withContainers && !cacheData[`${item.title}${el.title}`]){
                    const checked_ids = getDefaultChecks(el.children, product_id);
                    checkedValues = checked_ids;
                    cacheData[`${item.title}${el.title}`] = checkedValues;
                }
                return {
                    label: el.title, 
                    value: !withContainers ? el.id : el.title, 
                    checkable: true,
                    checkedValues: !withContainers ? [] : checkedValues,
                    children: withContainers ? el.children.map(item => ({
                        label: item.title, 
                        value: item.id,
                        code: item.container_code,
                        rows: (item.products.filter(kv => kv.id === product_id))[0]?.rows || [],
                        disabled: (!withContainers || (withContainers && containerCanCheck)) ? false : item.container_id === 0, 
                    })) : []
                }
            })
        }))
        currentCity = val.join('_');
        setData(resData);
    }, [product_id])

    useEffect(() => {
        const initialCity = city || ['湖北省', '武汉市'];
        cacheData = {};
        if(!withContainers && value){
            let area_ids = [];
            cacheData = cloneDeep(value);
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

    useEffect(() => {
        (async () => {
            const cities = [];
            const { data } = await activeCities();
            const v = Object.entries(data);
            v.forEach(item => {
                const [p, c] = item;
                Object.keys(c).forEach(el => cities.push([p, el]));
            })
            setCities(cities);
        })();
    }, []);

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
        <section style={{maxHeight: 400, overflowY: 'auto'}}>
            {
               !(!withContainers && value) &&
                <div>
                    <div className="cascader-wrapper">
                    {
                        cities.map(item => 
                            <span 
                                key={item[1]} 
                                className={`mgt-block city-item ${currentCity === item.join('_') ? 'active' : ''}`} 
                                onClick={() => getData(item)}
                            >{item[1]}</span>
                        )
                    }
                    </div>
                </div>
            }
            <div className="cascader-options-wrapper tree-wrapper">
                {
                   data.map(item => 
                        (
                            <div className="tree-item" key={item.value}>
                            {
                                withContainers ? 
                                <SkuContainersTop 
                                    data={item} 
                                    product_id={product_id} 
                                    containerCanCheck={containerCanCheck} 
                                    onChange={(val) => onChange(val) /**handleContainerChange(val, `${item.label}${el.label}`)*/} 
                                />
                                :
                                <Item 
                                    value={areasValue} 
                                    onChange={(val) => {
                                        handleCommunityChange(val, `${item.label}`)
                                    }} 
                                    options={item.children} 
                                    title={item.label}
                                />
                            }
                            </div>
                        )
                        
                   ) 
                }
            </div>
        </section>
    )
}



function SkuContainersTop({containerCanCheck, data, product_id, onChange}){
    const { label, children } = data;
    const [checkAll, setCheckAll] = useState(false);
    const [ checkIds, updateCheckIds ] = useState({});
    const containerRef = useRef({});

    const containerCount = useMemo(() => {
        let count = 0;
        children.forEach(item => {count += item.children.length});
        return count;
    }, [])

    const flatChecks = function(checks) {
        return Object.values(checks).flat();
    }

    const onCheckAllChange = (ev) => {
        const checked = ev.target.checked;
        if(checked){
            children.forEach(item => {
                containerRef.current[item.label] = item.children.map(el => el.value);
            })
            setCheckAll(true);
            updateCheckIds(containerRef.current);
            onChange({[data.label]: flatChecks(containerRef.current)})
        }else{
            setCheckAll(false);
            updateCheckIds(null);
            containerRef.current = {};
            onChange({[data.label]: []})
        }
    }
    
    return (
        <>
            <div>
               {
                   containerCanCheck ? 
                   <Checkbox 
                       onChange={onCheckAllChange}
                       checked={checkAll}
                   ><h4>{label}</h4></Checkbox> :
                   <h4>{label}</h4>
               } 
            </div>
            {
                children.map(el => 
                    <SkuContainers
                        key={el.value}
                        containerCanCheck={containerCanCheck}
                        value={containerCanCheck ? (checkIds ? checkIds[el.label] : null) : el.checkedValues}
                        product_id={product_id}
                        onChange={(val) => {
                            if(containerCanCheck){
                                containerRef.current = {...containerRef.current, ...val};
                                const postData = flatChecks(containerRef.current);
                                updateCheckIds(containerRef.current);
                                setCheckAll(containerCount === postData.length)
                                onChange({[data.label]: postData});
                            }else{
                                onChange(val)
                            }
                        }} 
                        data={el}
                    />
                )
            }
        </>
    )
}

function SkuContainers({data, value, product_id, onChange, containerCanCheck}){

    const options = data.children;

    const [checkedList, setCheckedList] = useState(value || []);
    const [checkAll, setCheckAll] = useState(value && value.length >= options.length);

    useEffect(() => {
        if(value){
            setCheckedList(value);
            setCheckAll(value.length >= options.length);
        }else{
            setCheckedList([]);
            setCheckAll(false);
        }
    }, [value])

    const onCheckAllChange = e => {
        const ids = e.target.checked ? options.map(item => item.value) : [];
        setCheckedList(ids);
        setCheckAll(e.target.checked);
        onChange({[data.label]: ids})
    };

    const onItemChange = (checked, branch_id, rows) => {
        console.log(branch_id);
        let status, _checkedList;
        if(checked){
            _checkedList = checkedList.concat(branch_id);
            status = 1;
            setCheckedList(_checkedList);
        }else{
            _checkedList = checkedList.slice();
            _checkedList.splice(checkedList.indexOf(branch_id) ,1);
            status = 2;
            setCheckedList(_checkedList);
        }
        if(containerCanCheck){
            setCheckAll(_checkedList.length === options.length);
            onChange({[data.label]: _checkedList})
        }else{
            onChange({
                community_branch_id: branch_id, 
                status: status,
                product_id,
                rows,
            })
        }
    };

    return <div className="flexbox tree-node">
        {
            containerCanCheck ? 
            <Checkbox 
                className='tree-node-padd'
                onChange={onCheckAllChange}
                checked={checkAll}
            ><div>{data.label}</div></Checkbox> :
            <div className='tree-node-padd'>{data.label}</div>
        }
        {
            options.length > 0 && <>
                <div className="divider" />
                <div className="flex1">
                    {
                        options.map(item => 
                            <div 
                                key={item.value} 
                                className='mgt-block' 
                                style={{marginRight: 20}}
                            >
                                
                                {
                                    containerCanCheck ? 
                                    <Checkbox 
                                        key={item.value}
                                        disabled={item.disabled}
                                        checked={checkedList.indexOf(item.value) > -1} 
                                        onChange={(ev) => onItemChange(ev.target.checked, item.value, item.rows)}
                                    >
                                        {item.label}
                                    </Checkbox> : 
                                    !item.disabled ? `${item.label}-${item.code}` : <span style={{color: '#00000040'}}>{item.label}-{item.code}</span>
                                }
                                {
                                    !item.disabled && !containerCanCheck && 
                                    <LayerSetter 
                                        title={`${item.label}-${item.code}`} 
                                        rows={item.rows} 
                                        onChange={(rows)=>onItemChange(true, item.value, rows)} 
                                    />
                                }
                            </div>
                        )
                    }
                </div>
            </>
        }
    </div>
}
    
function LayerSetter({rows, title, onChange}){

    const [ value, setValue ] = useState(rows)

    return (
        <Popconfirm 
            title={
                <>
                    <h4>设置层数-{title}</h4>
                    <Checkbox.Group 
                        value={value}
                        onChange={(val) => setValue(val)}
                        options={Array.apply(null, {length:6}).map((_, idx) => ({label: `${idx+1}`, value: `${idx+1}`}))}
                    />
                </>
            } 
            onConfirm={() => onChange(value)}
            onCancel={()=>setValue(rows)}
        >
            <a>
            {
                value?.length > 0 ? `(${value})` : '设置层数'
            }
            </a>
        </Popconfirm>
    )
}

function Item({options, value, onChange, title}) {

    const [checkedList, setCheckedList] = useState(value);
    const [indeterminate, setIndeterminate] = useState(value.length !== options.length);
    const [checkAll, setCheckAll] = useState(value.length >= options.length);

    const onItemChange = list => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < options.length);
        setCheckAll(list.length === options.length);
        onChange(list)
    };

    const onCheckAllChange = e => {
        const ids = e.target.checked ? options.map(item => item.value) : [];
        setCheckedList(ids);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
        onChange(ids)
    };

    return <div className="tree-node">
        <Checkbox 
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
        ><h4>{title}</h4></Checkbox>
        <div className='tree-node-padd'>
            <Checkbox.Group options={options} value={checkedList} onChange={onItemChange} />
        </div>
    </div>
}