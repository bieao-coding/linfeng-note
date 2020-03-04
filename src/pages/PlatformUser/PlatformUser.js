/*eslint-disable*/
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {resMessage} from '@/utils/utils'
import {Divider,Popconfirm,Form,Card,Row,Col,Button,Input,Tag} from 'antd';
import CommonTable from '@/components/CommonTable';
@connect(({ platformUser, loading }) => ({
  platformUser,
  loading: loading.effects['platformUser/fetch'],
}))
class PlatformUser extends Component {
  maxHeight = window.innerHeight - 64 - 40 - 40 - 42 - 46 - 44;
  state = {
    rowKey:'userId',
    placeHolder:'登录名、真实姓名',
    list:[],
    oldList:[]
  };
  /*列名*/
  columns = [
    {
      title: '登录名',
      dataIndex: 'loginName',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '登录次数',
      dataIndex: 'loginCount',
      align:'center',
    },
    {
      title: '最近登录时间',
      dataIndex: 'lastLoginTime',
    },
    {
      title: ' 状态',
      dataIndex: 'status',
      render: (text, record) => (
        <Fragment>
          <Tag color={!record.status ? 'green' : 'red'}>{!record.status ? '启用' : '禁用'}</Tag>
        </Fragment>
      ),
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a href = 'javascript:void(0)' onClick={() =>  this.addAndEdit(1,record)}>编辑</a>
          <Divider type='vertical'/>
          <a href = 'javascript:void(0)' onClick={() =>  this.resetPassword(record)}>重置密码</a>
        </Fragment>
      ),
    },
  ];

  /*DOM加载完成后执行*/
  componentDidMount() {
    this.getList();
  }
  /*请求事件*/
  getList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'platformUser/fetch',
      payload:{search:''},
      callback:(res)=>{
        if(res && res.list){
          this.setState({list:res.list,oldList:res.list})
        }
      }
    });
  };
  /*查询值更改*/
  searchChange = (e) =>{
    const search = e.target.value;
    let {list,oldList} = this.state;
    list = oldList.filter((item)=>{
      return item.loginName.indexOf(search) > -1 || item.username.indexOf(search) > -1
    });
    this.setState({list:list});
  };
  /*新增*/
  addAndEdit = (type,record) => {
    const obj = {};
    if(type) obj.userId = record.userId;
    router.push({
      pathname:'/platformUser/form',
      state:obj
    });
  };
  /*重置密码*/
  resetPassword = (record) => {
    if(!record || !record.userId) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'platformUser/resetPassword',
      payload:record.userId,
      callback:(res)=>{
        resMessage(res);
      }
    });
  };
  render() {
    const {loading} = this.props;
    const {placeHolder,rowKey,list} = this.state;
    return (
      <Card>
        <Form layout="inline" className = 'm-b-10'>
          <Row gutter={{ md:8,sm:8,xs: 8 }}>
            <Col xxl = {5} xl = {6} lg ={7} xs = {8}>
              <Input placeholder = {placeHolder} onChange={this.searchChange}/>
            </Col>
            <Col xxl = {19} xl = {18} lg ={17} xs = {16}>
              <Row type="flex" justify="end">
                <Button type="primary" icon="plus" onClick={() => this.addAndEdit(0)}>
                  添加
                </Button>
              </Row>
            </Col>
          </Row>
        </Form>
        <CommonTable
          loading={loading}
          list = {list}
          rowKey = {rowKey}
          columns = {this.columns}
        />
      </Card>
    );
  }
}

export default PlatformUser;
