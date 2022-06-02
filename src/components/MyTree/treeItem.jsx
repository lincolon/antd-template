import React from 'react';
import { DiffFilled, EditFilled } from '@ant-design/icons'
import './style.less';
import { Tooltip } from 'antd';

function treeLengthCalculator(data, count = 0, level = 0, slice){
    count += data.length;
    const _data = slice === -1 ? data.slice(0, -1) : data;
    _data.forEach((item) => {
        if(item.children.length > 0 && item.open){
            count = treeLengthCalculator(item.children, count, level);
        }
    })
        
    return count;

}

function TreeItem(props) {

    const { data, actionRef, level } = props;

    const hasChild = data.children.length > 0;

    const lineHeight = hasChild && data.open ? 
            treeLengthCalculator(data.children, 0, level, -1)*40 + 'px' :
            0 + 'px';

    const toggle = (ev) => {
        actionRef.current.handleClick(data.key, 'open');
        ev.stopPropagation();
    }

    const onMenuClick = (ev) => {
        actionRef.current.handleClick(data.key, 'active');
        ev.stopPropagation();
    }

    return (
        <div className={`tree-menu ${level?'child-level':'top-level'}`}>
            <span 
                className="tree-line" 
                style={{
                    left: (level||0) * (level?25:20) + 22,
                    height: lineHeight
                }}
            />
            <div 
                className={`flexbox tree-item ${data.active?'active':''}`}
                onClick={onMenuClick}
                style={{
                    paddingLeft: (level||0) * (level?25:20) + 10,
                    height: level ? (props.parentOpen ? '40px' : '0px') : '40px'
                }}
            >
                <div className="box-center-ver icon-prefix">
                    {
                        hasChild ? <span className={`tree-icon ${data.open?'tree-icon-flat':'tree-icon-unflat'}`} onClick={toggle} /> :
                            <span className="tree-icon tree-icon-empty" />
                    }
                </div>
                <div className="box-center-ver">
                    <Tooltip placement="bottom" title="编辑">
                        <span className="project-icon">
                            <EditFilled style={{color: '#0099ff'}} />
                        </span>
                    </Tooltip>
                </div>
                <div className="tree-title">{data.name}</div>
            </div>
            {
                data.children.map(item => (
                    <React.Fragment key={item.key}>
                    <TreeItem 
                        data={item}
                        actionRef={actionRef}
                        parentOpen={data.open}
                        level={(level||0)+1}
                        totalLength={data.children.length}
                    />
                    </React.Fragment>
                ))
            }
        </div>
    )
}

export default TreeItem;


