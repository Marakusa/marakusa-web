import React from 'react';
import Subheading from './Subheading';
import Paragraph from './Paragraph';
import LinkText from './LinkText';

interface AnnouncementProps {
  bannerImage: string;
}

const Announcement: React.FC<AnnouncementProps> = ({ bannerImage }) => {
  return (
    <div className="announcement">
      <img src={bannerImage} alt="Announcement" />
      <div className="announcement-content text-left">
        <Subheading>Kettu - VRChat avatar</Subheading>
        <Paragraph>
            The latest avatar base on Jinxxy!
        </Paragraph>
        <LinkText href="/kettu">
          Check it out
        </LinkText>
      </div>
    </div>
  );
};

export default Announcement;