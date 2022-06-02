import { useState, useEffect, useMemo } from 'react';
import isFunction from 'lodash-es/isFunction';
import debounce from 'lodash-es/debounce';

export default function useSelectSearch({ service, keywords, labelKey, valueKey = 'id', params = {}, auto = true }) {

    const [ options, setOptions ] = useState([]);

    useEffect(() => {
        if(auto){
            (async () => {
                const { data } = await service({page: 1, page_size: 20, ...params});
                setOptions(data.map(item => ({
                    label: isFunction(labelKey) ? labelKey(item) : item[labelKey||''], 
                    value: item[valueKey]
                })))
            })();
        }
    }, []);

    const searchHandler = useMemo(() => {
        return debounce(async (val) => {
            const { data } = await service({page: 1, page_size: 20, ...params, [keywords]: val});
            setOptions(data.map(item => ({
                label: isFunction(labelKey) ? labelKey(item) : item[labelKey||''], 
                value: item[valueKey]
            })))
        }, 800)
    }, [])

    return [
        options,
        searchHandler
    ]
}