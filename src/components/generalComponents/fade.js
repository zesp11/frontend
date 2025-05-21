import React from 'react';

const Fade = ({ id, children }) => {
  return (
    <section id={id} className="fadeBG">
      {children}
    </section>
  );
};

export default Fade;