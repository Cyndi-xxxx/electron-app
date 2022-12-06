
// IPC - 进程间通信
// ipcRenderer - 从渲染器进程到主进程的异步通信 
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // 主进程中收到单个响应，比如一个方法调用的结果，使用 ipcRenderer.invoke
  ping: () => ipcRenderer.invoke('ping'),
  // 能暴露的不仅仅是函数，我们还可以暴露变量
})