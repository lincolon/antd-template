import React, { useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormCheckbox, ProFormRadio, ProFormText } from '@ant-design/pro-form';
import { 
  getUserList,
  editUser,
} from './service'
import { Button, Tag, Form, Select, Modal, Input } from 'antd';

import withTableList from '../../components/ProTable';

export default withTableList(AccounterList, getUserList);

const roles = [
    {label: '管理员', value: '1'},
    {label: '运营', value: '2'},
    {label: '业务', value: '3'},
    {label: '生产', value: '4'},
    {label: '财务', value: '5'},
]

function AccounterList(tableProps){
    
    const actionRef = useRef();
    const [ state, setState ] = useState({visible: false, data: null})

    const columns = [
        {
            title: '姓名',
            dataIndex: 'nickname',
        },
        {
            title: '手机号',
            dataIndex: 'username',
        },
        {
            title: '角色',
            dataIndex: 'role_ids',
            hideInSearch: true,
            hideInForm: true,
            render(role_ids){
                const ids = role_ids.split(',');
                const role_str = [];
                roles.forEach(item => {
                    if(ids.includes(`${item.value}`)){
                        role_str.push(item.label);
                    }
                })
                return role_str.map(item => <Tag key={item}>{item}</Tag>)
            }
        },
        {
            title: '所属单位',
            dataIndex: 'created_at',
        },
        {
            title: '参与项目',
            dataIndex: 'created_at',
            hideInSearch: true,
        },
        {
            title: '创建人',
            dataIndex: 'created_at',
            hideInSearch: true,
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            hideInSearch: true,
        },
        {
            title: '状态',
            dataIndex: 'satus',
            valueType: 'select',
            valueEnum: {
                1: {text: '正常', status: 'Processing'},
                2: {text: '禁用', status: 'Error'},
                3: {text: '离职', status: 'Default'},
            }
        },
        {
            title: '操作',
            dataIndex: 'options',
            fixed: 'right',
            hideInSearch: true,
            width: 240,
            render: (_, record) => {
                return <>
                    <a onClick={() => setState({visible: true, data: {...record, role_ids: record.role_ids.split(',')}})}>编辑</a>
                    <Divider type="vertical" />
                    <a>删除</a>
                    <Divider type="vertical" />
                    <a onClick={handleEditPassword}>修改密码</a>
                </>
            }
        }
    ]

    const handleEditPassword = () => {

        let form;

        function PassForm(){
            [ form ] = Form.useForm();
            return <Form form={form}>
                <Form.Item label="旧密码" name="old_password" required>
                    <Input.Password />
                </Form.Item>
                <Form.Item label="新密码" name="password" required>
                    <Input.Password />
                </Form.Item>
                <Form.Item 
                    label="确认密码" 
                    name="confirm_password"
                    rules={[{
                        validator: async (_, value) => {
                            const newPass = form.getFieldValue('password');
                            if(newPass !== value){
                                throw new Error('与新密码不一致');
                            }
                        }
                    }]}
                >
                    <Input.Password />
                </Form.Item>
            </Form>
        }

        Modal.confirm({
            title: '修改密码',
            centered: true,
            content: <PassForm />,
            onOk: async () => {
                const values = await form.validateFields();
            }
        })
    }

    const handleSubmit = async (values) => {
        const postData = {
            ...values, 
            password: btoa(values.password),
            role_ids: values.role_ids.join(',')
        }
        await editUser({
            ...postData, 
            id: state.data.id
        })
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
        <ProFormText label="手机号" name="username" required disabled={state.data} />
        <ProFormText label="姓名" name="nickname" required />
        <ProFormText.Password label="密码" name="password" />
        <Form.Item label="所属单位" name="departments">
            <Select />
        </Form.Item>
        <Form.Item label="参与项目" name="peojects">
            <Select />
        </Form.Item>
        <ProFormCheckbox.Group
            label="角色" 
            name="role_ids" 
            required 
            options={roles} 
        />
        <ProFormRadio.Group
            name="status"
            label="状态"
            options={[
                {label: '启用', value: 0},
                {label: '禁用', value: 1},
                {label: '离职', value: 2},
            ]}
        />
    </ModalForm>
    </>
}