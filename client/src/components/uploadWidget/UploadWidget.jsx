import {createContext, useCallback, useEffect, useState} from "react";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();

function UploadWidget({ uwConfig, setState }) {
  const [loaded, setLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  //더블클릭 방지
  const initializeCloudinaryWidget = useCallback((e) => {
    setIsSubmitting(true);
    e.preventDefault();

    if (loaded) {
      var myWidget = window.cloudinary.createUploadWidget(
          uwConfig,
          (error, result) => {
            setIsSubmitting(false);

            if (!error && result && result.event === "success") {
              setState((prev) => [...prev, result.info.secure_url]);

            }
          }
      );
        myWidget.open();
    }


  }, [loaded, isSubmitting]);

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        id="upload_widget"
        className="cloudinary-button"
        onClick={initializeCloudinaryWidget}
        disabled={isSubmitting}
        type="submit"
      >
        업로드
      </button>
    </CloudinaryScriptContext.Provider>
  );

}

export default UploadWidget;
export { CloudinaryScriptContext };
