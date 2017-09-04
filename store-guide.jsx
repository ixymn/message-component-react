
const { render ,findDOMNode } = ReactDOM
import  GuideBox  from './store-guide-box.jsx'


window.showStoreGuide = function showStoreGuide(step){
  var smsVerify = window.smsVerify || 0 ;
  var emailVerify = window.emailVerify || 0 ;

  var list = window.countryList||["China +86","Kenya +254"]
  var stepOn = 10;
  if(step > 2) return ;
  stepOn = step*10;

  var msgList = document.createElement('div');
  msgList.id = "store-guide-mask";
  msgList.className="flexCenter"
  document.body.appendChild(msgList);
  render(
    <div className="store-guide">
    <GuideBox countryList={list} stepOn={stepOn}  smsVerify={smsVerify} emailVerify={emailVerify} />
    </div>,document.getElementById("store-guide-mask")
  )
}
