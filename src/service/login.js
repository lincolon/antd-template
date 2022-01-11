import axios from "axios";

export function login(params) {
    return axios.post('/login', {data});
}