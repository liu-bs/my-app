/**
 * @file forms.ts
 * @description 前端表单字段的标识与状态类型，用于注册/登录等表单的受控状态管理
 */

/** 表单字段标识：名 / 姓 / 用户名 / 邮箱 / 密码 */
export type FieldId = 'firstName' | 'lastName' | 'username' | 'email' | 'password';

/**
 * 单个表单字段的状态
 */
export interface FieldState {
  /** 当前输入值 */
  value: string;
  /** 是否已被交互过（失焦或修改） */
  touched: boolean;
  /** 校验结果：true 通过 / false 不通过 / null 未校验 */
  valid: boolean | null;
}
