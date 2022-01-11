import React from 'react';
import ProTable from '@ant-design/pro-table';

import { useSearchParams } from 'react-router-dom';

import { urlToObject } from '../../utils/helper';

export default function Table(props){

    let [searchParams, setSearchParams] = useSearchParams();
    const searchFormValues = urlToObject(searchParams);

    if(searchFormValues.start_at){
        searchFormValues.created_at = [searchFormValues.start_at, searchFormValues.end_at];
    } 

    return <ProTable 
            rowKey="id"
            form={{initialValues: searchFormValues}}
            onSubmit={(params) => setSearchParams(params)}
            search={{
              labelWidth: 'auto',
              span: 6
            }}
            pagination={{
              pageSize: 20,
            }}
            defaultSize="small"
            {...props}
        />
}