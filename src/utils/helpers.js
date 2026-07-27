/**
 * ==================== 全局工具函数库 ====================
 * 
 * 作用：提供游戏中经常使用的通用工具函数
 * 包括：数学计算、随机数生成、距离计算、角度计算等
 * 
 * 好处：
 * - 代码复用，避免重复写同样的逻辑
 * - 集中管理工具函数，便于维护
 * - 提高代码可读性
 */

// ==================== 数学计算工具 ====================

/**
 * 计算两个点之间的距离
 * @param {number} x1 - 第一个点的X坐标
 * @param {number} y1 - 第一个点的Y坐标
 * @param {number} x2 - 第二个点的X坐标
 * @param {number} y2 - 第二个点的Y坐标
 * @returns {number} 两点之间的距离
 * 
 * 例子：
 * distance(0, 0, 3, 4) // 返回 5（勾股定理）
 */
function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 计算两个点之间的角度（弧度制）
 * @param {number} x1 - 起点X坐标
 * @param {number} y1 - 起点Y坐标
 * @param {number} x2 - 终点X坐标
 * @param {number} y2 - 终点Y坐标
 * @returns {number} 角度（弧度）
 */
function angleToPoint(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * 将弧度转换为度数
 * @param {number} radians - 弧度值
 * @returns {number} 度数值
 */
function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

/**
 * 将度数转换为弧度
 * @param {number} degrees - 度数值
 * @returns {number} 弧度值
 */
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// ==================== 随机数生成工具 ====================

/**
 * 生成指定范围内的随机整数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} 随机整数
 * 
 * 例子：
 * randomInt(1, 10) // 返回1到10之间的随机整数
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成指定范围内的随机浮点数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 随机浮点数
 */
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * 从数组中随机选择一个元素
 * @param {Array} array - 数组
 * @returns {*} 数组中随机选中的元素
 */
function randomChoose(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * 按指定概率返回true（用于概率事件）
 * @param {number} probability - 概率（0-1之间，例如0.5表示50%概率）
 * @returns {boolean} 根据概率返回true或false
 */
function randomChance(probability) {
    return Math.random() < probability;
}

// ==================== 数值约束工具 ====================

/**
 * 限制数值在指定范围内
 * @param {number} value - 要约束的数值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 约束后的数值
 * 
 * 例子：
 * clamp(150, 0, 100) // 返回 100
 * clamp(-5, 0, 100) // 返回 0
 * clamp(50, 0, 100) // 返回 50
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * 线性插值（在两个值之间平滑过渡）
 * @param {number} start - 起始值
 * @param {number} end - 结束值
 * @param {number} t - 进度（0-1，其中0表示起始值，1表示结束值）
 * @returns {number} 插值结果
 */
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// ==================== 碰撞检测工具 ====================

/**
 * 检测圆形碰撞
 * @param {number} x1 - 第一个圆心X坐标
 * @param {number} y1 - 第一个圆心Y坐标
 * @param {number} r1 - 第一个圆的半径
 * @param {number} x2 - 第二个圆心X坐标
 * @param {number} y2 - 第二个圆心Y坐标
 * @param {number} r2 - 第二个圆的半径
 * @returns {boolean} 是否发生碰撞
 */
function circleCollision(x1, y1, r1, x2, y2, r2) {
    const d = distance(x1, y1, x2, y2);
    return d < r1 + r2;
}

/**
 * 检测矩形碰撞（AABB碰撞检测）
 * @param {number} x1 - 第一个矩形的X坐标
 * @param {number} y1 - 第一个矩形的Y坐标
 * @param {number} w1 - 第一个矩形的宽度
 * @param {number} h1 - 第一个矩形的高度
 * @param {number} x2 - 第二个矩形的X坐标
 * @param {number} y2 - 第二个矩形的Y坐标
 * @param {number} w2 - 第二个矩形的宽度
 * @param {number} h2 - 第二个矩形的高度
 * @returns {boolean} 是否发生碰撞
 */
function rectangleCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
}

// ==================== 数组工具 ====================

/**
 * 从数组中移除指定的元素
 * @param {Array} array - 数组
 * @param {*} element - 要移除的元素
 * @returns {Array} 移除后的数组（原数组被修改）
 */
function removeFromArray(array, element) {
    const index = array.indexOf(element);
    if (index > -1) {
        array.splice(index, 1);
    }
    return array;
}

/**
 * 检查数组是否为空
 * @param {Array} array - 数组
 * @returns {boolean} 是否为空
 */
function isEmpty(array) {
    return array.length === 0;
}

// ==================== 时间工具 ====================

/**
 * 延迟执行函数
 * @param {number} ms - 延迟时间（毫秒）
 * @param {Function} callback - 回调函数
 * 
 * 例子：
 * delay(1000, () => console.log('1秒后执行'))
 */
function delay(ms, callback) {
    setTimeout(callback, ms);
}

// ==================== 调试工具 ====================

/**
 * 打印调试信息
 * @param {string} label - 标签
 * @param {*} value - 要打印的值
 */
function debug(label, value) {
    console.log(`[DEBUG] ${label}:`, value);
}

/**
 * 打印错误信息
 * @param {string} message - 错误消息
 */
function error(message) {
    console.error(`[ERROR] ${message}`);
}