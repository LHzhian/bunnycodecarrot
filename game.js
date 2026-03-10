

// 静态常量
const GRID_SIZE = 80; // 格子像素
const ROWS = 5; // 网格行数
const COLS = 5; // 网格列数

// 皮肤系统
const SKIN_STYLES = {
    pixel: {
        name: '像素风',
        colors: {
            rabbit: '#f5f5f5',
            carrot: '#ff6b6b',
            stone: '#8B4513',
            grid: '#e0d6c2'
        }
    },
    handdrawn: {
        name: '手绘风',
        colors: {
            rabbit: '#f0f0f0',
            carrot: '#ff5252',
            stone: '#6d4c41',
            grid: '#d7ccc8'
        }
    }
};

let currentSkin = 'pixel'; // 当前皮肤风格

// 纯净坐标
let rabbit = { x: 0, y: 0, direction: 'up' }; // 初始位置 0,0，初始朝向向上
let carrot = { x: 4, y: 4 }; // 萝卜位置 4,4
let stones = []; // 石头位置数组
let portals = []; // 传送门位置数组
let traps = []; // 陷阱位置数组
let currentLevel = 0; // 当前关卡索引
let showTraps = true; // 控制陷阱显示的开关变量

// 关卡状态管理
let unlockedLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]; // 已解锁的关卡索引，暂时全部解锁以便测试
let completedLevels = []; // 已完成的关卡索引

// 关卡数据
const levels = [
    // 第1等级（1-5关）：1个石头，无传送门
    {
        carrot: { x: 2, y: 2 },
        stones: [{ x: 1, y: 1 }],
        portals: [],
        trap: [{ x: 2, y: 0 }]
    },
    {
        carrot: { x: 3, y: 3 },
        stones: [{ x: 2, y: 2 }],
        portals: [],
        trap: [{ x: 3, y: 2 }]
    },
    {
        carrot: { x: 4, y: 3 },
        stones: [{ x: 2, y: 2 }],
        portals: [],
        trap: [{ x: 3, y: 3 }]
    },
    {
        carrot: { x: 3, y: 4 },
        stones: [{ x: 2, y: 2 }],
        portals: [],
        trap: [{ x: 2, y: 3 }]
    },
    {
        carrot: { x: 4, y: 4 },
        stones: [{ x: 2, y: 2 }],
        portals: [],
        trap: [{ x: 2, y: 4 }]
    },
    // 第2等级（6-10关）：2个石头，无传送门
    {
        carrot: { x: 4, y: 4 },
        stones: [{ x: 2, y: 2 }, { x: 3, y: 4 }],
        portals: [],
        trap: [{ x: 4, y: 1 }, { x: 2, y: 3 }]
    },
    {
        carrot: { x: 4, y: 0 },
        stones: [{ x: 2, y: 2 }, { x: 3, y: 0 }],
        portals: [],
        trap: [{ x: 4, y: 3 }, { x: 2, y: 1 }]
    },
    {
        carrot: { x: 2, y: 4 },
        stones: [{ x: 0, y: 2 }, { x: 2, y: 3 }],
        portals: [],
        trap: [{ x: 3, y: 0 }, { x: 1, y: 3 }]
    },
    {
        carrot: { x: 4, y: 4 },
        stones: [{ x: 0, y: 1 }, { x: 2, y: 2 }],
        portals: [],
        trap: [{ x: 1, y: 2 }, { x: 4, y: 3 }]
    },
    {
        carrot: { x: 4, y: 4 },
        stones: [{ x: 2, y: 3 }, { x: 3, y: 2 }],
        portals: [],
        trap: [{ x: 0, y: 4 }, { x: 4, y: 3 }]
    },
    // 第3等级（11-15关）：3个石头，有传送门
    {
        carrot: { x: 4, y: 4 },
        stones: [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }],
        portals: [{ x: 2, y: 1, color: '#4ecdc4' }, { x: 2, y: 4, color: '#4ecdc4' }],
        trap: [{ x: 4, y: 0 }, { x: 0, y: 3 }, { x: 3, y: 4 }]
    },
    {
        carrot: { x: 4, y: 4 },
        stones: [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 4, y: 2 }],
        portals: [{ x: 2, y: 1, color: '#4ecdc4' }, { x: 1, y: 2, color: '#4ecdc4' }],
        trap: [{ x: 3, y: 0 }, { x: 0, y: 3 }, { x: 3, y: 4 }]
    },
    {
        carrot: { x: 4, y: 4 },
        stones: [{ x: 0, y: 1 }, { x: 2, y: 2 }, { x: 4, y: 3 }],
        portals: [{ x: 2, y: 0, color: '#96ceb4' }, { x: 3, y: 2, color: '#96ceb4' }],
        trap: [{ x: 1, y: 3 }, { x: 2, y: 1 }, { x: 3, y: 3 }]
    },
    {
        carrot: { x: 4, y: 4 },
        stones: [{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 4, y: 1 }],
        portals: [{ x: 0, y: 1, color: '#45b7d1' }, { x: 4, y: 2, color: '#45b7d1' }],
        trap: [{ x: 2, y: 0 }, { x: 1, y: 4 }, { x: 4, y: 3 }]
    },
    {
        carrot: { x: 4, y: 4 },
        stones: [{ x: 2, y: 0 }, { x: 2, y: 2 }, { x: 2, y: 4 }],
        portals: [{ x: 0, y: 2, color: '#ffeaa7' }, { x: 3, y: 3, color: '#ffeaa7' }],
        trap: [{ x: 1, y: 0 }, { x: 1, y: 4 }, { x: 4, y: 3 }]
    },
    // 第4等级（16-20关）：4个石头，有传送门
    {
        carrot: { x: 4, y: 4 },
        stones: [{ x: 1, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 3 }, { x: 1, y: 3 }],
        portals: [{ x: 1, y: 2, color: '#e17055' }, { x: 4, y: 2, color: '#e17055' }],
        trap: [{ x: 2, y: 2 }, { x: 4, y: 3 }, { x: 3, y: 0 }, { x: 4, y: 1 }]
    },
    {
        carrot: { x: 4, y: 4 },
        stones: [{ x: 1, y: 0 }, { x: 0, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 3 }],
        portals: [{ x: 2, y: 1, color: '#00b894' }, { x: 0, y: 4, color: '#00b894' }],
        trap: [{ x: 2, y: 2 }, { x: 2, y: 0 }, { x: 1, y: 4 }, { x: 3, y: 2 }]
    },
    {
        carrot: { x: 4, y: 0 },
        stones: [{ x: 3, y: 0 }, { x: 0, y: 4 }, { x: 3, y: 2 }, { x: 4, y: 4 }],
        portals: [{ x: 1, y: 2, color: '#dfe6e9' }, { x: 2, y: 4, color: '#dfe6e9' }],
        trap: [{ x: 0, y: 2 }, { x: 1, y: 1 }, { x: 2, y: 3 }, { x: 3, y: 1 }]
    },
    {
        carrot: { x: 0, y: 4 },
        stones: [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }],
        portals: [{ x: 2, y: 1, color: '#ff6b6b' }, { x: 4, y: 3, color: '#ff6b6b' }],
        trap: [{ x: 0, y: 1 }, { x: 1, y: 3 }, { x: 3, y: 1 }, { x: 3, y: 4 }]
    },
    {
        carrot: { x: 4, y: 4 },
        stones: [{ x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }],
        portals: [{ x: 4, y: 0, color: '#4ecdc4' }, { x: 3, y: 3, color: '#4ecdc4' }],
        trap: [{ x: 1, y: 0 }, { x: 3, y: 4 }, { x: 1, y: 3 }, { x: 3, y: 1 }]
    }
];

