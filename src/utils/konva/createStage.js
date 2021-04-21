/**
 *
 * @param {*} params
 * @returns
 */
// https://konvajs.org/api/Konva.Stage.html
function createStage(params) {
  console.log(params, 'params')
  let res = new Konva.Stage(params)
  return res
}
export default createStage
