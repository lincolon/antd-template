import React from 'react';
import QQMap from 'QQMap';

import { getAddressLocation } from '@/service/common';

export default class Map extends React.PureComponent {
    
    qqMap = null;
    marker = null;
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

        const { value, onChange, actionRef } = this.props;

        if (actionRef && typeof actionRef !== 'function') {
            actionRef.current = {
                reload: this.handleAddressChange.bind(this),
                location: (lat, lng) => {
                    this.initLocaion(this.qqMap, this.marker, lat, lng);
                    onChange([lat, lng])
                }
            }
        }

        this.qqMap = new QQMap.Map(
            this.qqMapContainer.current, 
            {zoom: 16}
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
            this.initLocaion(this.qqMap, this.marker, value[0], value[1])
        }
    }

    componentWillUnmount(){
        if(this.qqMap){
            QQMap.event.removeListener(this.clickEventHandler);
            QQMap.event.removeListener(this.markerMoveHandler);
            this.qqMap = null;
            this.marker = null;
        }
    }

    render(){
        const { height } = this.props;
        return (
            <section ref={this.qqMapContainer} style={{height: height || 500, width: '100%', backgroundColor: '#f6f6f6'}}></section>
        )
    }
}