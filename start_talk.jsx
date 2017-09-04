const { render , findDOMNode  } = ReactDOM
import  TalkBox from './user_talk_box.jsx'
import  "../css/user_message.css"
window.showTalkClick = function showTalkClick(talkID,seller,sellerID){

  var talkMask = document.createElement('div');
  talkMask.id = "talk-mask";
  document.body.appendChild(talkMask);
  render(
    <TalkBox talkID={talkID} seller={seller} sellerID={sellerID} />,document.getElementById("talk-mask")
  )
}
