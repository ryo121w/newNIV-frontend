import React from 'react';
import '../css/DifferentialComponent.css'

const DifferentialRadioButtons = ({ selectedDifferential, handleChange }) => {
    return (
        <div className="selector">
            <h4 className="Derivative-changer">微分変更</h4>
            <div class="radio-input">
                <div class="glass">
                    <div class="glass-inner">
                    </div>
                </div>
                <div class="selector">
                    <div class="choice">
                        <div>
                            <input class="choice-circle" type="radio" id="one" name="number-selector" value="ONE" checked={selectedDifferential === "ONE"} onChange={handleChange} />
                            <div class="ball"></div>
                        </div>
                        <label class="choice-name" for="one">2</label>
                    </div>
                    <div class="choice">
                        <div>
                            <input class="choice-circle" type="radio" id="two" name="number-selector" value="TWO" checked={selectedDifferential === "TWO"} onChange={handleChange} />
                            <div class="ball"></div>
                        </div>
                        <label class="choice-name">3</label>
                    </div>
                    <div class="choice">
                        <div>
                            <input class="choice-circle" type="radio" id="three" name="number-selector" value="THREE" checked={selectedDifferential === "THREE"} onChange={handleChange} />
                            <div class="ball"></div>
                        </div>
                        <label class="choice-name" for="three">4</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DifferentialRadioButtons;