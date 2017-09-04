import Pagination from './pagination.jsx'
class UserMsgList extends React.Component {
  constructor(props){
      super(props); //新建父类的构造对象
      this.state = {
          msg_items:[],
          m_item:null,
          pages:1,
          cur_page:1
      };
  }

  componentWillMount(){
    let m_item =[];
    let pagination=[];
    $.getJSON("/index.php?act=message&op=getTalk",function(res){

         res.datas.list.map(function (item,i) {
           let dialog_para = {key:item.p_key,custom:item.b_name,customID:item.b_id}

           m_item.unshift(<ul className="trow" key={i}>
             <li className="msg_check w30"><input type="checkbox" className="checkitem" value={item.p_key}  data-key={i} /></li>
             <li className="msg_content">
               <p>{item.b_name}</p>
               <p>{item.msg}</p>
             </li>
             <li className="msg_date">{ new Date(parseInt( item.time) * 1000).toLocaleString() }</li>
             <li className="msg_view"  > <span className="view_button" onClick={(e)=>this.viewClick(e,dialog_para)} >View  <i className={'unread '+(item.unread==0?"hide":"show")} >{item.unread}</i></span> </li>
           </ul>);
           this.setState({m_item : m_item});
         }.bind(this))
         this.setState({pages:Math.ceil(res.datas.total/10)})
    }.bind(this));
  }
  componentDidMount(){
    let deleteOption = ReactDOM.findDOMNode(this.refs.deleteOption);
    deleteOption.setAttribute('nc_type','batchbutton');
    deleteOption.setAttribute("uri","index.php?act=message&op=markread");
  }


  viewClick(e,dialog_para){
    window.showTalkClick(dialog_para.key,dialog_para.custom,dialog_para.customID);
    console.log(e);
    let a = e.target;
    $(a).find(".unread").removeClass("show").addClass("hide");

  }
  deleteMsg(){
    var  p_key = '',ul_key=[];
    $('.checkitem:checked').each(function(){
        p_key += this.value + '|';
        ul_key.push(this.getAttribute("data-key"));
        var a = this.parentNode.parentNode;
        $(a).find(".unread").removeClass("show").addClass("hide");

    });
    $.ajax({
    		type: "post",
    		url: "index.php?act=message&op=markread",
        data:{"p_key":p_key},
    		success: function(data, textStatus){
          let m_item=this.state.m_item;

          // ul_key.map(function(item){
          //   console.log($("."));
          // })
          this.setState({m_item: m_item})
    		}.bind(this),
    		complete: function(XMLHttpRequest, textStatus){
    			//HideLoading();
    		},
    		error: function(){
    			//请求出错处理
    		}
    });



  }
  getCurPage(n){
    this.setState({cur_page: n});
    let m_item =[];
    $.getJSON("/index.php?act=message&op=getTalk",{page:n},function(res){
         res.datas.list.map(function (item,i) {
           let dialog_para = {key:item.p_key,custom:item.b_name,customID:item.b_id}
           m_item.unshift(<ul className="trow" key={i}>
             <li className="msg_check w30"><input type="checkbox" className="checkitem" value={item.p_key}  data-key={i} /></li>
             <li className="msg_content">
               <p>{item.b_name}</p>
               <p>{item.msg}</p>
             </li>
             <li className="msg_date">{ new Date(parseInt( item.time) * 1000).toLocaleString() }</li>
             <li className="msg_view"  > <span className="view_button" onClick={()=>this.viewClick(event,dialog_para)} >View</span>  <i className={'unread '+(item.unread==0?"hide":"show")} >{item.unread}</i> </li>
           </ul>);
           this.setState({m_item : m_item});
         }.bind(this))
    }.bind(this));


  }



  render(){
    let deleteOriginAttr =  {
       "name":"smids",
       "href":"javascript:void(0)"
    }

    return (
      <div className="msg-list">
      <ul className="th">
        <li className="msg_check w30"> </li>
        <li className="msg_content">Message</li>
        <li className="msg_date">Date</li>
        <li className="msg_view">Operation</li>
      </ul>
      <ul className="toption">
        <li className="msg_check w30">
          <input type="checkbox" className="checkall" id="checkAll"/>
          <label htmlFor="checkAll" > Select All</label>

        </li>
        <li className="msg_options ">
          <a  className="ncm-btn-mini  ncsc-btn-mini "  ref="deleteOption" {...deleteOriginAttr} onClick={this.deleteMsg.bind(this)} ><i className="icon-flag"></i>Mark read</a>
        </li>


      </ul>
      {this.state.m_item}

      <div className="pagination">

        <Pagination totalPage={this.state.pages}  curPage={this.getCurPage.bind(this)} />
      </div>

      </div>
    )
  }
}
module.exports = UserMsgList
