<script>
export default {
  onLaunch: function () {
    // 仅保留必要的初始化代码
  }
}
</script>

<style>
/*每个页面公共css */
page {
	font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
	box-sizing: border-box;
}

/* 移除所有默认边距 */
view, text, input, button {
	margin: 0;
	padding: 0;
}

/* 移除按钮默认样式 */
button::after {
	border: none;
}

/* 定义主题色变量，方便全局使用 */
:root {
	--primary-color: #42b872;
	--light-green: #e9f5e9;
	--text-color: #333333;
	--light-text: #909090;
	--background-color: #f8f9fa;
}
</style>
