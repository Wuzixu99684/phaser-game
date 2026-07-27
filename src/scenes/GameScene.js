/**
 * ==================== 游戏主场景（GameScene） ====================
 *
 * 负责：主循环逻辑、生成/管理陨石、碰撞检测、波次/节点切换、绘制等
 */

class GameScene extends BaseScene {
    constructor() {
        super('GameScene');
    }

    create() {
        super.create();
        console.log('▶️ GameScene 创建');

        // 画布绘制对象
        this.graphics = this.add.graphics();

        // 实例化玩家（位于屏幕下方中心）
        this.player = new Player(this, PLAYER.START_X, PLAYER.START_Y);

        // 陨石和碎片数组
        this.meteors = [];
        this.meteorFragments = [];
        this.explosionGraphics = [];

        // 计时器与生成控制
        this.lastSpawnTime = 0;
        this.spawnedThisWave = 0;

        // HUD
        this.hud = new HUD(this);

        // 监听游戏开始/结束
        gameState.on('gameEnded', () => {
            console.log('🔚 游戏结束');
        });

        // 禁用右键默认菜单（已在Player中设置，但确保场景也禁用）
        this.input.mouse.disableContextMenu();
    }

    update(time, delta) {
        // 更新游戏状态管理器
        gameState.update(delta);

        // 如果游戏未处于运行中，不执行逻辑
        if (gameState.gameState !== GAME_STATE.RUNNING) {
            return;
        }

        // 更新玩家
        this.player.update(delta, this.meteors);

        // 生成陨石逻辑
        this.handleSpawning(time, delta);

        // 更新所有陨石
        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const meteor = this.meteors[i];
            meteor.update(delta);
            // 碰撞检测：陨石与玩家
            if (!meteor.destroyed) {
                if (circleCollision(this.player.x, this.player.y, this.player.getCollisionRadius(), meteor.x, meteor.y, meteor.getCollisionRadius())) {
                    // 如果有护盾则不扣血
                    if (!gameState.isShielded) {
                        const died = gameState.damagePlayer(1);
                        this.player.takeDamage();
                        if (died) {
                            // 游戏结束处理
                            gameState.endGame();
                        }
                    }
                    // 陨石爆炸
                    meteor.explode();
                }
            }
        }

        // 更新碎片
        for (let i = this.meteorFragments.length - 1; i >= 0; i--) {
            const frag = this.meteorFragments[i];
            frag.update(delta);
            // 碎片与玩家碰撞
            if (circleCollision(this.player.x, this.player.y, this.player.getCollisionRadius(), frag.x, frag.y, frag.getCollisionRadius())) {
                frag.destroy();
                if (!gameState.isShielded) {
                    const died = gameState.damagePlayer(FRAGMENT.COLLISION_DAMAGE);
                    this.player.takeDamage();
                    if (died) {
                        gameState.endGame();
                    }
                }
            }
        }

        // 清理已销毁的陨石/碎片（防止数组泄露）
        this.meteors = this.meteors.filter(m => !m.destroyed);
        this.meteorFragments = this.meteorFragments.filter(f => !f.destroyed);

        // 渲染
        this.renderScene();

        // 检查波次完成条件：当本波所有陨石已生成且场上没有陨石/碎片时，判定波次完成
        if (this.spawnedThisWave >= gameState.currentMeteorCount && this.meteors.length === 0 && this.meteorFragments.length === 0) {
            // 重置生成计数，为下一波做准备
            this.spawnedThisWave = 0;
            gameState.completeWave();
            // 更新spawn timing，以避免立即生成下一波（自然过渡）
            this.lastSpawnTime = time;
        }
    }

    /**
     * 生成控制
     */
    handleSpawning(time, delta) {
        // 游戏状态已经维护了当前波次的 meteorCount 和 spawnInterval
        const spawnInterval = gameState.currentSpawnInterval;
        if (this.spawnedThisWave < gameState.currentMeteorCount) {
            if (time - this.lastSpawnTime > spawnInterval) {
                this.spawnMeteor();
                this.spawnedThisWave++;
                this.lastSpawnTime = time;
            }
        }
    }

    /**
     * 实际生成一个陨石
     */
    spawnMeteor() {
        // 决定陨石类型，基于概率
        const rand = Math.random();
        let type = 'small';
        const pSmall = METEOR.TYPES.SMALL.probability;
        const pMedium = METEOR.TYPES.MEDIUM.probability;
        const pLarge = METEOR.TYPES.LARGE.probability;
        if (rand < pSmall) type = 'small';
        else if (rand < pSmall + pMedium) type = 'medium';
        else type = 'large';

        // 随机X位置（不出屏幕边界）
        const size = METEOR.TYPES[type.toUpperCase()].size;
        const x = randomInt(size / 2, GAME_WIDTH - size / 2);
        const y = -size; // 从屏幕上方生成

        const meteor = new Meteor(this, x, y, type);
        this.meteors.push(meteor);
    }

    /**
     * 渲染场景（绘制所有元素）
     */
    renderScene() {
        this.graphics.clear();

        // 背景（简单）
        this.graphics.fillStyle(COLORS.BG_DARK, 1);
        this.graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // 绘制陨石
        for (let meteor of this.meteors) {
            meteor.draw(this.graphics);
        }

        // 绘制碎片
        for (let frag of this.meteorFragments) {
            frag.draw(this.graphics);
        }

        // 绘制玩家
        this.player.draw(this.graphics);

        // 绘制爆炸特效（逐渐淡出）
        const now = Date.now();
        for (let i = this.explosionGraphics.length - 1; i >= 0; i--) {
            const e = this.explosionGraphics[i];
            const elapsed = now - e.startTime;
            const t = elapsed / EXPLOSION.DURATION;
            if (t >= 1) {
                this.explosionGraphics.splice(i, 1);
                continue;
            }
            const radius = e.radius * (1 + t * 2);
            const alpha = EXPLOSION.ALPHA * (1 - t);
            this.graphics.fillStyle(e.color, alpha);
            this.graphics.fillCircle(e.x, e.y, radius);
        }

        // HUD 绘制（HUD内部维护自己的graphics或文本）
        if (this.hud) this.hud.update();
    }
}
