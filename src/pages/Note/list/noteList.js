/*eslint-disable*/
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {resMessage,compare} from '@/utils/utils'
import {Form, Card, Row, Col, Button, Tag,Input,DatePicker } from 'antd';
import {transPingTreeToChildrenUnique} from '@/utils/utils'
import router from "umi/router";
import styles from './noteList.less';
import moment from 'moment';
@connect(({ note, loading }) => ({
  note,
  loading: loading.effects['note/fetch'],
}))
class NoteList extends React.Component {
  maxHeight = window.innerHeight - 64 - 40 - 40 - 44;
  state = {
    userId:null,
    currentUser:null,
    oldNotes:null,
    notes:null,
    placeHolder:'选择时间'
  };
  /*DOM加载完成后执行*/
  componentDidMount() {
    const location = this.props.location.state;
    if(location && location.userId){
      this.setState({userId:location.loginId},()=>{
        this.getList(location.userId);
      })
    }
  }
  /*属性变化执行*/
  componentWillReceiveProps (nextProps){
    const nextState = nextProps.location.state;
    const currentState = this.props.location.state;
    if((currentState && nextState.userId !== currentState.userId) || (!currentState && nextState)){
      this.setState({userId:nextState.loginId},()=>{
        this.getList(nextState.userId);
      })
    }
  }
  /*请求事件*/
  getList = (userId) => {
    this.setState({currentUser:userId});
    const { dispatch } = this.props;
    dispatch({
      type: 'note/fetch',
      payload:{userId:userId},
      callback:(res)=>{
        if(res){
          res = this.compareObj(res);
          this.setState({oldNotes:res});
          this.showNote(res,userId);
        }
      }
    });
  };
  /*对象排序*/
  compareObj(data){
    const keys = Object.keys(data).sort(compare(1));
    const newobj = {};
    for(const item of keys){
      newobj[item] = data[item];
    };
    return newobj;
  }
  /*处理展示日志*/
  showNote(data,userId){
    let html = [];
    let i = 0;
    const loginUserId = this.state.userId;
    for(const key in data){
      i++;
      const day = '星期' + this.showWeek(moment(key).day());
      html.push(<div className={styles.title} key={i}>{key + '（' + day + '）'}</div>)
      const notes = data[key];
      const tables = [];
      notes.forEach((item,index)=>{
        i++;
        const statusTag = this.showStatus(item.entryStatus);
        const content = this.resolveEnter(item.entryContent);
        tables.push(
          <tr key={i}>
            <td style={{width:'200px'}}>{item.entryTitle}</td>
            <td >{content}</td>
            <td style={{width:'100px'}} className='text-center'>
              <Fragment>
                {statusTag}
              </Fragment>
            </td>
            <td style={{width:'150px'}}>{item.insertTime.replace(/T/,' ')}</td>
            <td style={{width:'150px'}}>{item.updateTime ? item.updateTime.replace(/T/,' ') : ''}</td>
            {
              loginUserId === userId ? (
                <td style={{width:'50px',whiteSpace: 'nowrap'}}>
                  <Fragment>
                    <a href = 'javascript:void(0)' onClick={() =>  this.edit(key,index)}>编辑</a>
                  </Fragment>
                </td>
              ):(<td className='hide'></td>)
            }
          </tr>
        )
      });
      i++;
      html.push(<table key={i}><tbody>{tables}</tbody></table>);
    }
    this.setState({notes:html})
  }
  /*处理回车显示*/
  resolveEnter(content){
    const contentBr = content.replace(/(\r\n|\n|\r)/gm, "<br/>");
    const contentP = contentBr.split('<br/>');
    return contentP.map((item,index)=>{
      return <div key={'a' + index}>{!!item ? item : <br/>}</div>
    })
  }
  /*显示状态*/
  showStatus(status){
    let color = '';
    let content = '';
    switch(status){
      case 0:
        color = 'orange';
        content = '未开始';
        break;
      case 1:
        color = 'blue';
        content = '工作中';
        break;
      case 2:
        color = 'cyan';
        content = '已暂停';
        break;
      case 3:
        color = 'green';
        content = '已完成';
        break;
      case 4:
        color = 'purple';
        content = '已推迟';
        break;
      case 5:
        color = 'magenta';
        content = '已取消';
        break;
    }
    return <Tag color={color}>{content}</Tag>
  }
  /*显示星期*/
  showWeek(day){
    switch(day){
      case 0:
        return '日';
        break;
      case 1:
        return '一';
        break;
      case 2:
        return '二';
        break;
      case 3:
        return '三';
        break;
      case 4:
        return '四';
        break;
      case 5:
        return '五';
        break;
      case 6:
        return '六';
        break;
      default:
        return '';
        break;
    }
  }
  /*新增*/
  add = () => {
    const obj = {};
    obj.userId = this.state.userId;
    router.push({
      pathname:'/note/form',
      state:obj
    });
  };
  /*编辑*/
  edit = (key,index) =>{
    const obj = {};
    const {oldNotes} = this.state;
    obj.userId = this.state.userId;
    if(!oldNotes[key] || !oldNotes[key][index]) return;
    obj.entryId = oldNotes[key][index].entryId;
    router.push({
      pathname:'/note/form',
      state:obj
    });
  };
  /*查询值更改*/
  onChange = (date, dateString) =>{
    const {oldNotes,currentUser} = this.state;
    let newNote = {};
    for(const key in oldNotes){
      if(key === dateString){
        newNote[key] = oldNotes[key];
      }
    };
    if(!date) newNote = oldNotes;
    this.showNote(newNote,currentUser);
  };
  render() {
    const {userId,currentUser,notes,placeHolder} = this.state;
    return (
      <div className='m-l-10'>
        <Form layout="inline" className = 'm-b-10'>
          <Row gutter={8} className = 'm-b-10'>
            <Col xxl = {5} xl = {6} lg ={7} xs = {8}>
              <DatePicker placeholder={placeHolder} onChange={this.onChange} />
            </Col>
            <Col xxl = {19} xl = {18} lg ={17} xs = {16} className='flex row-end'>
              <Button type="primary" className={userId === currentUser ? 'show':'hide'} icon="plus" onClick={()=>this.add()}>
                添加
              </Button>
            </Col>
          </Row>
        </Form>
        <Row className={styles.note} style={{maxHeight:this.maxHeight,overflow:'auto'}}>
        {notes}
        </Row>
      </div>
    );
  }
}

export default NoteList;
