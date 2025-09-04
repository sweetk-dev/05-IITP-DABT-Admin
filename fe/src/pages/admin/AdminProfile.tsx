import { useState, useEffect } from 'react';
import { getAdminInfo } from '../../store/user';
import { getAdminProfile, updateAdminProfile, changeAdminPassword } from '../../api/admin';
import ProfileForm from '../../components/ProfileForm';

// ProfileForm과 호환되는 타입 정의
interface ProfileData {
  name?: string;
  affiliation?: string;
  email?: string;
  loginId?: string;
  role?: string;
  roleName?: string;
  createdAt?: string;
  [key: string]: any;
}

export default function AdminProfile() {
  const adminInfo = getAdminInfo();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!adminInfo || adminInfo.userType !== 'A') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getAdminProfile();
        
        if (response.success && response.data) {
          // AdminProfileRes를 ProfileData 호환 형태로 변환
          const convertedData: ProfileData = {
            ...response.data,
            roleName: response.data.roleName ? response.data.roleName.toString() : undefined
          };
          setProfileData(convertedData);
        } else {
          setError(response.errorMessage || '프로필 정보를 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('프로필 정보를 불러오는 중 오류가 발생했습니다.');
        console.error('Admin profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 정보 변경 저장
  const handleSaveProfile = async (data: { name: string; affiliation: string }) => {
    try {
      const response = await updateAdminProfile(data);
      
      if (response.success) {
        setProfileData(prev => prev ? { ...prev, ...data } : null);
        setError(undefined);
      } else {
        setError(response.errorMessage || '프로필 업데이트 실패');
      }
    } catch (err) {
      setError('프로필 업데이트 중 오류가 발생했습니다.');
      // throw err; 제거 - 에러를 다시 던지지 않음
    }
  };

  // 비밀번호 변경
  const handleChangePassword = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    try {
      const response = await changeAdminPassword(data);
      if (response.success) {
        setError(undefined);
      } else {
        setError(response.errorMessage || '비밀번호 변경 실패');
      }
    } catch (err) {
      setError('비밀번호 변경 중 오류가 발생했습니다.');
      // throw err; 제거 - 에러를 다시 던지지 않음
    }
  };

  if (!adminInfo || adminInfo.userType !== 'A') {
    return (
      <ProfileForm
        title="관리자 프로필"
        profileData={null}
        loading={false}
        error="관리자 정보를 불러올 수 없습니다."
        onSaveProfile={handleSaveProfile}
        onChangePassword={handleChangePassword}
        onCloseError={() => setError(undefined)}
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
      onCloseError={() => setError(undefined)}
      showRole={true}
      showLoginId={true}
      theme="admin"
    />
  );
} 