/**
 * ==================== 游戏全局配置文件 ====================
 * 
 * 作用：集中管理游戏的所有配置参数
 * 包括：游戏窗口大小、Phaser配置、场景管理等
 * 
 * 好处：
 * - 所有配置集中在一个地方，便于维护和调整
 * - 其他文件通过引用CONFIG来使用这些参数
 * - 避免到处散落"魔法数字"
 */

// ==================== 游戏基础参数 ====================
const GAME_WIDTH = 1600;      // 游戏窗口宽度（像素）
const GAME_HEIGHT = 900;      // 游戏窗口高度（像素）
const GAME_TITLE = '飞行躲避游戏'; // 游戏标题

// ==================== Phaser游戏配置对象 ====================
// 这是Phaser的核心配置，定义了游戏如何运行
const CONFIG = {
    // ===== 渲染配置 =====
    type: Phaser.AUTO,  // 自动选择最佳渲染方式（WebGL或Canvas）
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container', // 游戏容器的DOM元素ID
    
    // ===== 物理引擎配置 =====
    physics: {
        default: 'arcade',  // 使用Arcade物理引擎（轻量级，适合2D游戏）
        arcade: {
            gravity: { y: 0 }, // 重力设置为0（我们手动控制陨石下落）
            debug: false,      // 关闭物理引擎调试模式
        }
    },
    
    // ===== 场景配置 =====
    scene: [
        BootScene,      // 启动场景（先加载）
        LoadScene,      // 资源加载场景
        MenuScene,      // 主菜单场景
        GameScene       // 游戏主场景
    ],
    
    // ===== 输入配置 =====
    input: {
        // 支持键盘输入
        keyboard: true,
        // 支持鼠标输入
        mouse: true,
        // 支持触摸输入（手机）
        touch: true
    },
    
    // ===== 显示配置 =====
    render: {
        pixelArt: false,       // 关闭像素风格（我们用抗锯齿渲染）
        antialias: true,       // 启用抗锯齿，使画面更光滑
        autoCenter: Phaser.Scale.CENTER_BOTH, // 游戏自动居中
        fullscreenTarget: 'parent' // 全屏时的目标元素
    }
};
