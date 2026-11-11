import React from 'react';
import Subheading from './Subheading';
import LinkText from './LinkText';

interface AnnouncementProps {
  bannerImage: string;
}

const Announcement: React.FC<AnnouncementProps> = ({ bannerImage }) => {
  return (
    <div className="announcement">
      <img src={bannerImage} alt="Announcement" className="select-none" />
      <div className="announcement-content text-left">
        <Subheading>Kettu - VRChat avatar</Subheading>
        <p className="pb-1">
            The latest avatar base on Jinxxy!
        </p>
        <LinkText href="https://jinxxy.com/Marakusa/thekettu" newTab>
          Jinxxy
        </LinkText>
      </div>
    </div>
  );
};

export default Announcement;