import React, { useRef, useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

import { parseUrlSearchParams } from '../../utils/helper';

export default function withTableList(Comp, service){

  return function() {
    let [searchParams, setSearchParams] = useSearchParams();
    const searchFormValues = parseUrlSearchParams(searchParams);
    const formRef = useRef();

    const tableProps = {
        rowKey: "id",
        formRef,
        searchFormValues,
        search: {labelWidth: 'auto', span: 6},
        pagination: {
          pageSize: 20,
          defaultCurrent: searchFormValues.page || 1,
        },
        defaultSize: "small",
        onSubmit: (params) => {
          setSearchParams({...params, page: 1})
        },
        onReset: () => {
          setSearchParams({page:1});
          formRef.current.resetFields()
        },
        onChange: (pagination) => {
          setSearchParams({...searchFormValues, page: pagination.current});
        },
        request:async (params = {}) => {
          return await service({...params, ...searchFormValues, current: searchFormValues.page || 1})
        }
    }

    useEffect(() => {
      formRef.current && formRef.current.setFieldsValue(searchFormValues);
    }, [])

    return <Comp {...tableProps} />
  }
}