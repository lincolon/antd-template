import React from 'react';
import MyTree from '../../components/MyTree'

export default function Dashboard(){

    return <div className="flexbox" style={{height: '100%'}}>
        <div style={{height: '100%', width: 200, background: '#fff', overflowX: 'auto'}}>
            <MyTree data={[]} onClick={(data) => console.log(data)} width={300} />
        </div>
        <div className="flex1">
            {/* <Map height="100%" zoom={5} /> */}
        </div>
    </div>
}