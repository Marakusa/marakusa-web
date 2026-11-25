import React from 'react';
import Subheading from './Subheading';
import LinkText from './LinkText';

interface AnnouncementProps {
  bannerImage: string;
  title: string;
  description: string;
  linkHref: string;
  linkText: string;
}

const Announcement: React.FC<AnnouncementProps> = ({ bannerImage, title, description, linkHref, linkText }) => {
  return (
    <div className="announcement">
      <img src={bannerImage} alt="Announcement" className="select-none" />
      <div className="announcement-content text-left">
        <Subheading>{title}</Subheading>
        <p className="pb-1">
            {description}
        </p>
        <LinkText href={linkHref} newTab>
          {linkText}
        </LinkText>
      </div>
    </div>
  );
};

export default Announcement;
