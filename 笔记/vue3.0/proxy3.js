// 参考文档：https://zhuanlan.zhihu.com/p/50547367

function isArray(o){
  return Object.prototype.toString.call(o) === `[object Array]`
}

function isObject(o){
  return Object.prototype.toString.call(o) === `[object Object]`
}

class Observables{
  constructor(
    target,
    handler = {
      set(target, key, value, receiver){
        console.log('检测到了set的key为 -> ' + key);
        console.log(receiver);
        console.log(receiver == ob);
        return Reflect.set(target, key, value, receiver);
      }
    }
  )
  {
    if( !isObject(target) && !isArray(target) ){
      throw new TypeError('target 不是数组或对象')
    }

    this._target = JSON.parse( JSON.stringify(target) );  // 避免引用修改  数组不考虑
    this._handler = handler;

    return new Proxy(this._observables(this._target), this._handler);
  }
  // 为每一项为Array或者Object类型数据变为代理
  _observables(target){
    // 遍历对象中的每一项
    for( const key in target ){
      // 如果对象为Object或者Array
      if( isObject(target[key]) || isArray(target[key]) ){
        // 递归遍历
        this._observables(target[key]);
        // 转为Proxy
        target[key] = new Proxy(target[key], this._handler);
      }
    }
    // 将转换好的target返回出去
    return target;
  }
}

// const o = {
//   a : [1, 2],
//   c : {
//     a : 1,
//     b : 2,
//     c : [
//       [1,2,{
//         d : 3
//       }]
//     ]
//   },
//   b : 2
// }

// const ob = new Observables(o);
// ob.a.push(3); // 检测到了set的key为 -> 2 检测到了set的key为 -> length
// ob.c.a = 2; // 检测到了set的key为 -> a
// ob.c.c[0][2].d = 6; // 检测到了set的key为 -> d
// ob.b = 44; // 检测到了set的key为 -> b
// ob.d = 123; //检测到了set的key为 -> d
const o = [1, 2]
const ob = new Observables(o);
ob.push(3);
