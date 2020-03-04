/*eslint-disable*/
import React, { Component } from 'react';
import { Form, Input,Card,Button,Select,Cascader  } from 'antd';
import {connect} from "dva/index";
import {resMessage,transPingTreeToChildren} from '@/utils/utils'
const FormItem = Form.Item;
const Option = Select.Option;
@connect(({ platformUser }) => ({
  platformUser
}))
@Form.create()
class PlatformUserForm extends Component {
  state = {
    loading:false,
    params:{
      userId:null,
      loginName:null,
      username:null,
      status:0,
    }
  };
  // /*DOM加载完成后执行*/
  componentDidMount() {
    const params = this.props.location.state;
    if(params && params.userId){
      this.setState({id:params.userId},()=>{
        this.getEditData();
      });
    }
  }
  /*获取单项数据*/
  getEditData = () => {
    const {dispatch}  =this.props;
    dispatch({
      type: 'platformUser/getEdit',
      payload:this.state.id,
      callback:(res)=>{
        this.setState({params:res});
      }
    })
  };
  /*保存*/
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.setState({loading:true});
      this.props.dispatch({
        type: !!this.state.params.userId ? 'platformUser/edit' : 'platformUser/add',
        payload:{...this.state.params,...values},
        callback:(res) => {
          resMessage(res);
          this.setState({loading:false});
          if(res && !res.status){
            this.props.history.go(-1);
          }
        }
      })
    });
  };
  /*渲染*/
  render() {
    const { getFieldDecorator } = this.props.form;
    //自适应
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 },
        md: { span: 8 },
        xl: { span: 8 }
      },
      wrapperCol: {
        sm: { span: 12 },
        md: { span: 12 },
        xl: { span: 8 }
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    // 验证规则
    const formRules = {
      loginName:{
        rules:[{required: true, message: '请输入登录名',whitespace: true}],
        initialValue:this.state.params.loginName
      },
      username:{
        rules:[{required: true, message: '请输入用户姓名',whitespace: true}],
        initialValue:this.state.params.username
      },
      status:{
        initialValue:this.state.params.status
      },
    };
    const {params} = this.state;
    const {userId} = params;
    return (
      <Card>
        <Form onSubmit={this.handleSubmit} >
          <FormItem
            {...formItemLayout}
            label="登录名"
          >
            {getFieldDecorator('loginName', formRules.loginName)(
              <Input disabled={!!userId}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="用户名"
          >
            {getFieldDecorator('username', formRules.username)(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="状态"
          >
            {getFieldDecorator('status', formRules.status)(
              <Select>
                <Option value={0}>启用</Option>
                <Option value={1}>禁用</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" loading = {this.state.loading}>保存</Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
};
export default PlatformUserForm;
