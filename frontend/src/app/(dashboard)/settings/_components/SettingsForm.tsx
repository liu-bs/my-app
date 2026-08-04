'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Globe, Info, Check, Lock, Image as ImageIcon } from 'lucide-react';
import { PasswordToggle } from '@/components/PasswordToggle';
import toast from '@/lib/toast';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { PasswordStrength } from '@/components/PasswordStrength';
import { Alert } from '@/components/ui/Alert';
import { useUpdateProfile, useChangePassword } from '@/services/auth/hooks';
import { ApiRequestError } from '@/lib/api/request';
import { getInitials } from '@/lib/format';
import type { SettingsTab, User } from '@my-app/shared';

interface SettingsFormProps {
  user: User;
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const [tab, setTab] = useState<SettingsTab>('profile');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdError, setPwdError] = useState('');

  useEffect(() => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setAvatar(user.avatar);
    setBio(user.bio);
    setLocation(user.location);
    setWebsite(user.website);
  }, [user]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(
      { firstName, lastName, avatar, bio, location, website },
      {
        onSuccess: () => toast.success('资料已保存'),
        onError: (err: Error) => {
          if (err instanceof ApiRequestError && err.details?.length)
            toast.error(err.details.map((d) => d.message).join('；'));
          else toast.error(err.message || '保存失败');
        },
      },
    );
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');

    if (newPwd.length < 6) {
      setPwdError('新密码至少 6 位');
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError('两次密码不一致');
      return;
    }
    if (newPwd === currentPwd) {
      setPwdError('新密码不能与当前密码相同');
      return;
    }

    changePasswordMutation.mutate(
      { currentPassword: currentPwd, newPassword: newPwd },
      {
        onSuccess: () => {
          toast.success('密码修改成功，请重新登录');
          router.push('/login');
        },
        onError: (err: Error) => {
          if (err instanceof ApiRequestError && err.isUnauthorized) setPwdError('当前密码不正确');
          else setPwdError(err.message || '修改失败，请检查网络后重试');
        },
      },
    );
  };

  const userInitials = getInitials(firstName, lastName);

  return (
    <>
      <div className="segmented mb-8">
        <button
          onClick={() => setTab('profile')}
          className={`segmented-item ${tab === 'profile' ? 'segmented-item-on' : ''}`}
        >
          个人资料
        </button>
        <button
          onClick={() => setTab('password')}
          className={`segmented-item ${tab === 'password' ? 'segmented-item-on' : ''}`}
        >
          修改密码
        </button>
      </div>

      {tab === 'profile' && (
        <form onSubmit={handleProfileSave} className="form-stack">
          <div className="anim-fade-up stagger-1 flex items-start gap-4">
            <Avatar
              initials={userInitials}
              src={avatar || undefined}
              size="xl"
              className="shrink-0"
            />
            <div className="min-w-0 flex-1">
              <FormField label="头像 URL" hint="粘贴图片链接，建议方形 256x256">
                <Input
                  id="avatar"
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  maxLength={500}
                  leftIcon={<ImageIcon size={18} />}
                  placeholder="https://example.com/avatar.png"
                />
              </FormField>
            </div>
          </div>

          <div className="anim-fade-up stagger-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="名" required>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                maxLength={50}
              />
            </FormField>
            <FormField label="姓" required>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                maxLength={50}
              />
            </FormField>
          </div>

          <FormField
            label="个人简介"
            hint="简短的自我介绍，最多 280 字符"
            className="anim-fade-up stagger-3"
          >
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={280}
              rows={4}
              className="textarea-field input-focus"
            />
            <div className="meta-text mt-1 text-right">{bio.length} / 280</div>
          </FormField>

          <div className="anim-fade-up stagger-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="所在地" hint="可选">
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                maxLength={100}
                leftIcon={<MapPin size={18} />}
              />
            </FormField>
            <FormField label="个人网站" hint="可选">
              <Input
                id="website"
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                maxLength={200}
                leftIcon={<Globe size={18} />}
              />
            </FormField>
          </div>

          <div className="anim-fade-up stagger-5 flex justify-end">
            <Button type="submit" loading={updateProfileMutation.isPending}>
              <Check size={16} />
              保存修改
            </Button>
          </div>
        </form>
      )}

      {tab === 'password' && (
        <form onSubmit={handlePasswordChange} className="form-stack">
          {pwdError && (
            <Alert
              variant="error"
              icon={<Info size={16} />}
              className="anim-fade-up stagger-1 shake"
            >
              {pwdError}
            </Alert>
          )}

          <FormField label="当前密码" required className="anim-fade-up stagger-1">
            <Input
              id="currentPwd"
              type={showCurrent ? 'text' : 'password'}
              value={currentPwd}
              onChange={(e) => {
                setCurrentPwd(e.target.value);
                setPwdError('');
              }}
              autoComplete="current-password"
              leftIcon={<Lock size={18} />}
              rightElement={<PasswordToggle show={showCurrent} onToggle={setShowCurrent} />}
            />
          </FormField>

          <FormField label="新密码" hint="至少 6 位" required className="anim-fade-up stagger-2">
            <Input
              id="newPwd"
              type={showNew ? 'text' : 'password'}
              value={newPwd}
              onChange={(e) => {
                setNewPwd(e.target.value);
                setPwdError('');
              }}
              autoComplete="new-password"
              leftIcon={<Lock size={18} />}
              rightElement={<PasswordToggle show={showNew} onToggle={setShowNew} />}
            />
            <PasswordStrength password={newPwd} />
          </FormField>

          <FormField label="确认新密码" required className="anim-fade-up stagger-3">
            <Input
              id="confirmPwd"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPwd}
              onChange={(e) => {
                setConfirmPwd(e.target.value);
                setPwdError('');
              }}
              autoComplete="new-password"
              leftIcon={<Lock size={18} />}
              rightElement={<PasswordToggle show={showConfirm} onToggle={setShowConfirm} />}
            />
          </FormField>

          <div className="anim-fade-up stagger-4 flex justify-end">
            <Button type="submit" loading={changePasswordMutation.isPending}>
              <Check size={16} />
              更新密码
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
