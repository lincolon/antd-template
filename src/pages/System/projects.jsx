import React, { useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormCheckbox, ProFormRadio, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { 
  accounterList,
  editAccounter,
  addAccounter
} from '@service/system'
import { Button, Form, Select } from 'antd';

import withTableList from '../../components/ProTable';

export default withTableList(ProjectList, accounterList);

function ProjectList(tableProps){
    
    const actionRef = useRef();
    const [ state, setState ] = useState({visible: false, data: null})

    const columns = [
        {
            title: '项目名称',
            dataIndex: 'nickname',
        },
        {
            title: '所属单位',
            dataIndex: 'username',
        },
        {
            title: '项目简介',
            dataIndex: 'username',
            hideInSearch: true
        },
        {
            title: '创建人',
            dataIndex: 'username',
            hideInSearch: true
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
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
        headerTitle="项目列表"
        columns={columns}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button key="button2" type="primary" onClick={() => setState({...state, visible: true})}>
            新增项目
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
        <ProFormText label="项目名称" name="username" required disabled={state.data} />
        <ProFormTextArea label="项目简介" name="nickname"  />
        <Form.Item label="所属单位" name="departmant_ids">
            <Select />
        </Form.Item>
        <ProFormRadio.Group
            name="status"
            label="状态"
            options={[
                {label: '进行中', value: 0},
                {label: '已完结', value: 1},
                {label: '已暂停', value: 2},
            ]}
        />
    </ModalForm>
    </>
}