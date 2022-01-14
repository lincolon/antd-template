import { useState, useEffect } from 'react';
import { debounce, isFunction } from 'lodash-es';

let searchHandler = () => {};

export default function useSelectSearch({ service, keywords, labelKey, valueKey = 'id' }) {

    const [ options, setOptions ] = useState([]);

    useEffect(() => {
        (async () => {
            const { data } = await service({page: 1, page_size: 20});
            setOptions(data.map(item => ({
                label: isFunction(labelKey) ? labelKey(item) : item[labelKey||''], 
                value: item[valueKey]
            })))
        })();

        searchHandler = debounce(async (val) => {
            const { data } = await service({page: 1, page_size: 20, [keywords]: val});
            setOptions(data.map(item => ({
                label: isFunction(labelKey) ? labelKey(item) : item[labelKey||''], 
                value: item[valueKey]
            })))
        }, 800)

    }, []);

    return [
        options,
        searchHandler
    ]
}