/**
 * @file QuickStats.tsx
 * @description 本周快速数据组件，展示新增文章、总阅读量、新增关注与互动率四项指标
 */

/**
 * 本周快速统计组件（纯展示）
 * @returns 渲染「This Week」卡片，含 4 行 key/value 形式的统计指标
 */
const QuickStats = () => {
  return (
    <section className="border-border bg-surface rounded-xl border p-6"> {/* 本周统计卡片容器：圆角带边框，背景色为 surface */}
      {/* 卡片标题 */}
      <h3 className="text-text-primary mb-4 font-semibold">This Week</h3>
      {/* 统计指标列表：行间纵向间距 16px（space-y-4） */}
      <div className="space-y-4">
        {/* 新增文章数指标：本周新增 5 篇 */}
        <div className="flex items-center justify-between">
          {/* 指标名称：新增文章数 */}
          <span className="text-text-secondary text-sm">New Articles</span>
          {/* 指标值：+5 篇 */}
          <span className="text-text-primary text-sm font-medium">+5</span>
        </div>
        {/* 总阅读量指标 */}
        <div className="flex items-center justify-between">
          {/* 指标名称：总阅读量 */}
          <span className="text-text-secondary text-sm">Total Views</span>
          {/* 指标值：12.5k 次 */}
          <span className="text-text-primary text-sm font-medium">12.5k</span>
        </div>
        {/* 新增关注指标 */}
        <div className="flex items-center justify-between">
          {/* 指标名称：新增关注者数 */}
          <span className="text-text-secondary text-sm">New Followers</span>
          {/* 指标值：+128 人（增长类指标用成功色） */}
          <span className="text-success text-sm font-medium">+128</span>
        </div>
        {/* 互动率指标 */}
        <div className="flex items-center justify-between">
          {/* 指标名称：互动率 */}
          <span className="text-text-secondary text-sm">Engagement</span>
          {/* 指标值：8.4% */}
          <span className="text-text-primary text-sm font-medium">8.4%</span>
        </div>
      </div>
    </section>
  );
};

export default QuickStats;