// 动画相关变量
let isAnimating = false;
let animationStartTime;
let startPosition = { x: 0, y: 0 };
let targetPosition = { x: 0, y: 0 };

// 兔子状态
let isFainting = false;
let isTrapTriggered = false;

// 粒子系统
let particles = [];

// 全局变量
let canvas, ctx, runButton, resetButton, messageDiv, levelSelectButton, levelSelectPanel, commandQueue;

// 清空命令队列函数
function clearCommandQueue() {
    commandQueue.innerHTML = '';
}

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    runButton = document.getElementById('runButton');
    resetButton = document.getElementById('resetButton');
    messageDiv = document.getElementById('message');
    commandQueue = document.getElementById('command-queue');
    const commandBank = document.getElementById('command-bank');

    // 初始化关卡状态
    loadLevelStatus();
    
    // 随机选择初始皮肤
    setRandomSkin();
    
    // 创建关卡选择按钮
    createLevelSelectUI();
    
    // 创建皮肤选择UI
    createSkinSelectUI();
    
    // 初始化陷阱显示按钮文本
    const lang = document.documentElement.lang;
    
    // 获取指令的显示文本
    function getCommandText(command) {
        // 检测当前页面语言
        const lang = document.documentElement.lang;
        
        // 命令文本映射
        const commandTextMap = {
            en: {
                up: "Move Forward",
                down: "Move Backward",
                left: "Turn Left",
                right: "Turn Right",
                pull: "Pull Carrot",
                loop: "Loop"
            },
            'zh-CN': {
                up: "前进",
                down: "后退",
                left: "左移",
                right: "右移",
                pull: "拔萝卜",
                loop: "循环"
            }
        };
        
        // 默认使用英文
        const currentLang = lang === 'zh-CN' ? 'zh-CN' : 'en';
        return commandTextMap[currentLang][command] || command;
    }
    
    // 添加指令到队列或循环框
    function addCommandToQueue(command, targetElement = commandQueue) {
        if (command === 'loop') {
            // 创建循环框
            const loopBlock = document.createElement('div');
            loopBlock.className = 'loop-block';
            
            // 循环框头部
            const loopHeader = document.createElement('div');
            loopHeader.className = 'loop-header';
            
            const loopTitle = document.createElement('span');
            loopTitle.className = 'loop-title';
            loopTitle.textContent = getCommandText('loop');
            
            const loopCountContainer = document.createElement('div');
            loopCountContainer.className = 'loop-count-container';
            
            const loopCountLabel = document.createElement('span');
            loopCountLabel.textContent = 'x';
            
            const loopCountInput = document.createElement('input');
            loopCountInput.type = 'number';
            loopCountInput.className = 'loop-count-input';
            loopCountInput.value = 3;
            loopCountInput.min = 1;
            loopCountInput.max = 10;
            loopCountInput.style.width = '40px';
            loopCountInput.style.textAlign = 'center';
            loopCountInput.style.border = '1px solid #ff6b6b';
            loopCountInput.style.borderRadius = '4px';
            loopCountInput.style.padding = '2px';
            
            // 输入框变化时更新循环次数
            loopCountInput.addEventListener('change', function() {
                let value = parseInt(loopCountInput.value);
                if (isNaN(value)) value = 3;
                value = Math.max(1, Math.min(10, value));
                loopCountInput.value = value;
            });
            
            // 创建删除按钮
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                loopBlock.remove();
            });
            
            loopCountContainer.appendChild(loopCountLabel);
            loopCountContainer.appendChild(loopCountInput);
            
            loopHeader.appendChild(loopTitle);
            loopHeader.appendChild(loopCountContainer);
            loopHeader.appendChild(removeBtn);
            
            // 循环框内容区域
            const loopContent = document.createElement('div');
            loopContent.className = 'loop-content';
            
            // 拖拽事件处理
            loopContent.addEventListener('dragenter', function(e) {
                e.preventDefault();
                loopContent.classList.add('highlight');
            });
            
            loopContent.addEventListener('dragleave', function(e) {
                e.preventDefault();
                if (!loopContent.contains(e.relatedTarget)) {
                    loopContent.classList.remove('highlight');
                }
            });
            
            loopContent.addEventListener('dragover', function(e) {
                e.preventDefault();
            });
            
            loopContent.addEventListener('drop', function(e) {
                e.preventDefault();
                e.stopPropagation(); // 阻止事件冒泡到命令队列
                loopContent.classList.remove('highlight');
                const cmd = e.dataTransfer.getData('text/plain');
                if (cmd !== 'loop') { // 不允许循环嵌套
                    addCommandToQueue(cmd, loopContent);
                }
            });
            
            loopBlock.appendChild(loopHeader);
            loopBlock.appendChild(loopContent);
            targetElement.appendChild(loopBlock);
        } else {
            // 创建普通指令块
            const commandBlock = document.createElement('div');
            commandBlock.className = 'command-block';
            commandBlock.dataset.command = command;
            
            const commandText = document.createElement('span');
            commandText.className = 'command-text';
            commandText.textContent = getCommandText(command);
            
            // 创建删除按钮
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = '×';
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                commandBlock.remove();
            });
            
            // 添加文本和删除按钮到卡片
            commandBlock.appendChild(commandText);
            commandBlock.appendChild(removeBtn);
            
            targetElement.appendChild(commandBlock);
        }
    }
    
    // 拖拽开始事件
    commandBank.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('command-card')) {
            e.dataTransfer.setData('text/plain', e.target.dataset.command);
            e.target.classList.add('dragging');
        }
    });
    
    // 拖拽结束事件
    commandBank.addEventListener('dragend', function(e) {
        if (e.target.classList.contains('command-card')) {
            e.target.classList.remove('dragging');
        }
    });
    
    // 拖拽进入事件
    commandQueue.addEventListener('dragenter', function(e) {
        e.preventDefault();
        commandQueue.classList.add('highlight');
    });
    
    // 拖拽离开事件
    commandQueue.addEventListener('dragleave', function(e) {
        e.preventDefault();
        if (!commandQueue.contains(e.relatedTarget)) {
            commandQueue.classList.remove('highlight');
        }
    });
    
    // 拖拽悬停事件
    commandQueue.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    // 放置事件
    commandQueue.addEventListener('drop', function(e) {
        e.preventDefault();
        commandQueue.classList.remove('highlight');
        const command = e.dataTransfer.getData('text/plain');
        addCommandToQueue(command);
    });
    
    // 解析指令队列，处理循环结构
    function parseCommandQueue() {
        const commands = [];
        const commandElements = [];
        
        function parseElement(element) {
            const children = element.children;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (child.classList.contains('command-block')) {
                    // 普通指令
                    commands.push(child.dataset.command);
                    commandElements.push(child);
                } else if (child.classList.contains('loop-block')) {
                    // 循环指令
                    const loopCountInput = child.querySelector('.loop-count-input');
                    const loopCount = parseInt(loopCountInput.value) || 3;
                    const loopContent = child.querySelector('.loop-content');
                    const loopCommands = [];
                    const loopElements = [];
                    
                    // 解析循环内的指令
                    const loopChildren = loopContent.children;
                    for (let j = 0; j < loopChildren.length; j++) {
                        if (loopChildren[j].classList.contains('command-block')) {
                            loopCommands.push(loopChildren[j].dataset.command);
                            loopElements.push(loopChildren[j]);
                        }
                    }
                    
                    // 重复添加循环内的指令
                    for (let k = 0; k < loopCount; k++) {
                        commands.push(...loopCommands);
                        commandElements.push(...loopElements);
                    }
                }
            }
        }
        
        parseElement(commandQueue);
        return { commands, commandElements };
    }

    // 开始运行按钮点击事件
    runButton.addEventListener('click', function() {
        console.log('按钮被点击了');
        // 解析指令队列
        const { commands, commandElements } = parseCommandQueue();
        console.log('获取到的指令:', commands);
        
        if (commands.length === 0) {
            showMessage('Please add commands before running', 'error');
            return;
        }
        
        // 禁用按钮
        runButton.disabled = true;
        
        // 执行指令
        executeCommands(commands, commandElements);
    });
    

    
    // 重置按钮点击事件
    resetButton.addEventListener('click', function() {
        console.log('重置按钮被点击了');
        // 计算初始朝向，面向萝卜的方向
        let initialDirection = 'up';
        // 优先根据x坐标确定方向
        if (carrot.x > 0) {
            initialDirection = 'right';
        } else if (carrot.x < 0) {
            initialDirection = 'left';
        } else {
            // x坐标相同，根据y坐标确定方向
            if (carrot.y > 0) {
                initialDirection = 'down';
            } else if (carrot.y < 0) {
                initialDirection = 'up';
            }
        }
        // 重置兔子位置到起点
        rabbit = { x: 0, y: 0, direction: initialDirection };
        // 清空命令队列
        clearCommandQueue();
        // 重新渲染游戏
        render();
        showMessage('Reset to starting point', 'info');
    });
    
    // 加载第一关
    loadLevel(0);
    
    // 创建关卡选择UI函数
    function createLevelSelectUI() {
        // 创建关卡选择按钮
        levelSelectButton = document.createElement('button');
        levelSelectButton.textContent = 'Level';
        levelSelectButton.id = 'levelSelectButton';
        levelSelectButton.style.position = 'absolute';
        levelSelectButton.style.top = '10px';
        levelSelectButton.style.left = '10px';
        levelSelectButton.style.padding = '8px 16px';
        levelSelectButton.style.fontSize = '14px';
        levelSelectButton.style.backgroundColor = '#4ecdc4';
        levelSelectButton.style.color = 'white';
        levelSelectButton.style.border = 'none';
        levelSelectButton.style.borderRadius = '4px';
        levelSelectButton.style.cursor = 'pointer';
        document.body.appendChild(levelSelectButton);
        
        // 创建关卡选择面板
        levelSelectPanel = document.createElement('div');
        levelSelectPanel.id = 'levelSelectPanel';
        levelSelectPanel.style.position = 'fixed';
        levelSelectPanel.style.top = '50%';
        levelSelectPanel.style.left = '50%';
        levelSelectPanel.style.transform = 'translate(-50%, -50%)';
        levelSelectPanel.style.width = '400px';
        levelSelectPanel.style.height = '400px';
        levelSelectPanel.style.backgroundColor = 'white';
        levelSelectPanel.style.borderRadius = '8px';
        levelSelectPanel.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        levelSelectPanel.style.padding = '20px';
        levelSelectPanel.style.display = 'none';
        levelSelectPanel.style.zIndex = '1000';
        levelSelectPanel.style.pointerEvents = 'auto';
        
        // 创建面板标题
        const panelTitle = document.createElement('h2');
        panelTitle.textContent = 'Select Level';
        panelTitle.style.textAlign = 'center';
        panelTitle.style.marginTop = '0';
        levelSelectPanel.appendChild(panelTitle);
        
        // 创建关卡网格
        const levelGrid = document.createElement('div');
        levelGrid.style.display = 'grid';
        levelGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
        levelGrid.style.gap = '10px';
        levelGrid.style.marginTop = '20px';
        levelGrid.style.pointerEvents = 'auto';
        console.log('创建关卡网格');
        
        // 创建关卡按钮
        for (let i = 0; i < levels.length; i++) {
            const levelButton = document.createElement('button');
            levelButton.textContent = i + 1;
            levelButton.style.width = '60px';
            levelButton.style.height = '60px';
            levelButton.style.fontSize = '16px';
            levelButton.style.border = '2px solid #e0d6c2';
            levelButton.style.borderRadius = '8px';
            levelButton.style.cursor = 'pointer';
            levelButton.style.pointerEvents = 'auto';
            levelButton.style.position = 'relative';
            levelButton.style.zIndex = '1001';
            
            console.log('创建关卡按钮:', i + 1);
            
            // 设置关卡按钮样式
            if (completedLevels.includes(i)) {
                // 已完成的关卡
                levelButton.style.backgroundColor = '#4caf50';
                levelButton.style.color = 'white';
            } else if (unlockedLevels.includes(i)) {
                // 已解锁但未完成的关卡
                levelButton.style.backgroundColor = '#4ecdc4';
                levelButton.style.color = 'white';
            } else {
                // 未解锁的关卡
                levelButton.style.backgroundColor = '#e0d6c2';
                levelButton.style.color = '#999';
                levelButton.disabled = true;
            }
            
            // 添加点击事件
            (function(levelIndex) {
                levelButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    console.log('关卡按钮点击:', levelIndex + 1);
                    console.log('unlockedLevels:', unlockedLevels);
                    console.log('是否已解锁:', unlockedLevels.includes(levelIndex));
                    if (unlockedLevels.includes(levelIndex)) {
                        // 清空命令队列
                        clearCommandQueue();
                        // 加载关卡
                        loadLevel(levelIndex);
                        // 关闭面板
                        levelSelectPanel.style.display = 'none';
                        console.log('选择关卡:', levelIndex + 1);
                    } else {
                        console.log('关卡未解锁:', levelIndex + 1);
                    }
                });
            })(i);
            
            levelGrid.appendChild(levelButton);
            console.log('添加关卡按钮到网格:', i + 1);
        }
        
        levelSelectPanel.appendChild(levelGrid);
        console.log('添加关卡网格到面板');
        console.log('关卡按钮总数:', levels.length);
        
        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.position = 'absolute';
        closeButton.style.bottom = '10px';
        closeButton.style.right = '10px';
        closeButton.style.padding = '8px 16px';
        closeButton.style.backgroundColor = '#ff6b6b';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', function() {
            levelSelectPanel.style.display = 'none';
        });
        
        levelSelectPanel.appendChild(closeButton);
        document.body.appendChild(levelSelectPanel);
        
        // 关卡选择按钮点击事件
        levelSelectButton.addEventListener('click', function() {
            levelSelectPanel.style.display = 'block';
            console.log('打开关卡选择面板');
        });
    }
});

