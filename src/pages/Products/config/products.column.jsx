import {Avatar} from 'antd';

export default [
    {
        title: '商品图片',
        dataIndex: 'pic',
        hideInSearch: true,
        render: (pic) => {
            return <Avatar src={pic} size={64} />
        }
    },
    {
        title: '商品描述',
        dataIndex: 'title',
        ellipsis: true,
    },
    {
        title: '库存',
        dataIndex: 'stock',
        hideInSearch: true
    },
    {
        title: '销量',
        dataIndex: 'stock',
        hideInSearch: true
    },
    {
        title: '活动价',
        dataIndex: 'stock',
        hideInSearch: true
    },
    {
        title: '零售价',
        dataIndex: 'stock',
        hideInSearch: true
    },
    {
        title: '排序',
        dataIndex: 'stock',
        hideInSearch: true
    },
    {
        title: '商品编号',
        dataIndex: 'sn',
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        hideInSearch: true
    },
    {
        title: '最近更新',
        dataIndex: 'update_at',
        hideInSearch: true
    },
    {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: {
            all: {text: '全部', status: 'Default'},
            1: {text: '在售', status: 'Processing'},
            2: {text: '下架', status: 'Error'},
        }
    }
]