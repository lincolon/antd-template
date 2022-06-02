import { Modal, Divider, Button } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { ArrowsAltOutlined } from '@ant-design/icons';
import { isEmptyObject } from '../../utils/helper';

import AreasSelector from './index';
  
  export default function Areas({ value, onChange, disabled }) {
  
    const selectorRef = useRef();
    const [currentCity, setCity] = useState(null);
    const [state, setState] = useState({visible:false, initialValues: getAreas(value?.use_areas)});
    const [ config, setConfig ] = useState(value ? value.use_areas : []);
  
    useEffect(() => {
      if(value){
        const areas = {};
        value.use_areas.forEach(item => {
          areas[item[0]] = item[1];
        })
        selectorRef.current = areas;
      }
    }, []);
  
    const handleSubmit = () => {
      const allAreas = {};
      const { use_areas, community_ids } = createAreasData(selectorRef.current)
      for(const k in selectorRef.current){
        Object.assign(allAreas, getAllAreas(selectorRef.current[k]))
      }
      setConfig(use_areas);
      setState({...state, initialValues: allAreas})
      onChange({
        community_ids,
        use_areas
      })
    }
  
    const handleRemove = (city) => {
      Modal.confirm({
        title: '删除后不可还原，请确认操作',
        onOk: () => {
          delete selectorRef.current[city];
          handleSubmit();
        }
      })
    }
  
    const handleEdit = (city) => {
      setCity(city.split('_'));
      setState({...state, visible: true});
    }
  
    return (
      <div className="form-areas-wrapper">
        <div className={`areas-list ${config.length>0?"expand":''}`}>
        {
          config.map(item => (
            <div key={item[0]} className="areas-item">
              <div className="flexbox">
                <div style={{marginRight: 10}}>{item[0].split('_')}</div>
                <div className="flex1 word-ellipsis">
                  {
                    formatLabels(item[1])
                  }
                </div>
                {
                  !disabled && 
                  <div style={{marginLeft: 10}}>
                    <a onClick={() => handleRemove(item[0])}>移除</a>
                    <Divider type="vertical" />
                    <a onClick={() => handleEdit(item[0])}>编辑</a>
                  </div>
                }
              </div>
            </div>
          ))
        }
        </div>
        {
          !disabled && 
          <div className={`expand-btn ${config.length>0?"expand":''}`}>
            <Button 
              type="link" 
              icon={<ArrowsAltOutlined />} 
              size="small"
              onClick={()=>{setState({...state, visible: true})}}
            >设置区域</Button>
          </div>
        }
        
        <Modal
          title="设置区域"
          visible={state.visible}
          centered
          destroyOnClose
          maskClosable={false}
          onOk={handleSubmit}
          onCancel={()=>setState({...state, visible: false})}
        >
          <AreasSelector
            city={currentCity}
            value={state.initialValues}
            onChange={(values) => {
              if(!selectorRef.current){
                selectorRef.current = {
                  [values.title]: values.community
                }
              }else{
                if(isEmptyObject(values.community)){
                  delete selectorRef.current[values.title]
                }else{
                  selectorRef.current = {
                    ...selectorRef.current, 
                    [values.title]: values.community
                  };
                }
              }
            }} 
          />
        </Modal>
      </div>
    )
  }

  function createAreasData(values) {
    let use_areas = [], community_ids = [];
    if(values){
      use_areas = Object.entries(values);
      use_areas.forEach(item => {
        Object.keys(item[1]).map(key => {
          item[1][key].forEach(item => community_ids.push(item.value))
        })
      });
    }
  
    return { use_areas, community_ids };
  }
  
  function formatLabels(areas) {
    var res = [];
    for(let k in areas){
      res = res.concat(areas[k].map(item => item.label));
    }
    return res.join('、');
  }
  
  function getAreas(areas){
    if(!areas)return null;
    const res = {};
    areas.map(item => {
      const [ _, data ] = item;
      Object.assign(res, getAllAreas(data));
    });
    return res;
  }
  
  function getAllAreas(collection){
    const res = {};
    for(const k in collection){
      res[k] = collection[k];
    }
    return res;
  }