import React, { PureComponent, Fragment, useState, useEffect } from 'react';
import {
  Radio, 
  Input,
  Upload,
  Button,
  Form,
  Select,
  Spin,
  Checkbox,
  InputNumber,
  DatePicker
} from 'antd';

import {
  UploadOutlined
} from '@ant-design/icons';

import { Link } from 'dva/router';
import debounce from 'lodash/debounce';
import isNull from 'lodash/isNull';
import cloneDeep from 'lodash/cloneDeep';
import isPlainObject from 'lodash/isPlainObject';
import isEmpty from 'lodash/isEmpty';

import moment from 'moment';

import rules from '../../utils/rules';
import service from '../../services';

const { queryTickets, downloadExcelTemp } = service.activity;

const { phoneReg } = rules;

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

export default function DistributeForm(props) {

  const initData = props.initData;

  const [ state, setState ] = useState({
    type: initData && +initData.distribute_type || 1, 
    showAdvanceSettings: initData ? initData.distribute_object === 5 : false
  });
  const [ form ] = Form.useForm();
  const [formData] = useState({
    distribute_type: initData && initData.distribute_type || 1,
    distribute_object: initData && {
      distribute_object: initData.distribute_object,
      txt: initData.txt
    } || {distribute_object: 2, txt: ''},
    distribute_object_cp: initData && {
      distribute_object: initData.distribute_object
    } || { distribute_object: 5 },
    txt: initData && (initData.txt !== '' ? {...JSON.parse(initData.txt), exclude_activity_name: initData.exclude_activity_name} : null) || null,
    time: initData && (initData.start_time ? [moment(initData.start_time), moment(initData.end_time)] : null) || null,
    goods_id: initData && {
      goods_id: initData.goods_id,
      des: initData.des
    } || null,
    reason: initData && initData.reason || '',
  })

  useEffect(() => {
    props.wrappedComponentRef(form);
  }, [])

  const handleTypeChange = (ev) => {
    const val = ev.target.value;
    const { setFieldsValue } = form;
    setFieldsValue({
      distribute_object_cp: { distribute_object: 5 },
      distribute_object: {distribute_object: 2, txt: ''},
    })
    setState({
      type: val, 
      showAdvanceSettings: val === 2
    });
  }

  const handleConditionChange = (val) => {
    setState({
      ...state,
      showAdvanceSettings: val.distribute_object === 5
    });
  }

  const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 20}
  }
  const { type, showAdvanceSettings } = state;
  return (
    <Form 
      {...formItemLayout}
      form={form}
      initialValues={formData}
    >
      <FormItem 
        label="派发方式"
        name="distribute_type"
      >
        <RadioGroup onChange={handleTypeChange} disabled={!isNull(initData)}>
          <Radio value={1}>手动派发</Radio>
          <Radio value={2}>自动派发</Radio>
        </RadioGroup>
      </FormItem>
      { 
        type === 1 ?
        <FormItem 
          label="派发对象" 
          name="distribute_object"
          rules={[
            {
              validator: async (rule, value) => {
                const { distribute_object, txt, file } = value;
                if(distribute_object === 2){
                  if(!new RegExp(phoneReg).test(txt)){
                    throw new Error('请输入会员手机号');
                  }
                }
                if(distribute_object === 4 && file === undefined){
                  throw new Error('请选择文件');
                }
                if(distribute_object === ''){
                  throw new Error('请选择派发对象');
                }
                return true;
              }
            }
          ]}
        >
          <Reciver disabled={!isNull(initData)}/>
        </FormItem> : 
        <React.Fragment>
          <FormItem 
            label="触发条件" 
            name="distribute_object_cp"
          >
            <Condition 
              disabled={!isNull(initData)} 
              onChange={handleConditionChange}
            />
          </FormItem>
          {/* {
            showDelayDay && 
            <FormItem label="派发时间" name="before_day">
              <RadioGroup>
                <Radio value={0}>当天</Radio>
                <Radio value={3}>提前3天</Radio>
                <Radio value={7}>提前7天</Radio>
              </RadioGroup>
            </FormItem>
          } */}
          {
            showAdvanceSettings && 
            <FormItem label="高级设置" name="txt">
              <AdvanceSettings />
            </FormItem>
          }
        </React.Fragment>
      }
      {
        type === 2 &&
        <FormItem 
          label="持续时间"
          name="time"
        >
          <DatePicker.RangePicker 
            showTime={{
              defaultValue: [moment('00:00:00', 'hh:mm:ss'), moment('23:59:59', 'hh:mm:ss')],
            }}
          />
        </FormItem>
      }
      <FormItem 
        label="关联卡劵"
        name="goods_id"
        rules= {[
          {required: true, message: '请选择关联卡劵'}
        ]}  
      >
        <TicketFilter />
      </FormItem>
      <FormItem 
        label="派发原因"
        name="reason"
      >
        <TextArea rows={3}></TextArea>
      </FormItem>
      <section>
        <p className="reset-p" style={{marginBottom: 3}}>1.一次只能派发一张</p>
        <p className="reset-p" style={{marginBottom: 3}}>2.派发卡券并不会消耗卡券本身的库存</p>
        <p className="reset-p" style={{marginBottom: 3}}>3.派发前注意检查卡券的有效期，过卡券过期，自动派发会暂停</p>
        <p className="reset-p">4.派发遵循卡券本身的领取规则，若顾客之前已经领过，派发可能失败</p>
      </section>
    </Form>
  )
}

