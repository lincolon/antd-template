import { Layout } from 'antd';
import cookie from 'js-cookie';

export default function () {
  const now = new Date().getFullYear();
  const initDate = '2021';
  let crDate = initDate, serviceAddr = '';
  if(now > parseInt(initDate, 10)){
    crDate = `${crDate}-${now}`;
  }
  if(process.env.NODE_ENV === "development"){
    serviceAddr = cookie.get('hostApi');
  }
  return (
    <Layout.Footer style={{textAlign: "center", padding: '0px 50px 10px',backgroundColor:'#f3f6f9'}}>
      <div className="reset-p" style={{textAlign: 'center'}}>
        每鲜每纯
        <span className="mgt-block" style={{verticalAlign: 'baseline', margin: '0 3px',color: '#4BC5E9', padding: '1px 7px', borderRadius: 10, border: '1px solid #4BC5E9'}}>IPv6</span>
        网络
      </div>
      ©{crDate} 宝谷之宝 Co., Ltd. {serviceAddr}
    </Layout.Footer>
  )
}