import React from 'react';

import projectConfig from '../../../project.config.json';

export default function Logo(){

    return (
        <section className="logoContainer">
            <a onClick={() => {props.navigate('/dashboard', { replace: true })}}>
            <span className={`logo img-cover mgt-block`}></span>
            <h2 
                className="mgt-block" 
                style={{
                    color: '#2F80ED',
                    margin: 0,
                }}
            >{projectConfig.name}</h2>
            </a>
        </section>
    )
}