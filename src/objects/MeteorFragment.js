/**
 * ==================== 陨石碎片类 ====================
 * 
 * 作用：定义陨石爆炸后产生的碎片
 * 包括：位置、速度、生存时间、碰撞检测等
 * 
 * 特点：
 * - 碎片向四周飞散
 * - 玩家碰到碎片也会扣血
 * - 碎片有生存时间限制
 */

class MeteorFragment {
    constructor(scene, x, y, vx, vy, size, color) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.vx = vx; // 水平速度
        this.vy = vy; // 竖直速度
        this.size = size; // 碎片大小
        this.color = color; // 碎片颜色
        this.gravity = 100; // 重力加速度
        
        // 生存时间
        this.lifetime = FRAGMENT.LIFETIME; // 总生存时间（毫秒）
        this.createdTime = Date.now(); // 创建时间
        this.destroyed = false;
    }

    /**
     * 更新碎片位置和状态
     * @param {number} deltaTime - 时间差（毫秒）
     */
    update(deltaTime) {
        if (this.destroyed) return;
        
        const dt = deltaTime / 1000; // 转换为秒
        
        // 应用重力
        this.vy += this.gravity * dt;
        
        // 更新位置
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // 检查是否超出屏幕或超过生存时间
        const elapsed = Date.now() - this.createdTime;
        if (elapsed > this.lifetime || 
            this.x < -50 || this.x > GAME_WIDTH + 50 ||
            this.y > GAME_HEIGHT + 50) {
            this.destroy();
        }
    }

    /**
     * 销毁碎片
     */
    destroy() {
        this.destroyed = true;
        if (this.scene.meteorFragments) {
            removeFromArray(this.scene.meteorFragments, this);
        }
    }

    /**
     * 绘制碎片
     */
    draw(graphics) {
        if (this.destroyed) return;
        
        // 计算碎片的透明度（随着时间流逝逐渐消失）
        const elapsed = Date.now() - this.createdTime;
        const alpha = Math.max(0, 1 - (elapsed / this.lifetime));
        
        // 绘制碎片
        graphics.fillStyle(this.color, alpha);
        graphics.fillCircle(this.x, this.y, this.size / 2);
        
        // 绘制碎片边框
        graphics.lineStyle(0.5, 0xffffff, alpha * 0.5);
        graphics.strokeCircle(this.x, this.y, this.size / 2);
    }

    /**
     * 获取碰撞半径
     */
    getCollisionRadius() {
        return this.size / 2;
    }
}
