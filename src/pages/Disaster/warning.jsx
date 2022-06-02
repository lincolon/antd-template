import React, { useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormCheckbox, ProFormRadio, ProFormText } from '@ant-design/pro-form';
import { 
  accounterList,
  editAccounter,
  addAccounter
} from '@service/system'
import { Button, Tag } from 'antd';

import withTableList from '../../components/ProTable';

export default withTableList(AccounterList, accounterList);

function AccounterList(tableProps){
    
    const actionRef = useRef();
    const [ state, setState ] = useState({visible: false, data: null})

    const columns = [
        {
            title: '序号',
            dataIndex: 'nickname',
            hideInSearch: true,
            hideInForm: true,
        },
        {
            title: '灾害点',
            dataIndex: 'username',
            hideInSearch: true,
            hideInForm: true,
        },
        {
            title: '位置',
            dataIndex: 'created_at',
            hideInSearch: true,
            hideInForm: true,
        },
        {
            title: '监测点',
            dataIndex: 'username',
            hideInSearch: true,
            hideInForm: true,
        },
        {
            title: '预警等级',
            dataIndex: 'created_at',
            hideInSearch: true,
            hideInForm: true,
        },
        {
            title: '操作',
            dataIndex: 'options',
            fixed: 'right',
            hideInSearch: true,
            hideInForm: true,
            width: 180,
            render: (_, record) => {
                return <a onClick={() => setState({visible: true, data: record})}>查看</a>
            }
        }
    ]
    
    return  <ProTable 
                headerTitle="灾害预警"
                columns={columns}
                actionRef={actionRef}
                bordered
                {...tableProps}
                search={false}
            />
}