"use client";
import { useEffect, useState, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const Room = ({ params }) => {
  const [roomID, setRoomID] = useState(null);
  const hasJoinedRoom = useRef(false);

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setRoomID(resolvedParams.roomid);
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    const myMeeting = async (element) => {
      if (!roomID || !element || hasJoinedRoom.current) return;

      hasJoinedRoom.current = true;

      const appID = +process.env.NEXT_PUBLIC_APPID;
      const serverSecret = process.env.NEXT_PUBLIC_SERVER_SECRET;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        Date.now().toString(),
        "ritesh"
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "Personal link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomID=" +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
      });
    };

    const element = document.querySelector(".myCallContainer");
    myMeeting(element);
  }, [roomID]);

  return (
    <div
      className="myCallContainer"
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
};

export default Room;
