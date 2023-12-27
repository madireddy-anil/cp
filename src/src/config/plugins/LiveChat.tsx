import React, { useEffect } from "react";

const LiveChat: React.FC = () => {
  useEffect(() => {
    loadHubSoptLieChatScript("//js.hs-scripts.com/7469601.js");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadHubSoptLieChatScript = (src: string) => {
    const existingScript = document.getElementById("hubSpotLiveChat");

    // Create only if it is not present in DOM.
    if (!existingScript) {
      const script = document.createElement("script");
      script.async = false;
      script.src = src;
      script.id = "hubSpotLiveChat";
      document.body.appendChild(script);
    }
  };

  return <div id="hs-script-loader" />;
};

export { LiveChat as default };
