import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/hooks/store";

declare const window: any;

const LiveChat: React.FC = () => {
  const { kycStatus } = useAppSelector((state) => state.company);
  const [unUsed] = useState(false);
  const [loadMeetingPage, setLoadMeetingPage] = useState(true);

  useEffect(() => {
    if (kycStatus) {
      const script = document.createElement("script");
      script.src = "//js.hs-scripts.com/7469601.js";
      script.async = true;
      document.body.appendChild(script);
      script.addEventListener("load", (cvv) => {
        if (window.hbspt) {
          console.log(cvv);
        }
      });
      script.onload = () => {
        unUsed && console.log(loadMeetingPage);
        setLoadMeetingPage(false);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kycStatus]);

  return <div id="hs-script-loader" />;
};

export { LiveChat as default };
