import React, {
  useContext,
  useCallback,
  useState,
  useRef,
  FormEvent,
  useEffect

} from 'react'
import { useDropzone } from "react-dropzone";

import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'
import Cookies from "js-cookie";
import Alert from 'react-bootstrap/Alert';
import { GoogleOAuthProvider, googleLogout, useGoogleLogin } from '@react-oauth/google';

interface CommonFormProps {
  onFormSubmit?: (event: FormEvent<HTMLFormElement>, files?: File[]) => void;
}


const useMountEffect = fun => useEffect(fun, []);

const Main = () => {

  const { hhistory, history, show, setShow, setShowResult, onSent, recentPrompt, showResult, loading, resultData, setInput, input, setImageFile, imageFile, setImagePreviewUrl, imagePreviewUrl, newChat } = useContext(Context)

  const myRef = useRef(null);

  const executeScroll = () => { myRef && myRef.current ? myRef.current.scrollIntoView() : null };
  // run this function from an event handler or pass it to useEffect to execute scroll

  useMountEffect(executeScroll); // Scroll on mount

  const onDrop = useCallback((acceptedFiles: File[], fileRejections) => {
    console.log(fileRejections)
    fileRejections.forEach((file) => {
      file.errors.forEach((err) => {
        console.log(`Error: ${err.message}`);
        setShow(err.message)
      });
    });
    if (acceptedFiles.length > 0) {
      //setShowResult(true)

      const file = acceptedFiles[0];
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const { open } = useDropzone({
    onDrop,
    maxSize: 1024 * 1024 * 10,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "application/pdf": [],
      "application/x-python-code": [],
      "text/plain": [],
      "audio/mpeg": [],
      "audio/mp3": [],
      "audio/wav": [],
      "video/mp4": [],
    },
    multiple: false,
    noClick: true,
  });

  
  return (
    <div className='main'>
      <div className="main-container">
       

        {!showResult
          ? <>
            <div className="greet">
              <p><span>שלום,</span></p>
              <p>איך אוכל לעזור לך?</p>
            </div>
            {/* <div className="cards">
              <div className="card">
                <p>הגעת לג'מיני המאובטח של המשרד
                  כיצד אוכל לעזור?
                </p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card">
                <p>תוכל להעלות לפה קובץ ואני אסכם לך אותו בעברית … גם אם הוא כתוב ביידיש</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card">
                <p>האם תרצה לייצר תמונה של המאכל האהוב עליך על רקע חופי תל אביב?</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card">
                <p>האם אוכל לעזור לך לכתוב קוד או לבדוק אותו?</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div> */}
          </>
          : <div className='result'>
            {hhistory.map(name => (
              <div>
                {name.role == 'user' ?
                  <div className="result-title" ref={myRef}><img src={assets.user_icon} alt="" /><p>{name.text}</p></div>
                  :

                  <div className="result-data">
                    <img src={assets.gemini_icon} alt="" />
                    <pre onDoubleClick={(e) => { let obj = e.target; let direction = obj.style.direction; (direction == 'ltr') ? direction = 'rtl' : direction = 'ltr'; obj.style.direction = direction; console.log(obj.style.direction); }} dangerouslySetInnerHTML={{ __html: name.html }}></pre>

                  </div>
                } {executeScroll()}

              </div>
            ))}
            {loading ?
              <div className='loader'>
                <hr />
                <hr />
                <hr />
              </div> : ''
            }
          </div>
        }
        {show != "" ?
          <Alert variant="danger" onClose={() => setShow("")} dismissible>
            <Alert.Heading>ארעה שגיאה</Alert.Heading>
            <p>
              {<div dangerouslySetInnerHTML={{ __html: show }} />}
            </p>
          </Alert>
          : ''}
        <div className="main-bottom">
          <div className="search-box">
            <input onKeyDown={(e) => input && e.keyCode == 13 ? onSent() : null} onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='כאן כותבים את ההנחיה' />
            {imageFile ? <div className="chip1">
              <div className="chip-content1">{imageFile.name}</div>
              <div className="chip-close1" onClick={(e) => { setImageFile(""); setImagePreviewUrl(""); }}>
                <svg className="chip-svg1" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
              </div>
            </div> : ''}

            <div>
              <img className="gallery" src={assets.gallery_icon} alt="" onClick={open} />
              {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
            </div>
          </div>
          <p className='bottom-info'>
            מופעל על Google Vertex בסביבה המשרדית שלכם בישראל ושומר את כל המידע הארגוני הפרטי שלכם בארץ
          </p>
        </div>
      </div>

    </div>
  )


}

export default Main