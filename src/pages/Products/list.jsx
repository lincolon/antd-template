import React, { useRef } from 'react';
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import ProTable from '@ant-design/pro-table';
import { 
    getProducts
} from '@service/products'

import columns from './config/products.column';
import withTableList from '../../components/ProTable';

export default withTableList(ProductsList, getProducts) 

function ProductsList(tableProps){
    const actionRef = useRef();
    const navigate = useNavigate();

    const optionsConfig = {
        dataIndex: 'options',
        title: '操作',
        width: 80,
        hideInSearch: true,
        fixed: 'right',
        render(_, record){
            return <Link to={`/products/details/${record.id}`}>编辑</Link>
        }
    }

    return <ProTable 
            headerTitle="商品列表"
            columns={columns.concat(optionsConfig)}
            actionRef={actionRef}
            scroll={{x: 1500}}
            toolBarRender={() => [
              <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => navigate('/products/details')}>
                新建
              </Button>,
            ]}
            {...tableProps}
        />
}