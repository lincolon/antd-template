import React from 'react';
import { PageHeader } from 'antd';

import projectConfig from '../../../project.config.json';

export default class PageHeaderWrapper extends React.PureComponent {

  componentDidMount(){
    document.title = `${this.props.title || ''}-${projectConfig.name}`;
  }

  render() {
    const {onBack, title, extra, footer, back} = this.props;
    const handleBack = onBack ? onBack : ()=>window.history.back();
    const props = back ? {onBack: handleBack} : null;
    return (
      <React.Fragment>
        <PageHeader 
          title={title}
          extra={extra}
          footer={footer}
          {...props}
        ></PageHeader>
        <section 
          style={{
            margin: 12,
            backgroundColor: this.props.noBg ? 'none' : '#fff', 
            borderRadius: 6,
            overflow: 'hidden'
          }}>
          {this.props.children}
        </section>
      </React.Fragment>
    )
  }
}