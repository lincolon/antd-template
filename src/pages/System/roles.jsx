import React, { useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea,  } from '@ant-design/pro-form';
import { 
  getRolesList,
  editRoles,
} from './service'
import { Button, Divider, Form } from 'antd';

import withTableList from '../../components/ProTable';
import PermissionTree from '../../components/PermissionTree';

export default withTableList(RolesList, getRolesList);


function RolesList(tableProps){
    
    const actionRef = useRef();
    const [ state, setState ] = useState({visible: false, data: null})

    const columns = [
        {
            title: '角色名',
            dataIndex: 'name',
        },
        {
            title: '描述',
            dataIndex: 'description',
        },
        {
            title: '账号数',
            dataIndex: 'num',
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
            width: 100,
            render: (_, record) => {
                return record.id !== 100 && <><a onClick={() => setState({visible: true, data: {...record, role_ids: record.role_ids.split(',')}})}>编辑</a>
                    <Divider type="vertical" />
                    <a>删除</a>
                </>
            }
        }
    ]

    const handleSubmit = async (values) => {
        const postData = {
            ...values, 
            password: btoa(values.password),
            role_ids: values.role_ids.join(',')
        }
        await editRoles({
            ...postData, 
            id: state.data.id
        })
        actionRef.current.reload();
        setState({data: null, visible: false});
    }
    
    return <>
    <ProTable 
        headerTitle="角色列表"
        columns={columns}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button key="button2" type="primary" onClick={() => setState({...state, visible: true})}>
            添加角色
          </Button>,
        ]}
        {...tableProps}
        search={false}
    />
    <ModalForm
        title={`${state.data?'编辑':'新增'}角色`}
        modalProps={{
            centered: true,
            destroyOnClose: true,
            onCancel: () => setState({visible: false, data: null})
        }}
        onFinish={handleSubmit}
        visible={state.visible}
        layout="vertical"
        width={820}
        initialValues={state.data || { status: 0 }}
    >
        <section className="flexbox">
            <div style={{width: 200, marginRight: 50}}>
                <ProFormText label="名称" name="username" required disabled={state.data} />
                <ProFormTextArea label="描述" name="nickname" />
            </div>
            <div className="flex1">
                <Form.Item label="权限" name="menu_ids" required>
                    <PermissionTree />
                </Form.Item>
            </div>
        </section>
    </ModalForm>
    </>
}