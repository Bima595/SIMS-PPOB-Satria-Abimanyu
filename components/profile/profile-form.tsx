'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Profile } from '@/lib/api/profile';
import ProfileImage from './profile-image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProfileFormProps {
  profile: Profile;
  onUpdateProfile: (data: {
    first_name: string;
    last_name: string;
  }) => Promise<void>;
  onUploadImage: (file: File) => Promise<void>;
  onLogout: () => void;
}

export default function ProfileForm({
  profile,
  onUpdateProfile,
  onUploadImage,
  onLogout,
}: ProfileFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(profile.first_name);
  const [lastName, setLastName] = useState(profile.last_name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Nama depan dan belakang tidak boleh kosong');
      return;
    }

    try {
      setIsSubmitting(true);
      await onUpdateProfile({ first_name: firstName, last_name: lastName });
      toast.success('Profil berhasil diperbarui');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Gagal memperbarui profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFirstName(profile.first_name);
    setLastName(profile.last_name);
    setIsEditing(false);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <ToastContainer />
      <ProfileImage
        imageUrl={profile.profile_image || '/dashboard/Profile Photo.png'}
        onImageUpload={onUploadImage}
      />

      <h1 className="text-2xl font-bold text-center mb-6">
        {profile.first_name} {profile.last_name}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">@</span>
            </div>
            <input
              type="email"
              id="email"
              value={profile.email}
              disabled
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nama Depan
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">👤</span>
            </div>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!isEditing || isSubmitting}
              className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ${
                !isEditing ? 'bg-gray-50' : 'bg-white'
              }`}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nama Belakang
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">👤</span>
            </div>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!isEditing || isSubmitting}
              className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ${
                !isEditing ? 'bg-gray-50' : 'bg-white'
              }`}
            />
          </div>
        </div>

        {isEditing ? (
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full py-2 px-4 border border-red-500 text-red-500 font-medium rounded-md hover:bg-red-50"
            >
              Batal
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md"
          >
            Edit Profil
          </button>
        )}

        <button
          type="button"
          onClick={onLogout}
          className="w-full py-2 px-4 border border-red-500 text-red-500 font-medium rounded-md hover:bg-red-50"
        >
          Logout
        </button>
      </form>
    </div>
  );
}