/*eslint-disable*/
import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';
import {message} from 'antd';
const preValue = Math.PI / 180; // 计算弧度制专用
/*类型判断（大写）*/
const typeOf = (obj) => {
  const objStr = Object.prototype.toString.call(obj);
  return objStr.replace('[object ', '').replace(']', '');
};
/*判断children*/
const nodeChildren = (setting, node, newChildren) => {
  if (!node) {
    return null;
  }
  const key = setting.children;
  if (typeof newChildren !== 'undefined') {
    node[key] = newChildren;
  }
  return node[key];
};
export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}
/*返回提示消息*/
export function resMessage(res){
  const obj = {message : '操作失败！',type : 'error'};
  if(res && res.status !== undefined && res.data === null){
    obj.message = !res.status ? '操作成功！' : res.message;
    obj.type = !res.status ? 'success' : 'error';
  }
  message[obj.type](obj.message);
}
/*排序 0正序 1 倒叙*/
export function compareObj(prop,orderBy){
  return function (obj1, obj2) {
    debugger;
    const val1 = obj1[prop];
    const val2 = obj2[prop];
    if (val1 < val2) {
      return !orderBy ? -1 : 1;
    } else if (val1 > val2) {
      return !orderBy ? 1 : -1;
    } else {
      return 0;
    }
  }
}
/*排序 0正序 1 倒叙*/
export function compare(orderBy){
  return function (val1, val2) {
    if (val1 < val2) {
      return !orderBy ? -1 : 1;
    } else if (val1 > val2) {
      return !orderBy ? 1 : -1;
    } else {
      return 0;
    }
  }
}
/*平行树转children树*/
export function transPingTreeToChildren(setting, sNodes, extraSetting){//extraSetting = {name:[],value:[]}name:增加的key,value:取值的名,注意：保持一一对应
  let i, l;
  const key = setting.id;
  const parentKey = setting.pid;
  if (!key || key === "" || !sNodes) return [];
  if (typeOf(sNodes) === 'Array') {
    let r = [];
    const tmpMap = {};
    for (i = 0, l = sNodes.length; i < l; i++) {
      if(!!extraSetting){
        const name = extraSetting.name;
        const value = extraSetting.value;
        for(let y = 0; y < name.length; y++){
          sNodes[i][name[y]] = sNodes[i][value[y]];
        }
      }
      tmpMap[sNodes[i][key]] = sNodes[i];
    }
    for (i = 0, l = sNodes.length; i < l; i++) {
      const p = tmpMap[sNodes[i][parentKey]];
      if (p && sNodes[i][key] !== sNodes[i][parentKey]) {
        let children = nodeChildren(setting, p,undefined);
        if (!children) {
          children = nodeChildren(setting, p, []);
        }
        children.push(sNodes[i]);
      } else {
        r.push(sNodes[i]);
      }
    }
    return r;
  } else {
    return [sNodes];
  }
};
/*平行树转children树*/
export function transPingTreeToChildrenUnique(setting, sNodes, extraSetting){//extraSetting = {name:[],value:[]}name:增加的key,value:取值的名,注意：保持一一对应
  let i, l;
  const key = setting.id;
  const parentKey = setting.pid;
  if (!key || key === "" || !sNodes) return [];
  if (typeOf(sNodes) === 'Array') {
    let r = [];
    const tmpMap = {};
    for (i = 0, l = sNodes.length; i < l; i++) {
      const name = extraSetting.name;
      const value = extraSetting.value;
      sNodes[i][name[0]] = sNodes[i][value[0]] + '_' + i;
      sNodes[i][name[1]] = sNodes[i][value[1]];
      tmpMap[sNodes[i][value[0]] + '_' + i] = sNodes[i];
    }
    for (i = 0, l = sNodes.length; i < l; i++) {
      let p = undefined;
      const pid = sNodes[i][parentKey];
      for(const item of sNodes){
        if(item.level === sNodes[i].level - 1 && item.id === pid){
          p = item;
        }
      }
      if (p) {
        let children = nodeChildren(setting, p,undefined);
        if (!children) {
          children = nodeChildren(setting, p, []);
        }
        children.push(sNodes[i]);
      } else {
        r.push(sNodes[i]);
      }
    }
    return r;
  } else {
    return [sNodes];
  }
};
/*塔机列表数据转换*/
export function transCraneData(json, groupNameArray, groupArray){
  const outArray = [];
  for (const item of json) {
    for (const col of groupArray) {
      const outObj = {};
      for(const arr of groupNameArray){
        outObj[arr] = item[arr];
      }
      for (const i in col) {
        outObj[groupArray[0][i]] = item[col[i]];
      }
      outArray.push(outObj);
    }
  }
  return outArray;
};
/*任意坐标转化为笛卡尔坐标*/
export function  translateDecare(x,y, a, b,angle){
  const newX = x * Math.cos(preValue * b) - a * y * Math.sin(preValue * b);
  const newY = x * Math.sin(preValue * b) + a * y * Math.cos(preValue * b);
  const newAngle = angle * a + b;
  return [newX, newY,newAngle];
}
/*转化秒为天时分秒*/
export function transSecondsToFormat(data){
  let time = '';
  const day = data / (24 * 60 * 60);
  const hour = (data / (60 * 60)) % 24;
  const minute = (data / 60) % 60;
  const second = data % 60;
  if(!!Math.floor(day)) time = Math.floor(day) + '天';
  time =  time + `${Math.floor(hour)}时${Math.floor(minute)}分${Math.floor(second)}秒`;
  return time;
}
export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          styles={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            lineHeight: 20,
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return false;
}

/*增删改cookies*/

//设置cookie
export function setCookie(name,value,day){
  const date = new Date();
  date.setDate(date.getDate() + day);
  document.cookie = name + '=' + value + ';expires='+ date;
};
//获取cookie
export function getCookie(name){
  const reg = RegExp(name+'=([^;]+)');
  const arr = document.cookie.match(reg);
  if(arr){
    return arr[1];
  }else{
    return '';
  }
};
