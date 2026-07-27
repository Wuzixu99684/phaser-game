/**
 * ==================== 游戏常数定义文件 ====================
 * 
 * 作用：定义游戏中所有的常数、数值参数
 * 包括：飞机属性、陨石属性、难度参数、颜色等
 * 
 * 特点：
 * - 使用大写字母命名常数（JavaScript惯例）
 * - 这些值在游戏运行中一般不会改变
 * - 方便在一个地方调整游戏平衡性
 */

// ==================== 飞机参数 ====================
const PLAYER = {
    // 初始位置
    START_X: 800,              // 屏幕中心X坐标
    START_Y: 750,              // 屏幕下方Y坐标
    
    // 属性
    SIZE: 50,                  // 飞机大小（像素）
    SPEED: 375,                // 移动速度（像素/秒）
    
    // 鼠标跟随（平滑移动）
    MOUSE_FOLLOW_SPEED: 0.1,   // 鼠标跟随灵敏度（0-1，越小越平滑）
    
    // 初始生命值
    MAX_HEALTH: 3,             // 最大生命值（3条命）
    
    // 碰撞检测
    COLLISION_RADIUS: 20,      // 碰撞半径（用于检测碰撞）
};

// ==================== 陨石参数 ====================
const METEOR = {
    // 三种陨石类型定义
    TYPES: {
        SMALL: {
            size: 25,          // 小陨石大小
            health: 1,         // 小陨石血量（1次打爆）
            probability: 0.5,  // 生成概率（50%）
            color: 0xffd700    // 金色
        },
        MEDIUM: {
            size: 40,
            health: 2,         // 中陨石需要2次攻击
            probability: 0.3,  // 生成概率（30%）
            color: 0xff8c00    // 橙色
        },
        LARGE: {
            size: 60,
            health: 3,         // 大陨石需要3次攻击
            probability: 0.2,  // 生成概率（20%）
            color: 0xff4500    // 红色
        }
    },
    
    // 初始下落速度
    BASE_SPEED: 200,           // 基础下落速度（像素/秒）
    
    // 陨石移动轨迹参数（随机变化）
    WAVE_SPEED: 2,             // 轨迹波动速度
    WAVE_AMPLITUDE: 100,       // 轨迹波动幅度（像素）
    VERTICAL_RANDOMNESS: 0.3,  // 垂直方向随机变化程度
};

// ==================== 波次与节点系统 ====================
const WAVE_SYSTEM = {
    // 波次配置
    WAVES_PER_NODE: 5,         // 5个波次为1个节点
    
    // 初始波次配置
    INITIAL_SPAWN_INTERVAL: 3000, // 初始生成间隔（毫秒）
    INITIAL_METEOR_COUNT: 5,   // 波次1生成的陨石数量
    
    // 难度递进系数
    SPAWN_INTERVAL_DECREASE: 300,     // 每波次减少生成间隔（毫秒）
    METEOR_COUNT_INCREASE: 1.5,       // 陨石数量倍数递增（1.5倍）
    SPEED_INCREASE: 30,               // 每波次增加下落速度（像素/秒）
    
    // 节点强化配置
    NODE_REWARD: {
        HEALTH_RESTORE: 1,     // 每个节点恢复1条命
        SHIELD_DURATION: 5000, // 护盾持续时间（毫秒）
        SPEED_BOOST: 50,       // 飞机速度提升（像素/秒）
        SHIELD_SPEED_REDUCTION: 0.7, // 护盾时陨石速度倍数（70%）
    }
};

// ==================== 飞机攻击系统 ====================
const ATTACK = {
    // 自动锁定
    AUTO_LOCK_RANGE: 500,      // 自动锁定范围（像素）
    AUTO_LOCK_INTERVAL: 500,   // 自动攻击间隔（毫秒）
    
    // 手动攻击（右键点击）
    MANUAL_ATTACK_INTERVAL: 200, // 手动攻击间隔（毫秒）
    
    // 攻击伤害
    DAMAGE_PER_ATTACK: 1,      // 每次攻击伤害（1点）
    
    // 攻击特效
    ATTACK_VISUAL_DURATION: 100, // 攻击视觉反馈持续时间（毫秒）
};

// ==================== 陨石碎片系统 ====================
const FRAGMENT = {
    // 陨石摧毁时产生的碎片数量
    SPAWN_COUNT_RANGE: [5, 10],  // 生成5-10个碎片
    
    // 碎片属性
    SIZE_RANGE: [5, 12],        // 碎片大小范围
    VELOCITY_RANGE: [150, 400], // 碎片飞出速度范围（像素/秒）
    
    // 碎片生存时间
    LIFETIME: 2000,             // 碎片存活时间（毫秒）
    
    // 碎片造成伤害
    COLLISION_DAMAGE: 1,        // 碎片碰撞造成伤害
};

// ==================== 爆炸特效 ====================
const EXPLOSION = {
    // 爆炸持续时间
    DURATION: 300,              // 爆炸动画持续时间（毫秒）
    
    // 爆炸半径
    RADIUS_MULTIPLIER: 1.5,     // 爆炸范围是陨石大小的1.5倍
    
    // 爆炸颜色
    COLOR: 0xff6600,            // 橙色
    ALPHA: 0.8,                 // 透明度
};

// ==================== UI参数 ====================
const UI = {
    // 字体样式
    FONT_FAMILY: 'Arial',
    FONT_SIZE_LARGE: 36,        // 大字号
    FONT_SIZE_NORMAL: 24,       // 正常字号
    FONT_SIZE_SMALL: 16,        // 小字号
    
    // 颜色
    TEXT_COLOR: '#ffffff',      // 白色文字
    TEXT_SHADOW_COLOR: '#000000', // 黑色阴影
    
    // 位置与间距
    MARGIN: 20,                 // 边距
    LINE_HEIGHT: 40,            // 行高
};

// ==================== 游戏状态 ====================
const GAME_STATE = {
    IDLE: 'idle',               // 空闲状态
    RUNNING: 'running',         // 游戏运行中
    PAUSED: 'paused',           // 暂停状态
    GAME_OVER: 'gameOver',      // 游戏结束
};

// ==================== 颜色定义 ====================
const COLORS = {
    // 背景色
    BG_DARK: 0x0d0d0d,
    BG_LIGHT: 0x1a1a1a,
    
    // 文字色
    TEXT_WHITE: 0xffffff,
    TEXT_YELLOW: 0xffff00,
    TEXT_RED: 0xff0000,
    
    // 元素色
    PLAYER_COLOR: 0x00ccff,     // 青色飞机
    SHIELD_COLOR: 0x00ff00,     // 绿色护盾
};

// ==================== 动画配置 ====================
const ANIMATIONS = {
    // 飞机动画
    PLAYER_BLINK_DURATION: 300, // 飞机闪烁持续时间（毫秒）
    PLAYER_BLINK_INTERVAL: 50,  // 闪烁间隔（毫秒）
};
