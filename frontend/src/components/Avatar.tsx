import React from 'react';

interface AvatarProps {
    avatar?: string | null;
    username: string;
    onClick: () => void;
}

const Avatar: React.FC<AvatarProps> = ({ avatar, username, onClick }) => {
    return (
        <div className="avatar-container">
            {
                avatar ? (
                    <img
                        src={avatar}
                        alt={username}
                        className="w-8 h-8 rounded-full cursor-pointer border"
                        onClick={onClick}
                    />
                ) : (
                    <div
                        className="w-8 h-8 rounded-full bg-gray-300 cursor-pointer"
                        onClick={onClick}
                    />
                )
            }
        </div>
    );
};

export default Avatar;