// 加载关卡状态
function loadLevelStatus() {
    const savedUnlocked = localStorage.getItem('unlockedLevels');
    const savedCompleted = localStorage.getItem('completedLevels');
    
    if (savedUnlocked) {
        unlockedLevels = JSON.parse(savedUnlocked);
    }
    
    if (savedCompleted) {
        completedLevels = JSON.parse(savedCompleted);
    }
}

// 保存关卡状态
function saveLevelStatus() {
    localStorage.setItem('unlockedLevels', JSON.stringify(unlockedLevels));
    localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
}

// 检查是否碰撞石头
function checkCollision(x, y) {
    return stones.some(stone => stone.x === x && stone.y === y);
}

// 检查是否踩中陷阱
function checkTrap(x, y) {
    return traps.some(trap => trap.x === x && trap.y === y);
}

// 检查是否在传送门位置
function checkPortal(x, y) {
    const portal = portals.find(p => p.x === x && p.y === y);
    if (portal) {
        // 找到配对的传送门
        const pairedPortal = portals.find(p => p.color === portal.color && (p.x !== x || p.y !== y));
        if (pairedPortal) {
            return pairedPortal;
        }
    }
    return null;
}

// 触发兔子晕倒动画
function triggerFaintAnimation() {
    // 获取canvas元素并添加抖动类
    const canvasElement = document.getElementById('gameCanvas');
    if (canvasElement) {
        canvasElement.classList.add('canvas-shake');
    }
    
    // 播放撞击音效（预留位置）
    // playSound('bump');
    
    // 1秒后移除抖动类并显示提示
    setTimeout(() => {
        if (canvasElement) {
            canvasElement.classList.remove('canvas-shake');
        }
        showMessage('Hit the wall, please modify the command', 'error');
    }, 1000);
}

