import React, { useEffect, useState } from 'react';
import SecondDerivativeGraphComponent from './SecondDerivativeGraphComponent';
import ThirdDerivativeGraphComponent from './ThirdDerivativeGraphComponent';
import FourthDerivativeGraphComponent from './FourthDerivativeGraphComponent';
import '../css/DifferentialComponent.css';

const DifferentialComponent = ({ selectedDifferential }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('slide-down-enter');
    const timer = setTimeout(() => {
      setAnimationClass('slide-down-enter-to');
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [selectedDifferential]);

  return (
    <div className={`content-slide ${animationClass}`}>
      {selectedDifferential === "ONE" && <SecondDerivativeGraphComponent />}
      {selectedDifferential === "TWO" && <ThirdDerivativeGraphComponent />}
      {selectedDifferential === "THREE" && <FourthDerivativeGraphComponent />}
    </div>
  );
};

export default DifferentialComponent;
