import React from 'react';
import 'antd/dist/antd.css';
import styles from './BaseView.less';
// import './index.css';
import { Button, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { connect, FormattedMessage, formatMessage } from 'umi';
import { updateAvatar } from '../service'


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class Avatar extends React.Component {
  state = {
    loading: false,
    imageUrl: this.props.avatar.startsWith('http') ? this.props.avatar : '/server' + this.props.avatar
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }

    console.log(info)

    if (info.file.status === 'done') {
      // Get this url from response in real world.
      console.log('aaa')
      getBase64(info.file.originFileObj, imageUrl => 
            this.setState({
                imageUrl,
                loading: false,
            }),
        );
    }
  };


  customRequest = async (option)=> {
    const formData = new FormData();
    const response = await updateAvatar(option.file)

    if (response['status'] == 'ok') {
        this.setState({
            loading: false,
            imageUrl: '/server' + response['message']
        })
    } else {
        console.log("ddd")
        this.setState({
            loading: false,
            uploading: false
        })
        message.error(response['message']);
    }
}


  render() {
    const { imageUrl } = this.state;
    return (
        <>
          <div className={styles.avatar_title}>
            <FormattedMessage id="accountandsettings.basic.avatar" defaultMessage="Avatar" />
          </div>
          <div className={styles.avatar}>
            <img src={imageUrl} alt="avatar" />
          </div>
          <Upload
            name="avatar"
            // action="/server/admin/api/avatar"
            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            // action={((file) => {const x = queryAvatar(file); console.log(x.)})}
            customRequest={this.customRequest}
            beforeUpload={beforeUpload}
            // onChange={this.handleChange}
            showUploadList={false}>
            <div className={styles.button_view}>
              <Button>
                <UploadOutlined />
                <FormattedMessage
                  id="accountandsettings.basic.change-avatar"
                  defaultMessage="Change avatar"
                />
              </Button>
            </div>
          </Upload>
        </>
      );
  }
}

export default Avatar