/**
 *
 * @param {*} params
 * @returns group
 */
// https://konvajs.org/docs/groups_and_layers/Groups.html
function createGroup(params) {
  const {
    x = 0,
    y = 0,
    rotation = 0,
  } = params
  var group = new Konva.Group({
    x,
    y,
    rotation,
  })
  return group
}

export default createGroup
