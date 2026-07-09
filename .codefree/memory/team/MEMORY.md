# Memory Index
## project — active-initiative
当前工作流：把当前分支所有提交压缩成一条的命令：；git commit --amend -m "auth 模块"
## project — style-convention
用户偏好简洁清楚的代码组织，不要过度拆分文件。如果一个模块的常量、类型、Context、Provider 加起来体量不大，应合并到同一个文件中，避免每个小概念单独一个文件。只有职责明显不同（如核心 Context vs 业务 hooks）才拆分。