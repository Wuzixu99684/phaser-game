/**
 * ==================== 游戏状态管理器 ====================
 * 
 * 作用：管理游戏的全局状态
 * 包括：生命值、分数、波次、节点等
 * 
 * 特点：
 * - 单例模式（整个游戏只有一个实例）
 * - 集中管理所有游戏数据
 * - 提供状态变化通知机制
 */

class StateManager {
    constructor() {
        // ===== 游戏基础状态 =====
        this.gameState = GAME_STATE.IDLE;  // 游戏当前状态
        this.elapsedTime = 0;               // 游戏已存活时间（秒）
        this.survivalTime = 0;              // 本局存活时间（用于结算）
        
        // ===== 玩家状态 =====
        this.playerHealth = PLAYER.MAX_HEALTH; // 当前生命值
        this.isShielded = false;            // 是否有护盾
        this.shieldRemainingTime = 0;       // 护盾剩余时间（毫秒）
        this.speedBoostActive = false;      // 速度提升是否激活
        this.speedBoostRemainingTime = 0;   // 速度提升剩余时间（毫秒）
        this.meteorSpeedReduction = 1.0;    // 陨石速度倍数（1.0=正常，0.7=减速70%）
        
        // ===== 波次与节点系统 =====
        this.currentWave = 1;               // 当前波次（从1开始）
        this.currentNode = 1;               // 当前节点
        this.waveProgress = 1;              // 当前节点内的波次进度（1-5）
        
        // ===== 难度参数 =====
        this.currentMeteorCount = WAVE_SYSTEM.INITIAL_METEOR_COUNT; // 本波陨石数量
        this.currentMeteorSpeed = METEOR.BASE_SPEED; // 本波陨石速度
        this.currentSpawnInterval = WAVE_SYSTEM.INITIAL_SPAWN_INTERVAL; // 本波生成间隔
        
        // ===== 最高分记录 =====
        this.bestSurvivalTime = 0;          // 最好的存活时间
        this.bestWave = 0;                  // 最高波次
        
        // ===== 回调函数（用于通知UI更新） =====
        this.listeners = {};
    }

    /**
     * 获取单例实例
     */
    static getInstance() {
        if (!StateManager.instance) {
            StateManager.instance = new StateManager();
        }
        return StateManager.instance;
    }

    // ==================== 游戏状态管理 ====================

    /**
     * 开始游戏
     */
    startGame() {
        this.gameState = GAME_STATE.RUNNING;
        this.elapsedTime = 0;
        this.survivalTime = 0;
        this.playerHealth = PLAYER.MAX_HEALTH;
        this.currentWave = 1;
        this.currentNode = 1;
        this.waveProgress = 1;
        this.isShielded = false;
        this.speedBoostActive = false;
        this.meteorSpeedReduction = 1.0;
        
        this.updateDifficulty();
        this.emit('gameStarted');
    }

    /**
     * 结束游戏
     */
    endGame() {
        this.gameState = GAME_STATE.GAME_OVER;
        this.survivalTime = this.elapsedTime;
        
        // 更新最高纪录
        if (this.elapsedTime > this.bestSurvivalTime) {
            this.bestSurvivalTime = this.elapsedTime;
        }
        if (this.currentWave > this.bestWave) {
            this.bestWave = this.currentWave;
        }
        
        this.emit('gameEnded');
    }

    /**
     * 暂停游戏
     */
    pauseGame() {
        this.gameState = GAME_STATE.PAUSED;
        this.emit('gamePaused');
    }

    /**
     * 继续游戏
     */
    resumeGame() {
        this.gameState = GAME_STATE.RUNNING;
        this.emit('gameResumed');
    }

    // ==================== 玩家状态管理 ====================

    /**
     * 扣除玩家��命值
     * @param {number} damage - 伤害值
     */
    damagePlayer(damage = 1) {
        if (this.isShielded) {
            // 有护盾时不扣血
            return false;
        }
        
        this.playerHealth -= damage;
        this.emit('healthChanged', this.playerHealth);
        
        if (this.playerHealth <= 0) {
            this.endGame();
            return true; // 返回true表示已死亡
        }
        return false;
    }

    /**
     * 恢复玩家生命值
     * @param {number} amount - 恢复量
     */
    restoreHealth(amount = 1) {
        this.playerHealth = Math.min(this.playerHealth + amount, PLAYER.MAX_HEALTH);
        this.emit('healthChanged', this.playerHealth);
    }

    /**
     * 激活护盾
     */
    activateShield() {
        this.isShielded = true;
        this.shieldRemainingTime = WAVE_SYSTEM.NODE_REWARD.SHIELD_DURATION;
        this.meteorSpeedReduction = WAVE_SYSTEM.NODE_REWARD.SHIELD_SPEED_REDUCTION;
        this.emit('shieldActivated');
    }

