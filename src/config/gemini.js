import axios from 'axios'

const CLOUD_RUN_URL = '/func'


const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});
async function runChat(prompt, file, imagePreviewUrl, history) {
  let pHist = history
  if (history) { }
  else
    pHist = []


  const textPart = { text: prompt };
  var msg = { "message": [textPart], "history": history }
  if (file) {
    var base64Image = await toBase64(file)
    //console.log(base64Image)
    base64Image = base64Image.substring(base64Image.indexOf(",") + 1)
    //console.log(base64Image)

    var inlineData = {
      "inlineData": {
        "mimeType": file.type,
        "data": base64Image
      }
    };
    msg = { "message": [inlineData, textPart] }
  }
  console.log("Gemini request", msg)
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
  console.log("Gemini Results", res)
  if (res.error)
    return res
  res.data["msg"] = msg;
  return res.data
}

export default runChat;