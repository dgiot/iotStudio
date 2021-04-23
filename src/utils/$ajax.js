const Headers = {
  sessionToken: Cookies.get('access_token_pump'),
}

function ajax(url, method, datas) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: method,
      contentType: 'application/json',
      dataType: 'json',
      headers: Headers,
      data: datas,
      url: Cookies.get('apiserver') + url,
      success: (response) => {
        if (response) {
          resolve(response)
        }
      },
      fail: (error) => {
        reject(error)
      },
    })
  })
}
export default ajax
