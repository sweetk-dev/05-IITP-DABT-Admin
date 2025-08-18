import { useState, useEffect } from 'react';
import { getUserInfo } from '../../store/user';
import { getUserProfile, updateUserProfile, changeUserPassword } from '../../api/user';
import ProfileForm from '../../components/ProfileForm';
import type { UserProfileRes } from '@iitp-dabt/common';

export default function UserProfile() {
  const userInfo = getUserInfo();
  const [profileData, setProfileData] = useState<UserProfileRes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userInfo || userInfo.userType !== 'U') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getUserProfile();
        
        if (response.success && response.data) {
          setProfileData(response.data);
        } else {
          setError(response.errorMessage || '프로필 정보를 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('프로필 정보를 불러오는 중 오류가 발생했습니다.');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 정보 변경 저장
  const handleSaveProfile = async (data: { name: string; affiliation: string }) => {
    try {
      const response = await updateUserProfile(data);
      
      if (response.success) {
        setProfileData(prev => prev ? { ...prev, ...data } : null);
        setError(undefined);
      } else {
        setError(response.errorMessage || '프로필 업데이트 실패');
      }
    } catch (err) {
      setError('프로필 업데이트 중 오류가 발생했습니다.');
      throw err;
    }
  };

  // 비밀번호 변경
  const handleChangePassword = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    try {
      const response = await changeUserPassword(data);
      if (response.success) {
        setError(undefined);
      } else {
        setError(response.errorMessage || '비밀번호 변경 실패');
      }
    } catch (err) {
      setError('비밀번호 변경 중 오류가 발생했습니다.');
      throw err;
    }
  };

  if (!userInfo || userInfo.userType !== 'U') {
    return (
      <ProfileForm
        title="사용자 프로필"
        profileData={null}
        loading={false}
        error="사용자 정보를 불러올 수 없습니다."
        onSaveProfile={handleSaveProfile}
        onChangePassword={handleChangePassword}
        onCloseError={() => setError(undefined)}
        showRole={false}
        showLoginId={false}
        
      />
    );
  }

  return (
    <ProfileForm
      title="사용자 프로필"
      profileData={profileData}
      loading={loading}
      error={error}
      onSaveProfile={handleSaveProfile}
      onChangePassword={handleChangePassword}
      onCloseError={() => setError(undefined)}
      showRole={false}
      showLoginId={false}
      
    />
  );
} 