import React from 'react';
import PangoImage from '../../assets/pango.png';
import ScorpionUltraRare from '../../assets/scorpion-ultra-rare.png'
import PagePanel from '../../components/atoms/PagePanel';
import Divider from '../../components/atoms/Divider';

function About() {
  return (
    <div className="flex flex-wrap flex-col justify-center content-center">
      <PagePanel
        src={PangoImage}
        alt="Pango"
        title="A wildlife clash on your blockchain."
        description="Join now in the community of the most innovative card game on GoChain"
      />

      <Divider />

      <PagePanel
        reverse
        src={ScorpionUltraRare}
        alt="Ultra Rare Scorpion"
        title="Find the rarest."
        description="Each animal has unique attributes, will you find an epic one?"
      />

      <PagePanel
        src={ScorpionUltraRare}
        alt="Ultra Rare Scorpion"
        title="Battle to Survive."
        description="In the jungle, only the strongests will be able to stay alive."
      />

      <PagePanel
        reverse
        src={ScorpionUltraRare}
        alt="Ultra Rare Scorpion"
        title="Treasures or Bones?"
        description="You will bring something back home, you just dont know what. The only certainty is... there will be blood."
      />
    </div>
  );
}

export default About;
