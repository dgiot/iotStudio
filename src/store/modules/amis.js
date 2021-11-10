const amisJson = {
  "type": "page",
  "toolbar": [
    {
      "type": "form",
      "panelClassName": "mb-0",
      "title": "",
      "body": [
        {
          "type": "select",
          "label": "区域",
          "name": "businessLineId",
          "selectFirst": true,
          "mode": "inline",
          "options": [
            "北京",
            "上海"
          ],
          "checkAll": false
        },
        {
          "label": "时间范围",
          "type": "input-date-range",
          "name": "dateRange",
          "inline": true,
          "value": "-1month,+0month",
          "inputFormat": "YYYY-MM-DD",
          "format": "YYYY-MM-DD",
          "closeOnSelect": true,
          "clearable": false
        }
      ],
      "actions": [],
      "mode": "inline",
      "target": "mainPage",
      "submitOnChange": true,
      "submitOnInit": true
    }
  ],
  "body": [
    {
      "type": "grid",
      "columns": [
        {
          "type": "panel",
          "className": "h-full",
          "body": {
            "type": "tabs",
            "tabs": [
              {
                "title": "消费趋势",
                "tab": [
                  {
                    "type": "chart",
                    "config": {
                      "title": {
                        "text": "消费趋势"
                      },
                      "tooltip": {},
                      "xAxis": {
                        "type": "category",
                        "boundaryGap": false,
                        "data": [
                          "一月",
                          "二月",
                          "三月",
                          "四月",
                          "五月",
                          "六月"
                        ]
                      },
                      "yAxis": {},
                      "series": [
                        {
                          "name": "销量",
                          "type": "line",
                          "areaStyle": {
                            "color": {
                              "type": "linear",
                              "x": 0,
                              "y": 0,
                              "x2": 0,
                              "y2": 1,
                              "colorStops": [
                                {
                                  "offset": 0,
                                  "color": "rgba(84, 112, 197, 1)"
                                },
                                {
                                  "offset": 1,
                                  "color": "rgba(84, 112, 197, 0)"
                                }
                              ],
                              "global": false
                            }
                          },
                          "data": [
                            5,
                            20,
                            36,
                            10,
                            10,
                            20
                          ]
                        }
                      ]
                    }
                  }
                ]
              },
              {
                "title": "账户余额",
                "tab": "0"
              }
            ]
          }
        },
        {
          "type": "panel",
          "className": "h-full",
          "body": [
            {
              "type": "chart",
              "config": {
                "title": {
                  "text": "使用资源占比"
                },
                "series": [
                  {
                    "type": "pie",
                    "data": [
                      {
                        "name": "BOS",
                        "value": 70
                      },
                      {
                        "name": "CDN",
                        "value": 68
                      },
                      {
                        "name": "BCC",
                        "value": 48
                      },
                      {
                        "name": "DCC",
                        "value": 40
                      },
                      {
                        "name": "RDS",
                        "value": 32
                      }
                    ]
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "type": "crud",
      "className": "m-t-sm",
      "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample",
      "columns": [
        {
          "name": "id",
          "label": "ID"
        },
        {
          "name": "engine",
          "label": "Rendering engine"
        },
        {
          "name": "browser",
          "label": "Browser"
        },
        {
          "name": "platform",
          "label": "Platform(s)"
        },
        {
          "name": "version",
          "label": "Engine version"
        },
        {
          "name": "grade",
          "label": "CSS grade"
        }
      ]
    }
  ]
}
const state = () => ({
  amisJson: amisJson,
})
const getters = {
  amisJson: (state) => state.amisJson,
}
const mutations = {
  set_amisJson(state, json) {
    state.amisJson = json
  },
}
const actions = {
  set_amisJson({ commit, json }) {
    commit('set_amisJson', json)
  },
}
export default { state, getters, mutations, actions }