class CategorySelector extends PureComponent {

  handleChange(name, val){
    const { onChange } = this.props;
    onChange({
      name,
      val
    })
  }

  render(){
    const { tags, disabled, initData } = this.props;
    // console.log(tags);
    const labels = [
      {placeholder: '大类', prop: 'parent_category'}, 
      {placeholder: '品类', prop: 'category'}, 
      {placeholder: '品牌', prop: 'brand'},
    ];
    return (
      <section className="mgt-block">
        {
          tags && tags.map((item, idx) => 
            <div className="mgt-block" key={idx} style={{lineHeight: '44px'}}>
              <Select 
                mode="multiple" 
                onChange={this.handleChange.bind(this, labels[idx].prop)} 
                style={{width: 105, marginRight: 5}} 
                placeholder={labels[idx].placeholder}
                disabled={disabled}
                defaultValue={initData && initData[labels[idx].prop] || []}
              >
                {
                  item.map((el, idx) => <Option key={idx} value={el.value}>{el.text}</Option>)
                }
              </Select>
            </div>
          )
        }
      </section>
    )
  }
}

class AdvanceSettings extends PureComponent {

  state = {
    tags: null,
    memberLevel: [],
    selectStatus: {
      money: false,
      include_category: false,
      out_category: false,
      delayed_day: false,
      member_level: false,
      discount: false,
      exclude_activity_id: false,
    }
  }

  data = Object.create(null)

  async componentDidMount(){
    const helpers = require('../../utils/helper');
    const sc = await helpers.getSundryOptions('super_category', false); 
    const c = await helpers.getSundryOptions('category', false);
    const b = await helpers.getSundryOptions('brand', false);
    const ln = await helpers.getSundryOptions('member_level', false);
    console.log(this.props.value);
    let initState = {tags: [sc, c, b], memberLevel: ln}, initData = this.props.value;
    if(initData){
      initState.selectStatus = {
        money: initData.hasOwnProperty('money'),
        include_category: initData.hasOwnProperty('include_category'),
        out_category: initData.hasOwnProperty('out_category'),
        delayed_day: initData.hasOwnProperty('delayed_day'),
        member_level: initData.hasOwnProperty('member_level'),
        discount: initData.hasOwnProperty('discount'),
        exclude_activity_id: initData.hasOwnProperty('exclude_activity_id'),
      }
      this.data = cloneDeep(initData);
    }
    this.setState(initState)
  }

  setPostData(name, value){
    if(isPlainObject(value)){
      const prevData = this.data[name] || {};
      this.data[name] = {
        ...prevData,
        [value.name]: value.val
      }
    }else{
      this.data[name] = value
    }
  }

  handleChange(name, value){
    this.setPostData(name, value);
    this.props.onChange(this.genPostData(this.data));
  }

  handleSelect(name, ev){
    const isChecked = ev.target.checked;
    this.setState({
      selectStatus: {
        ...this.state.selectStatus,
        [name]: isChecked,
      }
    }, () => {
      this.props.onChange(this.genPostData(this.data));
    }) 
  }

  genPostData(data){
    let res;
    console.log(data);
    if(!isEmpty(data)){
      for(let k in data){
        if(this.state.selectStatus[k]){
          if(!res)res = {};
          res[k] = data[k];
        }
      }
      return res;
    }
  }

