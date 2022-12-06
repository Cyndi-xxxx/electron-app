// 入口文件，控制主进程，运行在node.js环境中负责控制应用的生命周期，显示原生界面，执行特殊操作并管理渲染器进程

/**
 * 将页面加载进应用窗口中,需要 两个Electron模块:
 * app 模块，它控制应用程序的事件生命周期
 * BrowserWindow 模块，它创建和管理应用程序窗口
 */
// 从主进程到渲染进程的异步通信。
const { app, BrowserWindow, ipcMain } = require('electron');

// path提供了处理文件和目录路径的实用程序
const path = require('path')

// 添加createWindow()方法来将index.html加载进一个新的BrowserWindow实例
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      /**
       * 添加预加载脚本路径
       * __dirname: 字符串指向当前正在执行脚本的路径
       * path.join: API将多个路径联结在一起，创建一个跨平台的路径字符串
       */
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // 为一个 invokeable的IPC 添加一个handler 
  // 每当一个渲染进程调用 ipcRenderer.invoke(channel, ...args) 时这个处理器就会被调用。
  // 如果 listener 返回一个 Promise，那么 Promise 的最终结果就是远程调用的返回值。
  // 否则， 监听器的返回值将被用来作为应答值。
  ipcMain.handle('ping', () => 'pong')

  // 在Electron中，每个窗口展示一个页面，后者可以来自本地的HTML，也可以来自远程URL
  win.loadFile('index.html');
  // win.loadURL('https://www.gongkongmall.com');
}

/**
 * 在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口
 * 使用 app.whenReady() API来监听此事件。 在whenReady()成功后调用createWindow()
 * 然后运行start命令打开窗口
 */
app.whenReady().then(() => {
  createWindow()

  /**
   * macOS 应用通常即使在没有打开任何窗口的情况下也继续运行，并且在没有窗口可用的情况下激活应用时会打开新的窗口
   * 为了实现这一特性，监听app模块的activate事件。如果没有任何浏览器窗口是打开的，则调用createWindow()方法
   * 因为窗口无法在 ready 事件前创建，在应用初始化后仅监听activate事件
   */
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 管理应用的生命周期
/**
 * 在Windows和Linux上，关闭所有窗口通常会完全退出一个应用程序.
 * 需要监听app模块的'window-all-closed'事件。如果用户不是在macOS(darwin)上运行程序，则调用app.quit()
 */
// window-all-closed 当所有的窗口都被关闭时触发
app.on('window-all-closed', () => {
  // Electron 目前只支持三个平台：win32 (Windows), linux (Linux) 和 darwin (macOS) 
  if (process.platform !== 'darwin') app.quit();
})