// 触发陷阱动画
function triggerTrapAnimation() {
    // 设置陷阱触发状态
    isTrapTriggered = true;
    
    // 获取canvas元素并添加抖动类
    const canvasElement = document.getElementById('gameCanvas');
    if (canvasElement) {
        canvasElement.classList.add('canvas-shake');
    }
    
    // 播放陷阱音效（预留位置）
    // playSound('trap');
    
    // 1秒后移除抖动类并显示提示
    setTimeout(() => {
        if (canvasElement) {
            canvasElement.classList.remove('canvas-shake');
        }
        showMessage('Stepped on a trap! Game over, restarting level', 'error');
    }, 1000);
    
    // 5秒后重新加载当前关卡
    setTimeout(() => {
        // 清空命令队列
        clearCommandQueue();
        // 重新加载当前关卡
        loadLevel(currentLevel);
    }, 5000);
}

// 移动兔子函数
function moveRabbit(direction) {
    console.log('移动方向:', direction);
    
    // 保存当前位置作为动画起点
    startPosition = { x: rabbit.x, y: rabbit.y };
    let newX = rabbit.x;
    let newY = rabbit.y;
    
    switch (direction) {
        case 'up':
            // 朝当前面向的方向移动
            switch (rabbit.direction) {
                case 'up':
                    newY = rabbit.y - 1;
                    break;
                case 'right':
                    newX = rabbit.x + 1;
                    break;
                case 'down':
                    newY = rabbit.y + 1;
                    break;
                case 'left':
                    newX = rabbit.x - 1;
                    break;
            }
            break;
        case 'down':
            // 朝当前面向的反方向移动
            switch (rabbit.direction) {
                case 'up':
                    newY = rabbit.y + 1;
                    break;
                case 'right':
                    newX = rabbit.x - 1;
                    break;
                case 'down':
                    newY = rabbit.y - 1;
                    break;
                case 'left':
                    newX = rabbit.x + 1;
                    break;
            }
            break;
        case 'right':
            // 顺时针转向（屏幕顺时针）
            switch (rabbit.direction) {
                case 'up':
                    rabbit.direction = 'right';
                    break;
                case 'right':
                    rabbit.direction = 'down';
                    break;
                case 'down':
                    rabbit.direction = 'left';
                    break;
                case 'left':
                    rabbit.direction = 'up';
                    break;
            }
            // 转向不需要动画
            render();
            return;
        case 'left':
            // 逆时针转向（屏幕逆时针）
            switch (rabbit.direction) {
                case 'up':
                    rabbit.direction = 'left';
                    break;
                case 'left':
                    rabbit.direction = 'down';
                    break;
                case 'down':
                    rabbit.direction = 'right';
                    break;
                case 'right':
                    rabbit.direction = 'up';
                    break;
            }
            // 转向不需要动画
            render();
            return;
    }
    
    // 检查边界
    if (newX < 0 || newX >= COLS || newY < 0 || newY >= ROWS) {
        triggerFaintAnimation();
        return;
    }
    
    // 检查石头碰撞
    if (checkCollision(newX, newY)) {
        triggerFaintAnimation();
        return;
    }
    
    // 更新位置
    rabbit.x = newX;
    rabbit.y = newY;
    
    // 检查传送门
    const portal = checkPortal(rabbit.x, rabbit.y);
    if (portal) {
        rabbit.x = portal.x;
        rabbit.y = portal.y;
    }
    
    // 检查陷阱
    if (checkTrap(rabbit.x, rabbit.y)) {
        // 触发陷阱动画
        triggerTrapAnimation();
        // 停止指令执行
        return;
    }
    
    // 设置目标位置
    targetPosition = { x: rabbit.x, y: rabbit.y };
    
    // 开始动画
    isAnimating = true;
    animationStartTime = performance.now();
    animate();
}

