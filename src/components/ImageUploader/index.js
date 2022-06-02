import React, {PureComponent} from 'react';
import {
  Upload,
  message
} from 'antd';
import {
  PlusSquareFilled
} from '@ant-design/icons';

import './style.less';

export default class extends PureComponent {

  state = {
    fileList: this.props.value ? this.createImgsState(this.props.value) : []
  }

  // componentDidUpdate(prevProps){
  //   const { value } = this.props;
  //   if(value && !isEqual(value, prevProps.value)){
  //     this.setState({fileList: this.createImgsState(value)})
  //   }
  // }

  createImgsState(files) {
    const res = [];
    files.map(item => {
      let url;
      if(item.hasOwnProperty('id') && item.hasOwnProperty('url')){
        item.url !== '' &&
        res.push({
          uid: item.id,
          status: 'done',
          hasID: true,
          url: item.url,
        })
      }else{
        item !== '' && res.push({
          uid: new Date().valueOf() * Math.random(),
          status: 'done',
          url: item
        }) 
      }
    })
    return res;
  }

  formatFileList(fileList){
    return fileList.map(item => {
      if(item instanceof File){
        return item
      }
      return {
        ...item,
        url: item.url
      }
    })
  }

  genImgsUploaderProps = () => {
    const {limitSize, onChange, disabledRemove} = this.props;
    return {
      accept: '.jpg, .jpeg, .png, .JPG, .JPEG, .PNG',
      beforeUpload: (file)=>{
        const isLt = file.size / 1024 / 1024 < (limitSize || 0.5);
        if (!isLt) {
          message.error(`图片大小不能超过${limitSize || 0.5}M!`);
        }else{
          file.url = window.URL.createObjectURL(file);
          this.setState((state) => {
            const newFileList = [...state.fileList, file];
            onChange(this.formatFileList(newFileList));
            return {
              fileList: newFileList
            }
          });
        }
        return false;
      },
      onRemove: (file) => {
        if(disabledRemove && (file.url.indexOf('blob:http') === -1)){
          message.error('维修中的货品不能删除图片');
          return false;
        }
        this.setState((state) => {
          const index = state['fileList'].indexOf(file);
          const newFileList = state['fileList'].slice();
          newFileList.splice(index, 1);
          onChange(this.formatFileList(newFileList));
          return {
            fileList: newFileList,
          };
        });
      },
    }
  }

  render(){
    const { multiple } = this.props;
    const { fileList } = this.state;
    const imgUploaderProps = this.genImgsUploaderProps();
    const uploadButton = (
      <div>
        <PlusSquareFilled />
        <div className="antUploadText">添加图片</div>
      </div>
    );
    const max = this.props.max || 1;

    return (
      <Upload
        listType="picture-card"
        fileList={fileList}
        multiple={multiple || false}
        {...imgUploaderProps}
      >
        {fileList.length >= max ? null : uploadButton}
      </Upload>
    )
  }
}