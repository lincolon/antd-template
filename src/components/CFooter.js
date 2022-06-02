import { Layout } from 'antd';
import cookie from 'js-cookie';

export default function () {
  const now = new Date().getFullYear();
  const initDate = '2022';
  let crDate = initDate, serviceAddr = '';
  if(now > parseInt(initDate, 10)){
    crDate = `${crDate}-${now}`;
  }
  if(process.env.NODE_ENV === "development"){
    serviceAddr = cookie.get('hostApi');
  }
  return (
    <Layout.Footer style={{textAlign: "center", padding: '0px 50px 10px',backgroundColor:'#f3f6f9'}}>
      ©{crDate} newbee五人众 Co., Ltd. {serviceAddr}
    </Layout.Footer>
  )
}