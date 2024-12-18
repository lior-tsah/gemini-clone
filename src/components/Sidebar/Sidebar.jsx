import React, { useContext, useState, useEffect } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import Cookies from "js-cookie";

const Sidebar = () => {
  const [extended, setExtended] = useState(true);
  const { userPreferences, userHistory, setPrevPromts, isCk, setIsCk, onSent, prevPrompts, prevPromptsFiles, setRecentPrompt, imageFile, setImageFile, imagePreviewUrl, setImagePreviewUrl, newChat } = useContext(Context);

  useEffect(() => {
    setTimeout(() => { console.log('remove cookie'); Cookies.remove('my_mutex') }, 8000);
    let mutex = Cookies.get("my_mutex");
    if (mutex == "yes")
      return;
    Cookies.set("my_mutex", "yes");
    setTimeout(() => {
      getUserPreferences();
      getUserHistory();
    }, 3000);
    setTimeout(() => { Cookies.set("my_mutex", "no"); }, 5000);
  }, [])

  const getUserHistory = async () => {
    console.log("Initiating User History ", prevPrompts)
    if (prevPrompts.length == 0) {
      let prevHist = await userHistory("get");
      if (prevHist.data && prevHist.data.rows) {
        let historyRows = prevHist.data.rows;
        for (var idx = 0; idx < historyRows.length; idx++) {
          let currHist = historyRows[idx]
          //setHistory(prev => [...prev,{role: "user",parts: [{ text: currHist.request }]}, {role: "model",parts: [{ text: currHist.response }]}])
          //setHHistory(prev => [...prev,{role: "user", text: currHist.request, html: ""}, {role: "model", text: currHist.response, html: currHist.response_json.html }])
          setPrevPromts(prev => [...prev, { "text": currHist.request, "msg": currHist }]);
          //setRecentPrompt(currHist.request)

        }

      }
    }
  }
  const getUserPreferences = async () => {
    let hist = Cookies.get("store_history")
    if (hist) {
      if (hist == "false")
        hist = false
      if (hist == "true")
        hist = true;
      setIsCk(hist);
      return hist;
    }
    let response;
    response = await userPreferences("get")
    if (response.data) {
      Cookies.set("store_history", response.data.rows[0].store_history)
      setIsCk(response.data.rows[0].store_history);
      return response.data.rows[0].store_history
    }
    return false;
  }

  const setUserPreferences = async (store_history) => {
    Cookies.set("store_history", store_history)
    setIsCk(store_history);
    let response;
    console.log("update", store_history)
    response = await userPreferences("update", store_history)
    return response;
  }



  const handleChange = async () => {
    setIsCk(!isCk)
    setUserPreferences(!isCk)
  }

  const loadPrompt = async (prompt, index) => {
    setRecentPrompt(prompt)
    if (prevPromptsFiles[index] && prevPromptsFiles[index].file)
      setImageFile(prevPromptsFiles[index].file)
    if (imageFile)
      setImagePreviewUrl(URL.createObjectURL(imageFile));
    await onSent(prompt)
  }

  const handle_delete_history = async (item, elem) => {
    console.log("About to delete ", item, elem)
    let prevHist = await userHistory("del", item);
    document.getElementById(elem).remove()

  }
  const handle_delete_all_history = async () => {
    console.log("About to delete all history")
    setPrevPromts([])
    let prevHist = await userHistory("delAll");

  }


  return (
    <div className="sidebar">
      <div className="top">
        <img onClick={() => setExtended(prev => !prev)} className="menu" src={assets.menu_icon} alt="" />
        <div onClick={() => newChat()} className="new-chat">
          <img src={assets.plus_icon} alt="" />
          {extended ? <p> שיחה חדשה</p> : null}
        </div>
        {extended ? (
          <>
            <p className="recent-title">מהזמן האחרון</p>
            <div className="recent">
              {prevPrompts.map((item, index) => {
                return (
                  <div id={"rEnt" + index} className="recent-entry">
                    <div className="chip-close1" onClick={(e) => { handle_delete_history(item, "rEnt" + index); }}>
                      <svg className="chip-svg1" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
                    </div>
                    <p onClick={() => loadPrompt(item, index)}>{item.text.slice(0, 22)}...</p>
                  </div>
                )
              })}

            </div>
          </>
        ) : null}
      </div>


      <div className="bottom">
        <div className="bottom-item recent-entry checkbox-wrapper-1">
          <input id="example-1" className="substituted" type="checkbox" checked={isCk} onChange={handleChange} aria-hidden="true" />
          {extended ? <label for="example-1">  היסטוריה</label> : null}
        </div>
        <div className="bottom-item recent-entry checkbox-wrapper-1">
          {extended ? <label for="example-2" style={{ paddingRight: "18px" }} onClick={handle_delete_all_history}>  נקה היסטוריה </label> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
