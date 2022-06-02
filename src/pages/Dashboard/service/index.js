import axios from "axios";

export function dataAnalyses(data) {
    return axios.post('/data/analyses', data);
}