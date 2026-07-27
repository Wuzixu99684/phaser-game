/**
 * ==================== 场景基类 ====================
 * 
 * 作用：所有游戏场景的父类，提供公共功能
 * 包括：初始化、更新、清理等通用方法
 * 
 * 优点：
 * - 减少重复代码
 * - 统一场景接口
 * - 便于维护和扩展
 * 
 * 使用方式：
 * class MyScene extends BaseScene {
 *   constructor() {
 *     super('MySceneName');
 *   }
 *   
 *   create() {
 *     super.create(); // 调用父类方法
 *     // 自定义逻辑
 *   }
 * }
 */

class BaseScene extends Phaser.Scene {
    /**
     * 构造函数
     * @param {string} key - 场景的唯一标识符
     */
    constructor(key) {
        super({ key: key });
        this.sceneName = key;
    }

    /**
     * 场景创建时调用（在preload和update之前）
     * 这里初始化游戏对象、添加事件监听等
     */
    create() {
        console.log(`✅ 场景 "${this.sceneName}" 已创建`);
    }

    /**
     * 场景更新（每一帧都会调用）
     * @param {number} time - 当前游戏时间（毫秒）
     * @param {number} delta - 上一帧到现在的时间差（毫秒）
     */
    update(time, delta) {
        // 在子类中覆盖此方法来实现自定义逻辑
    }

    /**
     * 切换到另一个场景
     * @param {string} targetScene - 目标场景名
     * @param {Object} data - 传递给目标场景的数据
     */
    switchScene(targetScene, data = {}) {
        this.scene.start(targetScene, data);
    }

    /**
     * 停止当前场景（但不卸载）
     */
    pauseScene() {
        this.scene.pause();
    }

    /**
     * 继续运行暂停的场景
     */
    resumeScene() {
        this.scene.resume();
    }

    /**
     * 关闭当前场景
     */
    shutdownScene() {
        this.scene.stop();
    }

    /**
     * 获取游戏宽度
     */
    getWidth() {
        return this.cameras.main.width;
    }

    /**
     * 获取游戏高度
     */
    getHeight() {
        return this.cameras.main.height;
    }

    /**
     * 获取游戏中心X坐标
     */
    getCenterX() {
        return this.getWidth() / 2;
    }

    /**
     * 获取游戏中心Y坐标
     */
    getCenterY() {
        return this.getHeight() / 2;
    }
}
