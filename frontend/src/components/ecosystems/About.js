import React from 'react';
import PangoImage from '../../assets/pango.png';

function About() {
  return (
    <div className="mt-28 flex flex-wrap justify-center content-center">
      <div className="flex flex-wrap align-center justify-center px-40">
        <img className="w-60" src={PangoImage} alt={"Pango"}/>
        <div className="max-w-screen-sm flex flex-wrap justify-center flex-col gap-y-2 text-center">
          <h2 className="text-5xl">A wildlife clash is happening on your blockchain.</h2>
          <p>Join now in the community of the most innovative card game on GO Chain</p>
        </div>
      </div>
    </div>
  );
}

export default About;