// 动画函数
function animate() {
    if (!isAnimating) return;
    
    const currentTime = performance.now();
    const elapsedTime = currentTime - animationStartTime;
    const duration = 300; // 300ms 动画
    
    let progress = Math.min(elapsedTime / duration, 1);
    // 使用缓动函数使动画更自然
    progress = 1 - Math.pow(1 - progress, 3);
    
    // 强制重绘
    render(progress);
    
    if (progress < 1) {
        requestAnimationFrame(animate);
    } else {
        isAnimating = false;
        // 动画结束后最终渲染
        render();
    }
}

// 随机设置皮肤
function setRandomSkin() {
    const skinKeys = Object.keys(SKIN_STYLES);
    const randomSkin = skinKeys[Math.floor(Math.random() * skinKeys.length)];
    currentSkin = randomSkin;
    console.log('随机设置皮肤:', SKIN_STYLES[currentSkin].name);
    render();
}

// 创建皮肤选择UI
function createSkinSelectUI() {
    // 创建皮肤选择按钮
    const skinSelectButton = document.createElement('button');
    skinSelectButton.textContent = 'Theme';
    skinSelectButton.id = 'skinSelectButton';
    skinSelectButton.style.position = 'absolute';
    skinSelectButton.style.top = '10px';
    skinSelectButton.style.right = '10px';
    skinSelectButton.style.padding = '8px 16px';
    skinSelectButton.style.fontSize = '14px';
    skinSelectButton.style.backgroundColor = '#4ecdc4';
    skinSelectButton.style.color = 'white';
    skinSelectButton.style.border = 'none';
    skinSelectButton.style.borderRadius = '4px';
    skinSelectButton.style.cursor = 'pointer';
    skinSelectButton.addEventListener('click', function() {
        setRandomSkin();
        showMessage('Switched to ' + SKIN_STYLES[currentSkin].name, 'info');
    });
    document.body.appendChild(skinSelectButton);
}

