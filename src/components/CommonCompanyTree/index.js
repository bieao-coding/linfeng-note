/*eslint-disable*/
import React, {PureComponent} from 'react';
import {Tree, Input,Col,Row,Icon} from 'antd';
const TreeNode = Tree.TreeNode;
import styles from './index.less';
import $ from 'jquery'
class CommonCompanyTree extends PureComponent{
  constructor(props){
    super(props);
    this.state = {
      hover:false,
      click:false,
      expandedKeys:[],
      selectItems: null,
      autoExpandParent: false,
      searchValue: '',
    }
  }
  /*DOM加载完成后执行*/
  componentDidMount() {
    this.treeClick();
  }
  treeClick = () => {
    $('#search-tree').hover(()=>{
      this.setState({hover:true})
    },()=>{
      this.setState({hover:false})
    });
    $('#turn-left-right').click(()=>
      this.setState({click:!this.state.click})
    );
  };
  /*递归查找*/
  getSelectItem = (search, tree,selectItem) => {
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if(node.title.indexOf(search) > -1){
        const newNode = JSON.parse(JSON.stringify(node));
        delete newNode.children;
        selectItem.push(newNode);
      }
      if (node.children) {
        this.getSelectItem(search,node.children,selectItem);
      }
    }
    return selectItem;
  };
  /*展开*/
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  /*值更改*/
  onChange = (e) => {
    const value = e.target.value.toString();
    if(!!value){
      const items = this.getSelectItem(value,this.props.data,[]);
      this.setState({
        selectItems:items
      });
    }else{
      this.setState({
        selectItems:this.props.data
      });
    }
    this.setState({
      searchValue: value,
      autoExpandParent: true
    });
  };
  render(){
    let { searchValue, selectItems,expandedKeys, autoExpandParent,hover,click } = this.state;
    selectItems = !selectItems ? this.props.data : selectItems;
    const loop = data => data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.title}</span>;
      if (item.children) {
        return (
          <TreeNode key={item.key} title={title} icon={<Icon type="user" />}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={title} icon={<Icon type="user" />}/>;
    });
    return (
      <Col id= 'search-tree' className={[styles.searchTree,click ? styles.flex0 : styles.flex256].join(' ')}>
        <Row className='m-r-10'><Input placeholder="搜索" onChange={this.onChange} /></Row>
        <Tree
          showIcon
          onSelect = {this.props.onSelect}
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          selectedKeys = {this.props.selectedKeys}
          switcherIcon={<Icon type="down" />}
        >
          {loop(selectItems)}
        </Tree>
        <span id= 'turn-left-right' className = {[styles.turnLeftRight,hover ? styles.hoverColor : '',click ? styles.left0 : ''].join(' ')}>
          <i className = {[styles.fontSize12,'iconfont icon-turn',click ? styles.rotate180 : ''].join(' ')}/>
        </span>
      </Col>
    );
  }
}
export default CommonCompanyTree;