    /**
     * 禁用护盾
     */
    deactivateShield() {
        this.isShielded = false;
        this.shieldRemainingTime = 0;
        this.meteorSpeedReduction = 1.0;
        this.emit('shieldDeactivated');
    }

    /**
     * 激活速度提升
     */
    activateSpeedBoost() {
        this.speedBoostActive = true;
        this.speedBoostRemainingTime = 10000; // 10秒
        this.emit('speedBoostActivated');
    }

    /**
     * 禁用速度提升
     */
    deactivateSpeedBoost() {
        this.speedBoostActive = false;
        this.speedBoostRemainingTime = 0;
        this.emit('speedBoostDeactivated');
    }

    // ==================== 波次与节点管理 ====================

    /**
     * 完成当前波次
     */
    completeWave() {
        this.currentWave++;
        this.waveProgress++;
        
        // 检查是否完成节点（5波次为1节点）
        if (this.waveProgress > WAVE_SYSTEM.WAVES_PER_NODE) {
            this.completeNode();
        }
        
        this.updateDifficulty();
        this.emit('waveCompleted', this.currentWave);
    }

    /**
     * 完成节点
     */
    completeNode() {
        this.currentNode++;
        this.waveProgress = 1; // 重置波次进度
        
        // 应用节点奖励
        this.restoreHealth(WAVE_SYSTEM.NODE_REWARD.HEALTH_RESTORE);
        this.activateShield();
        this.activateSpeedBoost();
        
        this.emit('nodeCompleted', this.currentNode);
    }

    /**
     * 更新难度参数
     */
    updateDifficulty() {
        // 陨石数量随波次递增（1.5倍）
        this.currentMeteorCount = Math.floor(
            WAVE_SYSTEM.INITIAL_METEOR_COUNT * Math.pow(WAVE_SYSTEM.METEOR_COUNT_INCREASE, this.currentWave - 1)
        );
        
        // 陨石速度随波次递增
        this.currentMeteorSpeed = METEOR.BASE_SPEED + (this.currentWave - 1) * WAVE_SYSTEM.SPEED_INCREASE;
        
        // 陨石生成间隔随波次递减
        this.currentSpawnInterval = Math.max(
            WAVE_SYSTEM.INITIAL_SPAWN_INTERVAL - (this.currentWave - 1) * WAVE_SYSTEM.SPAWN_INTERVAL_DECREASE,
            500 // 最小间隔500毫秒
        );
        
        this.emit('difficultyUpdated', {
            wave: this.currentWave,
            meteorCount: this.currentMeteorCount,
            meteorSpeed: this.currentMeteorSpeed,
            spawnInterval: this.currentSpawnInterval
        });
    }

    // ==================== 时间更新 ====================

    /**
     * 更新游戏时间（每帧调用）
     * @param {number} deltaTime - 本帧时间差（毫秒）
     */
    update(deltaTime) {
        if (this.gameState !== GAME_STATE.RUNNING) {
            return;
        }
        
        // 更新游戏总时间
        this.elapsedTime += deltaTime / 1000; // 转换为秒
        
        // 更新护盾时间
        if (this.isShielded) {
            this.shieldRemainingTime -= deltaTime;
            if (this.shieldRemainingTime <= 0) {
                this.deactivateShield();
            }
        }
        
        // 更新速度提升时间
        if (this.speedBoostActive) {
            this.speedBoostRemainingTime -= deltaTime;
            if (this.speedBoostRemainingTime <= 0) {
                this.deactivateSpeedBoost();
            }
        }
        
        this.emit('timeUpdated', this.elapsedTime);
    }

    // ==================== 事件系统 ====================

    /**
     * 注册事件监听
     * @param {string} event - 事件名
     * @param {Function} callback - 回调函数
     */
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    /**
     * 移除事件监听
     * @param {string} event - 事件名
     * @param {Function} callback - 回调函数
     */
    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    /**
     * 触发事件
     * @param {string} event - 事件名
     * @param {...any} args - 传递给回调函数的参数
     */
    emit(event, ...args) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => callback(...args));
    }

    // ==================== 获取状态信息 ====================

    /**
     * 获取游戏信息对象
     */
    getGameInfo() {
        return {
            state: this.gameState,
            elapsedTime: Math.floor(this.elapsedTime),
            playerHealth: this.playerHealth,
            currentWave: this.currentWave,
            currentNode: this.currentNode,
            waveProgress: this.waveProgress,
            isShielded: this.isShielded,
            speedBoostActive: this.speedBoostActive,
            bestSurvivalTime: Math.floor(this.bestSurvivalTime),
            bestWave: this.bestWave
        };
    }
}

// 创建全局单例
const gameState = StateManager.getInstance();
