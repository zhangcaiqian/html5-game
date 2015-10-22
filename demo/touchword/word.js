//实现字符类
function Word(x,y,speedY,color,content,index)
{
	this.x=x;
	this.y=y;
	this.speedY=speedY;
	this.color=color;
	this.content=content;//字符内容
	this.index=index;
	this.isAlive=true;
	this.drawWord=function()
	{
		context.font="200px Courier New";
		//context.lineWidth=5;
		context.fillStyle=this.color;
		context.fillText(this.content,this.x,this.y+=this.speedY);
	}
	this.checkBoundry=function()
	{
		if(this.y>=canvas.height-20)
		{
			this.isAlive=false;
		}
	}
}

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

	this.checkBoundary=function(BombX,BombY,radius)
	{
		if(Math.sqrt((this.x-BombX)*(this.x-BombX)+(this.y-BombY)*(this.y-BombY))>=radius)
		{
			this.isAlive=false;
		}
	}
}

//爆炸效果类
function Bomb(x,y,radius,density,color)//绘制炸弹
{
	this.isAlive=true;
	this.x=x;//位置
	this.y=y;
	this.radius=radius;//爆炸半径
	this.density=density;//碎片密度
	this.color=color;//碎片颜色
	this.aDirection=new Array("-1","1");//速度方向
	this.ball=new Array();//存储球体

	this.getDirection=function()//产生碎片速度的随机正负值
	{
		return this.aDirection[Math.floor(Math.random()*this.aDirection.length)];		
	}
	
	this.creatBomb=function()
	{
		for(var i=0;i<this.density;i++)
		{
			//BallVx=Math.ceil(Math.random()*20*this.getDirection());
			//BallVy=Math.ceil(Math.random()*4*this.getDirection());
			//BallRotation=Math.random()*360*Math.PI/180;
			//BallR=Math.ceil(Math.random()*2);
			this.ball.push(new Ball(this.x,
									this.y,
									-0.01,
									Math.ceil(Math.random()*20*this.getDirection()),
									Math.ceil(Math.random()*4*this.getDirection()),
									Math.random()*360*Math.PI/180,
									Math.ceil(Math.random()*10),
									this.color));
		}
	}

	this.drawBomb=function()
	{
		if(this.ball.length<=5)
		{
			this.isAlive=false;
		}
		for(var i in this.ball)
		{
			this.ball[i].checkBoundary(this.x,this.y,this.radius);
			if(this.ball[i].isAlive==true)
			{
				this.ball[i].vx+=this.ball[i].av;
				this.ball[i].vy+=this.ball[i].av;
				this.ball[i].x+=this.ball[i].vx;
				this.ball[i].y+=this.ball[i].vy;
				this.ball[i].drawBall(context);
			}
			else if(this.ball[i].isAlive==false)
			{
				this.ball.splice(i,1);
			}
		}
	}
}