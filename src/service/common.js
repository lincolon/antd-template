import axios from 'axios';
import { isString } from 'lodash-es';


//权限树
export function permissionList(data) {
    return axios.post('/role/menu', data);
}

export function refreshToken() {
    return axios.post('/refresh');
}

//地址解析
export function getAddressLocation(address){
    return axios.post('/management/map/address', {address})
}

//逆地址解析
export function getAddressRecommand(location){
    return axios.post('/management/map/location', {location})
}

//图片上传
export async function handleUploadImg(file) {
    console.log(file);
    if(file instanceof File){
        const res = await axios.post('/management/file/upload/image', {file, withFile: true})
        return res.data.url;
    }
    if(isString(file))return file;
    return file?.url || '';
}

//图片批量处理
export async function uploadImgs(filesList) {
    let imgs = [];
    for(let i = 0; i<filesList.length; i++){
        const res = await handleUploadImg(filesList[i]);
        imgs.push(res);
    }
    return imgs;
}

//文件上传
export async function handleUploadFile(file) {
    if(file instanceof File){
        const res = await axios.post('/management/file/upload/excel', {file, withFile: true})
        return res.data.url
    }
    return file
}

//文件处理
export async function uploadFiles(filesList) {
    let imgs = [];
    for(let i = 0; i<filesList.length; i++){
        const res = await handleUploadFile(filesList[i]);
        imgs.push(res);
    }
    return imgs;
}

//全部小区数据
export async function getAllAreas(data) {
    return axios.post('/management/community/all', data)
}

//可用省市区
export function activeCities(){
    return axios.post('/management/community/area')
}

//下载模版
export function downloadExcelTemp(data){
    return axios.post('/management/templates/url', data)
}