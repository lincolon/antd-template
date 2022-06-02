import React, { useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { 
  accounterList,
  editAccounter,
  addAccounter
} from '@service/system'
import { Button, Tag } from 'antd';

import withTableList from '../../components/ProTable';

export default withTableList(DepartmentList, accounterList);

function DepartmentList(tableProps){
    
    const actionRef = useRef();
    const [ state, setState ] = useState({visible: false, data: null})

    const columns = [
        {
            title: '单位名称',
            dataIndex: 'nickname',
        },
        {
            title: '单位简介',
            dataIndex: 'username',
            
        },
        {
            title: '项目数量',
            dataIndex: 'username',
            hideInSearch: true,
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            hideInSearch: true,
        },
        {
            title: '操作',
            dataIndex: 'options',
            fixed: 'right',
            hideInSearch: true,
            width: 180,
            render: (_, record) => {
                return <a onClick={() => setState({visible: true, data: {...record, role_ids: record.role_ids.split(',')}})}>编辑</a>
            }
        }
    ]

    const handleSubmit = async (values) => {
        const postData = {
            ...values, 
            password: btoa(values.password),
            role_ids: values.role_ids.join(',')
        }
        state.data ? await editAccounter({
            ...postData, 
            id: state.data.id
        }) : await addAccounter({
            ...postData
        });
        actionRef.current.reload();
        setState({data: null, visible: false});
    }
    
    return <>
    <ProTable 
        headerTitle="平台用户列表"
        columns={columns}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button key="button2" type="primary" onClick={() => setState({...state, visible: true})}>
            添加平台用户
          </Button>,
        ]}
        {...tableProps}
    />
    <ModalForm
        title={`${state.data?'编辑':'新增'}平台用户`}
        modalProps={{
            centered: true,
            destroyOnClose: true,
            onCancel: () => setState({visible: false, data: null})
        }}
        onFinish={handleSubmit}
        visible={state.visible}
        layout="horizontal"
        width={380}
        initialValues={state.data || { status: 0 }}
    >
        <ProFormText label="单位名称" name="username" required disabled={state.data} />
        <ProFormTextArea label="单位简介" name="nickname" />
    </ModalForm>
    </>
}