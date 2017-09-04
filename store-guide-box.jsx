//const {render} =ReactDOM;
import "../css/store-guide.css"
import ReactSelect from "./store-select.jsx"

class GuideBox extends React.Component {
  constructor(props){
      super(props); //新建父类的构造对象
      this.state = {
          stepOn:10,
          countryNumber:"",
          phoneNumber: "",
          vemail:"",
          verifyCode:"",
          countdownNumber:60,
          intervalId:null,
          resentFlag:"",
          selectIndex:0
      };
  }
  componentWillMount(){

    if(this.props.stepOn){
      this.setState({stepOn: this.props.stepOn });
    }
    if(this.props.smsVerify){
      if(this.props.emailVerify){
        this.setState({stepOn: 30 });
      }else{
        this.setState({stepOn: 20 });
      }
    }

  }
  storePhoneNumber(event) {
　　　　var newValue = event.target.value;
       newValue = newValue.replace(/[^0-9]/g,"");
　　　　this.setState({phoneNumber: newValue});
　}
  storeEmail(event){
    var newValue = event.target.value;
    this.setState({vemail: newValue});
    this.setState({verifyCode: "" });
  }
  getCountryNumber(n){
      this.setState({countryNumber: n});
  }
  getSelectIndex(index){
    this.setState({selectIndex:index})
  }

  removeGuide(){
    var node = document.getElementById("store-guide-mask");
    document.body.removeChild(node);
    window.location.reload();
  }
  skipVerify(){
    this.setState({stepOn: (Math.ceil((this.state.stepOn+1)/10))*10});
    this.setState({verifyCode:""});
    if(this.props.emailVerify) {
      this.removeGuide();
    }
  }
  backChange(){
    this.setState({stepOn: Math.floor(this.state.stepOn/10)*10});
    clearInterval(this.state.intervalId);
    this.setState({ countdownNumber:60 });
  }
  checkPhoneNumber(p){
    var c = this.state.countryNumber;
    if(c.indexOf("+86")>1){
      if(p.length!=11){
        return false;
      }
      return true;
    }else if(c.indexOf("+254")>1 || c.indexOf("+256")>1){
      if(p.length!=9){
        return false;
      }
      return true;

    }else if(c.indexOf("+234")>1){
      if(p.length!=10){
        return false;
      }
      return true;

    }
  }
  nextClick(){
    var step = this.state.stepOn;
    $("#store-guide-mask , .next-button").css("cursor","wait");
    switch(step)
    {
    case 10:
      if(!this.checkPhoneNumber(this.state.phoneNumber)){
        this.inputError("Phone number is wrong!");
        $("#store-guide-mask , .next-button").css("cursor","initial");
        return false;
      };
      this.sentVerify();
      break;
    case 11:
      if(this.state.verifyCode == "" ){
        this.inputError("Verify code can't be empty!");
        $("#store-guide-mask , .next-button").css("cursor","initial");
        return false;
      }
      this.verifyPhoneClick();
      break;
    case 20:
    if(this.state.vemail == "" ){
      this.inputError("Email can't be empty!");
      $("#store-guide-mask , .next-button").css("cursor","initial");
      return false;
    }
    if(this.state.vemail.indexOf("@")==-1 || this.state.vemail.indexOf(".")==-1 ){
      this.inputError("Email is wrong!");
      $("#store-guide-mask , .next-button").css("cursor","initial");
      return false;
    }
      this.sendEmailVerify()

      break;
    case 21:
      if(this.state.verifyCode == "" ){
        this.inputError("Verify code can't be empty!");
        $("#store-guide-mask , .next-button").css("cursor","initial");
        return false;
      }

      this.verifyEmailClick();
      break;
    case 30:
    $("#store-guide-mask , .next-button").css("cursor","initial");

      this.removeGuide();
    default:
    $("#store-guide-mask , .next-button").css("cursor","initial");
      break;
    }
  }
  startTimer() {
   var newCount = this.state.countdownNumber - 1;
   if(newCount >= 0) {
       this.setState({ countdownNumber: newCount });

   } else {
       clearInterval(this.state.intervalId);
       this.setState({ resentFlag: 1 });
   }
  }
  sentVerify(){
    var url = "/index.php?";
    $.getJSON(url,{
      "act":"store_joinin",
      "op":"send_sms",
      "zone": this.state.countryNumber.split("+")[1] || "86" ,
      "phone": this.state.phoneNumber
    },function(res){
        $("#store-guide-mask , .next-button").css("cursor","initial");
      if(res.state ==1) {

        this.setState({ stepOn: this.state.stepOn+1});
        var intervalId = setInterval(this.startTimer.bind(this), 1000);
        this.setState({intervalId: intervalId});
        this.setState({ resentFlag: 0 });
      }else{
        this.inputError(res.msg);

      }
    }.bind(this))
  }
  resentMobileClick(){
    $.ajaxSetup({
      async: false
    });
    $.getJSON("/index.php?",{
      "act":"store_joinin",
      "op": "send_sms",
      "zone": this.state.countryNumber.split("+")[1] || "86" ,
      "phone": this.state.phoneNumber
    },function(res){
      this.setState({countdownNumber:60})
      var intervalId = setInterval(this.startTimer.bind(this), 1000);
      this.setState({intervalId: intervalId});
      this.setState({ resentFlag: 0 });
    }.bind(this))
  }
  resentEmailClick(){
    $.ajaxSetup({
      async: false
    });
    $.getJSON("/index.php?",{
      "act":"store_joinin",
      "op": "send_sms",
      "op":"send_email",
      "email": this.state.vemail
    },function(res){
      this.setState({countdownNumber:60})
      var intervalId = setInterval(this.startTimer.bind(this), 1000);
      this.setState({intervalId: intervalId});
      this.setState({ resentFlag: 0 });
    }.bind(this))
  }
  sendEmailVerify(){
    clearInterval(this.state.intervalId);

    var url = "/index.php?";
    $.getJSON(url,{
      "act":"store_joinin",
      "op":"send_email",
      "email": this.state.vemail
    },function(res){
      $("#store-guide-mask , .next-button").css("cursor","initial");
      if(res.state ==1) {
        this.setState({ stepOn: this.state.stepOn+1});
        var intervalId = setInterval(this.startTimer.bind(this), 1000);
        this.setState({intervalId: intervalId});
        this.setState({ resentFlag: 0 });
      }else{
        this.inputError(res.msg);
      }
    }.bind(this))
  }

