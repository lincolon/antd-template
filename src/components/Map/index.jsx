import React from 'react';
import QQMap from 'QQMap';

import { getAddressLocation } from '@/service/common';

export default class Map extends React.PureComponent {
    
    qqMap = null;
    marker = null;
    markerLayer = null;
    qqMapContainer = React.createRef();

    initLocaion (mapHandle, marker, initLat , initLng){
        const center = new QQMap.LatLng(initLat , initLng);
        mapHandle.panTo(center);
        marker.setPosition(center);
        this.lat = initLat;
        this.lng = initLng;
    }

    async handleAddressChange(addressDetails) {
        if(addressDetails !== this.addressDetails){
            this.addressDetails = addressDetails;
            const res = await getAddressLocation(addressDetails);
            const lat = res.data.location.lat;
            const lng = res.data.location.lng;
            this.initLocaion(this.qqMap, this.marker, lat, lng)
            this.props.onChange([lat, lng]);
        }
    }

    componentDidMount(){

        const { value, onChange, actionRef, zoom } = this.props;

        if (actionRef && typeof actionRef !== 'function') {
            actionRef.current = {
                reload: this.handleAddressChange.bind(this),
                location: (lat, lng) => {
                    this.initLocaion(this.qqMap, this.marker, lat, lng);
                    onChange([lat, lng])
                },
                setMarks: (marks) => {
                    this.markerLayer = new QQMap.MultiMarker({
                        map: this.qqMapContainer.current,  //指定地图容器
                        //样式定义
                        styles: {
                            //创建一个styleId为"myStyle"的样式（styles的子属性名即为styleId）
                            "myStyle": new QQMap.MarkerStyle({ 
                                "width": 25,  // 点标记样式宽度（像素）
                                "height": 35, // 点标记样式高度（像素）
                                "src": '../img/marker.png',  //图片路径
                                //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
                                "anchor": { x: 16, y: 32 }  
                            }) 
                        },
                        //点标记数据数组
                        geometries: [{
                            "id": "1",   //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
                            "styleId": 'myStyle',  //指定样式id
                            "position": new QQMap.LatLng(39.954104, 116.357503),  //点标记坐标位置
                            "properties": {//自定义属性
                                "title": "marker1"
                            }
                        }, {//第二个点标记
                            "id": "2",
                            "styleId": 'marker',
                            "position": new TMap.LatLng(39.994104, 116.287503),
                            "properties": {
                                "title": "marker2"
                            }
                        }
                        ]
                    });
                    this.markerLayer.on('click', this.maskLayerClick)
                    return this.markerLayer;
                }
            }
        }

        this.qqMap = new QQMap.Map(
            this.qqMapContainer.current, 
            {zoom: zoom || 16}
        );
        this.marker = new QQMap.Marker({
            map: this.qqMap,
            draggable: true,
        }); 

        this.clickEventHandler = QQMap.event.addListener(this.qqMap, 'click', (event) => {
            const lat = event.latLng.getLat();
            const lng = event.latLng.getLng();
            this.initLocaion(this.qqMap, this.marker, lat, lng);  
            onChange([lat, lng])
        });
        this.markerMoveHandler = QQMap.event.addListener(this.marker, 'dragend', (event) => {
            const lat = event.latLng.getLat();
            const lng = event.latLng.getLng();
            this.initLocaion(this.qqMap, this.marker, lat, lng);
            onChange([lat, lng])
        });
        if(value){
            console.log(value)
            this.initLocaion(this.qqMap, this.marker, value[0], value[1])
        }
    }

    maskLayerClick(evt){
        const { onMaskLayerClick } = this.props;
        onMaskLayerClick && onMaskLayerClick(evt.geometry.properties)
    }

    componentWillUnmount(){
        if(this.qqMap){
            QQMap.event.removeListener(this.clickEventHandler);
            QQMap.event.removeListener(this.markerMoveHandler);
            if(this.markerLayer){
                this.markerLayer.off('click', this.maskLayerClick);
            }
            this.qqMap = null;
            this.marker = null;
            this.markerLayer = null;
        }
    }

    render(){
        const { height } = this.props;
        return (
            <section ref={this.qqMapContainer} style={{height: height || 500, width: '100%', backgroundColor: '#f6f6f6'}}></section>
        )
    }
}