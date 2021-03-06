import React from 'react';
import ReactDOM from 'react-dom';

require('normalize.css/normalize.css');
require('styles/App.scss');

//获取图片相关数据
import imageDatas from '../data/imageDatas.json';

//将图片名信息转化成图片url路径信息

var genImageURL = imageDatasArr => {
  for(var i = 0, j = imageDatasArr.length;i<j;i++) {
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/'+singleImageData.fileName);
    var imageDataArr = [];
    imageDataArr[i] = singleImageData;
  }
  return imageDatasArr;
};

var x = genImageURL(imageDatas);

//获取区间内的随机值
var getRangeRandom = (low, high) => Math.ceil(Math.random() * (high - low) + low);


//获取0-30度之间的正负值
var get30DegRandom = () => (Math.random() > 0.50 ? '' : '-' ) + Math.ceil(Math.random()*30);

//建立图片组件
class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
        if (this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }

        e.stopPropagation();
        e.preventDefault();
  }
  render() {

    var styleObj = {};

    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    //如果图片的旋转角度有值并且不为0，则使用

    if(this.props.arrange.rotate) {
      ['MozTransform','msTransform','WebkitTransform','transform'] .forEach(
        value => {
          styleObj[value ] = 'rotate(' + this.props.arrange.rotate + 'deg)';
        })
    }

    if(this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    var imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj}  onClick={this.handleClick}>
          <img src={this.props.data.imageURL}
              alt={this.props.data.title}
          />
          <figcaption>
              <h2 className="img-title">{this.props.data.title}</h2>
              <div className="img-back" onClick={this.handleClick}>
                <p>
                  {this.props.data.desc}
                </p>
              </div>
          </figcaption>
      </figure>
    )
  }
}

class ControllerUnit extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {

    if(this.props.arrange.isCenter) {
        this.props.inverse();
    } else {
        this.props.center();
    }

    e.preventDefault();
    e.stopPropagation();
  }
  render() {
    var controllerUnitClassName = 'controller-unit';
    if(this.props.arrange.isCenter) {
      controllerUnitClassName +=  ' is-center';
      if(this.props.arrange.isInverse) {
        controllerUnitClassName += ' is-inverse';
      }
    }


    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}>
      </span>
    );
  }
}

class AppComponent extends React.Component {

  constructor(props){
    super(props);
    this.Constant = {
      centerPos:{
        left:0,
        right:0
      },
      hPosRange:{       //水平方向的取值范围
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
      },
      vPosRange:{       //垂直方向的取值范围
        x:[0,0],
        topY:[0,0]
      }
    };
    this.state = {
      imgsArrangeArr:[
        /*{
         pos:{
         left:"0",
         top:"0"
         },

         //旋转角度
         rotate:0

         //是否反转
         isInverse:false

         //是否居中
         isCenter:false
         }*/

      ]
    }
  }

  /*
  * 翻转函数，管理图片的翻转
  */
  inverse(index) {
    return () => {
        var imgsArrangeArr = this.state.imgsArrangeArr;
        imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState ({
       imgsArrangeArr : imgsArrangeArr
      })
    };
  }

  /*
  *居中函数，
  */
  center(index) {
    return () => {
        this.rearrange(index)
    }
  }


  /*
  *重新布局所有图片
  *@param centerIndex 指定居中排布哪个图片
  */
  rearrange(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),  //取一个或者不取

      topImgSpliceIndex= 0,

      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

      //首先居中 centerIndex 的图片,居中的 centerIndex 图片不会旋转
      imgsArrangeCenterArr[0] = {
        pos:centerPos,
        rotate:0,
        isCenter:true
      };

      //取出要布局上侧的图片的状态信息
      topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));

      imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

      //布局位于上侧的图片
      imgsArrangeTopArr.forEach(
        (value,index) => {
          imgsArrangeTopArr[index] = {
            pos:{
              top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
              left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
            },
            rotate:get30DegRandom(),
            isCenter:false
          }
      });
      //布局左右两侧的图片
      for (var i = 0,j = imgsArrangeArr.length,k = j / 2;i < j;i++) {
        var hPosRangeLORX = null;

        //前半部分布局左边，右半部分布局右边
        if(i < k) {
            hPosRangeLORX = hPosRangeLeftSecX;
        } else {
           hPosRangeLORX = hPosRangeRightSecX;
        }

        imgsArrangeArr[i] = {
          pos:{
            top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
            left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
          },
          rotate:get30DegRandom(),
          isCenter:false
        }
      }

      if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
        imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
      }

      imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });
  }



  //组件加载以后，为每张图片计算其位置的范围
  componentDidMount(){
  //首先拿到舞台大小
   var stageDom  =  ReactDOM.findDOMNode(this.refs.stage),
     stageW = stageDom.scrollWidth,
     stageH = stageDom.scrollHeight,
     halfStageW = Math.ceil(stageW / 2),
     halfStageH =Math.ceil(stageH / 2);

  //拿到一个imgFigure的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置
    this.Constant.centerPos = {
      left:halfStageW - halfImgW,
      top:halfStageH - halfImgH
    };

  //计算左侧右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = - halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = - halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);

  }
  render() {
    var controllerUnits = [],
        imgFigures = [];

    x.forEach(
      (value,index) => {
        if(!this.state.imgsArrangeArr[index]) {
          this.state.imgsArrangeArr[index] = {
            pos:{
              left:0,
              top:0
            },
            rotate:0,
            isInverse:false,
            isCenter:false
          };
        }

         imgFigures.push(<ImgFigure data = {value} ref = {'imgFigure' + index} key={index} arrange={this.state.imgsArrangeArr[index]}
                                    inverse={this.inverse(index)} center={this.center(index)}/>);
         controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]}
                                              inverse={this.inverse(index)} center={this.center(index)}/>)
    });
    return (
      <section className="stage" ref="stage">
          <section className="img-sec">
              {imgFigures}
          </section>
          <nav className="controller-nav">
              {controllerUnits}
          </nav>
      </section>
    )
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