  verifyPhoneClick(){
    $.getJSON("/index.php",{
      "act":"store_joinin",
      "op":"check_sms",
      "zone": this.state.countryNumber.split("+")[1] || "86" ,
      "phone": this.state.phoneNumber,
      "code":this.state.verifyCode
    },function(res){
      $("#store-guide-mask , .next-button").css("cursor","initial");
      if(res.state == "1"){
        this.setState({stepOn: (Math.ceil(this.state.stepOn/10))*10 });
        if(this.props.emailVerify) {
          this.setState({ stepOn: 30});
        }
      }else{
        this.inputError(res.msg);
      }
  }.bind(this))

  }// end of check phoneNumber

  verifyEmailClick(){
    $.getJSON("/index.php",{
      "act":"store_joinin",
      "op":"check_email",
      "email": this.state.vemail,
      "code":this.state.verifyCode
    },function(res){
      $("#store-guide-mask , .next-button").css("cursor","initial");
      if(res.state == 1){
        this.setState({stepOn: (Math.ceil(this.state.stepOn/10))*10 });
      }else{
        this.inputError(res.msg);
      }
  }.bind(this))


  }//end of check Email
  verifyCodeInput(event){
    var newValue = event.target.value;
    this.setState({verifyCode: newValue});
  }

  inputError(errormsg){
    this.setState({verifyCode:"" });
    $(".error-msg").html(errormsg).addClass("show");
    setTimeout(function(){
      $(".error-msg").fadeOut(1000,function(){$(".error-msg").removeClass("show")});
    },2000)

  }
  render(){
    var list = this.props.countryList;
    var onStep = Math.floor(this.state.stepOn/10);
    return (
    <div className="guide-box" >
      <div className="head-title flexCenter"> complete shop information </div>
      <div className="state-bar" >
        <div className='step step1' >
          <i className="circleSign">1</i><span className="state-text">Verify Mobile</span>
        </div>
        <div className={'step step2 '+(onStep < 2 ? "dark":"" )} >
          <i className="circleSign ">2</i><span className="state-text">Verify Email</span></div>
        <div className={'step step3 '+(onStep < 3 ? "dark":"" )} >
          <i className="circleSign">3</i><span className = "state-text" > Complete </span>
        </div>
      </div>
      <div className="act-zone">
      <div className={'astep1 ' + (Math.floor(this.state.stepOn/10)==1 ? 'show':'hide')}>
        <div  className= {'content-input-zone '+ (this.state.stepOn%10==0 ? 'show':'hide')}>
          <span className="input-name">Cellphone :</span>
          <ReactSelect selectList={list} ref="rselect" selectIndex={this.state.selectList}  getCountryNumber={ this.getCountryNumber.bind(this)}  getSelectIndex={this.getSelectIndex.bind(this)} />
          <input className="input-box phone-input" value={this.state.phoneNumber} onChange={ this.storePhoneNumber.bind(this)} />
          <i className="error-msg" ></i>
        </div>
        <div  className={'verify-input-zone '+ (this.state.stepOn%10==0 ? 'hide':'show')} >
          <p className="">Verification code sent to {this.state.countryNumber}  {this.state.phoneNumber} <span className="change-phone" onClick={this.backChange.bind(this)} > Change </span></p>
          <label className="phone-input-wrap">
          <input className="input-box phone-input" value={this.state.verifyCode} onChange={ this.verifyCodeInput.bind(this)}/>
          <i className="verify-input-notice">
          <div className="notice-content">
          <p>In order to protect and enable secure transactions , Kilimall requires the verification of your phone number (via SMS), but the number once verified will not be subject to unwelcome public advertisements.</p>
          <p>为了保障交易真实性和安全性，Kilimall需验证手机号码（验证码以短信方式发送），但不会将该号码公开或用于推销。</p>
          </div>
          </i>
          </label>
          <div className="resent-flag">
          <span className={'resent-countdown  '+ (this.state.resentFlag==0 ? 'show':'hide')} > Resend in <em  >{this.state.countdownNumber}</em>s</span>
          <span className={'resent-click  '+ (this.state.resentFlag==0 ? 'hide':'show')}  onClick={this.resentMobileClick.bind(this) } >Resent</span>
          </div>
          <i className="error-msg" ></i>

        </div>
      </div>

      <div className={'astep2 ' + (Math.floor(this.state.stepOn/10)==2 ? 'show':'hide')}>
        <div  className= {'content-input-zone '+ (this.state.stepOn%10==0 ? 'show':'hide')}>
          <span className="input-name"> Email :</span>

          <input className="input-box email-input" value={this.state.vemail} onChange={ this.storeEmail.bind(this)} />
          <i className="error-msg" ></i>

        </div>
        <div  className={'verify-input-zone '+ (this.state.stepOn%10==0 ? 'hide':'show')} >
          <p className="">Verification code sent to {this.state.vemail}   <span className="change-phone" onClick={this.backChange.bind(this)} > Change </span></p>
          <label className="phone-input-wrap">
          <input className="input-box email-input" value={this.state.verifyCode} onChange={ this.verifyCodeInput.bind(this)}/>

          <i className="verify-input-notice">
          <div className="notice-content">
          <p>In order to help you learn more about the platforms promotions and merchants guideline changes, Kilimall requires the verification of your email (via email), the email will be used to send platform notifications and recommendations.</p>
          <p>为了方便您了解平台活动报名和卖家政策变更，Kilimall需要验证邮箱（验证码以邮件方式发送），该邮箱将用于平台活动推广和政策通知。</p>
          </div>
          </i>
          </label>
          <div className="resent-flag">
          <span className={'resent-countdown  '+ (this.state.resentFlag==0 ? 'show':'hide')} > Resend in <em  >{this.state.countdownNumber}</em>s</span>
          <span className={'resent-click  '+ (this.state.resentFlag==0 ? 'hide':'show')}  onClick={this.resentEmailClick.bind(this) } >Resent</span>
          </div>
          <i className="error-msg" ></i>

        </div>
      </div>
      <div className={'astep3 ' + (Math.floor(this.state.stepOn/10)==3 ? 'show':'hide')}>
        <div className="success-complete flexCenter">
          <img src="data:image/gif;base64,R0lGODlhSABIAMQfALPh9o7T8dHt+fn9/z6z5/3+/ymr5L7m98Hn9z2y5tvx+zew5qbc9Eu46C2s5PX8/juy5mnE7OX1/E+66e/5/X/N78jq+JnX8kO15+n3/XPI7TKu5VS76V2/6yap4////yH5BAEAAB8ALAAAAABIAEgAAAX/4CeOZGmeaKqubOu+cCzPdG3feK7vfO//wOANQfAYj8ikcskkIIBFpnQ6JbgOBKeLyu0erSyBwwhmec9S7SqT+G6PwtaAgwS8jXGWBhl4IfMqF0gRBX5wgCcHBkcNDzB/iCUKG0cLEjGQkSIUGEcGFjKZkQUdSAwzoogVSBU0qXkMSB2FqIeIFotGGBQ1r0ESC0cbCja+Pw8Nngc3xj0FEUgXOL5EBMs5AUgaOb5RDgI4AEgcA9y2JFEeEJc1YkcJGTq+4kcTjjNsR987xtlHETPm1OHRDNqRPjH2HExR7YkhPCgeTBj4QtA/WieilGnR7IMECPrAtVDE6B6KjiZQ57ozso7FpErsUqAsMZOeEXsqOHkCtWImCZ/+jABEQcoUx3NmkKYwaAShiVVHWh2FeMeDC4kUScQ6MqvqI6UpPoYkgevIrodW0cJYqY4dMGHE1Mp9YdODPWTKMIGVuVdFUA8RmHqQppfq1LQxBGurZThp46sTk5BjjPgwDbHv4lH++vjFyn2u+p7wyTCLw9Cd+abWRFpE6yCvXwOJLRoR7dWRblfW9LM2Td95dPMeDXyE7B/Ch//GnbK4kOTKjTv/cNyHbjTYs+/uqb07GhjpvItvAoPI+PNJ1ERfz769+/fw48ufT195CAA7" />
        </div>
      </div>
      </div>

      <div className="action-buttons">

        <button className="next-button" onClick={this.nextClick.bind(this)} > { (onStep==3) ? "OK" : "NEXT" } </button>
        <button className={"skip-button "+ (onStep==3 ? "hide":"show") } onClick={this.skipVerify.bind(this)} > SKIP </button>
      </div>
    </div>
  )
  }
}

module.exports = GuideBox
