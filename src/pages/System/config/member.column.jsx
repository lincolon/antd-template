import {Avatar,Tag,Tooltip} from 'antd';
import {setDateDefaultValue} from '../../../utils/helper'

export const roles = [
    {label: '配送员', value: '2'},
    {label: '合伙人', value: '3'},
    {label: '临时开门', value: '4'},
    {label: '网点上报', value: '5'},
    {label: '合伙人临时开门', value: '6'},
]

export default [
    {
        title: '头像',
        dataIndex: 'avatar',
        hideInSearch: true,
        fixed: 'left',
        width: 60,
        render: (avatar) => {
            return <Avatar src={avatar} size={32} shape="circle" />
        }
    },
    {
        title: '昵称',
        dataIndex: 'nickname',
        width: 100,
        ellipsis: true,
        hideInSearch: true,
    },
    {
        title: '姓名',
        dataIndex: 'real_name',
        width: 120,
    },
    {
        title: '手机',
        dataIndex: 'phone',
        width: 120,
    },
    {
        title: '角色',
        dataIndex: 'role_ids',
        width: 120,
        hideInSearch: true,
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
    // {
    //     title: '所属小区',
    //     dataIndex: 'plan_community_title',
    //     hideInSearch: true,
    //     render(communities){
    //         let cms = communities.map(item => item.title);
    //         if(cms.length){
    //             cms = cms.join('、');
    //             return <Tooltip title={cms}><div className="word-ellipsis">{cms}</div></Tooltip>
    //         }
    //         return null;
    //     }
    // },
    // {
    //     title: '小区',
    //     dataIndex: 'plan_community_id',
    //     hideInTable: true,
    //     hideInForm: true,
    //     renderFormItem: () => <CommunitySelect />
    // },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        width: 180,
        valueType: 'dateRange',
        search: {
            transform: (value) => ({ register_start_at: value[0], register_end_at: value[1] }),
        },
        renderFormItem: (_, props, form) => {
            const { defaultRender } = props;
            setDateDefaultValue(form, "created_at", "register_start_at", "register_end_at");
            return defaultRender(_);
        },
        render(_, { created_at }){
            return created_at;
        }
    },
    {
        title: '最近活跃',
        dataIndex: 'updated_at',
        width: 180,
        hideInSearch: true
    },
    {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
        width: 80,
        fixed: 'right',
        valueEnum: {
            
            0: {text: '未知', status: 'Default'},
            1: {text: '正常', status: 'Processing'},
            2: {text: '禁用', status: 'Error'},
        }
    }
]