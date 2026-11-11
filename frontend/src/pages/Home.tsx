import { FaTwitter, FaDiscord, FaTelegram } from 'react-icons/fa';
import { SiFurrynetwork, SiBluesky } from 'react-icons/si';
import JinxxyIcon from "../assets/icons/JinxxyIcon";
import Card from '../components/Card';
import kettuPromo from '../assets/images/kettuPromo.jpg';
import Announcement from '../components/Announcement';

function Home() {
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
    <Card>
        <Announcement bannerImage={kettuPromo} />
        <div className="flex gap-3 text-3xl w-fit mx-auto my-6">
            {links.map((link, index) =>
                <a key={index} href={link.href} target="blank" className="icon-link">{link.element}</a>
            )}
        </div>
    </Card>
  );
}

export default Home;