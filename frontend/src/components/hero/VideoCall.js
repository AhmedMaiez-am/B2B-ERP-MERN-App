import {
  CallControls,
  StreamCall,
  StreamTheme,
  StreamVideo,
  PaginatedGridLayout,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./Meeting.css";
import { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";


function VideoCall() {
  const history = useHistory();
    const apiKey = "hd8szvscpxvd";
    const ConnectedUser = JSON.parse(sessionStorage.getItem("user"));
    const user_id = ConnectedUser?.name || ""; // Use an empty string if user_id is not available
    const user = { id: user_id };

    const tokenProvider = async () => {
        const response = await fetch(
          "https://stream-calls-dogfood.vercel.app/api/auth/create-token?" +
            new URLSearchParams({
              api_key: apiKey,
              user_id: user_id,
            })
        );
        const { token } = await response.json();
        return token;
      };


  const client = new StreamVideoClient({ apiKey, user, tokenProvider });
  const callId = localStorage.getItem("callId");
  const [call] = useState(() => client.call("default", callId));

  useEffect(() => {
    call.join({ create: true });
  }, [call]);

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(callId)
        .then(() => {
          alert("Code d'invitation copiée  ");
        })
        .catch((error) => {
          console.error("Failed to copy Call ID: ", error);
          fallbackCopyToClipboard(callId);
        });
    } else {
      fallbackCopyToClipboard(callId);
    }
  };

  const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Call ID copied to clipboard!");
  };

  return (
    <>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <StreamTheme className="video__call">
            <PaginatedGridLayout />
            <CallControls
              onLeave={() => {
                history.push("/components/Chat");
              }}
            />
          </StreamTheme>
        </StreamCall>
      </StreamVideo>
      <Button
        variant="outlined"
        style={{
          borderRadius: "50px",
          display: "flex",
          alignItems: "center",
          padding: "2px 40px",
          borderColor: "#8f34eb",
          borderWidth: "2px",
          whiteSpace: "nowrap",
        }}
        onClick={() => copyToClipboard()}
      >
        <p style={{ color: "#8f34eb" }}>
          <strong>Copier Lien Invitation</strong>
        </p>
      </Button>
    </>
  );
}

export default VideoCall;
