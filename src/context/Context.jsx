import { createContext, useState, useEffect } from "react";
import runChat from "../config/gemini";
import userPreferences from "../config/user_preferences";
import userHistory from "../config/user_history";
import Cookies from "js-cookie";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPromts] = useState([]);
    const [prevPromptsFiles, setPrevPromtsFs] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [imageFile, setImageFile] = useState(""); //useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(""); //useState<string | null>(null);
    const [history, setHistory] = useState([]);
    const [hhistory, setHHistory] = useState([]);
    const [show, setShow] = useState("");
    const [isCk, setIsCk] = useState(false);

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord)
        }, 75 * index)
    }

    const newChat = (isFile) => {
        setLoading(false);
        setShowResult(false);
        setImageFile("")
        setImagePreviewUrl("")
        if (isFile) { }
        else {
            setHistory("")
            setHHistory("")
        }
    }

    const onSent = async (prompt) => {
        console.log("prompt", prompt)
        let response;
        setResultData("")
        setLoading(true)
        setShowResult(true)

        if (prompt && prompt.msg && prompt.msg.msg.message[0] && prompt.msg.msg.message[0].inlineData) {
            console.log("prompt with files", prompt)
            response = prompt.msg.response_json
            prompt = prompt.text
            console.log("prompt with files", prompt)

            setHistory(prev => [...prev, { role: "user", parts: [{ text: prompt }] }])
            setHHistory(prev => [...prev, { role: "user", text: prompt, html: "" }])
            setRecentPrompt(prompt)

        }
        else {
            if (prompt && prompt.msg) {
                prompt = prompt.msg.msg.message[0].text
            }

            if (prompt !== undefined) {

                if (prompt.text)
                    prompt = prompt.text
                //setPrevPromts(prev => [...prev, prompt]);
                //setPrevPromtsFs(prev => [...prev,{"prompt": prompt, "file": imageFile}])
                setHistory(prev => [...prev, { role: "user", parts: [{ text: prompt }] }])
                setHHistory(prev => [...prev, { role: "user", text: prompt, html: "" }])
                setRecentPrompt(prompt)
                response = await runChat(prompt, imageFile, imagePreviewUrl, history);
                if (response.error) {
                    setShow(response.error + "</p><p>" + JSON.stringify(response.debug.debug))
                    setLoading(false);
                }
                else {
                    setRecentPrompt(prompt);
                }
            } else {
                setPrevPromts(prev => [...prev, { "text": input }]);
                setPrevPromtsFs(prev => [...prev, { "prompt": input, "file": imageFile }])
                setHistory(prev => [...prev, { role: "user", parts: [{ text: input }] }])
                setHHistory(prev => [...prev, { role: "user", text: input, html: "" }])
                setRecentPrompt(input)
                response = await runChat(input, imageFile, imagePreviewUrl, history)
                if (response.error) {
                    setShow(response.error + "</p><p>" + JSON.stringify(response.debug.debug))
                    setLoading(false);
                }
                else {
                    setHistory(prev => [...prev, { role: "model", parts: [{ text: response.text }] }])
                    if (isCk)
                        userHistory("add", (prevPrompts.length + 1), input, response.text, response.msg, response)
                }
            }
        }
        let responseArray = response.text.split("**")
        let newResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArray[i]
            }
            else {
                newResponse += "<b>" + responseArray[i] + "</b>";
            }
        };
        let newResponse2 = newResponse.split("*").join("</br>")
        setHHistory(prev => [...prev, { role: "model", text: response.text, html: newResponse2 }])
        let newResponseArray = newResponse2.split(" ");
        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord + " ")
        }
        setTimeout(function () {
            setResultData(prev => response.html + prev)
        }, 1000)
        setLoading(false)
        setInput("")
        //setImageFile("")
        setImagePreviewUrl("")

    }

    // onSent("what is react js")

    const contextValue = {
        userPreferences, isCk, setIsCk, setShowResult,
        prevPrompts,
        setPrevPromts,
        prevPromptsFiles,
        setPrevPromtsFs,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        imageFile, setImageFile,
        imagePreviewUrl, setImagePreviewUrl,
        newChat,
        history, setHistory, show, setShow, hhistory, setHHistory,  userHistory

    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider