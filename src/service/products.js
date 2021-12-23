import axios from 'axios';
import projectConfig from '../../project.config.json';

//商品列表
export async function getProducts(data = {}) {
    return axios.post('/management/goods/list', data);
}

//商品添加
export function addProducts(data = {}) {
    return axios.post('/management/goods/list', data);
}

//商品编辑
export function editProducts(data = {}) {
    return axios.post('/management/goods/list', data);
}

//SKU列表
export function getSku(data = {}) {
    return axios.post('/management/products/list', data);
}

//sku修改
export function editSku(data = {}) {
    return axios.post('/management/products/edit', data);
}

//第三方商品列表
export function getOtherProducts(data = {}) {
    return axios.post('/management/products/third/list', data);
}

//商品上柜
export function productsOnline(data = {}) {
    return axios.post('/management/products/third/online', data);
}