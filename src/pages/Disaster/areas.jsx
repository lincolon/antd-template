import React, { useRef, useState } from 'react';
import { ModalForm, ProFormCheckbox, ProFormRadio, ProFormText } from '@ant-design/pro-form';

import { Button, Tag } from 'antd';

import MyTree from '../../components/MyTree';
import Map from '../../components/Map';

export default function AccounterList(tableProps){
    
    const [ state, setState ] = useState({visible: false, data: null})

    const handleSubmit = async (values) => {
        const postData = {
            ...values, 
            password: btoa(values.password),
            role_ids: values.role_ids.join(',')
        }
        
        setState({data: null, visible: false});
    }
    
    return <section style={{height: '100%'}}>
        <div className="flexbox" style={{height: '100%'}}>
            <div style={{height: '100%', width: 200, background: '#fff', overflowX: 'auto'}}>
                <MyTree data={[]} onClick={(data) => console.log(data)} width={300} />
            </div>
            <div className="flex1">
                <Map height="100%" zoom={5} />
            </div>
        </div>
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
            
        </ModalForm>
    </section>
}