class ReactSelect extends React.Component{

    constructor(props){
        super(props); //新建父类的构造对象
        this.state = {
            curSelect: props.defaultSelect || props.selectList[0],
            displayMenu: false,
            selectIndex:0
        };
    }
    changeCurSelect(target,index){
        //数据没有改变,则不执行任何操作
        if(target === this.state.curSelect){
            return;
        }
        this.setState({
            curSelect: target
        });
        this.props.getCountryNumber(target);
        this.props.getSelectIndex(index);
        if(!!this.props.keyType){
            switch(this.props.keyType){
                case "arrayIndex":
                    this.props.callback && this.props.callback(index);
                    break;
            }
            return;
        }
        this.setState({
            selectIndex: index
        });
        this.props.callback && this.props.callback(target);
        var left = $(".react-select.react-click").width() - $(".btn-group.react-click").width();

        $("ul.dropdown-menu ").css({"width":$(".react-select").css("width"),"left":-left/2});

    }
    showSelectList(){
        if(this.props.disabled){
            return;
        }
        this.setState({
            displayMenu: !this.state.displayMenu
        });

        let left = $(".react-select.react-click").width() - $(".btn-group.react-click").width();

        $("ul.dropdown-menu ").css({"width":$(".react-select").css("width"),"left":-left/2});
    }
    compileLiFromArray(){
        if(this.props.disabled){
            return;
        }
        let list;
        let selectList = this.props.selectList;
        let i = 0;//用来充当key值
        list = selectList.map(function (item, index) {
            return (
                //必须添加key属性,React在动态渲染子级时,key可以用来唯一确定子级的状态
                <li key={index} className={(index == this.state.selectIndex ? "sel":"")} onClick={ () => this.changeCurSelect(item,index) }><span className="tick" ></span><span className="item" >{item}</span></li>
            )
        }.bind(this));
        return list;
    }

    componentDidMount(){
      this.props.getCountryNumber(this.state.curSelect);
    }

    render(){

          return (
              <div className="react-select react-click" onClick={ () => this.showSelectList()}>
                  <div className="btn-group react-click" onClick={ () => this.showSelectList()}>
                      <div className="react-click"><span   className="default-select react-click" >{this.state.curSelect}</span><i className="caret react-click"></i></div>
                      <ul className={"react-click dropdown-menu " + (this.state.displayMenu ? 'show' : 'hide')}>
                          {this.compileLiFromArray()}
                      </ul>
                  </div>
              </div>
          )
    }
}
module.exports = ReactSelect
