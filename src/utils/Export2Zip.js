/*
 * @Author: h7ml
 * @Date: 2021-03-11 12:41:30
 * @LastEditTime: 2021-03-11 17:55:38
 * @LastEditors: h7ml
 * @FilePath: \dgiot_dashboard\src\utils\Export2Zip.js
 * @Description:
 */
// require('script-loader!file-saver')
// import JSZip from 'jszip'
function export_txt_to_zip(jsonData, jsonName, zipName) {
  const zip = new JSZip()
  const txt_name = jsonName || 'file'
  const zip_name = zipName || 'file'
  zip.file(`${txt_name}.json`, jsonData)
  zip
    .generateAsync({
      type: 'blob',
    })
    .then(
      (blob) => {
        saveAs(blob, `${zip_name}.zip`)
      },
      (err) => {
        console.log(err)
        alert('导出失败')
      }
    )
}
export { export_txt_to_zip }
