import React, { useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { CloudUploadOutlined } from '@ant-design/icons';
import { ModalForm, ProFormRadio } from '@ant-design/pro-form';
import { 
  accounterList,
  editAccounter,
  addAccounter
} from '@service/system'
import { Button, Form, Select, Upload } from 'antd';

import withTableList from '../../components/ProTable';

export default withTableList(ProjectDataList, accounterList);

function ProjectDataList(tableProps){
    
    const actionRef = useRef();
    const [ state, setState ] = useState({visible: false, data: null})

    const columns = [
        {
            title: '项目名称',
            dataIndex: 'nickname',
            ellispis: true,
            fixed: 'left',
            width: 140
        },
        {
            title: '所属单位',
            dataIndex: 'username',
            ellispis: true,
        },
        {
            title: '采集时间',
            dataIndex: 'username',
            width: 170
        },
        {
            title: '测站编号',
            dataIndex: 'username',
            hideInSearch: true,
            width: 110
        },
        {
            title: 'X向位移(mm)',
            dataIndex: 'username',
            hideInSearch: true,
            width: 110
        },
        {
            title: 'Y向位移(mm)',
            dataIndex: 'username',
            hideInSearch: true,
            width: 110
        },
        {
            title: 'H向位移(mm)',
            dataIndex: 'username',
            hideInSearch: true,
            width: 110
        },
        {
            title: '合位移(mm)',
            dataIndex: 'username',
            hideInSearch: true,
            width: 100
        },
        {
            title: '录入人',
            dataIndex: 'username',
            hideInSearch: true,
            width: 100
        },
        {
            title: '审核人',
            dataIndex: 'username',
            hideInSearch: true,
            width: 100
        },
        {
            title: '备注',
            dataIndex: 'remark',
            hideInSearch: true,
            ellispis: true
        },
        {
            title: '创建人',
            dataIndex: 'username',
            hideInSearch: true,
            width: 100
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            width: 170
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
        headerTitle="项目数据"
        columns={columns}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button key="button2" type="primary" onClick={() => setState({...state, visible: true})}>
            导入数据
          </Button>,
        ]}
        {...tableProps}
        scroll={{x: 1800}}
    />
    <ModalForm
        title="项目数据导入"
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
        <Form.Item label="单位" name="department_id">
            <Select />
        </Form.Item>
        <Form.Item label="项目" name="department_id">
            <Select />
        </Form.Item>
        <Form.Item label="灾害点" name="department_id">
            <Select />
        </Form.Item>
        <Form.Item label="监测点" name="department_id">
            <Select />
        </Form.Item>
        <ProFormRadio.Group
            name="status"
            label="数据类型"
            options={[
                {label: '启用', value: 0},
                {label: '禁用', value: 1},
                {label: '离职', value: 2},
            ]}
        />
        <Form.Item 
            label="监测点" 
            name="department_id" 
            help={<DownloadTemplate />}
            valuePropName="fileList"
        >
            <Upload.Dragger>
                <p className="ant-upload-drag-icon">
                    <CloudUploadOutlined />
                </p>
                <p className="ant-upload-text reset-p">点击上传，或直接拖拽文件到此处</p>    
            </Upload.Dragger>
        </Form.Item>
        <ol>
            <li className="reset-p">请按要求整理数据，格式有误可能导致导入失败</li>
            <li className="reset-p">时间重复的数据会被拦截</li>
        </ol>
    </ModalForm>
    </>
}

function DownloadTemplate({href}){
    return <a href={href} download>下载模版</a>
}