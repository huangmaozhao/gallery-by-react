import React from 'react';

require('normalize.css/normalize.css');
require('styles/App.scss');

//获取图片相关数据
import imageDatas from '../data/imageDatas.json';

//将图片名信息转化成图片url路径信息

function genImageURL(imageDatasArr) {
  for(var i = 0, j = imageDatasArr.length;i<j;i++) {
    var singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require('../images/'+singleImageData.fileName);
    var imageDataArr = [];
    imageDataArr[i] = singleImageData;
  }
  return imageDatasArr;
}
genImageURL(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
          <section className="img-sec">
          </section>
          <nav className="controller-nav">
          </nav>
      </section>
    )
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
