/**
 * ==================== 游戏HUD（头顶显示信息）系统 ====================
 * 
 * 作用：管理游戏界面的所有显示信息
 * 包括：生命值、时间、分数、节点进度等
 * 
 * 特点：
 * - 实时更新游戏数据
 * - 响应游戏状态变化
 * - 清晰的视觉层级
 */

class HUD {
    constructor(scene) {
        this.scene = scene;
        this.graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        // 监听游戏状态变化
        gameState.on('healthChanged', (health) => this.updateHealth(health));
        gameState.on('waveCompleted', (wave) => this.showWaveNotification(wave));
        gameState.on('nodeCompleted', (node) => this.showNodeNotification(node));
        gameState.on('shieldActivated', () => this.showShieldNotification());
    }

    /**
     * 更新HUD显示
     */
    update(time, delta) {
        this.graphics.clear();
        this.drawBackground();
        this.drawHealth();
        this.drawTime();
        this.drawNodeProgress();
    }

    /**
     * 绘制背景（半透明）
     */
    drawBackground() {
        // 左上角背景
        this.graphics.fillStyle(0x000000, 0.3);
        this.graphics.fillRect(0, 0, 400, 120);
        
        // 右上角背景
        this.graphics.fillRect(GAME_WIDTH - 350, 0, 350, 120);
        
        // 中上背景
        this.graphics.fillRect(GAME_WIDTH / 2 - 200, 0, 400, 80);
    }

    /**
     * 绘制生命值
     */
    drawHealth() {
        const health = gameState.playerHealth;
        const maxHealth = PLAYER.MAX_HEALTH;
        
        // 标签
        this.graphics.fillStyle(0xffffff, 1);
        this.graphics.font = '24px Arial';
        this.graphics.fillText('生命值:', UI.MARGIN, UI.MARGIN + 25);
        
        // 生命值图标（心形）
        for (let i = 0; i < maxHealth; i++) {
            const x = UI.MARGIN + 100 + i * 50;
            const y = UI.MARGIN + 20;
            
            if (i < health) {
                // 满心
                this.graphics.fillStyle(0xff0000, 1);
                this.drawHeart(x, y, 15);
            } else {
                // 空心
                this.graphics.lineStyle(2, 0xcccccc, 0.5);
                this.drawHeartOutline(x, y, 15);
            }
        }
    }

    /**
     * 绘制时间
     */
    drawTime() {
        const time = Math.floor(gameState.elapsedTime);
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        this.graphics.fillStyle(0xffffff, 1);
        this.graphics.font = '24px Arial';
        this.graphics.fillText('⏱️ ' + timeStr, UI.MARGIN, UI.MARGIN + 70);
    }

    /**
     * 绘制节点进度
     */
    drawNodeProgress() {
        const node = gameState.currentNode;
        const waveProgress = gameState.waveProgress;
        const totalWaves = WAVE_SYSTEM.WAVES_PER_NODE;
        
        this.graphics.fillStyle(0xffffff, 1);
        this.graphics.font = '28px Arial';
        this.graphics.fillText(`节点 ${node}`, GAME_WIDTH / 2 - 180, UI.MARGIN + 30);
        
        this.graphics.font = '18px Arial';
        this.graphics.fillText(`波次 ${waveProgress}/${totalWaves}`, GAME_WIDTH / 2 - 80, UI.MARGIN + 60);
        
        // 进度条
        const progressBarWidth = 200;
        const progressBarHeight = 10;
        const progressX = GAME_WIDTH / 2 - 100;
        const progressY = UI.MARGIN + 75;
        
        // 背景
        this.graphics.fillStyle(0x333333, 1);
        this.graphics.fillRect(progressX, progressY, progressBarWidth, progressBarHeight);
        
        // 进度
        const progressPercent = (waveProgress - 1) / (totalWaves - 1);
        const progressWidth = progressBarWidth * progressPercent;
        this.graphics.fillStyle(0x00ff00, 1);
        this.graphics.fillRect(progressX, progressY, progressWidth, progressBarHeight);
    }

    /**
     * 更新生命值
     */
    updateHealth(health) {
        // 触发动画更新
    }

    /**
     * 显示波次完成通知
     */
    showWaveNotification(wave) {
        console.log(`✅ 波次 ${wave} 完成！`);
    }

    /**
     * 显示节点完成通知
     */
    showNodeNotification(node) {
        // 这里可以显示屏幕中央的通知
        console.log(`🎉 节点 ${node} 完成！获得强化！`);
    }

    /**
     * 显示护盾激活通知
     */
    showShieldNotification() {
        console.log(`🛡️ 护盾已激活！`);
    }

    /**
     * 绘制心形（填充）
     */
    drawHeart(x, y, size) {
        // 简化的心形绘制（圆形近似）
        this.graphics.fillCircle(x - size / 2, y - size / 2, size / 2);
        this.graphics.fillCircle(x + size / 2, y - size / 2, size / 2);
        this.graphics.fillRect(x - size, y, size * 2, size);
    }

    /**
     * 绘制心形轮廓
     */
    drawHeartOutline(x, y, size) {
        // 简化的心形轮廓绘制
        this.graphics.strokeCircle(x - size / 2, y - size / 2, size / 2);
        this.graphics.strokeCircle(x + size / 2, y - size / 2, size / 2);
        this.graphics.strokeRect(x - size, y, size * 2, size);
    }

    /**
     * 销毁HUD
     */
    destroy() {
        this.graphics.destroy();
    }
}
