import React, { useRef, useEffect, useState, useCallback } from 'react';
import ProForm, { ProFormText, ProFormDigit, ProFormCheckbox, ProFormRadio, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { useParams } from 'react-router-dom';
import { Form, Typography, Cascader, Select, Checkbox, DatePicker, Switch, Input } from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import ImageUploader from '../../components/ImageUploader';


const FormItem = Form.Item;

export default function ProductsDetails(){
    const params = useParams();
    const formRef = useRef();

    const handleSubmit = async (values) => {
      await formRef.current.validateFields();
      console.log(params)
    }

    return  <PageHeaderWrapper 
              back={true}
              title="商品详情"
              formRef={formRef}
              onFinish={handleSubmit}
            >
              <div style={{padding: 24}}>
                <ProForm 
                  style={{width: 600}}
                >
                  <ProForm.Group>
                    <ProFormRadio.Group 
                      label="状态" 
                      name="status"
                      options={[{label: '在售', value: 1},{label: '下架', value: 2}]} 
                    />
                    <ProFormDigit label="排序" name="sort"/>
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormDigit name="sell_price" label="价格" rules={[{required: true}]}/>
                    <ProFormDigit name="tag_price" label="价格" rules={[{required: true}]}/>
                    <ProFormDigit name="stock_number" label="库存" rules={[{required: true}]}/>
                  </ProForm.Group>
                  <ProForm.Group>
                    <ProFormDigit label="最多购买次数" name="max_buy_number" rules={[{required: true}]}/>
                    <ProFormDigit label="单次起购件数" name="once_min_number" rules={[{required: true}]}/>
                    <ProFormDigit label="单次最多购买件数" name="once_max_number" rules={[{required: true}]}/>
                  </ProForm.Group>
                  <ProFormTextArea label="商品描述" name="description" rules={[{required: true}]}/>
                  <FormItem
                    label="商品图片"
                    name="imgs"
                    rules={[{required: true}]}
                  >
                    <Imgs />
                  </FormItem>
                </ProForm>
              </div>
            </PageHeaderWrapper>
}



function Imgs({value, onChange}) {
  return (
    <div>
      <Typography.Text type="secondary">轮播图（第一张为封面，最多9张，拖动可排序）</Typography.Text>
      <ImageUploader 
        file={details.extra.images} 
        limitSize={2} 
        multiple={true}
        max={9}
        onChange={(files) => onChange({...values, banner: files})}
      />
      <br />
      <Typography.Text type="secondary">图文详情（拖动可排序）</Typography.Text>
      <ImageUploader 
        file={details.extra.images} 
        limitSize={2} 
        multiple={true}
        max={100}
        onChange={(files) => onChange({...values, banner: contents})}
      />
    </div>
  )
}