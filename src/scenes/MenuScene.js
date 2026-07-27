/**
 * ==================== 主菜单场景 ====================
 * 
 * 作用：显示游戏主菜单
 * 包括：开始游戏、最高分、退出等选项
 */

class MenuScene extends BaseScene {
    constructor() {
        super('MenuScene');
    }

    create() {
        super.create();
        console.log('🎮 主菜单场景已加载');
        
        const centerX = this.getCenterX();
        const centerY = this.getCenterY();
        
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // 绘制背景
        graphics.fillStyle(0x1a1a1a, 1);
        graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        // 绘制标题
        graphics.fillStyle(0x00ccff, 1);
        graphics.font = 'bold 60px Arial';
        graphics.fillText('飞行躲避游戏', centerX - 180, centerY - 150);
        
        // 绘制最高分
        const bestTime = Math.floor(gameState.bestSurvivalTime);
        const bestWave = gameState.bestWave;
        graphics.fillStyle(0xffff00, 1);
        graphics.font = '24px Arial';
        graphics.fillText(`最高存活时间: ${bestTime}秒 | 最高波次: ${bestWave}`, centerX - 300, centerY - 50);
        
        // 绘制开始按钮提示
        graphics.fillStyle(0xffffff, 1);
        graphics.font = '28px Arial';
        graphics.fillText('按任意键或点击开始游戏', centerX - 250, centerY + 100);
        
        graphics.fillStyle(0x00ff00, 1);
        graphics.font = '20px Arial';
        graphics.fillText('控制: WASD 移动 | 鼠标跟随 | 右键点击陨石攻击', centerX - 350, centerY + 200);
        
        // 将graphics添加到显示列表
        this.add.existing(graphics);
        
        // 设置点击和按键开始游戏
        this.input.once('pointerdown', () => this.startGame());
        this.input.keyboard.once('keydown', () => this.startGame());
    }

    startGame() {
        console.log('🎮 游戏开始！');
        // 重置游戏状态
        gameState.startGame();
        // 切换到游戏场景
        this.switchScene('GameScene');
    }
}
