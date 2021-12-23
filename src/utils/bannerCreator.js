import zrender from 'zrender';

export default class BannerCreator {
  constructor(containerId, renderData){
    this.dom = document.getElementById(containerId);
    this.ctx = this.dom.getContext('2d');
    this.zr = zrender.init(this.dom);
    this.renderData = renderData;
    this.isdone = false;
    this.show();
  }

  async show(){
    this.zr.clear();
    await this.createAvatar();
    this.createTitle();
    await this.createBanner();
    this.createBottomBlock();
  }

  drawImage(timeout){
    return new Promise((resolve) => {
      setTimeout(()=>{
        const imgBase64Data = this.zr.painter.getRenderedCanvas({
                                backgroundColor: '#fff'
                              }).toDataURL('image/png');
        this.destory();
        resolve(imgBase64Data);
      }, timeout || 3000 )
    })
  }

  createBg(){
    const bg = new zrender.Rect({
      shape: {
        x: 0,
        y: 0,
        width: 750,
        height: 1334,
      },
      style: {
        fill: '#fff',
      }
    })
    this.zr.add(bg);
  }

  async createAvatar(){
    const {avatar} = this.renderData;
    let img ;
    console.log(avatar);
    if(avatar !== ''){
      img = new zrender.Image({
        style: {
          image: await downloadImage(avatar),
          x:30,
          y:30,
          width:80,
          height:80
        }
      });
    }else{
      img = new zrender.Rect({
        shape: {
          x:30,
          y:30,
          width:80,
          height:80
        },
        style: {
          fill: '#f3f6f9',
        }
      });
    }

    const clipPath = new zrender.Circle({
            shape: {
              cx: 70,
              cy: 70,
              r: 40
            }
          });

    img.setClipPath(clipPath);

    this.zr.add(img);
  }

  createTitle(){
    const {title} = this.renderData;
    const g = new zrender.Group();
    g.position[0] = 130;
    g.position[1] = 30;
    const bannerTitle = new zrender.Text({
      style: {
        text: title.replace(/\r\n/g, '').replace(/\n/g, ''),
        fontWeight: 'bolder',
        fontSize: 28,
        textFill: '#333',
        textLineHeight: 80,
        truncate: {
          outerWidth: 600
        }
      }
    });
    g.add(bannerTitle)
    this.zr.add(g);
  }

  async createBanner(){
    const {goodsPic} = this.renderData;
    const image = await downloadImage(goodsPic);
    const img = new zrender.Image({
      style: {
        image,
        x:0,
        y:140,
        width:750,
        height:700
      }
    })
    this.zr.add(img);
  }

  async createBottomBlock(){
    const {desc} = this.renderData;
    const g = new zrender.Group(({
      position: [0, 860]
    }));
    const titles = splitDesc(desc.replace(/\r\n/g, '').replace(/\n/g, ''), 750, 30);
    let i = 0;
    for(let l = titles.length; i < l; i++){
      const isLast = i === l-1;
      g.add(new zrender.Text({
        position: [0, 34*i],
        style: {
          text: titles[i],
          fontWeight: 'bolder',
          fontSize: 28,
          textFill: '#333',
          textLineHeight: 34,
          textPadding: [0, 26],
          truncate: {
            outerWidth: isLast ? 750 : null
          }
        }
      }))
    }
    let baseTop = 34*i;
    if(this.renderData.hasOwnProperty('priceNow')){
       g.add(this.createPrice(0, baseTop));
    }else{
      baseTop -= 60;
    }
    g.add(this.createDashLine(0, baseTop + 90));
    g.add(await this.createQrcode(0, baseTop + 100));
    g.add(this.createShopInfo(250, baseTop + 200));
    this.zr.add(g);
    return g;
  }

  createDashLine(x, y){
    return new zrender.Line({
      shape: {
        x1: x,
        y1: y,
        x2: 750,
        y2: y+2
      },
      style: {
        fill: '#f3f6f9',
        lineDash: [10, 10]
      }
    })
  }

  createPrice(x, y){
    const {priceNow, priceOld} = this.renderData;
    const g = new zrender.Group({
      position: [x, y + 60]
    })
    g.add(new zrender.Text({
      style: {
        text: `¥${priceNow || 0}`,
        fontWeight: 'bold',
        textFill: '#ff5670',
        fontSize: 40,
        textVerticalAlign: 'bottom',
        textPadding: [10, 26],
      }
    }))
    if(parseFloat(priceOld) > 0){
      const offsetX = priceNow.length * 30;
      g.add(new zrender.Text({
        position: [offsetX, 0],
        style: {
          text: `¥${priceOld}`,
          textFill: '#bcc6dd',
          fontSize: 30,
          textVerticalAlign: 'bottom',
          textPadding: [10, 26],
        }
      }))
      g.add(new zrender.Rect({
        shape: {
          x: offsetX + 20,
          y: -25,
          width: priceOld.length * 30 - 15,
          height: 2,
        },
        style: {
          fill: '#bcc6dd',
        }
      }))
    }
    return g;
  }

  async createQrcode(x, y){
    const {qrcode} = this.renderData;
    const image = await downloadImage(qrcode);
    return new zrender.Image({  
      style: {
        x,
        y,
        image,
        width: 250,
        height: 250,
      }
    })
  }

  createShopInfo(x, y){
    const {shopInfo} = this.renderData;
    const address = shopInfo.province + shopInfo.city + shopInfo.area + shopInfo.address;
    const shopName = shopInfo.name;
    const g = new zrender.Group({
      position: [x, y]
    });
    const addressArr = splitDesc(address, 500, 22);
    g.add(new zrender.Text({
      style: {
        text: shopName,
        fontWeight: 'bold',
        fontSize: 26,
        textLineHeight: 30,
      }
    }))
    addressArr.forEach((item, idx) => {
      g.add(new zrender.Text({
        position: [0, idx*26 + 32],
        style: {
          text: item,
          textFill: '#bcc6dd',
          fontSize: 22,
          textLineHeight: 26,
        }
      }))
    })
    return g;
  }

  destory(){
    this.zr.dispose();
  }
}

function downloadImage(src){
  return new Promise((resolve) => {
    var img = new Image();
    img.setAttribute("crossOrigin", 'Anonymous');
    img.src = src + '?t=' + new Date().valueOf();
    img.onload = function() {
      resolve(img)
    }
  })
}

function isChinese(str){
  return /[\u4e00-\u9fa5]/g.test(str);
}

function splitDesc(desc, width, itemWidth){
  const max = Math.floor(width/itemWidth);
  let count = 0;
  
  for(let i = 0, l = desc.length; i < l; i++){
    isChinese(desc[i]) ? count+=1 : count+=0.5;
    if(count >= max)break;
    if(i === l - 1 && count < max){
      count = desc.length;
    }
  }
  return [
    desc.substring(0, count),
    desc.substring(count)
  ];
}