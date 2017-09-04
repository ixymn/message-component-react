const { render , findDOMNode  } = ReactDOM
import  UserMsgList  from './user_message_list.jsx'
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


window.showUserMessageList = function showUserMessageList(){
var tablePosition = document.getElementsByClassName('ncm-default-table')[0];
var msgList = document.createElement('div');
msgList.id = "user-msg-list";
var father = tablePosition.parentNode;
father.insertBefore(msgList, tablePosition);

render(
  <UserMsgList />,document.getElementById("user-msg-list")
)



}
