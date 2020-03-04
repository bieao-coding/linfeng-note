/*eslint-disable*/
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {transPingTreeToChildren} from '@/utils/utils'
import {Card,Row,Col } from 'antd';
import info from '@/defaultInfo';
import CommonCompanyTree from '@/components/CommonCompanyTree';
import $ from 'jquery';
@connect(({ crane }) => ({
  crane
}))
class CraneLayout extends Component {
  maxHeight = window.innerHeight - 64 - 40;
  state = {
    oldTreeData:[],
    treeData:[],
    selectedKeys:[]
  };
  userInfo = {};
  /*DOM加载完成后执行*/
  componentDidMount() {
    this.userInfo = info.userInfo;
    if(!this.userInfo.userId) return;
    this.getTreeData();
  }
  /*请求树的事件*/
  getTreeData = () => {
    this.props.dispatch({
      type: 'note/getUsers',
      payload:{search:''},
      callback:(res)=>{
        const newList = res.list.filter((item)=>item.username !== 'admin');
        const treeData = transPingTreeToChildren({id:'userId',pid:'pid',children:'children'},newList,{name:['key','title'],value:['userId','username']});
        const resolve = newList.map((item)=>{
          return Object.assign(item,{key:item.userId.toString()});
        });
        this.setState({
          oldTreeData:resolve,
          treeData:treeData
        },()=>{
          this.initClickTree(treeData);
        })
      }
    });
  };
  /*初始点击树*/
  initClickTree = (treeData) => {
    const userId = this.userInfo.userId;
    if(!!treeData.length){
      const selectUser = treeData.filter((item)=>{
        return item.userId === userId;
      });
      const key = selectUser.length ? selectUser[0].key : treeData[0].key;
      this.setState({
        selectedKeys:[key]
      },()=>{
        this.onSelect([key]);
      })
    }
  };
  /*点击查询*/
  onSelect = (selectedKeys) => {
    this.setState({
      selectedKeys:selectedKeys
    });
    if(!selectedKeys.length) return false;
    const selectData = this.state.oldTreeData.filter((val)=>{
      return selectedKeys[0] === val.key;
    });
    if(!selectData.length) return;
    router.push({
      pathname:'/note/list',
      state:{userId:selectData[0].userId,loginId:this.userInfo.userId}
    });
  };
  render() {
    const {children} = this.props;
    const {treeData,selectedKeys} = this.state;
    return (
      <Card style = {{ height: `${this.maxHeight}px` }}>
        <Row className = 'all-height flex overflow-hidden' >
          <CommonCompanyTree
            onSelect = {this.onSelect}
            data = {treeData}
            selectedKeys = {selectedKeys}
          />
          <Col  className = 'all-height auto-flex' style={{width:'calc(100% - 256px)'}}>
            {children}
          </Col>
        </Row>
      </Card>
    );
  }
}

export default CraneLayout;
