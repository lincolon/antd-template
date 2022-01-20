import React, { useEffect, useRef } from 'react';
import ProTable from '@ant-design/pro-table';

import { useSearchParams } from 'react-router-dom';

import { urlToObject } from '../../utils/helper';

export default function Table(props){

    const formRef = useRef();

    let [searchParams, setSearchParams] = useSearchParams();
    const searchFormValues = urlToObject(searchParams);

    if(searchFormValues.start_at){
      searchFormValues.created_at = [searchFormValues.start_at, searchFormValues.end_at];
    }

    useEffect(() => {
      formRef.current && formRef.current.setFieldsValue(searchFormValues);
    }, []);

    return <ProTable 
            rowKey="id"
            formRef={formRef}
            onSubmit={(params) => {
              setSearchParams({...params, page: searchFormValues.page || 1})
            }}
            onReset={() => {setSearchParams({page:1});formRef.current.resetFields()}}
            search={{labelWidth: 'auto', span: 6}}
            onChange={(pagination) => {
              setSearchParams({...searchFormValues, page: pagination.current})
            }}
            pagination={{
              pageSize: 20,
              defaultCurrent: searchFormValues.page || 1,
            }}
            defaultSize="small"
            {...props}
            request={async (params = {}) => {
              return await props.request({...params, current: searchFormValues.page || 1})
            }}
        />
}