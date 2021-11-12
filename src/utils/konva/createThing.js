import { uuid } from '@/utils'

/**
 * @description create topo Thing
 * @document https://tech.iotn2n.com/w/docs/details?id=7
 * @param params
 * @return {{children: [{className: string, attrs: {name: string}}, {className: string, attrs: {id: string, text: string}}], className: string, attrs: {productid, name: string, id, thingid}}}
 */
function createThing(params) {
  console.log(params, 'params')
  const {
    id = `uuid_${uuid(6)}`,
    productid,
    thingid,
    name = 'thing',
    text = '9528ac1c5d_flow_text',
    event = 'mousemove',
  } = params
  const thing = {
    attrs: {
      name,
      productid,
      thingid,
      id: productid,
    },
    className: 'Label',
    children: [
      {
        attrs: {
          name: event,
        },
        className: 'Tag',
      },
      {
        attrs: {
          id: '9528ac1c5d_flow_text',
          text,
        },
        className: 'Text',
      },
    ],
  }
  return thing
}

export default createThing