// 加载关卡
function loadLevel(levelIndex) {
    console.log('加载关卡:', levelIndex + 1);
    console.log('levels.length:', levels.length);
    
    if (levelIndex >= levels.length) {
        showMessage('Congratulations! You have completed all levels!', 'success');
        // 重置到第一关
        currentLevel = 0;
        levelIndex = 0;
        console.log('关卡索引超出范围，重置到第一关');
    }
    
    const level = levels[levelIndex];
    console.log('关卡数据:', level);
    
    carrot = { ...level.carrot };
    console.log('萝卜位置:', carrot);
    
    // 计算初始朝向，面向萝卜的方向
    let initialDirection = 'up';
    // 优先根据x坐标确定方向
    if (carrot.x > 0) {
        initialDirection = 'right';
    } else if (carrot.x < 0) {
        initialDirection = 'left';
    } else {
        // x坐标相同，根据y坐标确定方向
        if (carrot.y > 0) {
            initialDirection = 'down';
        } else if (carrot.y < 0) {
            initialDirection = 'up';
        }
    }
    console.log('初始朝向:', initialDirection);
    
    rabbit = { x: 0, y: 0, direction: initialDirection };
    console.log('兔子初始位置:', rabbit);
    
    stones = level.stones.map(stone => ({ ...stone }));
    console.log('石头位置:', stones);
    
    portals = level.portals.map(portal => ({ ...portal }));
    console.log('传送门位置:', portals);
    
    traps = level.trap.map(trap => ({ ...trap }));
    console.log('陷阱位置:', traps);
    
    currentLevel = levelIndex;
    console.log('当前关卡:', currentLevel + 1);
    
    // 重置陷阱触发状态
    isTrapTriggered = false;
    
    showMessage('Level ' + (currentLevel + 1), 'info');
    render();
    console.log('关卡加载完成');
}

// 执行指令队列
function executeCommands(commands, commandElements) {
    console.log('开始执行指令队列:', commands);
    let index = 0;
    
    function executeNext() {
        if (index >= commands.length) {
            // 所有指令执行完毕
            console.log('所有指令执行完毕');
            runButton.disabled = false;
            return;
        }
        
        // 检查是否触发了陷阱，如果是则停止执行
        if (isTrapTriggered) {
            console.log('陷阱已触发，停止执行指令');
            runButton.disabled = false;
            return;
        }
        
        // 移除之前的高亮
        if (index > 0 && commandElements[index - 1]) {
            commandElements[index - 1].classList.remove('command-highlight');
        }
        
        // 添加当前指令的高亮
        if (commandElements[index]) {
            commandElements[index].classList.add('command-highlight');
        }
        
        const command = commands[index].toLowerCase();
        console.log('执行指令:', command);
        index++;
        
        if (command === 'pull') {
            // 检查是否在萝卜位置
            console.log('执行pull指令，当前位置:', rabbit.x, rabbit.y);
            if (rabbit.x === carrot.x && rabbit.y === carrot.y) {
                showMessage('Successfully pulled the carrot!', 'success');
                console.log('成功拔到萝卜！');
                
                // 创建粒子特效
                createParticles(carrot.x, carrot.y);
                
                // 预留成功音效位置
                // playSound('success');
                setTimeout(() => {
                    // 移除最后一个高亮
                    if (commandElements[index - 1]) {
                        commandElements[index - 1].classList.remove('command-highlight');
                    }
                    // 标记关卡为完成
                    if (!completedLevels.includes(currentLevel)) {
                        completedLevels.push(currentLevel);
                    }
                    // 解锁下一关
                    const nextLevel = currentLevel + 1;
                    if (nextLevel < levels.length && !unlockedLevels.includes(nextLevel)) {
                        unlockedLevels.push(nextLevel);
                    }
                    // 保存关卡状态
                    saveLevelStatus();
                    // 清空命令队列
                    clearCommandQueue();
                    // 加载下一关
                    loadLevel(currentLevel + 1);
                    runButton.disabled = false;
                }, 1500);
            } else {
                setTimeout(() => {
                    // 移除当前高亮
                    if (commandElements[index - 1]) {
                        commandElements[index - 1].classList.remove('command-highlight');
                    }
                    executeNext();
                }, 500);
            }
        } else {
            // 执行移动
            moveRabbit(command);
            // 延迟执行下一条指令，等待动画完成
            setTimeout(() => {
                // 检查是否触发了陷阱，如果是则停止执行
                if (isTrapTriggered) {
                    console.log('陷阱已触发，停止执行指令');
                    runButton.disabled = false;
                    return;
                }
                // 移除当前高亮
                if (commandElements[index - 1]) {
                    commandElements[index - 1].classList.remove('command-highlight');
                }
                executeNext();
            }, 800);
        }
    }
    
    // 开始执行
    executeNext();
}

