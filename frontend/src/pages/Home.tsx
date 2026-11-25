import { FaTwitter, FaDiscord, FaTelegram } from 'react-icons/fa';
import { SiFurrynetwork, SiBluesky } from 'react-icons/si';
import JinxxyIcon from "../assets/icons/JinxxyIcon";
import kettuPromo from '../assets/images/kettuPromo.jpg';
import blackFriday2026 from '../assets/images/blackfriday2026.jpg';
import Announcement from '../components/Announcement';

const BLACK_FRIDAY_END = new Date('2026-12-02T18:00:00+02:00');

const announcements = {
  blackFriday: {
    bannerImage: blackFriday2026,
    title: "Black Friday Sale",
    description: "Avatars are on sale on Jinxxy until December 2nd!",
    linkHref: "https://jinxxy.com/Marakusa",
    linkText: "Jinxxy",
  },
  kettu: {
    bannerImage: kettuPromo,
    title: "Kettu - VRChat avatar",
    description: "The latest avatar base on Jinxxy!",
    linkHref: "https://jinxxy.com/Marakusa/thekettu",
    linkText: "Jinxxy",
  },
};

function Home() {
  const announcement = new Date() < BLACK_FRIDAY_END ? announcements.blackFriday : announcements.kettu;

  const links = [
    {
      href: "https://x.com/Marakusa_",
      element: <FaTwitter />
    },
    {
      href: "https://bsky.app/profile/marakusa.me",
      element: <SiBluesky />
    },
    {
      href: "https://discord.gg/47SrTE3Spw",
      element: <FaDiscord />
    },
    {
      href: "https://t.me/marakusa_art",
      element: <FaTelegram />
    },
    {
      href: "https://www.furaffinity.net/user/marakusa",
      element: <SiFurrynetwork />
    },
    {
      href: "https://jinxxy.com/Marakusa",
      element: <JinxxyIcon />
    },
  ];

  return (
    <div>
        <Announcement {...announcement} />
        <div className="flex gap-6 text-3xl w-fit mx-auto my-6">
            {links.map((link, index) =>
                <a key={index} href={link.href} target="blank" className="icon-link text-5xl">{link.element}</a>
            )}
        </div>
    </div>
  );
}

export default Home;