import React from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { queryUsers } from '@/services/user'

const { Option } = Select;

class UserSelect extends React.Component {
  constructor(props) {
    super(props);
    this.fetchRole = debounce(this.fetchRole, 800);
  }

  fetchRole = value => {
    this.setState({ data: [], fetching: true });
    if (value.length > 0) {
      queryUsers({"name": value}).then((response) => {
        
        if (response.data == null) {
            const data = []
            this.setState({ data, fetching: false });
        } else {
            const data = response.data.map((item) => ({value: item.id+"", text: item.name}))
            this.setState({ data, fetching: false });
        }
      })
    } else {
      const data = []
            this.setState({ data, fetching: false });
    }

  };
  
  componentWillMount() {
    this.fetchRole("")
    this.state = {
        data: [],
        // value: this.props.value != undefined ? this.props.value.map((item) => ({value: item.id+"", text: item.name})) : [],
        value: this.props.value,// != undefined ? this.props.value.map((item) => (item.id+"")) : [],
        fetching: false,
    };
  }


  handleChange = (value) => {
    this.setState({
      value,
    //   data: [],
      fetching: false,
    });

    if (this.props.valueMap != undefined) {
      this.props.onChange(value.map(this.props.valueMap))
    } else {
      this.props.onChange(value)
    }

    
    // this.props.onChange(
    //   value.map((item) => {return {id: parseInt(item)}})
    // )
  };


  render() {
    const { fetching, data, value } = this.state;
    
    return (
      <Select
        showSearch
        // labelInValue={this.props.labelInValue}
        value={value}
        placeholder="输入用户名"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchRole}
        onChange={this.handleChange}
        style={{ width: '100%' }}
      >
        {data.map(d => (
          <Option key={d.value}>{d.text}</Option>
        ))}
      </Select>
    );
  }
}

export default UserSelect