// 绘制石头
function drawStone(x, y) {
    const centerX = x * GRID_SIZE + GRID_SIZE / 2;
    const centerY = y * GRID_SIZE + GRID_SIZE / 2;
    
    if (currentSkin === 'pixel') {
        // 像素风格石头
        ctx.fillStyle = SKIN_STYLES[currentSkin].colors.stone;
        // 绘制像素风格石头主体（方形）
        ctx.fillRect(centerX - 25, centerY - 25, 50, 50);
        
        // 绘制像素风格石头纹理
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(centerX - 15, centerY - 15, 10, 10);
        ctx.fillRect(centerX + 5, centerY + 5, 8, 8);
        ctx.fillRect(centerX - 10, centerY + 10, 9, 9);
    } else {
        // 手绘风格石头（保持原有风格）
        ctx.fillStyle = SKIN_STYLES[currentSkin].colors.stone;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制石头纹理
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.arc(centerX - 10, centerY - 10, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX + 10, centerY + 10, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX - 5, centerY + 15, 7, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 绘制传送门
function drawPortal(x, y, color) {
    const centerX = x * GRID_SIZE + GRID_SIZE / 2;
    const centerY = y * GRID_SIZE + GRID_SIZE / 2;
    
    if (currentSkin === 'pixel') {
        // 像素风格传送门
        // 绘制像素风格传送门外圈（方形）
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.strokeRect(centerX - 30, centerY - 30, 60, 60);
        
        // 绘制像素风格传送门内圈
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(centerX - 25, centerY - 25, 50, 50);
        ctx.globalAlpha = 1;
        
        // 绘制像素风格传送门装饰
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 20, centerY - 20, 40, 40);
    } else {
        // 手绘风格传送门（保持原有风格）
        // 绘制传送门外圈
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
        ctx.stroke();
        
        // 绘制传送门内圈
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // 绘制传送门装饰
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// 绘制陷阱
function drawTrap(x, y) {
    const centerX = x * GRID_SIZE + GRID_SIZE / 2;
    const centerY = y * GRID_SIZE + GRID_SIZE / 2;
    
    if (currentSkin === 'pixel') {
        // 像素风格陷阱
        // 绘制像素风格陷阱主体（方形）
        ctx.fillStyle = '#333';
        ctx.fillRect(centerX - 20, centerY - 20, 40, 40);
        
        // 绘制像素风格陷阱内部
        ctx.fillStyle = '#000';
        ctx.fillRect(centerX - 15, centerY - 15, 30, 30);
        
        // 绘制像素风格陷阱边缘
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - 20, centerY - 20, 40, 40);
    } else {
        // 手绘风格陷阱
        // 绘制陷阱主体
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制陷阱内部
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制陷阱边缘
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// 渲染函数
function render(progress = 0) {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格
    drawGrid();
    
    // 绘制石头
    stones.forEach(stone => drawStone(stone.x, stone.y));
    
    // 绘制陷阱（根据开关变量显示）
    if (isTrapTriggered || showTraps) {
        traps.forEach(trap => drawTrap(trap.x, trap.y));
    }
    
    // 绘制传送门
    portals.forEach(portal => drawPortal(portal.x, portal.y, portal.color));
    
    // 绘制萝卜
    drawCarrot(carrot.x, carrot.y);
    
    // 绘制粒子
    drawParticles();
    
    // 计算兔子位置
    let rabbitX, rabbitY;
    if (isAnimating) {
        // 动画过程中使用中间位置
        rabbitX = startPosition.x + (targetPosition.x - startPosition.x) * progress;
        rabbitY = startPosition.y + (targetPosition.y - startPosition.y) * progress;
    } else {
        // 动画结束后使用目标位置
        rabbitX = rabbit.x;
        rabbitY = rabbit.y;
    }
    
    // 绘制兔子
    drawRabbit(rabbitX, rabbitY);
    
    // 如果兔子正在晕倒，持续渲染以更新动画
    if (isFainting) {
        requestAnimationFrame(render);
    }
}

// 绘制网格
function drawGrid() {
    ctx.strokeStyle = SKIN_STYLES[currentSkin].colors.grid;
    ctx.lineWidth = currentSkin === 'pixel' ? 2 : 1;
    
    // 绘制垂直线
    for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * GRID_SIZE, 0);
        ctx.lineTo(x * GRID_SIZE, ROWS * GRID_SIZE);
        ctx.stroke();
    }
    
    // 绘制水平线
    for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * GRID_SIZE);
        ctx.lineTo(COLS * GRID_SIZE, y * GRID_SIZE);
        ctx.stroke();
    }
}

// 绘制兔子
function drawRabbit(x, y) {
    const centerX = x * GRID_SIZE + GRID_SIZE / 2;
    const centerY = y * GRID_SIZE + GRID_SIZE / 2;
    
    // 保存当前状态
    ctx.save();
    
    if (isFainting) {
        const time = performance.now() % 1000 / 1000; // 0-1秒循环
        let rotateAngle = 0;
        let scale = 1;
        
        // 实现晕倒动画效果
        if (time < 0.25) {
            // 向左倾斜
            rotateAngle = -10 * Math.PI / 180 * (time / 0.25);
            scale = 1 + 0.1 * (time / 0.25);
        } else if (time < 0.5) {
            // 向右倾斜
            rotateAngle = -10 * Math.PI / 180 + 20 * Math.PI / 180 * ((time - 0.25) / 0.25);
            scale = 1.1 - 0.05 * ((time - 0.25) / 0.25);
        } else if (time < 0.75) {
            // 向左倾斜
            rotateAngle = 10 * Math.PI / 180 - 15 * Math.PI / 180 * ((time - 0.5) / 0.25);
            scale = 1.05 - 0.05 * ((time - 0.5) / 0.25);
        } else {
            // 恢复正常
            rotateAngle = -5 * Math.PI / 180 + 5 * Math.PI / 180 * ((time - 0.75) / 0.25);
            scale = 1 + 0.05 * ((time - 0.75) / 0.25);
        }
        
        // 应用变换
        ctx.translate(centerX, centerY);
        ctx.rotate(rotateAngle);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -centerY);
    }
    
    // 根据方向旋转坐标系
    ctx.translate(centerX, centerY);
    switch (rabbit.direction) {
        case 'right':
            ctx.rotate(Math.PI / 2);
            break;
        case 'down':
            ctx.rotate(Math.PI);
            break;
        case 'left':
            ctx.rotate(Math.PI * 3 / 2);
            break;
    }
    ctx.translate(-centerX, -centerY);
    
    // 绘制兔子
    drawRabbitBody(centerX, centerY);
    
    // 恢复状态
    ctx.restore();
}

