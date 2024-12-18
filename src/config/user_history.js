import axios from 'axios'

const CLOUD_RUN_URL = '/user-history'


async function userHistory(method, idx, request, response, req_msg, response_json) {

  var msg = { "method": method };
  if (method == "del")
    msg["idx"] = idx;
  else // add
  {
    msg["request"] = request;
    msg["response"] = response;
    msg["idx"] = idx;
    msg["msg"] = req_msg;
    msg["response_json"] = response_json;

  }
  console.log("Get History", msg)
  axios.defaults.withCredentials = true
  var res = await axios.post(CLOUD_RUN_URL, msg).catch(function (error) {
    let debug = { "debug": msg }
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      //console.log(error.response.headers);
      return { "error": error.response.status + " : " + error.response.data, debug }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser 
      // and an instance of http.ClientRequest in node.js
      console.log(error.request);
      return { "error": error.request, debug }

    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
      return { "error": error.message, debug }

    }
  });
  console.log("User History", res)
  return res
}

export default userHistory;