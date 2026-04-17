const headerHTML = `
<div class="top-header" id="dynamic-top-header">
    <div class="logo-box">
        <span class="brand">廊道运维管理平台</span>
    </div>
    <div class="top-nav">
        <a class="top-nav-item" href="index.html" data-path="index.html">
            <i class="ri-dashboard-3-line"></i> 廊道态势显示
        </a>
        <a class="top-nav-item" href="廊道信息维护.html" data-path="廊道信息维护.html">
            <i class="ri-exchange-line"></i> 廊道基础数据
        </a>
        <a class="top-nav-item" href="规划计划.html" data-path="规划计划.html">
            <i class="ri-file-list-3-line"></i> 规划计划
        </a>
        <a class="top-nav-item" href="地面节点信息维护.html" data-path="地面节点信息维护.html">
            <i class="ri-share-line"></i> 地面节点管理
        </a>
        <a class="top-nav-item" href="飞行器管理.html" data-path="飞行器管理.html">
            <i class="ri-flight-takeoff-line"></i> 飞行器管理
        </a>
        <a class="top-nav-item" href="健康管理.html" data-path="健康管理.html">
            <i class="ri-heart-pulse-line"></i> 健康管理
        </a>
    </div>
    <div class="user-box">
        <i class="ri-function-line dots" title="应用中心"></i>
        <div class="avatar"><i class="ri-user-line"></i></div>
        <span>Admin</span>
    </div>
</div>
`;

// 同步写入文档并避免闪烁
document.write(headerHTML);

// 延时挂载类名动态高亮算法
setTimeout(() => {
    // 获取当前访问的文件名称（例如：廊道信息维护.html）
    let currentPath = window.location.pathname.split('/').pop() || 'index.html';
    // 中文 URL 需要解码，否则无法进行字符串匹配
    currentPath = decodeURIComponent(currentPath);

    const navItems = document.querySelectorAll('#dynamic-top-header .top-nav-item');
    navItems.forEach(item => {
        const itemPath = item.getAttribute('data-path');
        if (itemPath === currentPath) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}, 0);
