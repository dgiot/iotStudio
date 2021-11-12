/**
 *
 * @type {{inserted: sensor.inserted, unbind(*): void}}
 * @url https://juejin.cn/post/6953879183600648229#heading-5
 */
const sensor = {
  // 当被绑定的元素插入到 DOM 中时
  inserted: function (el, { value: sensorObj }) {
    let showObj = {},
      clickObj = {} //showObj代表展示类埋点，clickObj代表点击类埋点
    //如果传入参数格式不为对象，则不向下执行
    if (
      !Object.prototype.toString.call(sensorObj) === '[object Object]' ||
      JSON.stringify(sensorObj) == '{}'
    ) {
      return
    }
    //遍历传入对象参数，根据key值确定埋点类型
    for (const key in sensorObj) {
      if (Object.hasOwnProperty.call(sensorObj, key)) {
        switch (key) {
          case 'el':
            showObj = {
              name: 'ElementShow',
              value: sensorObj[key],
            }
            break
          case 'pop':
            showObj = {
              name: 'PopupTrack',
              value: sensorObj[key],
            }
            break
          case 'elClick':
            clickObj = {
              name: '$WebClick',
              value: sensorObj[key],
            }
            break
          case 'popClick':
            clickObj = {
              name: 'PopupBtnClick',
              value: sensorObj[key],
            }
            break
          default:
            break
        }
      }
    }
    // 展示类埋点执行
    showObj.value &&
    sensors.track(showObj.name, {
      FileName: showObj.value,
    })
    //点击类埋点执行
    if (clickObj.value) {
      el.handler = function () {
        clickObj.name === '$WebClick' &&
        sensors.track(clickObj.name, {
          $element_name: clickObj.value,
        })
        clickObj.name === 'PopupBtnClick' &&
        sensors.track(clickObj.name, {
          FileName: clickObj.value,
        })
      }
      el.addEventListener('click', el.handler)
    }
  },
  // 指令与元素解绑的时候，移除事件绑定
  unbind(el) {
    el.handler && el.removeEventListener('click', el.handler)
  },
}

export default sensor
