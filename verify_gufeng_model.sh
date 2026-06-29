#!/bin/bash
# Automation script to verify the Gufeng (鼓风炉) 3D model
# This script can be used for quick verification after model changes

echo "🔧 天工开物 - 鼓风炉模型验证脚本"
echo "=================================="
echo ""

# Check if the dev server is running
echo "📡 检查开发服务器状态..."
if ! curl -s http://localhost:5173 > /dev/null; then
    echo "❌ 开发服务器未运行"
    echo "请先启动开发服务器: cd tiangong-3d-demo && npm run dev"
    exit 1
fi
echo "✅ 开发服务器运行中"
echo ""

# Instructions for manual verification
echo "🎯 验证步骤："
echo "1. 打开浏览器访问: http://localhost:5173/"
echo "2. 点击「开启阅读」进入目录"
echo "3. 点击「鼓风炉　十三」进入鼓风炉页面"
echo "4. 查看3D模型并对比左侧的古籍插图"
echo ""

echo "🔍 验证要点："
echo "- 炉体: 更细长，腰鼓形更收敛"
echo "- 风箱: 扁平长方形，位置更低"
echo "- 风口: 简化的送风管设计"
echo "- 铁箍: 从3道减少到2道"
echo "- 整体: 更符合明代古籍插图的简洁风格"
echo ""

echo "🎬 测试动画功能："
echo "- 点击「运作模拟」→「开启」查看风箱推拉动作"
echo "- 调整「鼓风强度」滑块测试不同速度"
echo "- 切换「侧视」角度查看风箱与炉体连接"
echo ""

echo "✨ 如需重新加载模型变更，请刷新浏览器页面"
