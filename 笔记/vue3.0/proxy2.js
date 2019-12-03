let testData = ['211', '212']

let proxyTestData = new Proxy(testData, {
  // "get": function (oTarget, sKey, receiver) {
  //   console.log('-------------get start---------------')
  //   console.log(oTarget)
  //   console.log(sKey)
  //   console.log('-------------get end---------------')
  //   return Reflect.get(oTarget, sKey, receiver)
  // },
  "set": function (oTarget, sKey, vValue, receiver) {
    console.log('-------------set start---------------')
    console.log(oTarget)
    console.log(sKey)
    console.log(vValue)
    return Reflect.set(oTarget, sKey, vValue, receiver)
    console.log('-------------set end---------------')
  },
  // "deleteProperty": function (oTarget, sKey) {
  //   console.log('-------------delete start---------------')
  //   console.log(oTarget)
  //   console.log(sKey)
  //   delete oTarget[sKey]
  //   console.log('-------------delete end---------------')
  // },
  // "ownKeys": function (oTarget) {
  //   console.log('-------------ownKeys start---------------')
  //   console.log(oTarget)
  //   console.log('-------------ownKeys end---------------')
  //   return Reflect.ownKeys(oTarget)
  // },
  // "has": function (oTarget, sKey) {
  //   console.log('-------------has start---------------')
  //   console.log(oTarget)
  //   console.log(sKey)
  //   console.log('-------------has end---------------')
  //   return sKey in oTarget
  // },
});



// let shopId = proxyTestData.shopId;
// let deals = proxyTestData.deals;
// proxyTestData.shopName = "美团"
// proxyTestData.shopId = 123456;
// proxyTestData.deals.push("213")
// proxyTestData.deals[0] = "456"
// proxyTestData.deals.length = 1
// delete proxyTestData.shopId;
// console.log('shopId' in proxyTestData)
// console.log(Object.keys(proxyTestData))
// console.log(testData)
// proxyTestData.shopInfo = {
//   shopName: "美团",
//   detail: "开水团",
//   address: "申亚",
//   employee: ["张三", "李四"]
// }
// proxyTestData.shopInfo['employee'][1] = "王五"
// proxyTestData.shopInfo['employee'].push("赵六")
// proxyTestData.deals.push("321")
// console.log(testData)
// proxyTestData.push("321")
proxyTestData[1] = 321
proxyTestData.push(432)
console.log(proxyTestData)
