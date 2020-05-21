import React from 'react';
import { TreeSelect, Tree } from 'antd';
import debounce from 'lodash/debounce';
import { queryMenus } from '@/services/menu'

class MenuSelect extends React.Component {
  constructor(props) {
    super(props);
    this.fetchRole = debounce(this.fetchRole, 800);
    this.state = {
      data: [],
      value: this.props.value,
      fetching: false,
  };
  }

  toTree = (data, pid) => {
    const res = []
    if (data) {
      for (var i=0;i<data.length;i++)
      { 
        const item = data[i]
        if (pid == item.parent_id) {
          res.push({
            key: item.id+"",
            title: item.name,
            value: item.id + "",
            children: item.children ? this.toTree(item.children, item.id) : []
        })
        }
      }
    }
    return res
  }

  fetchRole = value => {
    this.setState({ data: [], fetching: true });
    queryMenus({"type": [value]}).then((response) => {
        
        if (response.data == null) {
            const data = []
            this.setState({ data, fetching: false });
        } else {

            const data = this.toTree(response.data, 0)
            this.setState({ data, fetching: false });
        }
        
    })
  };

  
  
  componentWillMount() {
    this.fetchRole(this.props.showType == undefined ? [] : this.props.showType)

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
  };




  render() {
    const { fetching, data, value } = this.state;
    
    return (
      <>
      {this.props.multiple && (
        <Tree
          checkable
          style={{ width: '100%' }}
          checkedKeys={value}
          treeData={data}
          onCheck={this.handleChange}
        />
      )}
      {!this.props.multiple && (
      <TreeSelect
          style={{ width: '100%' }}
          value={value}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={data}
          placeholder="选择分组"
          allowClear={true}
          // treeDefaultExpandAll
          onChange={this.handleChange}
        />
      )}
      </>
    );
  }
}

export default MenuSelect