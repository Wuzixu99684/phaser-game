/**
 * ==================== 游戏全局配置文件 (已修改) ====================
 * 
 * 说明：原来在这里引用场景类会在浏览器中导致引用错误（因为场景类在后面才定义）。
 * 现在我们把 CONFIG.scene 留空，并在 main.js 中将实际场景类赋值给 CONFIG.scene。
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
    // 注意：在 main.js 中将实际场景类赋值到这个数组，避免提前引用未定义的类
    scene: [],
    
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
