import axios from "axios";

//用户列表
export function getUserList(data) {
    return axios.post('/user/list', data);
}

//用户编辑
export function editUser(data) {
    return axios.post('/user/save', data);
}

//用户删除
export function removeUser(data) {
    return axios.post('/user/del', data);
}

//角色列表
export function getRolesList(data) {
    return axios.post('/role/list', data);
}

//基于权限的角色列表，创建账户时使用
export function rolesList(data) {
    return axios.post('/role/openList', data);
}


//角色编辑
export function editRoles(data) {
    return axios.post('/role/save', data);
}

//角色删除
export function removeRoles(data) {
    return axios.post('/role/del', data);
}

//项目列表
export function getProjectList(data) {
    return axios.post('/project/list', data);
}

//项目编辑
export function editProject(data) {
    return axios.post('/project/save', data);
}

//项目删除
export function removeProject(data) {
    return axios.post('/project/del', data);
}

//单位列表
export function getDepartmentList(data) {
    return axios.post('/dept/list', data);
}

//单位编辑
export function editDepartment(data) {
    return axios.post('/dept/save', data);
}

//单位删除
export function removeDepartment(data) {
    return axios.post('/dept/del', data);
}