// 绘制兔子身体
function drawRabbitBody(centerX, centerY) {
    if (currentSkin === 'pixel') {
        // 像素风格兔子
        ctx.fillStyle = SKIN_STYLES[currentSkin].colors.rabbit;
        // 绘制像素风格身体（方形）
        ctx.fillRect(centerX - 20, centerY - 10, 40, 40);
        
        // 绘制像素风格耳朵
        ctx.fillRect(centerX - 15, centerY - 40, 10, 30);
        ctx.fillRect(centerX + 5, centerY - 40, 10, 30);
        
        // 绘制像素风格眼睛
        ctx.fillStyle = '#333';
        ctx.fillRect(centerX - 10, centerY - 5, 5, 5);
        ctx.fillRect(centerX + 5, centerY - 5, 5, 5);
        
        // 绘制像素风格鼻子
        ctx.fillStyle = '#ff8c8c';
        ctx.fillRect(centerX - 2, centerY + 10, 4, 4);
    } else {
        // 手绘风格兔子（保持原有风格）
        ctx.fillStyle = SKIN_STYLES[currentSkin].colors.rabbit;
        ctx.beginPath();
        ctx.arc(centerX, centerY + 10, 25, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制兔子耳朵
        ctx.fillStyle = SKIN_STYLES[currentSkin].colors.rabbit;
        ctx.beginPath();
        ctx.moveTo(centerX - 15, centerY - 20);
        ctx.lineTo(centerX - 25, centerY - 50);
        ctx.lineTo(centerX - 10, centerY - 30);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(centerX + 15, centerY - 20);
        ctx.lineTo(centerX + 25, centerY - 50);
        ctx.lineTo(centerX + 10, centerY - 30);
        ctx.closePath();
        ctx.fill();
        
        // 绘制兔子眼睛
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(centerX - 10, centerY, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX + 10, centerY, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制兔子鼻子
        ctx.fillStyle = '#ff8c8c';
        ctx.beginPath();
        ctx.arc(centerX, centerY + 10, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 绘制萝卜
function drawCarrot(x, y) {
    const centerX = x * GRID_SIZE + GRID_SIZE / 2;
    const centerY = y * GRID_SIZE + GRID_SIZE / 2;
    
    if (currentSkin === 'pixel') {
        // 像素风格萝卜
        // 绘制像素风格叶子
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(centerX - 10, centerY - 40, 5, 20);
        ctx.fillRect(centerX + 5, centerY - 40, 5, 20);
        ctx.fillRect(centerX - 15, centerY - 35, 5, 15);
        
        // 绘制像素风格萝卜主体
        ctx.fillStyle = SKIN_STYLES[currentSkin].colors.carrot;
        ctx.fillRect(centerX - 15, centerY - 10, 30, 35);
        // 绘制像素风格萝卜底部
        ctx.fillRect(centerX - 20, centerY + 25, 40, 5);
    } else {
        // 手绘风格萝卜（保持原有风格）
        // 绘制萝卜叶子
        ctx.fillStyle = '#4caf50';
        // 绘制多片叶子，更自然
        // 主叶子
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 20);
        ctx.quadraticCurveTo(centerX - 10, centerY - 40, centerX - 15, centerY - 50);
        ctx.quadraticCurveTo(centerX - 5, centerY - 35, centerX, centerY - 20);
        ctx.fill();
        
        // 右叶子
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 20);
        ctx.quadraticCurveTo(centerX + 10, centerY - 35, centerX + 15, centerY - 45);
        ctx.quadraticCurveTo(centerX + 5, centerY - 30, centerX, centerY - 20);
        ctx.fill();
        
        // 左叶子
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 25);
        ctx.quadraticCurveTo(centerX - 15, centerY - 35, centerX - 20, centerY - 40);
        ctx.quadraticCurveTo(centerX - 10, centerY - 30, centerX, centerY - 25);
        ctx.fill();
        
        // 绘制萝卜主体
        // 创建渐变效果
        const carrotGradient = ctx.createLinearGradient(centerX - 25, centerY, centerX + 25, centerY);
        carrotGradient.addColorStop(0, SKIN_STYLES[currentSkin].colors.carrot);
        carrotGradient.addColorStop(1, '#ff8787');
        
        // 绘制圆润的萝卜形状
        ctx.fillStyle = carrotGradient;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 15);
        ctx.quadraticCurveTo(centerX - 25, centerY - 5, centerX - 20, centerY + 25);
        ctx.quadraticCurveTo(centerX, centerY + 35, centerX + 20, centerY + 25);
        ctx.quadraticCurveTo(centerX + 25, centerY - 5, centerX, centerY - 15);
        ctx.closePath();
        ctx.fill();
        
        // 添加高光效果
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(centerX - 5, centerY - 5);
        ctx.quadraticCurveTo(centerX - 15, centerY + 5, centerX - 10, centerY + 15);
        ctx.quadraticCurveTo(centerX, centerY + 10, centerX - 5, centerY - 5);
        ctx.closePath();
        ctx.fill();
        
        // 添加纹理细节
        ctx.strokeStyle = 'rgba(255, 107, 107, 0.5)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const yPos = centerY - 10 + i * 10;
            ctx.beginPath();
            ctx.moveTo(centerX - 15 + i * 2, yPos);
            ctx.quadraticCurveTo(centerX, yPos + 2, centerX + 15 - i * 2, yPos);
            ctx.stroke();
        }
    }
}

// 显示消息
function showMessage(text, type = '') {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
}

// 创建粒子
function createParticles(x, y) {
    particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 2 + Math.random() * 3;
        const size = 3 + Math.random() * 5;
        
        particles.push({
            x: x * GRID_SIZE + GRID_SIZE / 2,
            y: y * GRID_SIZE + GRID_SIZE / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: size,
            color: getRandomColor(),
            life: 1.0,
            decay: 0.02 + Math.random() * 0.03
        });
    }
    
    // 开始粒子动画
    animateParticles();
}

// 获取随机颜色
function getRandomColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#e17055', '#00b894'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 动画粒子
function animateParticles() {
    let isActive = false;
    
    // 更新粒子
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // 重力
        p.life -= p.decay;
        
        if (p.life > 0) {
            isActive = true;
        } else {
            particles.splice(i, 1);
        }
    }
    
    // 重绘
    render();
    
    if (isActive) {
        requestAnimationFrame(animateParticles);
    }
}

// 绘制粒子
function drawParticles() {
    particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}
