/*eslint-disable*/
import React, {PureComponent} from 'react';
import {Table} from 'antd';


class CommonTable extends PureComponent{
  constructor(props){
    super(props);
    this.state = {
      searchValue:''
    }
  }
  render(){
    const {rowKey,list,columns,loading,scroll}  = this.props;
    return (
      <div>
        <Table
          size = 'middle'
          rowKey = {rowKey}
          pagination = {false}
          dataSource={list}
          columns={columns}
          loading={loading}
          scroll = {!!scroll ? scroll : {x:0}}
        />
      </div>
    );
  }
}
export default CommonTable;
