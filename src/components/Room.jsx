import React from "react";
import { useLocation } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function Room() {
  const location = useLocation();
  const { selectedFriend, sender } = location.state;
  
  const myMeeting = async (element) => {
    const appID = 154027292;
    const serverSecret = "2703e824bbf11ec47818b44a8bd1d4e2";
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
