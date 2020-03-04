/*eslint-disable*/
import React, { Component } from 'react';
import {Form, Input, Card, Button, Select} from 'antd';
import {connect} from "dva/index";
import {resMessage} from '@/utils/utils'
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea}  = Input;
@connect(({ note, loading }) => ({
  note,
  loading: loading.effects['note/getEdit'],
}))
@Form.create()
class NoteForm extends Component {
  state = {
    loading:false,
    params:{
      userId:null,
      entryId:null,
      entryTitle:null,
      entryContent:null,
      entryStatus:0
    }
  };
  // /*DOM加载完成后执行*/
  componentDidMount() {
    const params = this.props.location.state;
    if(params && params.userId) {
      this.setState({params:{...this.state.params,...{userId:params.userId}}});
      if(params.entryId){
        this.setState({params:{...this.state.params,...{entryId:params.entryId}}},()=>{
          this.getEditData();
        });
      }
    }
  }
  /*获取单项数据*/
  getEditData = () => {
    this.props.dispatch({
      type: 'note/getEdit',
      payload:this.state.params.entryId,
      callback:(data)=>{
        this.setState({params:data});
      }
    })
  };
  // /*保存*/
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.setState({loading:true});
      values.entryContent = values.entryContent.trim();
      this.props.dispatch({
        type: !!this.state.params.entryId ? 'note/edit' : 'note/add',
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
      entryTitle:{
        rules:[{required: true, message: '请输入日志标题'}],
        initialValue:this.state.params.entryTitle
      },
      entryContent:{
        rules:[{required: true, message: '请输入日志内容'}],
        initialValue:this.state.params.entryContent
      },
      entryStatus:{
        initialValue:this.state.params.entryStatus
      }
    };
    // 编辑赋值
    return (
      <div>
        <Form onSubmit={this.handleSubmit} >
          <FormItem
            {...formItemLayout}
            label="标题"
          >
            {getFieldDecorator('entryTitle', formRules.entryTitle)(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="内容"
          >
            {getFieldDecorator('entryContent', formRules.entryContent)(
              <TextArea rows={5}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="状态"
          >
            {getFieldDecorator('entryStatus', formRules.entryStatus)(
              <Select>
                <Option value={0}>未开始</Option>
                <Option value={1}>工作中</Option>
                <Option value={2}>暂停</Option>
                <Option value={3}>完成</Option>
                <Option value={4}>推迟</Option>
                <Option value={5}>取消</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" loading = {this.state.loading}>保存</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
};
export default NoteForm;
