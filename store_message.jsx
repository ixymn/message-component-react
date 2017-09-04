const { render ,findDOMNode } = ReactDOM
import  UserMsgList  from './user_message_list.jsx'
import  TalkBox from './user_talk_box.jsx'
import  "../css/store_message.css"
window.showTalkClick = function showTalkClick(talkID,seller,sellerID){

  var talkMask = document.createElement('div');
  talkMask.id = "talk-mask";
  document.body.appendChild(talkMask);
  render(
    <TalkBox talkID={talkID} seller={seller} sellerID={sellerID} />,document.getElementById("talk-mask")
  )
}


window.showStoreMessageList = function showStoreMessageList(){
var tablePosition = document.getElementsByClassName('ncsc-default-table')[0];
var msgList = document.createElement('div');
msgList.id = "store-msg-list";
var father = tablePosition.parentNode;
father.insertBefore(msgList, tablePosition);
render(
  <UserMsgList />,document.getElementById("store-msg-list")
)


}
