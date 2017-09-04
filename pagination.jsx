import "../css/pagination.css"
class Pagination extends React.Component {
  constructor(props){
      super(props); //新建父类的构造对象
      this.state = {
        pagin_list:null,
        cur_page: 1
      };
  }
  componentDidMount(){

  }
  curPage(i){
    this.setState({cur_page:i})
    this.props.curPage(i);
  }


  render(){

    let last_page = this.props.totalPage,
        cur = this.state.cur_page,
        prev_page = cur-1,
        next_page = cur+1;
    let pagin = [];
    if(cur < last_page && cur > 1){
      prev_page = cur-1;
      next_page = cur+1;
    }else if(cur == 1){
      prev_page = 1;
      next_page = 2;
    }else if(cur == last_page){
      prev_page = cur-1;
      next_page = last_page;
    }else if(cur < 1){
      prev_page = 1;
      next_page = 2;
    }else if(cur > last_page){
      prev_page = last_page-1;
      next_page = last_page;
    }


    for(let i =1 ;i<= last_page;i++){
      if( i < cur+3 && i > cur-3 ){
        pagin.push(
          <li className={"pages "+ ( i == cur ? 'cur':'')} onClick={()=>this.curPage(i)}> {i} </li>
        )
      }
    }
    return (
      <ul className="pagin-list">
        <li className="first-pagin"  onClick={()=>this.curPage(1)} > First </li>
        <li className="prev-pagin"  onClick={()=>this.curPage(prev_page)} > Prev </li>
        {pagin}
        <li className="next-pagin"  onClick={()=>this.curPage(next_page)} > Next </li>

        <li className="last-pagin" onClick={()=>this.curPage(last_page)} > Last </li>

      </ul>
    )
  }

}
module.exports = Pagination;
