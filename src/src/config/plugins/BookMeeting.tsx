import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks/store";

interface BookMeetingProps {
  loadBookMeeting?: boolean;
}

const BookMeeting: React.FC<BookMeetingProps> = ({ loadBookMeeting }) => {
  const [url] = useState(
    "https://meetings.hubspot.com/meetings-orbital/platform-demo?embed=true"
  );
  const firstName = useAppSelector((state) => state.auth.firstName);
  const lastName = useAppSelector((state) => state.auth.lastName);
  const email = useAppSelector((state) => state.auth.email);

  useEffect(() => {
    if (loadBookMeeting) {
      loadHubSoptMeetingScript(
        "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js",
        loadBookMeeting
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadBookMeeting]);

  const loadHubSoptMeetingScript = (src: string, loadBookMeeting: boolean) => {
    const existingScript = document.getElementById("hubSpotMeeting");

    // Create only if it is not present in DOM.
    if (!existingScript || loadBookMeeting) {
      const script = document.createElement("script");
      script.async = false;
      script.src = src;
      script.id = "hubSpotMeeting";
      document.body.appendChild(script);
    }
  };

  const meetingPage = () => {
    return (
      <div
        className="meetings-iframe-container"
        data-src={`${url}?embed=true&firstname=${firstName}&lastname=${lastName}&email=${email}`}
      />
    );
  };
  return <div id="hubSpotMeeting">{meetingPage()}</div>;
};

export { BookMeeting };
