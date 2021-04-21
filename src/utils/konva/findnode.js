/**
 *
 * @param {*} id
 * @returns
 */
// https://konvajs.org/api/Konva.Container.html#findOne
function findnode(id) {
  if (id) {
    var node = stage.findOne(id)
    return node
  } else {
    this.$message('id必传', 'error')
  }
}
export default findnode
