import React, { useRef } from 'react';
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { 
    getProducts,
    addProducts,
    editProducts
} from '@service/products'

import columns from './config/products.column';

import ProTable from '../../components/ProTable'

export default function ProductsList(){
    const actionRef = useRef();

    return <ProTable 
            headerTitle="商品列表"
            columns={columns}
            actionRef={actionRef}
            request={async (params = {}, sort, filter) => {
                console.log(params)
                return await getProducts(params);
            }}
            toolBarRender={() => [
              <Button key="button" icon={<PlusOutlined />} type="primary">
                <Link to="/products/details" style={{color: '#fff'}}>新建</Link>
              </Button>,
            ]}
        />
}