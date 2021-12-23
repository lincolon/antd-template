import React, { createElement } from 'react';
import { Button } from 'antd';
import config from './typeConfig';
import styles from './style.less';

class Exception extends React.PureComponent {
  static defaultProps = {
    backText: '返回首页',
    redirect: '/app/dashboard',
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      backText,
      linkElement = 'a',
      type,
      // title,
      desc,
      img,
      actions,
      redirect,
    } = this.props;
    const pageType = type in config ? type : '404';
    return (
      <div className="exception">
        <div className="imgBlock">
          <div
            className="imgEle"
            style={{ backgroundImage: `url(${img || config[pageType].img})` }}
          />
        </div>
        <div className="content">
          {/* <h1>{title || config[pageType].title}</h1>
          <div className="desc">{desc || config[pageType].desc}</div> */}
          <h3>{desc || config[pageType].desc}</h3>
          <div className="actions">
            {actions ||
              createElement(
                linkElement,
                {
                  to: redirect,
                  href: redirect,
                },
                <Button type="primary">{backText}</Button>
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default Exception;
