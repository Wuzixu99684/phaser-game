/**
 * ==================== 启动场景 ====================
 * 
 * 作用：游戏的第一个场景，用于初始化
 * 在这里可以设置全局事件、加载必要的数据等
 */

class BootScene extends BaseScene {
    constructor() {
        super('BootScene');
    }

    create() {
        super.create();
        console.log('✅ BootScene 已初始化');
        
        // 初始化全局游戏状态
        gameState.startGame();
        
        // 切换到加载场景
        this.switchScene('LoadScene');
    }
}
