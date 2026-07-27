/**
 * ==================== 陨石类 ====================
 * 
 * 作用：定义和管理游戏中的陨石对象
 * 包括：位置、移动、生命值、碰撞检测等
 * 
 * 特点：
 * - 三种陨石类型（小/中/大），血量不同
 * - 完全随机的移动轨迹
 * - 被击中时显示爆炸特效和掉落碎片
 */

class Meteor {
    constructor(scene, x, y, type = 'small') {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.type = type; // 'small', 'medium', 'large'
        
        // 获取陨石属性
        const typeData = METEOR.TYPES[type.toUpperCase()];
        this.size = typeData.size;
        this.maxHealth = typeData.health;
        this.health = typeData.health;
        this.color = typeData.color;
        
        // 速度参数
        this.baseSpeed = METEOR.BASE_SPEED * gameState.meteorSpeedReduction;
        this.vx = 0; // X方向速度
        this.vy = this.baseSpeed; // Y方向初始速度（向下）
        
        // 随机轨迹参数
        this.wavePhase = Math.random() * Math.PI * 2; // 波形相位
        this.waveDirection = randomChoose([-1, 1]); // 波形方向（左或右）n        this.randomChangeTimer = 0; // 轨迹变化计时器
        this.randomChangeInterval = randomInt(500, 1500); // 轨迹变化间隔（毫秒）
        this.targetVx = randomFloat(-100, 100); // 目标水平速度
        
        // 状态
        this.destroyed = false;
        this.isExploding = false;
        this.explosionStartTime = 0;
    }

    /**
     * 更新陨石位置和状态
     * @param {number} deltaTime - 时间差（毫秒）
     */
    update(deltaTime) {
        if (this.destroyed) return;
        
        const dt = deltaTime / 1000; // 转换为秒
        
        // 更新轨迹变化
        this.updateRandomTrajectory(deltaTime);
        
        // 更新速度（应用陨石减速效果）
        this.vy = (METEOR.BASE_SPEED + (gameState.currentWave - 1) * WAVE_SYSTEM.SPEED_INCREASE) * gameState.meteorSpeedReduction;
        
        // 更新位置
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // 如果陨石坠落出屏幕下方，销毁
        if (this.y > GAME_HEIGHT + this.size) {
            this.destroy();
        }
    }

    /**
     * 更新随机���迹
     */
    updateRandomTrajectory(deltaTime) {
        this.randomChangeTimer += deltaTime;
        
        // 定期改变轨迹方向
        if (this.randomChangeTimer > this.randomChangeInterval) {
            this.randomChangeTimer = 0;
            this.randomChangeInterval = randomInt(500, 1500);
            this.targetVx = randomFloat(-150, 150); // 新的目标水平速度
        }
        
        // 平滑过渡到目标速度
        this.vx += (this.targetVx - this.vx) * 0.05;
        
        // 添加正弦波形波动
        this.wavePhase += METEOR.WAVE_SPEED * 0.01;
        const waveOffset = Math.sin(this.wavePhase) * METEOR.WAVE_AMPLITUDE * 0.01;
        this.vx += waveOffset * this.waveDirection;
        
        // 限制水平速度范围
        this.vx = clamp(this.vx, -200, 200);
    }

    /**
     * 陨石受到伤害
     * @param {number} damage - 伤害值
     */
    takeDamage(damage) {
        this.health -= damage;
        
        if (this.health <= 0) {
            this.explode();
        }
    }

    /**
     * 爆炸处理
     */
    explode() {
        if (this.destroyed) return;
        
        this.isExploding = true;
        this.explosionStartTime = Date.now();
        
        // 创建爆炸碎片
        this.spawnFragments();
        
        // 显示爆炸特效
        this.showExplosion();
        
        // 100毫秒后销毁
        setTimeout(() => {
            this.destroy();
        }, 100);
    }

    /**
     * 生成爆炸碎片
     */
    spawnFragments() {
        const fragmentCount = randomInt(FRAGMENT.SPAWN_COUNT_RANGE[0], FRAGMENT.SPAWN_COUNT_RANGE[1]);
        
        for (let i = 0; i < fragmentCount; i++) {
            const angle = (Math.PI * 2 / fragmentCount) * i + randomFloat(-0.3, 0.3);
            const velocity = randomFloat(FRAGMENT.VELOCITY_RANGE[0], FRAGMENT.VELOCITY_RANGE[1]);
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            const size = randomInt(FRAGMENT.SIZE_RANGE[0], FRAGMENT.SIZE_RANGE[1]);
            
            const fragment = new MeteorFragment(this.scene, this.x, this.y, vx, vy, size, this.color);
            this.scene.meteorFragments.push(fragment);
        }
    }

    /**
     * 显示爆炸特效
     */
    showExplosion() {
        // 创建爆炸圆圈（通过graphics对象）
        if (!this.scene.explosionGraphics) {
            this.scene.explosionGraphics = [];
        }
        
        this.scene.explosionGraphics.push({
            x: this.x,
            y: this.y,
            radius: this.size / 2,
            startTime: Date.now(),
            color: this.color
        });
    }

    /**
     * 销毁陨石
     */
    destroy() {
        this.destroyed = true;
        
        // 从场景的陨石数组中移除
        if (this.scene.meteors) {
            removeFromArray(this.scene.meteors, this);
        }
    }

    /**
     * 绘制陨石
     */
    draw(graphics) {
        if (this.destroyed || this.isExploding) return;
        
        // 绘制陨石主体
        graphics.fillStyle(this.color, 0.9);
        graphics.fillCircle(this.x, this.y, this.size / 2);
        
        // 绘制陨石边框
        graphics.lineStyle(1, 0xcccccc, 0.6);
        graphics.strokeCircle(this.x, this.y, this.size / 2);
        
        // 绘制陨石生命值指示器（可选）
        if (this.maxHealth > 1) {
            const healthPercent = this.health / this.maxHealth;
            graphics.lineStyle(2, 0x00ff00, 0.8);
            graphics.arc(this.x, this.y, this.size / 2 + 5, 0, Math.PI * 2 * healthPercent);
        }
    }

    /**
     * 获取碰撞半径
     */
    getCollisionRadius() {
        return this.size / 2;
    }
}
