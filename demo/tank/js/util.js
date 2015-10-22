//绘制坦克图形
function drawTank(tank,Graphics)//传入坦克对象，传入画布对象
{
	//绘制左边的矩形
		//alert("X"+tank.x+"   Y"+tank.y);
		if(tank.isAlive==true)
		{
			Graphics.save();
			Graphics.translate(tank.x,tank.y);//画布坐标参考点移动
			switch(tank.direct)
			{
				case 0:
					Graphics.rotate(0*Math.PI/180);
					break;
				case 1:
					Graphics.rotate(90*Math.PI/180);
					break;
				case 2:
					Graphics.rotate(180*Math.PI/180);
					break;
				case 3:
					Graphics.rotate(270*Math.PI/180);
					break;
			}
			Graphics.fillStyle=tank.color;//坦克颜色
			Graphics.fillRect(-15,-15,5,30);//坦克位置，参考点为左上角
			//绘制右边的矩形
			Graphics.fillRect(-15+25,-15,5,30);
			//绘制中间的矩形
			Graphics.fillRect(-15+5,-15+5,20,20);
			//绘制炮筒
			Graphics.strokeStyle="#def286";
			Graphics.lineWidth=1.5;
			Graphics.beginPath();
			Graphics.moveTo(-15+15,-15+5);
			Graphics.lineTo(-15+15,-15+0);
			Graphics.closePath();
			Graphics.stroke();

			Graphics.restore();
		}
		else
		{
			var b=new Bomb(tank.x,tank.y,50,100,tank.color);
			b.creatBomb();
			aBomb.push(b);
			//bomb.drawBomb();
		}
}


//绘制子弹
function drawBullet(bullet,tank,Graphics)
{
	if(bullet.x<=0 || bullet.x>=canvas.width || bullet.y<=0 || bullet.y>=canvas.height)
	{
		bullet.changeAlive();//若子弹运动出边界，则将标记变为假
		tank.bulletAlive=true;//敌人子弹只有运动出边界后才可以发射下一颗
		tank.bullet=null;//存储子弹的属性赋为空值
	}
	else
	{
		Graphics.save();
		Graphics.translate(bullet.x,bullet.y);//画布坐标参考点移动
		switch(bullet.direct)
		{
			case 0:
				Graphics.rotate(0*Math.PI/180);
				bullet.y-=bullet.speed;
				break;
			case 1:
				Graphics.rotate(90*Math.PI/180);
				bullet.x+=bullet.speed;
				break;
			case 2:
				Graphics.rotate(180*Math.PI/180);
				bullet.y+=bullet.speed;
				break;
			case 3:
				Graphics.rotate(270*Math.PI/180);
				bullet.x-=bullet.speed;
				break;
		}
		Graphics.fillStyle=bullet.color;//子弹颜色
		Graphics.fillRect(-1,-15,2,2);//绘制子弹
		Graphics.restore();
	}
}

//绘制以及控制敌方坦克的运动，并发射子弹
function drawEnemy(enemy)
{
	for(var i in enemy)
	{
		switch(enemy[i].direct)
		{
			case 0:
				enemy[i].y-=enemy[i].speed;
				break;
			case 1:
				enemy[i].x+=enemy[i].speed;
				break;
			case 2:
				enemy[i].y+=enemy[i].speed;
				break;
			case 3:
				enemy[i].x-=enemy[i].speed;
				break;
		}
		enemy[i].checkBoundary();//调用检测边界方法，若到达边界，则继续转换方向
		drawTank(enemy[i],Graphics);//document.title=enemy.length;
		if(enemy[i].isAlive==false)//若坦克死亡则在数组中移出
		{
			enemy.splice(i,1);
		}
		if(enemy[i].bulletAlive==true)//发射子弹，当子弹超出边界后再发射第二颗子弹
		{
			enemy[i].shootHero();
			enemy[i].bulletAlive=false;
		}
		else if(enemy[i].bulletAlive==false)
		{
			drawBullet(enemy[i].bullet,enemy[i],Graphics);
		}
		
		//alert(typeof enemy[i].shootHero());
	}
}

//获取2d上下文
function getCanvas(ID)
{
	return document.getElementById(ID).getContext('2d');
}

//获取画布对象
function getCanvasObject(ID)
{
	return document.getElementById(ID);
}

//刷新地图的所有物体
function flushMap(Hero,Graphics)
{
	Graphics.clearRect(0,0,canvas.width,canvas.height);//刷新画布
	if(Hero.isAlive==true)
	{
		Hero.checkBoundary();//英雄坦克边界检测
		for(var e in Enemy)
		{
			if(Enemy[e].bullet!=null)
			{
				Hero.checkBullet(Enemy[e].bullet);
			}
		}
		drawTank(Hero,Graphics);//绘制己方坦克
	}
	if(Hero.isAlive==false)
	{
		Hero=null;
	}
	drawEnemy(Enemy);       //绘制敌方坦克
	if(HeroBullet.length!=0)//绘制英雄子弹
	{
		for(var i in HeroBullet)
		{
			drawBullet(HeroBullet[i],Hero,Graphics);
			if(HeroBullet[i].isAlive==false)//如果子弹运动出边界，则在数组中移除
			{
				HeroBullet.splice(i,1);
			}
			for(var j in Enemy)
			{
				Enemy[j].checkBullet(HeroBullet[i]);
			}
		}
	}
	//document.title=typeof Hero;
	if(aBomb.length!=0)
	{
		for(var s in aBomb)
		{
			aBomb[s].drawBomb();
			if(aBomb[s].isAlive==false)
			{
				aBomb.splice(s,1);
			}
		}
	}
}