import React, { useRef, useState, useEffect, Fragment } from 'react';
import TreeItem from './treeItem';

import dataSource from './data.json'
import isFunction from 'lodash-es/isFunction';
import cloneDeep from 'lodash-es/cloneDeep'

function parseData(data, key){
	return data.map((item, idx) => {
		const newKey = key !== undefined ? `${key}-${idx}` : `${idx}`;
		return {
			...item,
			children: (item.children && item.children.length > 0) ? parseData(item.children, newKey) : [],
			open: false,
			active: false,
			key: newKey
		}
	})
}

function resetFlat(data, open){
	if(open){
		return data;
	}else{
		return data.map(item => ({
			...item,
			open: false,
			children: resetFlat(item.children, false)
		}))
	}
}

function flatFromBottom(data){
	data.open = true;
	if(data.parent){
		flatFromBottom(data.parent);
	}
}

function setTreeFlat(data, activeKey, parent){
	data.forEach(item => {
		item.parent = parent;
		if(item.id === activeKey || item.name === activeKey){
			item.active = true;
			if(parent){
				flatFromBottom(parent)
			}
		}else {
			item.active === false;
			if(item.children.length > 0){
				setTreeFlat(item.children, activeKey, item)
			}
		}
	})
}

export default function Tree(props){

	const ref = useRef();
	const [ treeData, updateTreeData ] = useState(parseData(dataSource))

	
	ref.current = {
		handleClick: (key, propName) => {
			console.log("Adasds", key, propName)
			console.log(treeData);
			const newData = updateTree(treeData, key, propName);
			console.log(newData);
			updateTreeData(newData);
		}
	}

	useEffect(() => {
		if(props.activeKey){
			const data = cloneDeep(treeData);
			updateTreeData(setTreeFlat(data, props.activeKey));
		}
	}, [props.activeKey])

	function updateTree(data, key, propName){
		const newData = data.map(item => {
			if(item.key === key){
				let status = !item[propName];
				if(propName === 'active' && status){
					if(isFunction(props.onClick)){
						props.onClick(item);
					}
				}
				return {
					...item,
					[propName]: propName === 'active' ? (status || item[propName]) : status,
					children: propName === 'active' ? updateTree(item.children, key, propName) : resetFlat(item.children, status)
				}
			}else{
				return {
					...item,
					[propName]: propName === 'active' ? false : item[propName],
					children: updateTree(item.children, key, propName)
				}
			}
		})
		return newData;
	}

	return (
		<div className="tree-wrapper" style={{minWidth: props.width || 100}}>
			{
				treeData.map(item => 
					<Fragment key={item.key}>
						<TreeItem 
							data={item}
							parentOpen={item.open}
							actionRef={ref}
							activeKey={props.activeKey}
						/>
					</Fragment>
				)
			}
		</div>
	)
}

