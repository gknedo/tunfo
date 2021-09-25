import React from 'react';

function PagePanel({src, alt, title, description, reverse}) {
  return (
    <div className={`py-14 flex flex-wrap align-center justify-center px-40 ${reverse && "flex-row-reverse"}`}>
      <img className="w-60" src={src} alt={alt}/>
      <div className="max-w-screen-sm flex flex-wrap justify-center flex-col gap-y-2 text-center">
        <h2 className="text-5xl">{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default PagePanel;