  render() {
    const { selectStatus, tags, memberLevel } = this.state;
    const { value } = this.props;
    console.log(value);
    return (
      <section style={{marginTop: -6}}>
        <div style={{lineHeight: '44px'}}>
          <Checkbox
            checked={selectStatus['money']}
            onChange={this.handleSelect.bind(this, 'money')}
          >达到指定金额</Checkbox>
          <InputNumber 
            onChange={this.handleChange.bind(this, 'money')}
            disabled={!selectStatus['money']}
            defaultValue={value && value.money}
            min={0}
          />
          <div className="mgt-block">
            <p className="reset-p">（整单金额达到）</p>
          </div>
        </div>
        <div style={{lineHeight: '44px'}}>
          <Checkbox
            checked={selectStatus['discount']}
            onChange={this.handleSelect.bind(this, 'discount')}
          >高于指定折扣</Checkbox>
          <InputNumber 
            onChange={this.handleChange.bind(this, 'discount')}
            disabled={!selectStatus['discount']}
            defaultValue={value && value.discount}
            min={0}
            max={1}
            step={0.01}
          />
          <div className="mgt-block">
            <p className="reset-p">（每件货都需达到）</p>
          </div>
        </div>
        <div style={{lineHeight: '44px'}}>
          <Checkbox
            checked={selectStatus['member_level']}
            onChange={this.handleSelect.bind(this, 'member_level')}
          >指定会员等级</Checkbox>
          <Select 
            onChange={this.handleChange.bind(this, 'member_level')}
            disabled={!selectStatus['member_level']}
            defaultValue={value && value.member_level || []}
            style={{width: 324}}
            mode="multiple"
          >
           { 
              memberLevel.map((item, idx) => (<Option key={idx} value={item.value}>{item.text}</Option>))
           }
          </Select>
        </div>
        <div style={{lineHeight: '44px'}}>
          <Checkbox
            checked={selectStatus['include_category']}
            onChange={this.handleSelect.bind(this, 'include_category')}
          >指定大类派发</Checkbox>
          <CategorySelector
            tags={tags}
            initData={value && value.include_category}
            onChange={this.handleChange.bind(this, 'include_category')}
            disabled={!selectStatus['include_category']}
          />
          <p className="reset-p" style={{paddingLeft: 120}}>（每件货都需满足）</p>
        </div>
        <div style={{lineHeight: '44px'}}>
          <Checkbox
            checked={selectStatus['out_category']}
            onChange={this.handleSelect.bind(this, 'out_category')}
          >排除指定大类</Checkbox>
          <CategorySelector
            tags={tags}
            initData={value && value.out_category}
            onChange={this.handleChange.bind(this, 'out_category')}
            disabled={!selectStatus['out_category']}
          />
          <p className="reset-p" style={{paddingLeft: 120}}>（有一件货被排除则不派发）</p>
        </div>
        <div style={{lineHeight: '44px'}}>
          <Checkbox
            checked={selectStatus['exclude_activity_id']}
            onChange={this.handleSelect.bind(this, 'exclude_activity_id')}
          >排除指定活动</Checkbox>
          <div style={{width: 324}} className="mgt-block">
            <TicketFilter 
              onChange={this.handleChange.bind(this, 'exclude_activity_id')} 
              disabled={!selectStatus['exclude_activity_id']}
              value={value ? {des:value.exclude_activity_name} : null}
            />
          </div>
        </div>
        <div style={{lineHeight: '44px'}}>
          <Checkbox
            checked={selectStatus['delayed_day']}
            onChange={this.handleSelect.bind(this, 'delayed_day')}
          >延迟派发</Checkbox>
          <InputNumber
            style={{marginLeft: 28}} 
            onChange={this.handleChange.bind(this, 'delayed_day')}
            disabled={!selectStatus['delayed_day']}
            defaultValue={value && value.delayed_day}
            min={0}
            step={1}
            formatter={value => value}
            parser={value => Math.ceil(value)}
          />
          <span style={{marginLeft: 3}}>天后派发</span>
        </div>
      </section>
    ) 
  }
}

class TicketFilter extends PureComponent {

  state = {
    fetching: false,
    data: [],
    value: ''
  }

  componentDidMount(){
    const { value } = this.props;
    this.fetchTicket = debounce(this.fetchTicket, 1000);
    // console.log(value);
    if(value){
      this.setState({
        value: value.des
      })
    }
  }


  async fetchTicket(value){
    this.setState({fetching: true});
    const res = await queryTickets({search_id: value})
    this.setState({
      fetching: false,
      data: res.data
    });
  }

  handleSelectChange(value){
    const { onChange } = this.props;
    this.setState({
      value
    })
    onChange(value);
  }

  async handleDropdownVisibleChange(){
    this.setState({fetching: true});
    const res = await queryTickets();
    if(res){
      this.setState({
        fetching: false,
        data: res.data.slice(0, 20)
      })
    }
  }

