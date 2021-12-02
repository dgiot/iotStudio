/**
 * @description 组态视频公共has
 * @type {{on(*=): void}}
 */
const topoVideo = {
  on(args) {
    dgiotlog.log(args)
  },
}
window.topoVideo = topoVideo

export default topoVideo
