#!/bin/bash
# 纺织机3D模型验证脚本
# 自动打开浏览器，导航到纺织机页面，并截图验证

SCREENSHOT_DIR="./fangzhi_verification"
mkdir -p "$SCREENSHOT_DIR"

echo "=== 纺织机3D模型验证 ==="
echo "1. 打开浏览器页面 http://localhost:5173/"
echo "2. 点击「开启阅读」"
echo "3. 点击「纺织机」进入页面"
echo "4. 截图保存到 $SCREENSHOT_DIR"
echo ""

# 生成时间戳
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SCREENSHOT_FILE="$SCREENSHOT_DIR/fangzhi_${TIMESTAMP}.png"

echo "截图将保存为: $SCREENSHOT_FILE"
echo ""
echo "请在 Claude Code 中使用以下 Chrome DevTools MCP 命令："
echo "1. mcp__chrome-devtools__new_page(url='http://localhost:5173/')"
echo "2. mcp__chrome-devtools__click('开启阅读'按钮)"
echo "3. mcp__chrome-devtools__click('纺织机'按钮)"
echo "4. mcp__chrome-devtools__take_screenshot(filePath='$SCREENSHOT_FILE')"
echo ""
echo "或使用以下 Node.js 自动化脚本："
cat << 'EOF'

// verify_fangzhi.js - 纺织机模型自动验证脚本
// 需要先安装: npm install puppeteer

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function verifyFangzhiModel() {
  const screenshotDir = './fangzhi_verification';
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
  }

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();

  try {
    console.log('正在打开页面...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

    console.log('点击「开启阅读」...');
    await page.waitForSelector('button:has-text("开启阅读")');
    await page.click('button:has-text("开启阅读")');
    await page.waitForTimeout(2000);

    console.log('点击「纺织机」...');
    await page.waitForSelector('button:has-text("纺织机")');
    await page.click('button:has-text("纺织机")');
    await page.waitForTimeout(3000);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = path.join(screenshotDir, `fangzhi_${timestamp}.png`);

    console.log('截图保存中...');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`截图已保存: ${screenshotPath}`);

    // 测试不同视角
    const views = ['正视', '侧视', '俯视'];
    for (const view of views) {
      console.log(`切换到${view}视角...`);
      await page.click(`button:has-text("${view}")`);
      await page.waitForTimeout(1000);
      const viewPath = path.join(screenshotDir, `fangzhi_${timestamp}_${view}.png`);
      await page.screenshot({ path: viewPath });
      console.log(`${view}视角截图已保存`);
    }

    console.log('验证完成！');

  } catch (error) {
    console.error('验证过程出错:', error);
  } finally {
    await browser.close();
  }
}

verifyFangzhiModel();
EOF

echo ""
echo "=== 使用说明 ==="
echo "方式1: 手动在 Claude Code 中运行 Chrome DevTools MCP 命令"
echo "方式2: 安装 puppeteer 后运行: node verify_fangzhi.js"
