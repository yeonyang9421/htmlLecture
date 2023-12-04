var canvas = document.getElementById("canvas");
var original = new MarvinImage();
var image;
original.load("https://i.imgur.com/P2xzsUY.jpg", imageLoaded);

function imageLoaded(){
	image = original.clone();
  image.clear(0xFF000000);
	Marvin.prewitt(original, image);
	Marvin.invertColors(image, image);
	Marvin.thresholding(image, image, 150, 300);
    whiteToAlpha(image);
    Marvin.alphaBoundary(image.clone(), image, 10);
    Marvin.scale(image.clone(), image, 400);
	image.draw(canvas);
}

function whiteToAlpha(image){
	for(var y=0; y < image.getHeight(); y++){
  
  	for(var x=0; x<image.getWidth(); x++){
        var r = image.getIntComponent0(x,y);
      var g = image.getIntComponent1(x,y);
      var b = image.getIntComponent2(x,y);
      
      if(r >= 250 && g >= 250 && b >= 250){
				image.setIntColor(x, y, 0);
      }
    }
  }
}