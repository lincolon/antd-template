import { Tree, Spin } from 'antd';
import React, { useState, useEffect } from 'react';

import { permissionList } from '../../service/common';

import './style.less';

function formatTreeData(treeData, k){
    return treeData.map((item, idx) => {
        const key = k ? `${k}-${idx}` : `${idx}`;
        item.key = key;
        return {
          title: item.name,
          key: `${item.id}`,
          children: item.children && item.children.length > 0 && formatTreeData(item.children, key) || []
        }
      })
}

function reSetTreeStyle() {
    const treeWrapper = document.querySelector('.ant-tree-list-holder-inner');
    const noopNodes = document.querySelectorAll(".ant-tree-switcher-noop");
    treeWrapper.style.display = "block";
    noopNodes.forEach(el => {
        el.parentNode.style.display = "inline-flex";
        el.parentNode.style.width = '170px';
    })
}

export default function(props) {

    const [treeData, setTreeData] = useState([]);
    const [showTree, updateStatus] = useState(false);

    const [checkedKeys, setCheckedKeys] = useState(props.value);

    useEffect(() => {

        (async () => {
            const { data } = await permissionList();
            setTreeData(formatTreeData(data));
            const timer1 = setTimeout(reSetTreeStyle, 0);
            const timer = setTimeout(() => {
                updateStatus(true);
                clearTimeout(timer);
                clearTimeout(timer1);
            }, 0);
        })();
    }, []);

    const onCheck = (checkedKeysValue) => {
        setCheckedKeys(checkedKeysValue);
        props.onChange(checkedKeysValue);
    };

    return treeData.length > 0 ?
        <div style={{display: showTree ? 'block' : 'none'}}>
            <Tree 
                checkable
                blockNode={true}
                // blockNode={true}
                // onExpand={onExpand}
                // expandedKeys={expandedKeys}
                defaultExpandAll={true}
                // autoExpandParent={autoExpandParent}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                // onSelect={onSelect}
                // selectedKeys={selectedKeys}
                treeData={treeData}
                switcherIcon={() => null}
            />
        </div> : <div style={{textAlign: 'center',padding: '50px 0'}}><Spin /></div>
}