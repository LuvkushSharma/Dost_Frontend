import React from "react";
import { useLocation } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function Room() {
  const location = useLocation();
  const { selectedFriend, sender } = location.state;
  
  const myMeeting = async (element) => {
    const appID = 940175395;
    const serverSecret = "247bf40936b3ac7842d23f7f42156059";
    const roomID = [selectedFriend.id, sender.senderId].sort().join('');
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      Date.now().toString(),
      sender.senderName
    );

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
    });
  };

  return (
    <div>
      <div ref={myMeeting}/>
    </div>
  );
}

export default Room;