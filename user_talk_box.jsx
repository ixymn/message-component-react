class TalkBox extends React.Component {
  constructor(props){
      super(props); //新建父类的构造对象
      this.state = {
        d_list:null,
        post_content: '',
        page:1,
        has_more_talk:false,
        isLoading:false,
        not_login:true,
        posted:false,
        nowHeight:0,
        loadingDialog:true,
      };
  }
  componentWillMount(){
    let  m_item =[];
    this.setState({not_login:false})

    $.getJSON("/index.php?act=message&op=view",{p_key:this.props.talkID,"b_id":this.props.sellerID},function(res){

      if(res.code == 444){
        login_dialog();
        this.setState({not_login:true})

        return false;
      }else{
        this.setState({loadingDialog:false})

        if(res.datas.list!=null){
          res.datas.list.map(function (item,i) {
            m_item.unshift(
              <p className={ (item.state =="1" ? "custom":"mine") } >
               <span>{ (item.m_type =="1" ? <a href={item.t_msg}> {item.goods_name}</a>:item.t_msg) }</span>
              </p>
            );
          }.bind(this))
          this.setState({d_list : m_item});
          this.setState({has_more_talk: res.datas.hasmore})
          var talkbox =  document.getElementsByClassName("talk-zone")[0];
          talkbox.scrollTop = talkbox.scrollHeight;
          $('html, body').css({
            overflow: 'hidden',
            height: '100%'
          });
        }
      }


    }.bind(this));
  }
  componentDidMount(){
    var talkbox =  document.getElementsByClassName("talk-zone")[0];
    talkbox.scrollTop = talkbox.scrollHeight;
    talkbox.addEventListener('scroll', this.handleScroll.bind(this));
  }
  componentWillUnmount() {
    var talkbox =  document.getElementsByClassName("talk-zone")[0];
    talkbox.removeEventListener('scroll', ()=>this.handleScroll);
  }
  componentDidUpdate(){
    if(this.state.posted){
      let talkbox =  document.getElementsByClassName("talk-zone")[0];
      talkbox.scrollTop = talkbox.scrollHeight;
      this.setState({posted:false});
    }
  }
  handleScroll(event){
    event.preventDefault();
let preHeight = event.target.scrollHeight
    if(event.target.scrollTop<1 && this.state.has_more_talk && !this.state.isLoading){
      this.setState({isLoading:true});
      this.setState({page:this.state.page+1})
      let  m_item = this.state.d_list;

      $.getJSON("/index.php?act=message&op=view",{p_key:this.props.talkID,page:this.state.page,"b_id":this.props.sellerID},function(res){
        this.setState({isLoading:false});

        if(res.datas.list!=null){
          res.datas.list.map(function (item,i) {
            m_item.unshift(
              <p className={ (item.state =="1" ? "custom":"mine") }   >
               <span>{ (item.m_type =="1" ? <a href={item.t_msg}> {item.goods_name}</a>:item.t_msg) }</span>
              </p>
            );
          }.bind(this))
          this.setState({d_list : m_item});
          this.setState({has_more_talk: res.datas.hasmore})
          let talkbox =  document.getElementsByClassName("talk-zone")[0];
          let nowHeight = talkbox.scrollHeight;
                    this.setState({nowHeight : nowHeight});

          talkbox.scrollTop = nowHeight-preHeight;

        }

      }.bind(this));


    }
  }
  removeTalkbox(){

    var node = document.getElementById("talk-mask");
    document.body.removeChild(node);
    $('html, body').css({
        overflow: 'auto',
        height: 'auto'
    });
  }
  post_contentChange(event) {
      this.setState({post_content: event.target.value});
    }
  talkPost(){
    let post_content = this.state.post_content;
    post_content = post_content.trim()
    let d_list = this.state.d_list || [];
    if(post_content == "" || post_content == null  ){return false;}

    d_list.push(
      <p className="mine" >
      <span  className="waiting" > {this.state.post_content} </span>
     </p>)
     this.setState({d_list:d_list})
     this.setState({post_content:""});
     this.setState({posted:true})

     let talkbox =  document.getElementsByClassName("talk-zone")[0];
     talkbox.scrollTop = talkbox.scrollHeight;
    $.ajax({
        type: "post",
        url: "index.php?act=message&op=sendMessage",
        data:{"t_msg":this.state.post_content,"b_id":this.props.sellerID},
        success: function(data){
          $(".waiting").removeClass("waiting")
        }.bind(this),
        complete: function(XMLHttpRequest, textStatus){
          //HideLoading();

        },
        error: function(){
          //请求出错处理
        }
    });
  }
  render(){

    return (
    <div className={"talk-mask " + (this.state.not_login ? "hide":"show")}>
      <div className="talk-box">
        <div className="head-title flexCenter"> {this.props.seller}
        <span className="close-talk" onClick={this.removeTalkbox.bind(this)} >   </span>
        </div>
        <div className="talk-zone">
        {this.state.d_list}
        </div>
        <div className="talk-post">
          <textarea className="text-post" value={this.state.post_content } onChange={this.post_contentChange.bind(this)}  ></textarea>

          <button className="text-send" onClick={this.talkPost.bind(this)}>Send</button>
        </div>
        <div className={"spinner " + (this.state.loadingDialog?"show":"hide")}><i></i></div>
      </div>

    </div>
    )
  }
}
module.exports = TalkBox
