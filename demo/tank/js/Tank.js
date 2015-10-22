//坦克类，父类
function Tank(x,y,speed,direct,color)
{
	//位置，速度，方向，颜色
	this.x=x;
	this.y=y;
	this.speed=speed;
	this.direct=direct;
	this.color=color;
	this.isAlive=true;//是否存活标记
	this.bulletAlive=true;//子弹是否存活

	this.moveUp=function()
	{
		this.direct=0;//上
	}

	this.moveRight=function()
	{
		this.direct=1;//右
	}

	this.moveDown=function()
	{
		this.direct=2;//下
	}

	this.moveLeft=function()
	{
		this.direct=3;//左
	}

	this.checkBullet=function(bullet)//检测坦克与子弹的距离
	{
		var distance=Math.sqrt((this.x-bullet.x)*(this.x-bullet.x)+(this.y-bullet.y)*(this.y-bullet.y));
		if(distance>=15 && distance<=Math.sqrt(225+225) && this.sign!=bullet.sign)
		{
			this.isAlive=false;
			bullet.isAlive=false;
		}
		else
			return;
	}
}

//敌人坦克类
function EnemyTank(x,y,speed,direct,color)
{
	this.bullet=null;
	this.sign=0;//enemy tank sign with 0
	this.Enemy=Tank;
	this.Enemy(x,y,speed,direct,color);
	this.shootHero=function()//发射子弹
	{
		this.bullet=new Bullet(this.x,this.y,3,this.direct,this.color,this.sign);
	}
	this.checkBoundary=function()//边界检测，如果到达边界，则转换方向
	{//document.title=Math.floor(Math.random()*4);
		if(this.x<=15&&this.direct==3
			 || this.y<=15&&this.direct==0
			 || canvas.width-this.x<=15&&this.direct==1
			 || canvas.height-this.y<=15&&this.direct==2)
		{
			/*switch(this.direct)
			{
				case 0:
					this.direct=2;
					break;
				case 1:
					this.direct=3;
					break;
				case 2:
					this.direct=0;
					break;
				case 3:
					this.direct=1;
					break;
			}*/
			this.direct=Math.floor(Math.random()*4);
		}
	}
}

//自己的坦克类
function HeroTank(x,y,speed,direct,color)
{
	this.sign=1;//己方坦克识别
	this.hero=Tank;
	this.hero(x,y,speed,direct,color);
	this.shootEnemy=function()//发射子弹
	{
		return new Bullet(this.x,this.y,5,this.direct,this.color,this.sign);
	}
	this.checkBoundary=function()//边界检测，若到达边界，则无法再继续行走
	{
		if(this.y<=16 && this.direct==0)
		{
			this.y=17;
		}
		else if(canvas.width-this.x<=16 && this.direct==1)
		{
			this.x=canvas.width-17;
		}
		else if(canvas.height-this.y<=16 && this.direct==2)
		{
			this.y=canvas.height-17;
		}
		else if(this.x<=16 && this.direct==3)
		{
			this.x=17;
		}
	}
}

//子弹类
function Bullet(x,y,speed,direct,color,sign)
{
	this.x=x;
	this.y=y;
	this.speed=speed;
	this.direct=direct;
	this.color=color;
	this.isAlive=true;
	this.sign=sign;//who shoot this bullet, enemy sign with 0, hero sign with 1
	//alert(this);
	this.changeAlive=function()
	{
		this.isAlive=false;
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

	//当超出定义的移动范围，则将子弹状态变为false
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
									Math.ceil(Math.random()*2),
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
				this.ball[i].drawBall(Graphics);
			}
			else if(this.ball[i].isAlive==false)
			{
				this.ball.splice(i,1);
			}
		}
	}
}