  render(){ 
    const { data, fetching, value } = this.state;
    return (
      <Select
        showSearch={true}
        value={value}
        placeholder='请输入可用状态卡劵编号'
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchTicket.bind(this)}
        onChange={this.handleSelectChange.bind(this)}
        onDropdownVisibleChange={this.handleDropdownVisibleChange.bind(this)}
        style={{ width: '100%' }}
        disabled={this.props.disabled}
      >
        {data.map(item => (
          <Option key={item.goods_id}>{item.des}</Option>
        ))}
      </Select>
    )
  }
}

class Condition extends PureComponent{

  handleChange = (ev) => {
    const { onChange } = this.props;
    onChange({distribute_object: ev.target.value});
  }

  render(){
    const { disabled, value } = this.props;
    return (
      <RadioGroup 
        onChange={this.handleChange} 
        defaultValue={value.distribute_object} 
        disabled={disabled}
        style={{
          width: '100%', 
          whiteSpace: 'inherit',
          paddingTop: 3
        }}
      >
        <Radio className="mgt-block" value={5}>销售开单后</Radio>
        <Radio className="mgt-block" value={6}>生日当天</Radio>
        <Radio className="mgt-block" value={7}>纪念日当天</Radio>
        <Radio className="mgt-block" value={8}>初次绑定手机后</Radio>
        <Radio className="mgt-block" value={9}>初次关注公众号</Radio>
      </RadioGroup>
    )
  }
}

class Reciver extends PureComponent{

  state = {
    type: 2,
    fileList: []
  }

  componentDidMount(){
    const { value } = this.props;
    if(value){
      this.setState({
        type: value.distribute_object
      })
    }
  }

  async downloadExcel(){
    const res = await downloadExcelTemp();
    if(res){
      window.open(res.data, '_blank');
    }
  }

  handleChange = (ev) => {
    const { onChange } = this.props;
    const val = ev.target.value;
    this.setState({type: val})
    onChange({
      file: undefined,
      txt: '',
      distribute_object: val,
    })
  }

  handleInputChange(ev){
    const val = ev.target.value;
    const { onChange } = this.props;
    onChange({
      txt: val,
      file: this.state.fileList[0],
      distribute_object: this.state.type,
    })
  }

  genUploaderProps = () => {
    const { onChange } = this.props;
    return {
      accept: '.csv, .xls, .xlsx',
      beforeUpload: (file)=>{
        this.setState(() => {
          return {
            fileList: [file]
          }
        });
        onChange({
          file,
          txt: '',
          distribute_object: this.state.type,
        })
        return false;
      },
      onRemove: () => {
        this.setState(() => {
          return {
            fileList: [],
          };
        });
        onChange({
          file: undefined,
          txt: '',
          distribute_object: this.state.type,
        })
      },
    }
  }

  render(){
    const { type, fileList } = this.state;
    const { value, disabled } = this.props;
    const uploaderProps = this.genUploaderProps();
    const { txt } = value;
    const defaultPhone = Array.isArray(txt) ? txt[0] : txt;
    return (
      <section>
        <RadioGroup 
          onChange={this.handleChange} 
          defaultValue={type} 
          disabled={disabled}
          className="form-item-lh"
        >
          <Radio value={2}>指定会员</Radio>
          <Radio value={1}>全部公众号粉丝</Radio>
          <Radio value={3}>筛选会员</Radio>
          <Radio value={4}>批量上传手机</Radio>
        </RadioGroup>
        <div className="reset-p">
          {
            type === 1 &&
            <span className="reset-p" style={{marginRight: 10}}>所有关注了公众号的粉丝</span>
          }
          {
            type === 2 && 
            <Input 
              className="mgt-block" 
              style={{width: 130}} 
              placeholder="会员手机号" 
              defaultValue={defaultPhone} 
              onBlur={this.handleInputChange.bind(this)} 
              disabled={disabled}
            />
          }
          {
            type === 3 && !disabled &&
            <p className="reset-p" style={{color: '#ff0000'}}>
              请到<Link to={`/app/statistics/vipStatistics?advanceExpand=true`}>数据灯塔-会员分析</Link>，按条件查询出会员，然后使用页面上的群发功能
            </p>
          }
          {
            type === 4 && !disabled &&
            <Fragment>
              <div className="mgt-block">
                <Upload {...uploaderProps} fileList={fileList}>
                  <Button icon={<UploadOutlined />}>选择文件</Button>
                </Upload>
              </div>
              <a className="mgt-blcok" style={{paddingLeft: 10}} onClick={this.downloadExcel.bind(this)}>下载模版</a>
            </Fragment>
          }
        </div>
      </section>
    )
  }
}