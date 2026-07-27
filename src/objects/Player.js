/**
 * ==================== 飞机类 ====================
 * 
 * 作用：定义和管理玩家控制的飞机
 * 包括：位置、移动、攻击、碰撞检测等
 * 
 * 特点：
 * - 支持键盘移动（WASD或方向键）
 * - 支持鼠标跟随（平滑跟踪）
 * - 支持自动锁定攻击和手动点击攻击
 */

class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.vx = 0;  // X方向速度
        this.vy = 0;  // Y方向速度
        this.targetX = x; // 鼠标跟随的目标X
        this.targetY = y; // 鼠标跟随的目标Y
        this.size = PLAYER.SIZE;
        this.color = COLORS.PLAYER_COLOR;
        
        // 攻击系统
        this.lastAutoAttackTime = 0;        // 上次自动攻击时间
        this.lastManualAttackTime = 0;      // 上次手动攻击时间
        this.targetMeteor = null;           // 当前锁定的陨石
        
        // 状态
        this.isBlinking = false;            // 是否闪烁中
        this.blinkStartTime = 0;            // 闪烁开始时间
        
        // 输入状态
        this.keysPressed = {
            w: false,
            a: false,
            s: false,
            d: false,
            up: false,
            down: false,
            left: false,
            right: false
        };
        
        // 注册键盘事件
        this.setupKeyboardInput();
        
        // 注册鼠标事件
        this.setupMouseInput();
        
        // 监听游戏状态
        gameState.on('speedBoostActivated', () => this.onSpeedBoostActivated());
        gameState.on('speedBoostDeactivated', () => this.onSpeedBoostDeactivated());
    }

    /**
     * 设置键盘输入
     */
    setupKeyboardInput() {
        this.scene.input.keyboard.on('keydown', (event) => {
            const key = event.key.toLowerCase();
            if (key === 'w') this.keysPressed.w = true;
            if (key === 'a') this.keysPressed.a = true;
            if (key === 's') this.keysPressed.s = true;
            if (key === 'd') this.keysPressed.d = true;
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.UP) this.keysPressed.up = true;
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.DOWN) this.keysPressed.down = true;
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.LEFT) this.keysPressed.left = true;
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.RIGHT) this.keysPressed.right = true;
        });

        this.scene.input.keyboard.on('keyup', (event) => {
            const key = event.key.toLowerCase();
            if (key === 'w') this.keysPressed.w = false;
            if (key === 'a') this.keysPressed.a = false;
            if (key === 's') this.keysPressed.s = false;
            if (key === 'd') this.keysPressed.d = false;
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.UP) this.keysPressed.up = false;
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.DOWN) this.keysPressed.down = false;
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.LEFT) this.keysPressed.left = false;
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.RIGHT) this.keysPressed.right = false;
        });
    }

    /**
     * 设置鼠标输入
     */
    setupMouseInput() {
        // 鼠标移动事件
        this.scene.input.on('pointermove', (pointer) => {
            this.targetX = pointer.x;
            this.targetY = pointer.y;
        });
        
        // 右键点击事件（手动攻击）
        this.scene.input.on('pointerdown', (pointer) => {
            if (pointer.button === 2) { // 右键
                this.handleManualAttack(pointer.x, pointer.y);
            }
        });
        
        // 启用右键菜单禁用
        this.scene.input.mouse.disableContextMenu();
    }

    /**
     * 更新飞机位置和状态
     * @param {number} deltaTime - 时间差（毫秒）
     * @param {Array} meteors - 所有陨石数组
     */
    update(deltaTime, meteors = []) {
        // 处理键盘输入
        this.handleKeyboardMovement(deltaTime);
        
        // 处理鼠标跟随
        this.handleMouseFollowing(deltaTime);
        
        // 更新位置
        this.updatePosition(deltaTime);
        
        // 处理自动攻击
        this.handleAutoAttack(deltaTime, meteors);
        
        // 更新闪烁效果
        this.updateBlink(deltaTime);
    }

    /**
     * 处理键盘移动
     */
    handleKeyboardMovement(deltaTime) {
        this.vx = 0;
        this.vy = 0;
        
        const speed = gameState.speedBoostActive 
            ? PLAYER.SPEED + WAVE_SYSTEM.NODE_REWARD.SPEED_BOOST
            : PLAYER.SPEED;
        
        // WASD控制
        if (this.keysPressed.w || this.keysPressed.up) this.vy -= speed;
        if (this.keysPressed.s || this.keysPressed.down) this.vy += speed;
        if (this.keysPressed.a || this.keysPressed.left) this.vx -= speed;
        if (this.keysPressed.d || this.keysPressed.right) this.vx += speed;
    }

    /**
     * 处理鼠标跟随
     */
    handleMouseFollowing(deltaTime) {
        // 计算到目标位置的距离
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 如果距离太小，不需要跟随
        if (distance < 5) return;
        
        // 平滑跟随目标
        const followSpeed = PLAYER.SPEED * PLAYER.MOUSE_FOLLOW_SPEED;
        this.vx += (dx / distance) * followSpeed * 0.5;
        this.vy += (dy / distance) * followSpeed * 0.5;
    }

    /**
     * 更新飞机位置
     */
    updatePosition(deltaTime) {
        const dt = deltaTime / 1000; // 转换为秒
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // 边界检查（防止飞出屏幕）
        const margin = this.size / 2;
        this.x = clamp(this.x, margin, GAME_WIDTH - margin);
        this.y = clamp(this.y, margin, GAME_HEIGHT - margin);
    }

    /**
     * 处理自动攻击
     */
    handleAutoAttack(deltaTime, meteors) {
        const currentTime = Date.now();
        
        // 检查是否可以发动攻击
        if (currentTime - this.lastAutoAttackTime < ATTACK.AUTO_LOCK_INTERVAL) {
            return;
        }
        
        // 查找最近的陨石
        let nearestMeteor = null;
        let minDistance = ATTACK.AUTO_LOCK_RANGE;
        
        for (let meteor of meteors) {
            const d = distance(this.x, this.y, meteor.x, meteor.y);
            if (d < minDistance) {
                minDistance = d;
                nearestMeteor = meteor;
            }
        }
        
        // 如果找到陨石，发动攻击
        if (nearestMeteor) {
            this.attackMeteor(nearestMeteor);
            this.lastAutoAttackTime = currentTime;
        }
    }

    /**
     * 处理手动攻击（右键点击）
     */
    handleManualAttack(clickX, clickY) {
        const currentTime = Date.now();
        
        // 检查冷却时间
        if (currentTime - this.lastManualAttackTime < ATTACK.MANUAL_ATTACK_INTERVAL) {
            return;
        }
        
        // 遍历所有陨石，检查是否点中
        const meteors = this.scene.meteors || [];
        for (let meteor of meteors) {
            if (distance(clickX, clickY, meteor.x, meteor.y) < meteor.size / 2 + 10) {
                this.attackMeteor(meteor);
                this.lastManualAttackTime = currentTime;
                return;
            }
        }
    }

    /**
     * 攻击陨石
     */
    attackMeteor(meteor) {
        if (!meteor || meteor.destroyed) return;
        
        meteor.takeDamage(ATTACK.DAMAGE_PER_ATTACK);
    }

    /**
     * 飞机受到伤害（闪烁效果）
     */
    takeDamage() {
        if (!this.isBlinking) {
            this.isBlinking = true;
            this.blinkStartTime = Date.now();
        }
    }

    /**
     * 更新闪烁效果
     */
    updateBlink(deltaTime) {
        if (!this.isBlinking) return;
        
        const elapsed = Date.now() - this.blinkStartTime;
        if (elapsed > ANIMATIONS.PLAYER_BLINK_DURATION) {
            this.isBlinking = false;
        }
    }

    /**
     * 速度提升激活时的回调
     */
    onSpeedBoostActivated() {
        // 可以在这里添加视觉效果
    }

    /**
     * 速度提升禁用时的回调
     */
    onSpeedBoostDeactivated() {
        // 可以在这里添加视觉效果
    }

    /**
     * 绘制飞机
     */
    draw(graphics) {
        if (this.isBlinking) {
            // 闪烁时透明度变化
            const elapsed = Date.now() - this.blinkStartTime;
            const blinkCount = Math.floor(elapsed / ANIMATIONS.PLAYER_BLINK_INTERVAL);
            if (blinkCount % 2 === 0) return; // 奇数次闪烁时不绘制
        }
        
        // 绘制飞机主体（蓝色圆形）
        graphics.fillStyle(this.color, 1);
        graphics.fillCircle(this.x, this.y, this.size / 2);
        
        // 如果有护盾，绘制护盾圆圈
        if (gameState.isShielded) {
            graphics.lineStyle(2, COLORS.SHIELD_COLOR, 0.8);
            graphics.strokeCircle(this.x, this.y, this.size / 2 + 15);
        }
        
        // 绘制飞机方向指示（三角形）
        graphics.fillStyle(0xffffff, 1);
        const angle = -Math.PI / 2;
        const tipX = this.x + Math.cos(angle) * (this.size / 2 + 5);
        const tipY = this.y + Math.sin(angle) * (this.size / 2 + 5);
        graphics.fillTriangleShape([
            { x: this.x, y: this.y - this.size / 2 - 5 },
            { x: this.x - 5, y: this.y + 5 },
            { x: this.x + 5, y: this.y + 5 }
        ]);
    }

    /**
     * 获取碰撞半径
     */
    getCollisionRadius() {
        return PLAYER.COLLISION_RADIUS;
    }
}
