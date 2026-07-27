// main.js - 游戏入口

// 在主入口处，我们把之前在 config.js 中保留的空 scene 数组填充为实际的场景类引用
CONFIG.scene = [BootScene, LoadScene, MenuScene, GameScene];

// 创建 Phaser 游戏实例
window.game = new Phaser.Game(CONFIG);

// 将一些常用对象暴露到 window，方便在浏览器控制台调试
window.gameState = gameState;
