import { useState, useEffect } from 'react';
import { getUserInfo } from '../../store/user';
import { getAdminProfile } from '../../api/admin';
import ProfileForm from '../../components/ProfileForm';
import type { AdminProfileRes } from '@iitp-dabt/common';

export default function AdminProfile() {
  const userInfo = getUserInfo();
  const [profileData, setProfileData] = useState<AdminProfileRes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userInfo || userInfo.userType !== 'A') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getAdminProfile();
        
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
      // TODO: API 호출 구현
      // const response = await updateAdminProfile(data);
      
      // 임시로 로컬 상태만 업데이트
      setProfileData(prev => prev ? { ...prev, ...data } : null);
      setError(null);
    } catch (err) {
      setError('프로필 업데이트 중 오류가 발생했습니다.');
      throw err;
    }
  };

  // 비밀번호 변경
  const handleChangePassword = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    try {
      // TODO: API 호출 구현
      // const response = await updateAdminPassword(data);
      setError(null);
    } catch (err) {
      setError('비밀번호 변경 중 오류가 발생했습니다.');
      throw err;
    }
  };

  if (!userInfo || userInfo.userType !== 'A') {
    return (
      <ProfileForm
        title="관리자 프로필"
        profileData={null}
        loading={false}
        error="관리자 정보를 불러올 수 없습니다."
        onSaveProfile={handleSaveProfile}
        onChangePassword={handleChangePassword}
        onCloseError={() => setError(null)}
        showRole={true}
        showLoginId={true}
        theme="admin"
      />
    );
  }

  return (
    <ProfileForm
      title="관리자 프로필"
      profileData={profileData}
      loading={loading}
      error={error}
      onSaveProfile={handleSaveProfile}
      onChangePassword={handleChangePassword}
      onCloseError={() => setError(null)}
      showRole={true}
      showLoginId={true}
      theme="admin"
    />
  );
} 