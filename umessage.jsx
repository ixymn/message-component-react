class UMessage extends React.Component {
  constructor(props){
      super(props); //新建父类的构造对象
      this.state = {
      };
  }


  render(){
    console.log(3);

    let a = [];
    this.props.mdata.map(function(item,i){
      a.push(<ul className="tr"  key={i}>
        <li className="msg_check w30"><input type="checkbox" className="checkitem" /></li>
        <li className="msg_content">{item.msg}</li>
        <li className="msg_date"> </li>
        <li className="msg_view"> </li>
      </ul>)
    });
  return({a})

  }

}
module.exports = UMessage
