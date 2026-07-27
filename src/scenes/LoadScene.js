/**
 * ==================== 资源加载场景 ====================
 * 
 * 作用：预加载游戏所需的所有资源
 * 在这里可以加载图片、音频、精灵表等
 * 
 * 注意：我们的游戏主要使用图形绘制，所以暂时没有很多资源要加载
 */

class LoadScene extends BaseScene {
    constructor() {
        super('LoadScene');
    }

    preload() {
        console.log('📦 开始加载资源...');
        // 这里可以加载图片、音频等
        // this.load.image('player', 'assets/player.png');
    }

    create() {
        super.create();
        console.log('✅ 资源加载完成');
        
        // 切换到菜单场景
        this.switchScene('MenuScene');
    }
}
