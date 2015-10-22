//球体类
function Ball(x,y,av,vx,vy,rotation,radius,color)
{
	this.x=x;
	this.y=y;
	this.av=av;//加速度
	this.vx=vx;//x轴速度
	this.vy=vy;//y轴速度
	this.rotation=rotation;//画布旋转角度
	this.radius=radius;//球体半径
	this.color=color;//球体颜色
	this.isAlive=true;
	this.drawBall=function(context)
	{
		context.save();
		//context.translate(this.x,this.y);
		//context.rotate(this.rotation);
		//context.scale(this.scaleX,this.scaleY);
		context.lineWidth=1;
		context.fillStyle=this.color;
		context.beginPath();
		context.arc(this.x,this.y,this.radius,0,(Math.PI*2),true);
		context.closePath();
		context.fill();
		if(this.lineWidth>0)
		{
			context.stroke();
		}
		context.restore();
	}

	this.moveRight=function()
	{
		this.x+=5;
	}

	this.moveLeft=function()
	{
		this.x-=5;
	}

	this.changeY=function()
	{
		this.vy+=this.av;
		this.y+=this.vy;
	}

	this.checkBoundary=function()
	{
		if(canvas.height-this.y<=20)
		{
			this.vy=-5;
		}
	}
}